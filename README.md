# Furuochen's Blog

Static personal blog hosted on GitHub Pages at [blog.furuochen.com](https://blog.furuochen.com).

## Structure

```
index.html              Homepage
styles.css              Horizontal layout styles
vertical.css            Vertical writing-mode styles (Chinese)
psychology/
  index.html            Psychology section listing
  hedonic_adaptation.html
  happiness.html
chinese/
  vertical.html         Chinese linguistics (vertical layout experiment)
```

## Adding a post

1. Create a new `.html` file under the relevant section (e.g. `psychology/my_post.html`).
2. Copy the `<head>` and page shell from an existing article in that section.
3. Add a listing entry on the section `index.html` and on the root `index.html` if it should appear as a recent post.
4. Commit and push to `main`; GitHub Pages redeploys automatically.

## Local preview

Serve the repo root with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Absolute paths (`/styles.css`, etc.) require serving from the repo root, not from a subdirectory.
