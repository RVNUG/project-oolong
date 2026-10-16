"""Unit tests for scripts/youtube_latest_videos.py helpers."""

from unittest.mock import MagicMock, patch

from scripts import youtube_latest_videos as yt


def test_generate_json_roundtrip():
    videos = [
        {
            "title": "Talk",
            "video_id": "abc",
            "published_at": "2025-01-01T00:00:00Z",
            "thumbnail_url": "https://example.com/t.jpg",
            "video_url": "https://www.youtube.com/watch?v=abc",
        }
    ]
    raw = yt.generate_json(videos)
    assert '"video_id": "abc"' in raw
    assert '"Talk"' in raw


def test_generate_html_includes_links():
    videos = [
        {
            "title": "Talk",
            "video_id": "abc",
            "published_at": "2025-01-01T00:00:00Z",
            "thumbnail_url": "https://example.com/t.jpg",
            "video_url": "https://www.youtube.com/watch?v=abc",
        }
    ]
    html = yt.generate_html(videos)
    assert "https://www.youtube.com/watch?v=abc" in html
    assert "Talk" in html


@patch("scripts.youtube_latest_videos.requests.get")
def test_verify_channel_success(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.json.return_value = {
        "items": [{"snippet": {"title": "RVNUG"}}]
    }
    mock_resp.text = "{}"
    mock_get.return_value = mock_resp

    assert yt.verify_channel("channel", "secret-key") is True

    mock_get.assert_called_once()
    args, kwargs = mock_get.call_args
    assert args[0] == "https://www.googleapis.com/youtube/v3/channels"
    assert "key=" not in args[0]
    assert kwargs["params"]["key"] == "secret-key"
    assert kwargs["params"]["id"] == "channel"


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_latest_videos_parses_items(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.status_code = 200
    mock_resp.text = "{}"
    mock_resp.json.return_value = {
        "items": [
            {
                "id": {"videoId": "vid1"},
                "snippet": {
                    "title": "Episode 1",
                    "publishedAt": "2025-02-01T12:00:00Z",
                    "thumbnails": {"medium": {"url": "https://example.com/m.jpg"}},
                },
            }
        ]
    }
    mock_get.return_value = mock_resp

    videos = yt.get_latest_videos("channel", "secret-key", max_results=1)
    assert videos is not None
    assert videos[0]["video_id"] == "vid1"
    assert videos[0]["title"] == "Episode 1"

    mock_get.assert_called_once()
    args, kwargs = mock_get.call_args
    assert args[0] == "https://www.googleapis.com/youtube/v3/search"
    assert "key=" not in args[0]
    assert kwargs["params"]["key"] == "secret-key"
    assert kwargs["params"]["channelId"] == "channel"
    assert kwargs["params"]["maxResults"] == 1
