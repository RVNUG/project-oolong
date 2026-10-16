"""Unit tests for scripts/youtube_latest_videos.py helpers."""

from unittest.mock import MagicMock, patch

import pytest
import requests

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
def test_verify_channel_empty_items(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.json.return_value = {"items": []}
    mock_get.return_value = mock_resp

    assert yt.verify_channel("channel", "key") is False


@patch("scripts.youtube_latest_videos.requests.get")
def test_verify_channel_exception(mock_get):
    mock_get.side_effect = requests.exceptions.RequestException("network")

    assert yt.verify_channel("channel", "key") is False


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


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_latest_videos_request_exception(mock_get):
    err = requests.exceptions.HTTPError("bad")
    err.response = MagicMock(status_code=403)
    mock_get.side_effect = err

    assert yt.get_latest_videos("channel", "key") is None


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_latest_videos_bad_json(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.status_code = 200
    mock_resp.text = "not-json"
    mock_resp.json.side_effect = ValueError("bad json")
    mock_get.return_value = mock_resp

    assert yt.get_latest_videos("channel", "key") is None


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_channel_id_from_channel_id_success(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.json.return_value = {"items": [{"id": "UC123"}]}
    mock_get.return_value = mock_resp

    assert yt.get_channel_id_from_channel_id("UC123", "key") == "UC123"


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_channel_id_from_channel_id_empty(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.json.return_value = {"items": []}
    mock_get.return_value = mock_resp

    assert yt.get_channel_id_from_channel_id("missing", "key") is None


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_channel_id_from_channel_id_request_error(mock_get):
    mock_get.side_effect = requests.exceptions.RequestException("down")

    assert yt.get_channel_id_from_channel_id("UC123", "key") is None


@patch("scripts.youtube_latest_videos.requests.get")
def test_get_channel_id_from_channel_id_bad_json(mock_get):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.return_value = None
    mock_resp.json.side_effect = ValueError("bad")
    mock_get.return_value = mock_resp

    assert yt.get_channel_id_from_channel_id("UC123", "key") is None


@patch("scripts.youtube_latest_videos.verify_channel", return_value=False)
def test_main_exits_when_verify_fails(mock_verify):
    with pytest.raises(SystemExit) as exc:
        yt.main()
    assert exc.value.code == 1
    mock_verify.assert_called_once()


@patch("scripts.youtube_latest_videos.get_latest_videos", return_value=None)
@patch("scripts.youtube_latest_videos.verify_channel", return_value=True)
def test_main_when_no_videos(mock_verify, mock_videos):
    yt.main()
    mock_verify.assert_called_once()
    mock_videos.assert_called_once()


@patch(
    "scripts.youtube_latest_videos.get_latest_videos",
    return_value=[
        {
            "title": "Talk",
            "video_id": "abc",
            "published_at": "2025-01-01T00:00:00Z",
            "thumbnail_url": "https://example.com/t.jpg",
            "video_url": "https://www.youtube.com/watch?v=abc",
        }
    ],
)
@patch("scripts.youtube_latest_videos.verify_channel", return_value=True)
def test_main_writes_videos_json(mock_verify, mock_videos, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    yt.main()
    out = tmp_path / "public" / "data" / "videos.json"
    assert out.exists()
    assert "abc" in out.read_text()
