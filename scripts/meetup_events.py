import json
import os
import datetime
import asyncio
import time
import re
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Error as PlaywrightError, TimeoutError as PlaywrightTimeoutError

# Load environment variables
print("Current working directory:", os.getcwd())
print("Loading .env file...")
load_dotenv(dotenv_path=".env", override=True)

# Get Meetup group name from environment, or use default
MEETUP_GROUP_NAME = os.getenv("MEETUP_GROUP_NAME", "roanoke-valley-net-user-group")
print(f"MEETUP_GROUP_NAME: {MEETUP_GROUP_NAME}")

# Configure timeouts and retries
PAGE_TIMEOUT = 90000  # 90 seconds
MAX_RETRIES = 4
RETRY_DELAY = 5  # seconds

# Debug mode - set to True to save screenshots and HTML dumps
# Can be enabled with MEETUP_DEBUG environment variable
DEBUG = os.getenv("MEETUP_DEBUG", "false").lower() == "true"
if DEBUG:
    print("DEBUG mode enabled - will save screenshots and HTML dumps")

async def scrape_meetup_events(group_name):
    """
    Scrapes events from the Meetup website using Playwright headless browser.
    
    Args:
        group_name: The URL name of the Meetup group.
        
    Returns:
        A list of event objects, or None if an error occurs.
    """
    print(f"Launching Playwright to scrape events for {group_name}...")
    
    all_events = []
    seen_event_ids = set()
    
    async with async_playwright() as p:
        # Launch the browser with increased timeout
        browser = await p.chromium.launch(headless=True)
        
        # Create context with viewport size and user agent to look more like a real browser
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        )
        
        # Enable JavaScript in the context
        page = await context.new_page()
        
        try:
            # Scrape upcoming events first
            upcoming_events = await scrape_page_with_retry(
                page, 
                f"https://www.meetup.com/{group_name}/events/?type=upcoming", 
                "upcoming"
            )
            
            # Add upcoming events with deduplication
            for event in upcoming_events:
                event_id = event.get('id')
                if event_id and event_id not in seen_event_ids:
                    all_events.append(event)
                    seen_event_ids.add(event_id)
            
            print(f"Scraped {len(upcoming_events)} upcoming events")
            
            # Scrape past events
            past_events = await scrape_page_with_retry(
                page, 
                f"https://www.meetup.com/{group_name}/events/?type=past", 
                "past"
            )
            
            # Add past events with deduplication
            for event in past_events:
                event_id = event.get('id')
                if event_id and event_id not in seen_event_ids:
                    all_events.append(event)
                    seen_event_ids.add(event_id)
            
            print(f"Scraped {len(past_events)} past events")
            print(f"Total unique events scraped: {len(all_events)}")
            
        except Exception as e:
            print(f"Error during scraping: {e}")
        finally:
            await browser.close()
            
    return all_events

async def scrape_page_with_retry(page, url, event_type, retries=MAX_RETRIES):
    """
    Tries to scrape a page with retries on timeout.
    
    Args:
        page: Playwright page object
        url: URL to scrape
        event_type: 'upcoming' or 'past'
        retries: Number of retries on failure
        
    Returns:
        List of event dictionaries
    """
    for attempt in range(retries):
        try:
            # Navigate to the page with increased timeout
            print(f"Navigating to: {url} (attempt {attempt + 1}/{retries})")
            
            # Navigate with a longer timeout
            await page.goto(url, timeout=PAGE_TIMEOUT, wait_until="domcontentloaded")
            print(f"Page loaded, waiting for content to stabilize...")
            
            # Wait for a bit to let the page fully render
            await asyncio.sleep(3)
            
            # Take a screenshot for debugging if DEBUG is enabled
            if DEBUG:
                screenshot_path = f"debug_{event_type}_{attempt}.png"
                await page.screenshot(path=screenshot_path)
                print(f"Screenshot saved to {screenshot_path}")
                
                # Dump the page HTML to a file for debugging
                html_path = f"debug_{event_type}_{attempt}.html"
                with open(html_path, "w") as f:
                    f.write(await page.content())
                print(f"HTML saved to {html_path}")
            
            # Scroll down a bit to trigger lazy loading
            await page.evaluate("window.scrollBy(0, 500)")
            await asyncio.sleep(2)
            
            # Try to find event cards
            print(f"Looking for event cards on the page...")
            events = await scrape_events_from_page(page, event_type)
            
            if events:
                print(f"Found {len(events)} {event_type} events")
                return events
            else:
                print(f"No {event_type} events found on this page")
                
            # Only retry timeout errors, not empty results
            return []
            
        except PlaywrightTimeoutError as e:
            print(f"Timeout error: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {RETRY_DELAY} seconds...")
                await asyncio.sleep(RETRY_DELAY)
            else:
                print(f"Maximum retries reached for {url}")
                return []
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            # Don't retry on non-timeout errors
            return []
    
    return []

async def scrape_events_from_page(page, event_type):
    """
    Scrapes events from the current page using Next.js __NEXT_DATA__ JSON.
    
    Args:
        page: Playwright page object
        event_type: 'upcoming' or 'past'
        
    Returns:
        List of event dictionaries
    """
    events = []
    
    try:
        # Try to extract __NEXT_DATA__ JSON from the page
        print(f"Attempting to extract __NEXT_DATA__ for {event_type} events...")
        
        next_data = await page.evaluate("""
            () => {
                const script = document.getElementById('__NEXT_DATA__');
                if (script) {
                    try {
                        return JSON.parse(script.textContent);
                    } catch (e) {
                        console.error('Failed to parse __NEXT_DATA__:', e);
                        return null;
                    }
                }
                return null;
            }
        """)
        
        if not next_data:
            print(f"Could not find __NEXT_DATA__ script tag")
            return events
        
        # Extract Apollo state from Next.js data
        apollo_state = next_data.get('props', {}).get('pageProps', {}).get('__APOLLO_STATE__', {})
        
        if not apollo_state:
            print(f"Could not find Apollo state in __NEXT_DATA__")
            return events
        
        print(f"Found Apollo state with {len(apollo_state)} keys")
        
        # Find all Event objects in the Apollo state
        event_keys = [key for key in apollo_state.keys() if key.startswith('Event:')]
        print(f"Found {len(event_keys)} event objects in Apollo state")
        
        # Process each event
        for event_key in event_keys:
            try:
                event_data = apollo_state[event_key]
                event_id = event_data.get('id')
                title = event_data.get('title', '').strip()
                event_url = event_data.get('eventUrl', '').strip()
                description = event_data.get('description', '').strip()
                
                # Skip events without title or ID (incomplete data)
                if not title or not event_id:
                    print(f"Skipping event with missing data: ID={event_id}, title='{title}'")
                    continue
                
                # Get date/time info
                date_time_str = event_data.get('dateTime', '')
                end_time_str = event_data.get('endTime', '')
                status = event_data.get('status', 'UNKNOWN')
                event_type_from_data = event_data.get('eventType', 'PHYSICAL')
                is_online = event_data.get('isOnline', False)
                
                # Parse datetime
                event_date, event_time = parse_iso_datetime(date_time_str)
                
                # Get venue information
                venue_ref = event_data.get('venue', {})
                venue = extract_venue_from_apollo(venue_ref, apollo_state, is_online)
                
                # Determine if upcoming or past based on status and type filter
                is_upcoming = status == "ACTIVE"
                event_status = "upcoming" if is_upcoming else "past"
                
                # Filter based on requested event_type (if not "all")
                if event_type != "all":
                    if event_type == "past" and is_upcoming:
                        continue
                    if event_type == "upcoming" and not is_upcoming:
                        continue
                
                # Create event object
                event = {
                    "id": f"e-{event_id}" if is_upcoming else f"ep-{event_id}",
                    "name": title,
                    "status": event_status,
                    "local_date": event_date,
                    "local_time": event_time,
                    "description": description if description else f"Details at: {event_url}",
                    "venue": venue,
                    "link": event_url,
                    "is_upcoming": is_upcoming,
                    "is_online": is_online
                }
                
                print(f"Extracted event: {event['name']}")
                events.append(event)
                
            except Exception as e:
                print(f"Error extracting event data from {event_key}: {e}")
        
        return events
        
    except Exception as e:
        print(f"Error processing page: {e}")
        import traceback
        traceback.print_exc()
        return events

def extract_venue_from_apollo(venue_ref, apollo_state, is_online):
    """
    Extract venue information from Apollo state reference.
    """
    if is_online:
        return {
            "name": "Online Event",
            "address_1": "",
            "city": "",
            "state": "",
            "country": "us",
            "zip": ""
        }
    
    # Default venue
    default_venue = {
        "name": "TBD",
        "address_1": "",
        "city": "Roanoke",
        "state": "VA",
        "country": "us",
        "zip": ""
    }
    
    if not venue_ref or not isinstance(venue_ref, dict):
        return default_venue
    
    # Check if it's a reference
    ref_key = venue_ref.get('__ref')
    if ref_key and ref_key in apollo_state:
        venue_data = apollo_state[ref_key]
    else:
        venue_data = venue_ref
    
    # Extract venue fields
    name = venue_data.get('name', 'TBD')
    address = venue_data.get('address', '')
    city = venue_data.get('city', 'Roanoke')
    state = venue_data.get('state', 'VA')
    country = venue_data.get('country', 'us')
    
    # Try to extract ZIP from address if present
    zip_code = ""
    if address:
        zip_match = re.search(r'(\d{5}(?:-\d{4})?)', address)
        if zip_match:
            zip_code = zip_match.group(1)
    
    return {
        "name": name,
        "address_1": address,
        "city": city,
        "state": state,
        "country": country,
        "zip": zip_code
    }

def parse_iso_datetime(datetime_str):
    """
    Parse ISO 8601 datetime string from Meetup API.
    Returns formatted date (YYYY-MM-DD) and time (HH:MM).
    """
    if not datetime_str:
        now = datetime.datetime.now()
        return now.strftime("%Y-%m-%d"), "18:00"
    
    try:
        # Parse ISO format: "2025-11-06T18:00:00-05:00"
        # Remove timezone info for simpler parsing
        if 'T' in datetime_str:
            date_part, time_part = datetime_str.split('T')
            
            # Parse date
            date_obj = datetime.datetime.strptime(date_part, "%Y-%m-%d")
            event_date = date_obj.strftime("%Y-%m-%d")
            
            # Parse time (remove timezone)
            time_only = time_part.split('-')[0].split('+')[0]
            time_obj = datetime.datetime.strptime(time_only, "%H:%M:%S")
            event_time = time_obj.strftime("%H:%M")
            
            return event_date, event_time
    except Exception as e:
        print(f"Error parsing datetime '{datetime_str}': {e}")
    
    # Default fallback
    now = datetime.datetime.now()
    return now.strftime("%Y-%m-%d"), "18:00"

# Keep the old scraping code as fallback (in case Next.js approach fails)
async def scrape_events_from_page_legacy(page, event_type):
    """
    Legacy scraper for events using DOM selectors (fallback).
    
    Args:
        page: Playwright page object
        event_type: 'upcoming' or 'past'
        
    Returns:
        List of event dictionaries
    """
    events = []
    
    try:
        # Use the old selectors based on event type
        if event_type == "past":
            selector = "ul li div[id^='ep-']"
        else:  # upcoming
            selector = "ul li div[id^='e-']"
            
        print(f"Using legacy selector: {selector}")
        
        # First check if there are any events on the page using JavaScript
        has_events = await page.evaluate("""
            () => {
                const elements = document.querySelectorAll("%s");
                return elements.length > 0;
            }
        """ % selector)
        
        if not has_events:
            print(f"No {event_type} events found on the page (no elements matching '{selector}')")
            
            # Print the page's HTML for debugging
            html = await page.content()
            print(f"Page HTML snippet: {html[:500]}...")
            
            return events
        
        # Wait for the events to load with a longer timeout
        try:
            await page.wait_for_selector(selector, state="visible", timeout=PAGE_TIMEOUT)
        except PlaywrightTimeoutError:
            print(f"Timeout waiting for event cards, will try to proceed anyway")
        
        # Extract event elements using locator API which is safer
        event_elements = page.locator(selector)
        event_count = await event_elements.count()
        
        print(f"Found {event_count} event elements")
        
        # For each event element, extract the necessary information
        for i in range(event_count):
            try:
                # Get current element
                element = event_elements.nth(i)
                
                # Extract ID
                event_id = await element.get_attribute("id") or f"{event_type}-{i}"
                
                # First, extract the date/time text to help with title cleanup later
                date_time_text = ""
                date_selectors = [
                    "time", 
                    "[data-testid='event-date']",
                    "[aria-label*='date']",
                    "span:has-text(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \\d{1,2}/)"  # Pattern matching date format
                ]
                
                for date_selector in date_selectors:
                    date_element = element.locator(date_selector).first
                    if await date_element.count() > 0:
                        date_text = await date_element.text_content()
                        if date_text and date_text.strip():
                            date_time_text = date_text.strip()
                            break
                
                # Extract title - try various approaches
                raw_title = ""
                title_selectors = [
                    "h2",  # Try h2 first
                    "h3",  # Then h3
                    "a[data-event-label]",  # Event links often have the title
                    "[data-testid='event-card-title']",  # TestID based selector
                    ".eventCardHead a",  # Class-based selector
                    "a:not([aria-label])",  # Any link without aria-label
                ]
                
                for title_selector in title_selectors:
                    title_element = element.locator(title_selector).first
                    if await title_element.count() > 0:
                        title_text = await title_element.text_content()
                        if title_text and title_text.strip():
                            raw_title = title_text.strip()
                            break
                
                # If still no title, try to get it from a parent element
                if not raw_title:
                    parent = element.locator("xpath=..")  # Get parent element
                    for title_selector in title_selectors:
                        title_element = parent.locator(title_selector).first
                        if await title_element.count() > 0:
                            title_text = await title_element.text_content()
                            if title_text and title_text.strip():
                                raw_title = title_text.strip()
                                break
                
                # Clean up the title: remove date/time, "This event has passed", attendee counts, etc.
                title = clean_title(raw_title, date_time_text)
                
                # Extract URL - look for links
                event_url = ""
                url_selectors = [
                    "a[href*='/events/']", 
                    "a[data-event-label]"
                ]
                
                for url_selector in url_selectors:
                    link_element = element.locator(url_selector).first
                    if await link_element.count() > 0:
                        url = await link_element.get_attribute("href")
                        if url:
                            event_url = url
                            break
                
                # If still no URL, try the parent element
                if not event_url:
                    parent = element.locator("xpath=..")
                    for url_selector in url_selectors:
                        link_element = parent.locator(url_selector).first
                        if await link_element.count() > 0:
                            url = await link_element.get_attribute("href")
                            if url:
                                event_url = url
                                break
                
                # Make sure URL is absolute
                if event_url and not event_url.startswith("http"):
                    event_url = f"https://www.meetup.com{event_url}"
                    
                # Extract description if available
                description = ""
                desc_selectors = [
                    ".utils_cardDescription__1Qr0x", # This class contains the full description
                    "p", 
                    "[data-testid='event-description']",
                    ".eventDescription"
                ]
                
                for desc_selector in desc_selectors:
                    desc_element = element.locator(desc_selector).first
                    if await desc_element.count() > 0:
                        desc_content = await desc_element.text_content()
                        if desc_content and desc_content.strip():
                            description = desc_content.strip()
                            break
                
                # If no description found, try a parent element
                if not description:
                    parent = element.locator("xpath=..")
                    for desc_selector in desc_selectors:
                        desc_element = parent.locator(desc_selector).first
                        if await desc_element.count() > 0:
                            desc_content = await desc_element.text_content()
                            if desc_content and desc_content.strip():
                                description = desc_content.strip()
                                break
                
                # Clean up description - remove "This is an online meeting" prefix if title already indicates it's online
                if description.startswith("This is an online meeting") and ("Online" in title or "online" in title):
                    description = description.replace("This is an online meeting.", "", 1).strip()
                
                # If no real description found, use default
                if not description or description == "This is an online meeting.":
                    description = f"Details at: {event_url}"
                
                # Extract venue 
                venue_text = ""
                venue_selectors = [
                    "address", 
                    "[data-testid='venue-name']",
                    "[aria-label*='location']",
                    "span.venueDisplay",
                    "[class*='venue']",
                    "[class*='location']",
                    "[data-testid*='event-location']"
                ]
                
                for venue_selector in venue_selectors:
                    venue_element = element.locator(venue_selector).first
                    if await venue_element.count() > 0:
                        venue_content = await venue_element.text_content()
                        if venue_content and venue_content.strip():
                            venue_text = venue_content.strip()
                            break
                
                # Additional approach: try to find spans containing address-like text
                if not venue_text:
                    try:
                        # Get all span elements
                        spans = element.locator("span")
                        span_count = await spans.count()
                        
                        # Check each span for address-like content
                        for i in range(span_count):
                            span = spans.nth(i)
                            span_text = await span.text_content()
                            
                            # Check if it looks like an address (contains a comma followed by a state code)
                            if span_text and re.search(r',\s*[A-Z]{2}\b', span_text):
                                venue_text = span_text.strip()
                                break
                    except Exception as e:
                        print(f"Error checking spans for address: {e}")
                
                # If no venue found through selectors or spans, try to look for specific patterns in the description
                if not venue_text and description:
                    # Look for common location patterns in the description
                    location_patterns = [
                        r"Location:\s*([^\n]+)",
                        r"Venue:\s*([^\n]+)",
                        r"will be held at\s*([^\n\.]+)",
                        r"Join us at\s*([^\n\.]+)"
                    ]
                    for pattern in location_patterns:
                        match = re.search(pattern, description)
                        if match:
                            venue_text = match.group(1).strip()
                            break
                
                # Parse date and time
                event_date, event_time = parse_date_time(date_time_text, event_type)
                
                # Check if this is an online event
                is_online = bool("online" in title.lower() or 
                            "virtual" in title.lower() or 
                            "zoom" in title.lower() or 
                            "teams" in title.lower() or
                            "google meet" in title.lower() or
                            "webinar" in title.lower() or
                            "webex" in title.lower() or
                            (venue_text and ("online" in venue_text.lower() or 
                                            "virtual" in venue_text.lower() or 
                                            "zoom" in venue_text.lower() or
                                            "meet.google" in venue_text.lower() or
                                            "teams.microsoft" in venue_text.lower())))
                
                # Extract venue details with potential ZIP code
                venue = parse_venue(venue_text)
                
                # If venue is detected but no address and not online, try to extract address from description
                if not is_online and venue.get("name") != "TBD" and not venue.get("address_1") and description:
                    address_patterns = [
                        rf"{re.escape(venue['name'])},?\s+([^\.]+)",
                        r"address[:\s]+([^\.]+)",
                        r"located at[:\s]+([^\.]+)"
                    ]
                    for pattern in address_patterns:
                        try:
                            match = re.search(pattern, description, re.IGNORECASE)
                            if match:
                                venue["address_1"] = match.group(1).strip()
                                break
                        except Exception as e:
                            print(f"Error extracting address from description: {e}")
                            continue
                
                # Create event object
                event = {
                    "id": event_id,
                    "name": title,
                    "status": event_type,
                    "local_date": event_date,
                    "local_time": event_time,
                    "description": description,
                    "venue": venue,
                    "link": event_url,
                    "is_upcoming": event_type == "upcoming",
                    "is_online": is_online
                }
                
                print(f"Extracted event: {event['name']}")
                events.append(event)
                
            except Exception as e:
                print(f"Error extracting event data: {e}")
        
    except Exception as e:
        print(f"Error processing page: {e}")
    
    return events

def clean_title(raw_title, date_time_text):
    """
    Clean up title by removing date/time, attendee counts, etc.
    """
    if not raw_title:
        return "No Title"
        
    # Remove the date/time if it appears in the title
    if date_time_text and date_time_text in raw_title:
        raw_title = raw_title.replace(date_time_text, "").strip()
    
    # Remove text after specific patterns
    patterns_to_remove = [
        r"icon.*$",                         # Remove icon text and everything after it
        r"This event has passed.*$",        # Remove "This event has passed" and everything after
        r"\d+ attendees.*$",                # Remove attendee counts
        r"Link visible for attendees.*$",   # Remove link visible text
        r"Attend.*$",                       # Remove attend button text
        r"\n.*$"                            # Remove everything after first newline
    ]
    
    for pattern in patterns_to_remove:
        raw_title = re.sub(pattern, "", raw_title, flags=re.DOTALL).strip()
    
    # If title starts with location indicator like "In Person:" or "Online Meeting:", 
    # keep it but remove any leading/trailing whitespace or newlines
    title = raw_title.strip()
    
    # Final cleanup - remove any duplicate whitespace
    title = re.sub(r'\s+', ' ', title).strip()
    
    # If title is too short or empty after cleaning, return a placeholder
    if len(title) < 2:
        return "No Title"
    
    return title

def parse_date_time(date_time_text, event_type):
    """
    Parse the date and time from the text extracted from the page.
    Returns formatted date (YYYY-MM-DD) and time (HH:MM).
    """
    try:
        # Handle different date formats
        now = datetime.datetime.now()
        
        # Default values
        event_date = now.strftime("%Y-%m-%d")
        event_time = "18:00"
        
        if date_time_text:
            print(f"Parsing date/time text: '{date_time_text}'")
            
            # Common date formats on Meetup
            # Format 1: "Thu, Mar 6, 2025, 6:00 PM EST"
            try:
                date_parts = date_time_text.split(", ")
                if len(date_parts) >= 3:
                    # Extract the date part: "Mar 6, 2025"
                    month_day = date_parts[1]
                    year = date_parts[2].split(",")[0]
                    date_str = f"{month_day} {year}"
                    
                    # Extract the time part: "6:00 PM EST"
                    time_parts = date_parts[-1].split()
                    time_str = " ".join(time_parts[:2])  # "6:00 PM"
                    
                    # Parse the date
                    date_obj = datetime.datetime.strptime(date_str, "%b %d %Y")
                    event_date = date_obj.strftime("%Y-%m-%d")
                    
                    # Parse the time
                    time_obj = datetime.datetime.strptime(time_str, "%I:%M %p")
                    event_time = time_obj.strftime("%H:%M")
                    
                    return event_date, event_time
            except Exception as e:
                print(f"Could not parse date format 1: {e}")
            
            # Format 2: Try format with "·" separator
            if "·" in date_time_text:
                try:
                    parts = date_time_text.split("·")
                    date_part = parts[0].strip()
                    time_part = parts[1].strip() if len(parts) > 1 else ""
                    
                    # For date part, handle common formats
                    if "," in date_part:  # Format like "Thu, Apr 11"
                        # Try to parse with current year
                        date_obj = datetime.datetime.strptime(f"{date_part} {now.year}", "%a, %b %d %Y")
                        event_date = date_obj.strftime("%Y-%m-%d")
                    
                    # For time part
                    if time_part:
                        # Try to handle formats like "6:30 PM"
                        if "AM" in time_part or "PM" in time_part:
                            time_obj = datetime.datetime.strptime(time_part, "%I:%M %p")
                            event_time = time_obj.strftime("%H:%M")
                    
                    return event_date, event_time
                except Exception as e:
                    print(f"Could not parse date format 2: {e}")
            
            # Format 3: Try to match "Month Day, Year at Time" format (e.g., "June 20, 2024 at 6:00 PM")
            try:
                match = re.search(r"([A-Za-z]+ \d{1,2}, \d{4}) at (\d{1,2}:\d{2} [AP]M)", date_time_text)
                if match:
                    date_str = match.group(1)
                    time_str = match.group(2)
                    
                    date_obj = datetime.datetime.strptime(date_str, "%B %d, %Y")
                    event_date = date_obj.strftime("%Y-%m-%d")
                    
                    time_obj = datetime.datetime.strptime(time_str, "%I:%M %p")
                    event_time = time_obj.strftime("%H:%M")
                    
                    return event_date, event_time
            except Exception as e:
                print(f"Could not parse date format 3: {e}")
            
            # Format 4: Try to match "Day of Week, Month Day" format for current year events
            try:
                match = re.search(r"([A-Za-z]{3}), ([A-Za-z]{3}) (\d{1,2})", date_time_text)
                if match:
                    day_of_week = match.group(1)
                    month = match.group(2)
                    day = match.group(3)
                    
                    # Try to find time
                    time_match = re.search(r"(\d{1,2}:\d{2} [AP]M)", date_time_text)
                    if time_match:
                        time_str = time_match.group(1)
                        time_obj = datetime.datetime.strptime(time_str, "%I:%M %p")
                        event_time = time_obj.strftime("%H:%M")
                    
                    # Use current year
                    date_str = f"{month} {day} {now.year}"
                    date_obj = datetime.datetime.strptime(date_str, "%b %d %Y")
                    event_date = date_obj.strftime("%Y-%m-%d")
                    
                    return event_date, event_time
            except Exception as e:
                print(f"Could not parse date format 4: {e}")
        
        return event_date, event_time
    except Exception as e:
        print(f"Error parsing date/time '{date_time_text}': {e}")
        # Default values for date and time
        return datetime.datetime.now().strftime("%Y-%m-%d"), "18:00"

def parse_venue(venue_text):
    """
    Parse venue information from the venue text.
    """
    # Default venue if nothing else found
    default_venue = {
        "name": "TBD",
        "address_1": "",
        "city": "Roanoke",
        "state": "VA",
        "country": "us",
        "zip": ""
    }
    
    # Check for online indicators in venue_text
    if venue_text and any(keyword in venue_text.lower() for keyword in ["online", "virtual", "zoom", "teams", "meet.google"]):
        return {
            "name": "Online Event",
            "address_1": "",
            "city": "",
            "state": "",
            "country": "us",
            "zip": ""
        }
    
    # If no venue text, return default
    if not venue_text:
        return default_venue
    
    # Try to parse out venue details
    venue_parts = venue_text.split("·")
    venue_name = venue_parts[0].strip() if venue_parts else venue_text.strip()
    venue_address = venue_parts[1].strip() if len(venue_parts) > 1 else ""
    
    # If no separator, try to extract parts based on commas
    if len(venue_parts) <= 1 and "," in venue_text:
        address_parts = venue_text.split(",")
        if len(address_parts) > 0:
            venue_name = address_parts[0].strip()
        if len(address_parts) > 1:
            venue_address = ", ".join(address_parts[1:]).strip()
    
    # Try to extract city/state/zip if available
    city = "Roanoke"
    state = "VA"
    zip_code = ""
    
    if venue_address:
        # Try to extract ZIP code
        zip_match = re.search(r"(\d{5}(-\d{4})?)", venue_address)
        if zip_match:
            zip_code = zip_match.group(1)
            
        address_parts = venue_address.split(",")
        if len(address_parts) > 0:
            # The last part might contain state and ZIP
            last_part = address_parts[-1].strip() if address_parts else ""
            
            # Try to extract state and ZIP from the last part (e.g., "VA 24017" or "VA")
            state_zip_match = re.search(r"([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?)|$)", last_part)
            if state_zip_match:
                state = state_zip_match.group(1)
                if state_zip_match.group(2):
                    zip_code = state_zip_match.group(2)
            else:
                # Just look for a two-letter state code
                state_match = re.search(r"\b([A-Z]{2})\b", last_part)
                if state_match:
                    state = state_match.group(1)
            
            # Try to extract city from the second-to-last part
            if len(address_parts) > 1:
                city = address_parts[-2].strip()
            
            # If we couldn't find a city, and there's only one part without a clear state,
            # that could be the city with state and name combined in the venue_name
            if city == "Roanoke" and len(address_parts) == 1 and not state_zip_match:
                city_match = re.search(r"^([A-Za-z\s]+)(?:\s+[A-Z]{2})?$", last_part)
                if city_match:
                    city = city_match.group(1).strip()
    
    # Ensure venue_name is never "TBD" if we have actual venue text
    if venue_text and venue_name in ["TBD", ""]:
        venue_name = venue_text.strip()
        
    # Clean up venue name - remove any trailing commas
    venue_name = re.sub(r',\s*$', '', venue_name).strip()
    
    return {
        "name": venue_name,
        "address_1": venue_address,
        "city": city,
        "state": state,
        "country": "us",
        "zip": zip_code
    }

def process_events(events):
    """
    Process and clean up the events data.
    
    Args:
        events: List of raw event objects.
        
    Returns:
        List of processed events with only the necessary fields.
    """
    if not events:
        return []
    
    # Sort events by date (upcoming first, then past in reverse chronological order)
    events.sort(key=lambda x: (not x["is_upcoming"], x.get("local_date", ""), x.get("local_time", "")))
    
    return events

def save_to_json(events, filename="public/data/events.json"):
    """
    Save the processed events to a JSON file.
    
    Args:
        events: List of processed event objects.
        filename: Path to the JSON file to write.
    """
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Create the final data structure
    data = {
        "events": events,
        "updated_at": datetime.datetime.now().isoformat()
    }
    
    # Write to file
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved {len(events)} events to {filename}")

# Main execution
if __name__ == "__main__":
    # Run the async scraper
    events = asyncio.run(scrape_meetup_events(MEETUP_GROUP_NAME))
    
    if events and len(events) > 0:
        # Process the events
        processed_events = process_events(events)
        
        # Save to JSON file
        save_to_json(processed_events)
        
        # Output summary
        upcoming_count = sum(1 for event in processed_events if event["is_upcoming"])
        past_count = len(processed_events) - upcoming_count
        print(f"Summary: {upcoming_count} upcoming events, {past_count} past events")
    else:
        print("Failed to scrape events from Meetup website.")
        print("No events.json file will be created or updated.")
        
        # Check if events.json already exists
        events_file_path = "public/data/events.json"
        if not os.path.exists(events_file_path):
            print(f"Creating an empty events.json file because none exists")
            save_to_json([])
        else:
            print(f"Keeping the existing events.json file intact") 