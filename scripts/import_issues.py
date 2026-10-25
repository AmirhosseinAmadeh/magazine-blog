"""Import Pixel magazine PDFs into the site.

Usage (from the repo root):  python -I -X utf8 scripts/import_issues.py

For every Pixel-No<N>*.pdf in the repo root it writes, under site/public/magazine/<NN>/:
  <name>.pdf        copy of the PDF (download link)
  cover.jpg         large cover render (+ cover-sm.jpg, 420px, for shelves)
  pages/p001.jpg    every page, ~1100px wide (online reader)
  thumbs/p001.jpg   every page, ~260px wide (contact sheets)
and prints a JSON summary (page count + the two cover band colours) used to fill
site/src/content/issues/<NN>.md. The PDFs and renders are git-ignored on purpose.
"""
import glob
import json
import re
import shutil
import statistics
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'site' / 'public' / 'magazine'


def render(page, width, path, quality):
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(str(path), jpg_quality=quality)
    return pix


def band_colour(pix, x_frac):
    """Median RGB of a small patch in a cover side strip (away from logo and computer)."""
    cx, cy = int(pix.width * x_frac), int(pix.height * 0.32)
    r = max(4, pix.width // 60)
    chans = ([], [], [])
    for y in range(cy - r, cy + r):
        for x in range(cx - r, cx + r):
            px = pix.pixel(x, y)
            for i in range(3):
                chans[i].append(px[i])
    return '#%02x%02x%02x' % tuple(int(statistics.median(c)) for c in chans)


summary = {}
for pdf in sorted(glob.glob(str(ROOT / 'Pixel-No*.pdf'))):
    name = Path(pdf).name
    num = int(re.search(r'No(\d+)', name).group(1))
    nn = f'{num:03d}'
    dest = OUT / nn
    (dest / 'pages').mkdir(parents=True, exist_ok=True)
    (dest / 'thumbs').mkdir(exist_ok=True)
    shutil.copyfile(pdf, dest / name)

    doc = pymupdf.open(pdf)
    cover = render(doc[0], 1400, dest / 'cover.jpg', 85)
    render(doc[0], 420, dest / 'cover-sm.jpg', 80)  # shelf / archive cards
    for i, page in enumerate(doc, start=1):
        render(page, 1100, dest / 'pages' / f'p{i:03d}.jpg', 80)
        render(page, 260, dest / 'thumbs' / f'p{i:03d}.jpg', 70)
    summary[nn] = {
        'file': name,
        'pages': len(doc),
        'right': band_colour(cover, 0.96),
        'left': band_colour(cover, 0.04),
    }
    print(nn, summary[nn], flush=True)

print(json.dumps(summary, indent=2))
