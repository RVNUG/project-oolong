import requests
import json
import os
from dotenv import load_dotenv

# Update the path to point to the project root .env file
print("Current working directory:", os.getcwd())
print("Loading .env file...")
load_dotenv(dotenv_path=".env", override=True)
print("Environment variables loaded:")
print("YOUTUBE_DATA_API_KEY:", os.getenv("YOUTUBE_DATA_API_KEY"))
print("YOUTUBE_CHANNEL_ID:", os.getenv("YOUTUBE_CHANNEL_ID"))

API_KEY = os.getenv("YOUTUBE_DATA_API_KEY")
CHANNEL_ID = os.getenv("YOUTUBE_CHANNEL_ID")

print(f"API_KEY: {API_KEY}")
print(f"CHANNEL_ID: {CHANNEL_ID}")

def verify_channel(channel_id, api_key):
    """Verify that the channel exists and is accessible."""
    url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet&id={channel_id}&key={api_key}"
    print(f"Verifying channel with URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Channel verification response: {response.text}")
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])
        if items:
            channel = items[0]
            print(f"Channel found: {channel.get('snippet', {}).get('title')}")
            return True
        else:
            print("No channel found with this ID")
            return False
    except Exception as e:
        print(f"Error verifying channel: {e}")
        return False

def get_latest_videos(channel_id, api_key, max_results=3):
    """
    Retrieves the latest videos from a YouTube channel using the channel ID.

    Args:
        channel_id: The ID of the YouTube channel.
        api_key: Your YouTube Data API key.
        max_results: The maximum number of videos to retrieve (default: 3).

    Returns:
        A list of video dictionaries, or None if an error occurs.  Each dictionary
        contains video details like 'title', 'video_id', and 'published_at'.
    """
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={channel_id}&order=date&type=video&maxResults={max_results}&key={api_key}"
    print(f"Fetching from URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        
        response.raise_for_status()  # Raise an exception for bad status codes

        data = response.json()
        items = data.get("items", [])  # Use .get() to avoid KeyError

        videos = []
        for item in items:
            snippet = item.get("snippet", {})
            video_id = item.get("id", {}).get("videoId")  # Handle nested 'videoId'
            video_data = {
                "title": snippet.get("title"),
                "video_id": video_id,
                "published_at": snippet.get("publishedAt"),
                "thumbnail_url": snippet.get("thumbnails", {}).get("medium", {}).get("url"),  # Get medium quality thumbnail
                "video_url": f"https://www.youtube.com/watch?v={video_id}"
            }
            videos.append(video_data)
        return videos

    except requests.exceptions.RequestException as e:
        # Handle network errors, HTTP errors, etc.
        print(f"Error fetching videos: {e}")
        if hasattr(e.response, 'text'):
            print(f"Error response: {e.response.text}")
        return None
    except ValueError as e:
        print(f"Error parsing JSON response: {e}")
        return None

def get_channel_id_from_channel_id(channel_id, api_key):
    """
    Retrieves a channel ID from a channel ID using the YouTube Data API.

    Args:
        channel_id: The ID of the YouTube channel.
        api_key: Your YouTube Data API key.

    Returns:
        The channel ID as a string, or None if an error occurs or the channel is not found.
    """
    url = f"https://www.googleapis.com/youtube/v3/channels?part=id&id={channel_id}&key={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes

        data = response.json()
        items = data.get("items", [])  # Use .get() to avoid KeyError
        if items:
            # If a channel is found, return its ID
            return items[0].get("id")
        else:
            # Handle the case where no channel is found for the channel ID
            print(f"No channel found for channel ID: {channel_id}")
            return None
    except requests.exceptions.RequestException as e:
        # Handle network errors, HTTP errors, etc.
        print(f"Error fetching data: {e}")
        return None
    except ValueError as e:
        print(f"Error parsing JSON response: {e}")
        return None

def generate_html(videos):
    """
    Generates HTML code to display the videos with links and thumbnails.

    Args:
        videos: A list of video dictionaries, as returned by get_latest_videos().

    Returns:
        A string containing the HTML code.
    """
    html = "<ul>\n"
    for video in videos:
        title = video['title']
        video_url = video['video_url']
        thumbnail_url = video['thumbnail_url']
        html += f"""
        <li>
            <a href="{video_url}" target="_blank">{title}</a><br>
            <img src="{thumbnail_url}" alt="Thumbnail for {title}" width="200"><br>
            <p>Published At: {video['published_at']}</p>
        </li>
        """
    html += "</ul>"
    return html

def generate_json(videos):
    """
    Generates JSON code to display the videos with links and thumbnails.

    Args:
        videos: A list of video dictionaries, as returned by get_latest_videos().

    Returns:
        A string containing the JSON code.
    """
    json_output = json.dumps(videos, indent=4)
    return json_output

# First verify the channel
if not verify_channel(CHANNEL_ID, API_KEY):
    print("Channel verification failed. Please check the channel ID.")
    exit(1)

# Get the latest 3 videos
latest_videos = get_latest_videos(CHANNEL_ID, API_KEY)

if latest_videos:
    print("Latest Videos:")
    for video in latest_videos:
        print(f"Title: {video['title']}")
        print(f"Video ID: {video['video_id']}")
        print(f"Published At: {video['published_at']}")
        print("-" * 20)

    # Generate HTML
    # html_output = generate_html(latest_videos)
    # print("\nGenerated HTML:")
    # print(html_output)

    json_output = generate_json(latest_videos)
    print("\nGenerated JSON:", json_output)

    # Save the JSON to a file in the public/data directory
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/videos.json", "w") as f:
        f.write(json_output)
    print("\nJSON saved to public/data/videos.json")

else:
    print("Could not retrieve latest videos.")
