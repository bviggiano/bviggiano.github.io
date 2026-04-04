# al-folio Template Features

This file documents template capabilities whose example files were removed to reduce repo size.
The underlying support (layouts, includes, plugins, JS/CSS) is all still in place; you just need
to add your own content files to use any of these.

Full al-folio docs: https://github.com/alshedivat/al-folio

## Jupyter Notebook Blog Posts

Write blog posts as `.ipynb` files. Code cells, outputs, and plots render inline.

1. Place your notebook in `assets/jupyter/`
2. In a blog post's markdown, embed it:

{% raw %}

```liquid
{% jupyter_notebook "assets/jupyter/my_post.ipynb" %}
```

{% endraw %}

Plugin: `jekyll-jupyter-notebook` (already enabled in `_config.yml`).

## 3D Protein Structure Visualization

Two approaches for embedding interactive 3D molecular viewers.

### Approach 1: Liquid Include (3Dmol.js)

Add `mol3d: true` to your post's front matter, then use the `mol3d.liquid` include.

**Simple usage** (loads from RCSB PDB):

{% raw %}

```liquid
{% include mol3d.liquid pdb="1CRN" style="cartoon" color="spectrum" %}
```

{% endraw %}

**With spinning and caption:**

{% raw %}

```liquid
{% include mol3d.liquid pdb="1CRN" spin="true" caption="Crambin" %}
```

{% endraw %}

**Custom code** (mirrors py3Dmol API):

{% raw %}

```liquid
{% capture mol_code %}
viewer.setStyle({cartoon: {color: 'spectrum'}});
viewer.addSurface($3Dmol.VDW, {opacity: 0.7, color: 'white'});
viewer.zoomTo();
{% endcapture %}
{% include mol3d.liquid pdb="1CRN" code=mol_code %}
```

{% endraw %}

**Loading from a local file:**

{% raw %}

```liquid
{% include mol3d.liquid file="assets/pdb/my_protein.pdb" style="stick" color="chainHetatm" %}
```

{% endraw %}

Parameters: `pdb`, `file`, `style` (default: cartoon), `color` (default: spectrum),
`width` (default: 100%), `height` (default: 400px), `code`, `caption`, `id`,
`spin` (true for default speed, or a number for custom speed).

### Approach 2: Jupyter Notebook with py3Dmol

For full Python control, use py3Dmol in a Jupyter notebook. py3Dmol outputs
self-contained HTML with inline 3Dmol.js, so it renders correctly when embedded.

1. Install py3Dmol: `pip install py3Dmol`
2. Write and run your notebook with py3Dmol code
3. Place the notebook in `assets/jupyter/`
4. Embed in a post (no `mol3d: true` frontmatter needed):

{% raw %}

```liquid
{% jupyter_notebook "assets/jupyter/protein_analysis.ipynb" %}
```

{% endraw %}

## Audio Embedding

Embed audio players in any post or page using the `audio.liquid` include.

1. Place audio files in `assets/audio/`
2. Use:

{% raw %}

```liquid
{% include audio.liquid path="assets/audio/my_file.mp3" controls=true %}
```

{% endraw %}

Supports: `autoplay`, `controls`, `loop`, `muted`, `caption`.

## Video Embedding

Embed local video files or YouTube/Vimeo iframes.

1. Place video files in `assets/video/`
2. Use:

{% raw %}

```liquid
{% include video.liquid path="assets/video/my_video.mp4" controls=true %}
```

{% endraw %}

For YouTube/Vimeo, pass the embed URL as `path` and it renders as an iframe.

## Plotly Interactive Charts

Embed interactive Plotly visualizations in posts.

1. Export your Plotly figure to an HTML file (e.g., `fig.write_html("assets/plotly/my_chart.html")`)
2. Embed in a post with an iframe:

```html
<iframe src="/assets/plotly/my_chart.html" width="100%" height="500px" frameborder="0"></iframe>
```

## Distill-Style Posts

Write academic-style posts with hover citations, footnotes, and margin notes using the Distill layout.

Set in your post's front matter:

```yaml
layout: distill
```

Supports `d-cite`, `d-footnote`, `d-math`, and other Distill web components.
Associated bibliography goes in `assets/bibliography/`.

## PDF Embedding

Reference PDFs from pages (e.g., your CV page can link to a PDF).

In `_pages/cv.md` front matter:

```yaml
cv_pdf: my_cv.pdf
```

Place the PDF in `assets/pdf/`.

## Coauthor Auto-Linking

Automatically hyperlink coauthors in your publications list.

Add entries to `_data/coauthors.yml`:

```yaml
"lastname":
  - firstname: ["Full Name", "F.", "F. M."]
    url: https://their-website.com
```

The `bib.liquid` layout matches these against your `papers.bib` entries and adds links.

## Tweet Embedding

Embed tweets in posts. The plugin caches tweet HTML in `.tweet-cache/`.

{% raw %}

```liquid
{% twitter https://twitter.com/user/status/123456789 %}
```

{% endraw %}

## Book Reviews

Use the `_books/` collection with the `book-review` layout.

Create a file in `_books/`:

```yaml
---
layout: book-review
title: "Book Title"
author: "Author Name"
cover: the_cover.jpg # place in assets/img/book_covers/
started: 2026-01-01
finished: 2026-02-01
rating: 4
---
Your review here.
```

The `_pages/books.md` page (already exists) displays the shelf.

## Lighthouse Performance Testing

The template includes a GitHub Actions workflow (`.github/workflows/lighthouse-badger.yml`)
that can run Lighthouse audits and store results in `lighthouse_results/`.

## Example/Demo Page (about_einstein.md)

The template ships with an Einstein-themed example about page showing all formatting options.
View the original at: https://github.com/alshedivat/al-folio/blob/main/_pages/about_einstein.md
