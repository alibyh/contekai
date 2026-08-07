#!/usr/bin/env bash
# Builds public/media/{hero.mp4,hero.webm,poster.avif} from the client's raw clip.
#
# Run from the repo root:  ./scripts/build-hero-video.sh hero_vid.MOV
#
# WHY THIS EXISTS
# The delivered clip cannot be used as a hero background as-is. Measured on the
# source (1024x576):
#   - the ConteKai logo is burned into EVERY frame at x 50-205, y 50-85
#   - English subtitles are burned into ~90% of frames at x 270-755, y 424-488
#   - there is an AAC audio track
#   - most of the runtime is founders talking to camera, which is meaningless
#     muted, and it is shot in a bright office, which argues against a headline
#     about the lights going out
#
# So this script crops the bug and the caption band out of frame entirely
# (rather than hoping blur hides them), keeps only the b-roll segments that
# contain lit screens, and grades the result toward night.
#
# IF THE CLIENT SENDS A NEW CLIP: re-measure before trusting these numbers.
#   Bug / caption positions:  ffmpeg -ss 5 -i IN -frames:v 1 frame.png  and look
#   Peak luma after grading:  see the CHECK step at the bottom of this script
# The grade is load-bearing: tokens.css documents that hero text contrast is won
# by the peak luma being ~103/255, not by the scrim.

set -euo pipefail

SRC="${1:-hero_vid.MOV}"
OUT="public/media"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$SRC" ] || { echo "no such file: $SRC" >&2; exit 1; }
mkdir -p "$OUT"

# --- segments -----------------------------------------------------------------
# A: 1.5-4.2s  over-shoulder at a laptop, screen lit
# B: 11.5-15.0s  two people over a phone
# Both joined with a 0.5s crossfade, then the tail crossfaded back into the head
# so the loop point has no visible cut either.
#
# --- frame -------------------------------------------------------------------
# crop=1024:330:0:90 keeps y 90-420, which is below the logo bug (ends y 85) and
# above the caption band (starts y 424).
#
# --- grade -------------------------------------------------------------------
# gblur    keeps forms abstract: light and shadow, not a recognisable face
# eq       desaturates slightly and holds contrast
# colorbalance  pushes shadows blue, toward --ink-900
# colorlevels   caps output white near 0.4, which is what makes it a night ground

FILTER="\
[0:v]trim=start=1.5:end=4.2,setpts=PTS-STARTPTS,fps=25[a];\
[0:v]trim=start=11.5:end=15.0,setpts=PTS-STARTPTS,fps=25[b];\
[a][b]xfade=transition=fade:duration=0.5:offset=2.2[ab];\
[ab]split[m][n];\
[m]trim=start=0:end=0.5,setpts=PTS-STARTPTS[head];\
[n]trim=start=0.5:end=5.7,setpts=PTS-STARTPTS[body];\
[body][head]xfade=transition=fade:duration=0.5:offset=4.7[loop];\
[loop]crop=1024:330:0:90,\
gblur=sigma=18,\
eq=saturation=0.62:contrast=1.06,\
colorbalance=rs=-0.06:gs=-0.02:bs=0.13:rm=-0.05:bm=0.06,\
colorlevels=romin=0:romax=0.40:gomin=0:gomax=0.42:bomin=0.02:bomax=0.49[out]"

echo "==> mastering"
ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER" -map "[out]" \
  -an -c:v libx264 -crf 18 -pix_fmt yuv420p "$TMP/master.mp4"

echo "==> encoding delivery formats"
# -an on both: no audio track at all. Saves weight and removes autoplay risk.
ffmpeg -v error -y -i "$TMP/master.mp4" -c:v libx264 -preset slow -crf 27 \
  -pix_fmt yuv420p -movflags +faststart -an "$OUT/hero.mp4"
ffmpeg -v error -y -i "$TMP/master.mp4" -c:v libvpx-vp9 -crf 36 -b:v 0 \
  -row-mt 1 -pix_fmt yuv420p -an "$OUT/hero.webm"
# The poster is deliberately encoded well above the quality this blurred, dark
# frame needs. Chrome discards LCP candidates below ~0.05 bits per pixel as
# "low-entropy placeholders", and at crf 30 this poster came in at 0.046 bpp,
# which pushed the LCP element onto the header wordmark. crf 8 puts it at
# 0.10 bpp for 4.4 KB, so the poster is the LCP element as the section spec
# requires. It also stops a dark gradient banding.
ffmpeg -v error -y -ss 1.0 -i "$TMP/master.mp4" -frames:v 1 \
  -c:v libsvtav1 -crf 8 -f avif "$OUT/poster.avif" 2>/dev/null

# --- CHECK --------------------------------------------------------------------
echo "==> checks"
PEAK=$(ffmpeg -v error -i "$TMP/master.mp4" \
  -vf "signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-" -f null - 2>/dev/null \
  | grep -o "=[0-9.]*$" | tr -d '=' | sort -n | tail -1)
DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$TMP/master.mp4")
AUD=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$OUT/hero.mp4" | wc -l | tr -d ' ')

printf "    duration   %ss\n" "$DUR"
printf "    peak luma  %s/255  " "$PEAK"
if [ "${PEAK%%.*}" -le 120 ]; then echo "ok (>= 4.5:1 for --on-ink before the scrim)";
else echo "TOO BRIGHT — regrade, or raise the --scrim-hero-mobile bottom stop to 0.75"; fi
printf "    audio      %s stream(s)  " "$AUD"
if [ "$AUD" -eq 0 ]; then echo "ok"; else echo "FAIL — must be 0"; fi
ls -la "$OUT"/hero.mp4 "$OUT"/hero.webm "$OUT"/poster.avif
