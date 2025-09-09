from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse, parse_qs
import httpx
import html
import xml.etree.ElementTree as ET

_YT_AVAILABLE = False  # we will use direct timedtext fetch to avoid env issues

app = FastAPI(title="Vid2Text API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


class YouTubeIngestRequest(BaseModel):
    url: HttpUrl
    language: Optional[str] = Field(default=None, description="Preferred language code, e.g. 'en'")


class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str


class YouTubeIngestResponse(BaseModel):
    source: str = "youtube"
    video_id: str
    language: str
    segments: List[TranscriptSegment]
    text: str


def _extract_youtube_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.netloc.endswith("youtu.be"):
        vid = parsed.path.lstrip("/")
        if not vid:
            raise ValueError("Missing video id in youtu.be URL")
        return vid
    if "youtube.com" in parsed.netloc:
        qs = parse_qs(parsed.query)
        vid_list = qs.get("v")
        if vid_list and vid_list[0]:
            return vid_list[0]
        # Shorts or embed style
        parts = [p for p in parsed.path.split("/") if p]
        if parts:
            return parts[-1]
    raise ValueError("Unsupported YouTube URL format")


@app.post("/ingest/youtube", response_model=YouTubeIngestResponse)
def ingest_youtube(req: YouTubeIngestRequest) -> Any:
    try:
        video_id = _extract_youtube_video_id(str(req.url))
    except ValueError as e:  # noqa: PERF203
        raise HTTPException(status_code=400, detail=str(e))

    # Prefer requested language, then English variants
    languages = []
    if req.language:
        languages.append(req.language)
    languages.extend(["en", "en-US", "en-GB"])

    segments: List[TranscriptSegment] = []

    def _try_fetch(lang: str, kind_asr: bool) -> List[TranscriptSegment]:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
        }
        # First attempt: JSON format
        params_json = {
            "fmt": "json3",
            "v": video_id,
            "lang": lang,
            "hl": lang,
        }
        if kind_asr:
            params_json["kind"] = "asr"
        try:
            resp = httpx.get(
                "https://www.youtube.com/api/timedtext",
                params=params_json,
                headers=headers,
                timeout=15,
            )
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    events = data.get("events") or []
                    segs: List[TranscriptSegment] = []
                    for ev in events:
                        t_start_ms = ev.get("tStartMs")
                        d_ms = ev.get("dDurationMs")
                        seg_parts = ev.get("segs") or []
                        if t_start_ms is None or d_ms is None or not seg_parts:
                            continue
                        t = "".join(p.get("utf8", "") for p in seg_parts)
                        text_clean = (t or "").strip()
                        if not text_clean:
                            continue
                        start_s = float(t_start_ms) / 1000.0
                        end_s = start_s + (float(d_ms) / 1000.0)
                        segs.append(TranscriptSegment(start=start_s, end=end_s, text=text_clean))
                    if segs:
                        return segs
                except Exception:
                    # Fall through to XML attempt
                    pass
        except Exception:
            # Fall through to XML attempt
            pass

        # Second attempt: XML format (omit fmt param)
        params_xml = {
            "v": video_id,
            "lang": lang,
            "hl": lang,
        }
        if kind_asr:
            params_xml["kind"] = "asr"
        try:
            resp_xml = httpx.get(
                "https://www.youtube.com/api/timedtext",
                params=params_xml,
                headers=headers,
                timeout=15,
            )
            if resp_xml.status_code != 200 or not resp_xml.text:
                return []
            # Parse XML like: <transcript><text start="1.23" dur="2.34"> ... </text> ...</transcript>
            root = ET.fromstring(resp_xml.text)
            segs_xml: List[TranscriptSegment] = []
            for node in root.findall("text"):
                try:
                    start_s = float(node.attrib.get("start", "0"))
                    dur_s = float(node.attrib.get("dur", "0"))
                except Exception:
                    continue
                end_s = start_s + dur_s
                raw_text = node.text or ""
                text_clean = html.unescape(raw_text).strip()
                if not text_clean:
                    continue
                segs_xml.append(TranscriptSegment(start=start_s, end=end_s, text=text_clean))
            return segs_xml
        except Exception:
            return []

    # Try manual captions first, then ASR
    for lang in languages:
        segs = _try_fetch(lang, kind_asr=False)
        if not segs:
            segs = _try_fetch(lang, kind_asr=True)
        if segs:
            segments = segs
            detected_lang = lang
            break

    if not segments:
        # As a final fallback, list tracks and try the first available
        try:
            list_headers = {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9",
            }
            list_params = {"type": "list", "v": video_id}
            list_resp = httpx.get("https://video.google.com/timedtext", params=list_params, headers=list_headers, timeout=15)
            if list_resp.status_code == 200 and list_resp.text:
                list_root = ET.fromstring(list_resp.text)
                tracks = list_root.findall("track")
                for tr in tracks:
                    lang_code = tr.attrib.get("lang_code") or tr.attrib.get("lang") or ""
                    name = tr.attrib.get("name") or ""
                    kind_attr = tr.attrib.get("kind") or ""
                    # Try exact track first
                    segs = _try_fetch(lang_code, kind_asr=(kind_attr == "asr"))
                    if not segs and name:
                        # Some tracks require name parameter
                        headers = {
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
                            "Accept": "*/*",
                            "Accept-Language": "en-US,en;q=0.9",
                        }
                        # JSON attempt with name
                        params_json = {"fmt": "json3", "v": video_id, "lang": lang_code, "name": name}
                        try:
                            rj = httpx.get("https://www.youtube.com/api/timedtext", params=params_json, headers=headers, timeout=15)
                            if rj.status_code == 200:
                                try:
                                    data = rj.json()
                                    events = data.get("events") or []
                                    out: List[TranscriptSegment] = []
                                    for ev in events:
                                        t_start_ms = ev.get("tStartMs")
                                        d_ms = ev.get("dDurationMs")
                                        seg_parts = ev.get("segs") or []
                                        if t_start_ms is None or d_ms is None or not seg_parts:
                                            continue
                                        t = "".join(p.get("utf8", "") for p in seg_parts)
                                        txt = (t or "").strip()
                                        if not txt:
                                            continue
                                        s = float(t_start_ms) / 1000.0
                                        e = s + (float(d_ms) / 1000.0)
                                        out.append(TranscriptSegment(start=s, end=e, text=txt))
                                    if out:
                                        segments = out
                                        detected_lang = lang_code
                                        break
                                except Exception:
                                    pass
                            # XML attempt with name
                            params_xml = {"v": video_id, "lang": lang_code, "name": name}
                            rx = httpx.get("https://www.youtube.com/api/timedtext", params=params_xml, headers=headers, timeout=15)
                            if rx.status_code == 200 and rx.text:
                                try:
                                    root = ET.fromstring(rx.text)
                                    out2: List[TranscriptSegment] = []
                                    for node in root.findall("text"):
                                        try:
                                            s = float(node.attrib.get("start", "0"))
                                            d = float(node.attrib.get("dur", "0"))
                                        except Exception:
                                            continue
                                        e = s + d
                                        raw = node.text or ""
                                        txt = html.unescape(raw).strip()
                                        if not txt:
                                            continue
                                        out2.append(TranscriptSegment(start=s, end=e, text=txt))
                                    if out2:
                                        segments = out2
                                        detected_lang = lang_code
                                        break
                                except Exception:
                                    pass
                        except Exception:
                            pass
                    if segs:
                        segments = segs
                        detected_lang = lang_code
                        break
        except Exception:
            pass

    if not segments:
        raise HTTPException(status_code=404, detail="Transcript not available for requested languages")

    full_text = "\n".join(seg.text for seg in segments)
    detected_lang = locals().get("detected_lang") or req.language or "en"
    return YouTubeIngestResponse(video_id=video_id, language=detected_lang, segments=segments, text=full_text)



