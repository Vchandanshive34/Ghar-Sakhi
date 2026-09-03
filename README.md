# GharSakhi Ulwe

Founding-waitlist website for **GharSakhi** — a planned, on-demand, verified house-help booking service for **Ulwe, Navi Mumbai**.

This is a static site: plain HTML/CSS/JS, no build step, no backend. It's meant to validate demand and collect a founding waitlist before any booking product exists.

## Structure

```
gharsakhi-ulwe/
├── index.html        # the whole page: hero, services, how-it-works, trust, coverage, pricing, waitlist form, FAQ
├── css/
│   └── style.css      # all styling, incl. light/dark theme tokens
├── js/
│   └── main.js         # waitlist form -> mailto handoff, scroll-reveal animation
└── README.md
```

## How the waitlist form works

There's no backend. Submitting the form composes an email (via a `mailto:` link) to the address hard-coded in `js/main.js` — currently `gharsakhiofficial@gmail.com` — with the visitor's name, phone, sector/society, and selected services pre-filled in the body. The visitor's own mail app has to send it, so it's a soft-commit, not a guaranteed lead capture. If you outgrow this (want signups saved to a spreadsheet or database automatically), swap the form's `submit` handler in `js/main.js` for a call to a form backend (e.g. Formspree, a Google Form, or your own small API) instead of building the `mailto:` link.

## Running it locally

No build tools needed — just open `index.html` in a browser, or serve the folder so relative paths behave the same as they will on GitHub Pages:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying with GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick your default branch and the `/ (root)` folder.
4. Save — GitHub gives you a `https://<username>.github.io/<repo>/` URL a minute or two later.

## Before you launch this for real

- Confirm `gharsakhiofficial@gmail.com` is a real inbox someone is actually checking.
- The brand name **GharSakhi** hasn't had a formal trademark search — worth doing one, along with checking domain/social handle availability, before investing further in the name.
- Copy throughout is intentionally honest about being pre-launch (no fabricated review counts, user numbers, or testimonials) — keep that framing until there's a real, live service behind it.
