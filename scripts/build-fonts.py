#!/usr/bin/env python3
"""
build-fonts.py — rebuild the self-hosted Archivo subsets.

The woff2 files in public/fonts/ were originally produced by hand and the
recipe was never written down, which meant the weight range they had been
instanced to (400-700) was invisible until a design asked for 900 and silently
got 700. This script is that recipe.

    python3 scripts/build-fonts.py path/to/Archivo[wdth,wght].ttf

Source: https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf

What it does, and why each step exists:

  1. Instances the variable font down to the axis ranges this build actually
     uses. Archivo ships wght 100-900 and wdth 62-125; carrying ranges nobody
     references is pure download weight.

       wght 400-900  — 400 body, 500/600 labels and buttons, 900 display.
       wdth 100-112  — 100 everywhere, 112 for the display line. The width axis
                       is how this build separates display from body instead of
                       loading a second family, so it has to survive.

  2. Subsets to two unicode ranges, latin and latin-ext, matching the two
     @font-face blocks in base.css. An English page only ever downloads the
     first; latin-ext exists so a stray accented character does not fall back
     to a system face mid-paragraph.

  3. Emits woff2.

Keep the two unicode ranges below in sync with base.css. If they drift, the
browser will download a file that cannot render the character that triggered
it.
"""

import subprocess
import sys
from pathlib import Path

# Must match the unicode-range declarations in src/styles/base.css exactly.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FEFF,U+FFFD"
)
LATIN_EXT = (
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,"
    "U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,"
    "U+2C60-2C7F,U+A720-A7FF"
)

# The axis ranges base.css declares. Changing these means changing the
# font-weight / font-stretch descriptors on the @font-face blocks too.
AXES = ["wght=400:900", "wdth=100:112"]

OUT = Path("public/fonts")


def run(cmd: list[str]) -> None:
    print("  " + " ".join(cmd[:2]) + " ...")
    subprocess.run(cmd, check=True)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)

    src = Path(sys.argv[1])
    if not src.exists():
        sys.exit(f"No such font: {src}")

    OUT.mkdir(parents=True, exist_ok=True)
    partial = OUT / "_archivo-partial.ttf"

    print("Instancing axes to the ranges this build uses...")
    run(
        ["fonttools", "varLib.instancer", str(src), *AXES, "-o", str(partial)]
    )

    for name, unicodes in (
        ("archivo-var-subset.woff2", LATIN),
        ("archivo-var-ext-subset.woff2", LATIN_EXT),
    ):
        print(f"Subsetting {name}...")
        run(
            [
                "fonttools",
                "subset",
                str(partial),
                f"--unicodes={unicodes}",
                "--layout-features=kern,liga,calt,tnum",
                "--flavor=woff2",
                "--no-hinting",
                "--desubroutinize",
                f"--output-file={OUT / name}",
            ]
        )

    partial.unlink()

    print("\nDone. Sizes (only the first is downloaded on an English page):")
    for name in ("archivo-var-subset.woff2", "archivo-var-ext-subset.woff2"):
        kb = (OUT / name).stat().st_size / 1024
        print(f"  {name:32} {kb:6.1f} KB")
    print(
        "\nBudget is 80 KB of fonts total. Add dm-mono-subset.woff2 and\n"
        "dm-mono-500-subset.woff2 to the first number before judging."
    )


if __name__ == "__main__":
    main()
