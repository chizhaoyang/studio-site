# studio-site

Static marketing site for Crescendo Journey Music Studio (English + `zh/` Chinese mirror). Plain HTML/CSS/JS — no build step, no dependencies to install.

## Testing locally

The header and footer are injected at runtime by `js/injectIncludes.js`, which `fetch()`es `header.html`/`footer.html`. That `fetch()` is blocked by the browser if you open a page directly from disk (`file://...`), so you must serve the site over local HTTP instead.

From the repo root, run one of:

```bash
python3 -m http.server 8000
```

or, if you have Node installed:

```bash
npx serve .
```

Then open **http://localhost:8000/** in a browser.

### What to check

- Navigate to each page from the nav: Home, About, Lessons, Policies, Contact (Showcase is intentionally unlinked — visit `/showcase.html` directly).
- Click the `中文` / `EN` language switch on any page and confirm it lands on the matching `/zh/...` (or root) page.
- Resize the window below ~900px to check the mobile hamburger menu opens/closes, including click-outside and `Esc` to close.
- Tab through a page with the keyboard from the very top — the first stop should be the "Skip to main content" link.
- Visit a nonexistent path (e.g. `/does-not-exist`) — note that Python's simple server doesn't emulate custom 404 routing, so this will 404 from the server itself rather than showing `404.html`; that page only renders correctly once deployed to hosting that's configured to serve it on a 404 (e.g. Cloudflare Pages).
- On the Contact page, avoid clicking final submit unless you intend to actually send a message — the form posts to a live Formspree endpoint, not a mock.
