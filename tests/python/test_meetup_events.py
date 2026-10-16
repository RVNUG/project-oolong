"""Unit tests for pure helpers in scripts/meetup_events.py."""

from scripts.meetup_events import (
    clean_title,
    extract_venue_from_apollo,
    parse_date_time,
    parse_iso_datetime,
    parse_venue,
    process_events,
    save_to_json,
)


def test_parse_iso_datetime_valid():
    date, time = parse_iso_datetime("2025-11-06T18:00:00-05:00")
    assert date == "2025-11-06"
    assert time == "18:00"


def test_parse_iso_datetime_empty_uses_defaults():
    date, time = parse_iso_datetime("")
    assert len(date) == 10
    assert time == "18:00"


def test_parse_iso_datetime_invalid_uses_defaults():
    date, time = parse_iso_datetime("not-a-date")
    assert len(date) == 10
    assert time == "18:00"


def test_clean_title_strips_datetime_and_noise():
    raw = "Meetup Night Thu, Mar 6, 2025, 6:00 PM EST\n5 attendees Attend"
    cleaned = clean_title(raw, "Thu, Mar 6, 2025, 6:00 PM EST")
    assert "attendees" not in cleaned.lower()
    assert "Attend" not in cleaned
    assert "Meetup Night" in cleaned


def test_clean_title_empty():
    assert clean_title("", "") == "No Title"


def test_clean_title_too_short_after_clean():
    assert clean_title("A", "") == "No Title"


def test_parse_date_time_format_month_day_year_at():
    date, time = parse_date_time("June 20, 2024 at 6:00 PM", "upcoming")
    assert date == "2024-06-20"
    assert time == "18:00"


def test_parse_date_time_format_comma_est():
    date, time = parse_date_time("Thu, Mar 6, 2025, 6:00 PM EST", "upcoming")
    assert date == "2025-03-06"
    assert time == "18:00"


def test_parse_date_time_format_dot_separator():
    date, time = parse_date_time("Thu, Apr 11 · 6:30 PM", "upcoming")
    assert date.endswith("-04-11")
    assert time == "18:30"


def test_parse_date_time_format_weekday_short():
    date, time = parse_date_time("Fri, Jun 20 7:00 PM", "upcoming")
    assert date.endswith("-06-20")
    assert time == "19:00"


def test_parse_date_time_empty_uses_defaults():
    date, time = parse_date_time("", "upcoming")
    assert len(date) == 10
    assert time == "18:00"


def test_parse_venue_online():
    venue = parse_venue("Join us on Zoom")
    assert venue["name"] == "Online Event"


def test_parse_venue_default_when_empty():
    venue = parse_venue("")
    assert venue["name"] == "TBD"
    assert venue["city"] == "Roanoke"
    assert venue["state"] == "VA"


def test_parse_venue_physical_with_dot_separator():
    venue = parse_venue("Mill Mountain Coffee · 101 Shenandoah Ave, Roanoke, VA 24016")
    assert venue["name"] == "Mill Mountain Coffee"
    assert "Shenandoah" in venue["address_1"]
    assert venue["city"] == "Roanoke"
    assert venue["state"] == "VA"
    assert venue["zip"] == "24016"


def test_parse_venue_physical_comma_address():
    venue = parse_venue("Tech Space, 123 Main St, Salem, VA 24153")
    assert venue["name"] == "Tech Space"
    assert venue["state"] == "VA"
    assert venue["zip"] == "24153"


def test_process_events_sorts_upcoming_before_past():
    events = [
        {
            "id": "past",
            "is_upcoming": False,
            "local_date": "2025-11-01",
            "local_time": "18:00",
        },
        {
            "id": "upcoming",
            "is_upcoming": True,
            "local_date": "2025-12-01",
            "local_time": "19:00",
        },
    ]
    processed = process_events(events)
    assert [e["id"] for e in processed] == ["upcoming", "past"]


def test_process_events_empty():
    assert process_events([]) == []
    assert process_events(None) == []


def test_save_to_json(tmp_path):
    out = tmp_path / "events.json"
    save_to_json([{"id": "1", "title": "T", "is_upcoming": True}], str(out))
    assert out.exists()
    content = out.read_text()
    assert '"events"' in content
    assert '"updated_at"' in content


def test_extract_venue_from_apollo_online():
    venue = extract_venue_from_apollo(None, {}, True)
    assert venue["name"] == "Online Event"


def test_extract_venue_from_apollo_default_when_missing_ref():
    venue = extract_venue_from_apollo(None, {}, False)
    assert venue["name"] == "TBD"
    assert venue["city"] == "Roanoke"


def test_extract_venue_from_apollo_via_ref():
    apollo = {
        "Venue:1": {
            "name": "Civic Center",
            "address": "400 Williamson Rd NE, Roanoke, VA 24016",
            "city": "Roanoke",
            "state": "VA",
            "country": "us",
        }
    }
    venue = extract_venue_from_apollo({"__ref": "Venue:1"}, apollo, False)
    assert venue["name"] == "Civic Center"
    assert venue["zip"] == "24016"


def test_extract_venue_from_apollo_inline():
    venue = extract_venue_from_apollo(
        {
            "name": "Library",
            "address": "100 Main St",
            "city": "Salem",
            "state": "VA",
            "country": "us",
        },
        {},
        False,
    )
    assert venue["name"] == "Library"
    assert venue["city"] == "Salem"
