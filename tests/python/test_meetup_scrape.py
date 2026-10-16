"""Async scrape tests with mocked Playwright (no real browser)."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from playwright.async_api import TimeoutError as PlaywrightTimeoutError

from scripts import meetup_events as me


def _apollo_next_data(
    *,
    event_id="123",
    title="Meetup Night",
    status="ACTIVE",
    is_online=False,
    include_venue=True,
):
    venue_ref = {"__ref": "Venue:1"} if include_venue else {}
    apollo = {
        f"Event:{event_id}": {
            "id": event_id,
            "title": title,
            "eventUrl": f"https://www.meetup.com/g/events/{event_id}",
            "description": "A talk",
            "dateTime": "2025-11-06T18:00:00-05:00",
            "endTime": "2025-11-06T20:00:00-05:00",
            "status": status,
            "eventType": "PHYSICAL",
            "isOnline": is_online,
            "venue": venue_ref,
        }
    }
    if include_venue:
        apollo["Venue:1"] = {
            "name": "Mill Mountain Coffee",
            "address": "101 Shenandoah Ave, Roanoke, VA 24016",
            "city": "Roanoke",
            "state": "VA",
            "country": "us",
        }
    return {
        "props": {
            "pageProps": {
                "__APOLLO_STATE__": apollo,
            }
        }
    }


@pytest.fixture(autouse=True)
def _no_sleep():
    with patch("scripts.meetup_events.asyncio.sleep", new_callable=AsyncMock):
        yield


def test_scrape_events_from_page_extracts_apollo_event():
    page = AsyncMock()
    page.evaluate = AsyncMock(return_value=_apollo_next_data())

    events = asyncio.run(me.scrape_events_from_page(page, "upcoming"))

    assert len(events) == 1
    assert events[0]["id"] == "e-123"
    assert events[0]["name"] == "Meetup Night"
    assert events[0]["is_upcoming"] is True
    assert events[0]["venue"]["name"] == "Mill Mountain Coffee"


def test_scrape_events_from_page_filters_past():
    page = AsyncMock()
    page.evaluate = AsyncMock(
        return_value=_apollo_next_data(status="PAST", event_id="99", title="Old Talk")
    )

    upcoming = asyncio.run(me.scrape_events_from_page(page, "upcoming"))
    past = asyncio.run(me.scrape_events_from_page(page, "past"))

    assert upcoming == []
    assert len(past) == 1
    assert past[0]["id"] == "ep-99"
    assert past[0]["is_upcoming"] is False


def test_scrape_events_from_page_missing_next_data():
    page = AsyncMock()
    page.evaluate = AsyncMock(return_value=None)

    events = asyncio.run(me.scrape_events_from_page(page, "upcoming"))
    assert events == []


def test_scrape_events_from_page_missing_apollo_state():
    page = AsyncMock()
    page.evaluate = AsyncMock(return_value={"props": {"pageProps": {}}})

    events = asyncio.run(me.scrape_events_from_page(page, "upcoming"))
    assert events == []


def test_scrape_events_from_page_skips_incomplete_event():
    page = AsyncMock()
    page.evaluate = AsyncMock(
        return_value={
            "props": {
                "pageProps": {
                    "__APOLLO_STATE__": {
                        "Event:1": {"id": "1", "title": ""},
                    }
                }
            }
        }
    )

    events = asyncio.run(me.scrape_events_from_page(page, "all"))
    assert events == []


def test_scrape_events_from_page_online_venue():
    page = AsyncMock()
    page.evaluate = AsyncMock(
        return_value=_apollo_next_data(is_online=True, include_venue=False)
    )

    events = asyncio.run(me.scrape_events_from_page(page, "upcoming"))
    assert events[0]["venue"]["name"] == "Online Event"
    assert events[0]["is_online"] is True


def test_scrape_events_from_page_evaluate_raises():
    page = AsyncMock()
    page.evaluate = AsyncMock(side_effect=RuntimeError("boom"))

    events = asyncio.run(me.scrape_events_from_page(page, "upcoming"))
    assert events == []


def test_scrape_page_with_retry_success():
    page = AsyncMock()
    page.goto = AsyncMock()
    page.evaluate = AsyncMock(return_value=None)

    with patch(
        "scripts.meetup_events.scrape_events_from_page",
        new_callable=AsyncMock,
        return_value=[{"id": "e-1"}],
    ) as scrape:
        events = asyncio.run(
            me.scrape_page_with_retry(page, "https://example.com", "upcoming", retries=2)
        )

    assert events == [{"id": "e-1"}]
    scrape.assert_awaited()
    page.goto.assert_awaited()


def test_scrape_page_with_retry_empty_results():
    page = AsyncMock()
    page.goto = AsyncMock()
    page.evaluate = AsyncMock(return_value=None)

    with patch(
        "scripts.meetup_events.scrape_events_from_page",
        new_callable=AsyncMock,
        return_value=[],
    ):
        events = asyncio.run(
            me.scrape_page_with_retry(page, "https://example.com", "past", retries=2)
        )

    assert events == []


def test_scrape_page_with_retry_timeout_then_success():
    page = AsyncMock()
    page.goto = AsyncMock(
        side_effect=[PlaywrightTimeoutError("timeout"), None]
    )
    page.evaluate = AsyncMock(return_value=None)

    with patch(
        "scripts.meetup_events.scrape_events_from_page",
        new_callable=AsyncMock,
        return_value=[{"id": "e-2"}],
    ):
        events = asyncio.run(
            me.scrape_page_with_retry(page, "https://example.com", "upcoming", retries=2)
        )

    assert events == [{"id": "e-2"}]
    assert page.goto.await_count == 2


def test_scrape_page_with_retry_timeout_exhausted():
    page = AsyncMock()
    page.goto = AsyncMock(side_effect=PlaywrightTimeoutError("timeout"))

    events = asyncio.run(
        me.scrape_page_with_retry(page, "https://example.com", "upcoming", retries=2)
    )
    assert events == []


def test_scrape_page_with_retry_non_timeout_error():
    page = AsyncMock()
    page.goto = AsyncMock(side_effect=RuntimeError("nav failed"))

    events = asyncio.run(
        me.scrape_page_with_retry(page, "https://example.com", "upcoming", retries=3)
    )
    assert events == []
    assert page.goto.await_count == 1


def test_scrape_page_with_retry_debug_screenshots():
    page = AsyncMock()
    page.goto = AsyncMock()
    page.screenshot = AsyncMock()
    page.content = AsyncMock(return_value="<html></html>")
    page.evaluate = AsyncMock(return_value=None)

    with (
        patch.object(me, "DEBUG", True),
        patch(
            "scripts.meetup_events.scrape_events_from_page",
            new_callable=AsyncMock,
            return_value=[{"id": "e-3"}],
        ),
        patch("builtins.open", MagicMock()),
    ):
        events = asyncio.run(
            me.scrape_page_with_retry(page, "https://example.com", "upcoming", retries=1)
        )

    assert events == [{"id": "e-3"}]
    page.screenshot.assert_awaited()


def test_scrape_meetup_events_dedupes():
    upcoming = [{"id": "shared", "name": "A"}, {"id": "u1", "name": "U"}]
    past = [{"id": "shared", "name": "A"}, {"id": "p1", "name": "P"}]

    browser = AsyncMock()
    context = AsyncMock()
    page = AsyncMock()
    context.new_page = AsyncMock(return_value=page)
    browser.new_context = AsyncMock(return_value=context)
    browser.close = AsyncMock()

    chromium = MagicMock()
    chromium.launch = AsyncMock(return_value=browser)

    playwright_cm = AsyncMock()
    playwright_cm.__aenter__ = AsyncMock(
        return_value=MagicMock(chromium=chromium)
    )
    playwright_cm.__aexit__ = AsyncMock(return_value=None)

    with (
        patch("scripts.meetup_events.async_playwright", return_value=playwright_cm),
        patch(
            "scripts.meetup_events.scrape_page_with_retry",
            new_callable=AsyncMock,
            side_effect=[upcoming, past],
        ),
    ):
        events = asyncio.run(me.scrape_meetup_events("test-group"))

    ids = [e["id"] for e in events]
    assert ids == ["shared", "u1", "p1"]
    browser.close.assert_awaited()


def test_scrape_meetup_events_handles_error():
    browser = AsyncMock()
    context = AsyncMock()
    page = AsyncMock()
    context.new_page = AsyncMock(return_value=page)
    browser.new_context = AsyncMock(return_value=context)
    browser.close = AsyncMock()

    chromium = MagicMock()
    chromium.launch = AsyncMock(return_value=browser)

    playwright_cm = AsyncMock()
    playwright_cm.__aenter__ = AsyncMock(
        return_value=MagicMock(chromium=chromium)
    )
    playwright_cm.__aexit__ = AsyncMock(return_value=None)

    with (
        patch("scripts.meetup_events.async_playwright", return_value=playwright_cm),
        patch(
            "scripts.meetup_events.scrape_page_with_retry",
            new_callable=AsyncMock,
            side_effect=RuntimeError("scrape failed"),
        ),
    ):
        events = asyncio.run(me.scrape_meetup_events("test-group"))

    assert events == []
    browser.close.assert_awaited()
