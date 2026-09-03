# GharSakhi Ulwe

Founding-waitlist website for **GharSakhi** — a planned, on-demand, verified house-help booking service for **Ulwe, Navi Mumbai**.

Structurally inspired by the quick-service and trust-first home-services category (location-first hero CTA, service cards, how-it-works, trust signals, FAQ) — but with GharSakhi's own visual identity, not a copy of any single competitor's branding.

## Structure

```
gharsakhi-ulwe/
├── index.html         # RECOMMENDED — everything inline, one file, nothing to break on upload
├── index-split.html    # same page, but reads css/style.css and js/main.js instead
├── css/
│   └── style.css        # extracted styling — kept in sync with index.html by hand, see note below
├── js/
│   └── main.js           # extracted behaviour — same
└── README.md
```

**Use `index.html` unless you have a specific reason not to.** It's fully self-contained — no `css/` or `js/` folders, no relative paths to break. The earlier split version broke on GitHub's web "upload files" flow, which flattened the sub-folders and silently broke the `<link>`/`<script>` paths — the page still loaded, just with no styling. `index.html` can't hit that bug because it has nothing external to lose.

`index-split.html` + `css/style.css` + `js/main.js` are included as well, purely because you asked for them back — e.g. if you'd rather edit CSS/JS in their own files, or plan to run this through a bundler later. If you use this route, **push the whole folder with `git add`/`git push` from a terminal (or GitHub Desktop), not the browser's drag-and-drop "upload files" button** — that's specifically what flattened the structure last time. And rename `index-split.html` to `index.html` in the repo (GitHub Pages serves `index.html` as the homepage; `index-split.html` on its own is just a second page at `/index-split.html`).

⚠️ **`index.html` and `index-split.html`/`css`/`js` are two independent copies of the same content**, not one linked source. If you edit the page going forward, pick one route and edit consistently — changes made in one won't appear in the other.

## What's new in this version

- **Hero quick-entry field** — visitors can type their sector right in the hero; it jumps them to the full waitlist form below with that sector already filled in (a pattern borrowed from location-first home-services sites like trustedmaid.in, restyled in GharSakhi's own colors and type rather than copying their look).

## How the waitlist form works

There's no backend. Submitting the form composes an email (via a `mailto:` link) to the address hard-coded near the bottom of `index.html` — currently `gharsakhiofficial@gmail.com` — with the visitor's name, phone, sector/society, and selected services pre-filled in the body. The visitor's own mail app has to send it, so it's a soft-commit, not a guaranteed lead capture. Search `index.html` for `gharsakhiofficial@gmail.com` if you need to change it — it appears in three spots (the confirmation message, the footer, and the JavaScript that builds the mailto link). If you outgrow this (want signups saved automatically to a spreadsheet or database), swap the `submit` handler for a call to a form backend (Formspree, a Google Form, or your own small API) instead of building a `mailto:` link.

## Running it locally

For `index.html`: just open it in a browser — no server or build step, nothing external to fetch.

For `index-split.html`: open it the same way, or serve the folder (`python3 -m http.server 8000`) if your browser is fussy about loading local `css/`/`js/` files directly from disk.

## Deploying with GitHub Pages

**If you're using `index.html` (recommended):** push it and `README.md` straight into the repo root — drag-and-drop upload is fine here, there's nothing to flatten.

**If you're using the split version:** push `css/` and `js/` as real sub-folders (via `git push`, not drag-and-drop upload), and rename `index-split.html` to `index.html` in the repo so GitHub Pages picks it up as the homepage.

Either way:
1. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick your default branch and the `/ (root)` folder.
4. Save — GitHub gives you a `https://<username>.github.io/<repo>/` URL a minute or two later.
5. If it still looks unstyled after this, hard-refresh (Cmd/Ctrl+Shift+R) — GitHub Pages and browsers both cache aggressively, and the old broken version may still be cached.

## Before you launch this for real

- Confirm `gharsakhiofficial@gmail.com` is a real inbox someone is actually checking.
- The brand name **GharSakhi** hasn't had a formal trademark search — worth doing one, along with checking domain/social handle availability, before investing further in the name.
- Copy throughout is intentionally honest about being pre-launch (no fabricated review counts, user numbers, or testimonials) — keep that framing until there's a real, live service behind it.
