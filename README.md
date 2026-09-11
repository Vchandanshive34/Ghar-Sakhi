# GharSakhi Ulwe

Founding-waitlist website for **GharSakhi** — a planned, on-demand, verified house-help booking service for **Ulwe, Navi Mumbai**.

**v2 — full redesign (current version).** This is a from-scratch rebuild of the landing page, not a restyle: new visual identity (warm ivory + near-black charcoal + a single terracotta accent, large editorial serif type, illustrated SVG scenes instead of stock photos), new storytelling structure (problem → chaos → before/after → how it works → trust → gated-society fit → coverage map → founding perks → pricing → community → waitlist → FAQ → final CTA), and a fair amount of new interaction (a floating "booking card" demo in the hero, a selectable service grid, an auto-cycling how-it-works phone mock, a branded Ulwe sector map with a "check my sector" prompt). None of it is a copy of Snabbit, trustedmaid.in, Uber, Airbnb or Urban Company's actual UI — it borrows the *category's* conventions (hero CTA, trust strip, how-it-works, FAQ) the way any modern consumer-service site would, with GharSakhi's own look.

The previous version (hero + skyline illustration, count-up stats) isn't included in this delivery, but it wasn't discarded either — say the word if you'd like it back to compare or roll back to.

## Structure

```
gharsakhi-ulwe/
├── index.html          # RECOMMENDED — everything inline, one file, nothing to break on upload
├── index-split.html     # same page, but reads css/style.css and js/main.js instead
├── dashboard.html         # founder-only view of waitlist signups (login required) — see "Dashboard" below
├── css/
│   └── style.css           # extracted styling — kept in sync with index.html by hand, see note below
├── js/
│   └── main.js              # extracted behaviour incl. the Supabase submit logic — same
├── supabase/
│   └── schema.sql            # run once in Supabase's SQL Editor to create the table + both policies
└── README.md
```

**Use `index.html` unless you have a specific reason not to.** It's fully self-contained — no `css/` or `js/` folders, no relative paths to break. The earlier split version broke on GitHub's web "upload files" flow, which flattened the sub-folders and silently broke the `<link>`/`<script>` paths — the page still loaded, just with no styling. `index.html` can't hit that bug because it has nothing external to lose.

`index-split.html` + `css/style.css` + `js/main.js` are included as well, purely because you asked for them back — e.g. if you'd rather edit CSS/JS in their own files, or plan to run this through a bundler later. If you use this route, **push the whole folder with `git add`/`git push` from a terminal (or GitHub Desktop), not the browser's drag-and-drop "upload files" button** — that's specifically what flattened the structure last time. And rename `index-split.html` to `index.html` in the repo (GitHub Pages serves `index.html` as the homepage; `index-split.html` on its own is just a second page at `/index-split.html`).

⚠️ **`index.html` and `index-split.html`/`css`/`js` are two independent copies of the same content**, not one linked source. If you edit the page going forward, pick one route and edit consistently — changes made in one won't appear in the other.

## What's in the v2 redesign

- **New design system** — ivory (`--paper`) background, near-black charcoal (`--ink`) type, one terracotta accent (`--accent`) used consistently for every CTA, checkmark and highlight. Fraunces for headlines (large, editorial), IBM Plex Sans for body copy, IBM Plex Mono for eyebrows/labels. Full dark-mode token set included (`prefers-color-scheme` + a `data-theme` override for a manual toggle, if you ever add one).
- **Immersive hero with a live demo** — an illustrated Ulwe skyline (pure SVG, no stock photos — see "Why illustrations, not photos" below) with a floating, gently-animated "booking card" showing what a request will look like: service, sector, time, Confirm Request. Clicking **Confirm Request** scrolls to the real waitlist form with that service/sector pre-filled — it's a preview, not a fake booking, and never pretends to submit anything on its own.
- **WhatsApp-chaos section** — an illustrated group-chat mockup ("Anyone know a good bai in Sector 19?" → "Guard isn't allowing her inside…") that dramatizes the actual problem before pivoting to "There has to be a better way."
- **Before/after comparison** — without GharSakhi vs. with GharSakhi, side by side.
- **How-it-works as a journey** — four steps drive an animated phone mock through matching screens (choose service → choose time → meet your Sakhi → pay by the hour). Steps are clickable/keyboard-selectable and auto-advance when scrolled into view (pausing on hover/focus), always respecting `prefers-reduced-motion`.
- **Selectable service grid** — six services as tappable "products," not plain cards; picking one pre-checks that service in the waitlist form and scrolls you there.
- **Verified-Sakhi trust section** — a realistic (fictional) helper profile card plus a booking → helper profile → photo ID → society gate → home flow diagram.
- **"Built for gated societies" section** — a step-by-step visual of how a booking becomes something your society's guard can actually verify.
- **Branded Ulwe sector map** — an illustrated (not Google Maps) sector layout with a legend and a "Check my sector" field that notes interest and pre-fills the waitlist form; it's honest that this isn't a live availability lookup.
- **Founding Member Pass section** — a membership-pass-styled panel for the four founding perks, instead of a generic 4-card grid.
- **Simple pricing** — "₹ / hour" plus "no subscription / no deposit / no contract / no monthly minimum." No invented numbers, because there's no live pricing yet.
- **Founding Community section** — deliberately **not** fake testimonials or invented user counts (pre-launch, so there's nothing real to show yet); it names what we're actually tracking (founding households, sectors of interest, services requested) instead.
- **Waitlist form, extended** — now asks for Sector and Society/Building separately, plus an optional Preferred time, matching the brief's field list. See "Form field mapping" below for how these map onto the *unchanged* Supabase table.
- **FAQ as a true accordion** — opening one question closes the others; added two new questions (helper cancels? same helper again?) on top of the original set.
- **Scroll reveals, hover-lift, animated nav underline, button sheen, sticky mobile CTA bar, floating WhatsApp button** — all gated behind `@media (prefers-reduced-motion: no-preference)`, so anyone who's asked their OS to reduce motion gets the same content instantly, no animation.
- **SEO/OG metadata + favicon** — page title, meta description, canonical tag, Open Graph + Twitter card tags (the `og:image` URL is a placeholder — see the SEO note below), and a simple monogram favicon (no image file needed, it's an inline SVG data URI).

### Why illustrations, not photos

The brief asked for "beautiful real-life home imagery." This build uses illustrated SVG scenes (the skyline, the gated-society entrance, the Ulwe map) instead of actual photography, for two practical reasons: real photos of specific homes/people would need to be licensed or shot (nothing here should look like it's using someone's photo without permission), and a file full of hotlinked or embedded photos stops being a single portable HTML file you can drop into GitHub Pages. If you'd like real photography later, the natural next step is a small set of licensed/shot images for the hero and the gated-society section specifically — happy to help wire those in once you have them.

### SEO note

`og:image` in `<head>` points to `https://vchandanshive34.github.io/Ghar-Sakhi/og-image.png`, which doesn't exist yet — social previews (WhatsApp/Twitter/LinkedIn link cards) will show no image until you add one. A 1200×630px PNG at that path fixes it; not urgent for a pre-launch waitlist, but worth doing before you actively share the link.

## WhatsApp, alongside email

The waitlist form offers WhatsApp everywhere it also offers email:

- Next to the **Join the waitlist** button there's a **WhatsApp us instead** link — it opens a chat to `+91 93213 95952` with a message pre-filled from whatever the visitor has typed into the form so far, so someone can bail out of the form and go straight to WhatsApp at any point.
- After submitting (success, Supabase failure, or Supabase not yet configured), the confirmation panel offers **both** a WhatsApp link (pre-filled with their submitted details) and the existing `mailto:` email option.
- The footer's "Questions?" line now links to WhatsApp as well as email.

This uses WhatsApp's free **click-to-chat** links (`wa.me/<number>?text=...`) — no signup, no cost, no backend. The trade-off: it opens a chat with the message pre-filled, but the visitor still has to tap **Send** themselves; it can't send automatically on their behalf. (A fully automatic "form saves → you get pinged on WhatsApp with zero visitor action" flow exists too, but needs a registered WhatsApp Business API number and a paid provider — ask if you want that set up later.)

To change the WhatsApp number, search each file for `919321395952` (used in `wa.me/...` links) and `WHATSAPP_NUMBER` (used in the JS that builds the pre-filled message) and replace both — same independent-copies caveat as Supabase credentials: `index.html` and the split `index-split.html`/`css/style.css`/`js/main.js` must each be edited separately.

## Form field mapping

The v2 form has more visible fields than the Supabase table has columns, on purpose — extending the table would mean everyone re-running SQL migrations, and the brief's own instruction was "do not break existing functionality." So two fields get combined before saving, transparently:

- **Sector** + **Society/Building** are joined into the existing `sector` column as `"Sector 19 — Ashoka Alta"` (or just `"Sector 19"` if Society/Building is left blank — it's optional).
- **Preferred time** + **Anything else** are joined into the existing `notes` column as `"Preferred time: Weekday mornings. <their other notes>"` (or just their other notes if Preferred time is left blank).

Both the `mailto:` fallback email and the WhatsApp message show all four pieces as separate labeled lines regardless — the combining only happens in what gets saved to the `sector`/`notes` columns in Supabase, so nothing is lost, and the dashboard's sector/service breakdown still works (it just sees the combined text). If you'd rather give Society/Building and Preferred time their own database columns later, that's a straightforward `ALTER TABLE` — ask if you want that done.

## How the waitlist form works

**Until you connect Supabase (see below), it behaves exactly as before**: submitting composes an email (via `mailto:`) to `gharsakhiofficial@gmail.com` with the visitor's details pre-filled, and their own mail app has to send it.

**Once Supabase is connected**, submitting the form instead saves a row straight into your `waitlist_signups` table — a real, queryable record, no email step required. If the save ever fails (bad credentials, no internet, Supabase is down), the form automatically falls back to the `mailto:` behavior so you never silently lose a signup.

## Connecting Supabase

Supabase gives this static site a real (free-tier) database and a public API, without needing a server of your own — a good fit since GitHub Pages only serves static files.

**1. Create a project**
- Go to [supabase.com](https://supabase.com) and sign in (GitHub login is easiest).
- **New project** → name it e.g. `gharsakhi-ulwe`, pick a region close to India, set a database password (save it somewhere safe — you likely won't need it for this setup, but you might later).
- Wait ~2 minutes for it to finish provisioning.

**2. Create the table**
- In the project, open **SQL Editor** → **New query**.
- Paste in the contents of [`supabase/schema.sql`](supabase/schema.sql) from this repo and click **Run**.
- This creates a `waitlist_signups` table and locks it down with Row Level Security so the public API can only ever *insert* rows — never read, edit, or delete them.

**3. Get your API credentials**
- Go to **Project Settings → API**.
- Copy the **Project URL** and the **`anon` `public`** key. (Never use the **`service_role`** key anywhere in this front-end code — it bypasses Row Level Security and must stay server-side only, which this project doesn't have.)

**4. Create your dashboard login**
- Still in Supabase: **Authentication → Users → Add user**.
- Use the *same* email `schema.sql`'s admin policy checks for — `gharsakhiofficial@gmail.com` by default — and set a password. This is the only account `dashboard.html` will let in, because the SQL policy only grants read access to that exact email.
- Want a different email for dashboard login? Edit the address in **both** places before running the SQL: the `auth.jwt() ->> 'email' = '...'` line in `supabase/schema.sql`, and create the Supabase Auth user with that same address.

**5. Wire the credentials into the site**
- Open `js/main.js` (this also updates `index-split.html` automatically, since it loads that file) and `dashboard.html`.
- In each, near the top, replace:
  ```js
  var SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
  var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
  ```
  with your real values — same URL and anon key in both files.
- **If you're using `index.html`** (the recommended, self-contained file) for the public site, also paste those same two values into its inline `<script>` block near the bottom — search it for `SUPABASE_URL`. Remember: `index.html` and `js/main.js` are independent copies (see the structure note above), so this is a manual edit in each file, not automatic.

**6. Viewing signups**
- Open `dashboard.html` (locally, or wherever you deploy it — see "Deploying with GitHub Pages" below) and sign in with the account you created in step 4. You'll get stat tiles, a sector/service breakdown, a searchable table, and a CSV export.
- Or skip the dashboard entirely and use Supabase's own **Table Editor → waitlist_signups** — that's you, the project owner, browsing directly, and isn't subject to either RLS policy.
- Want an email/Slack ping on every new signup instead of checking manually? Supabase has built-in **Database Webhooks** (Project Settings → Database → Webhooks) you can point at a Zapier/Make automation — outside the scope of this repo, but worth knowing it exists.

It's safe to commit your Supabase URL and anon key to a public GitHub repo — the anon key is designed to be public, and the RLS policies in `schema.sql` are what actually keep the data safe (public can only insert; only the one authenticated founder account can read). Just double-check you never paste the `service_role` key anywhere in this repo — that key ignores RLS entirely.

## Dashboard

`dashboard.html` is a separate, unlisted page — nothing on the public site links to it, and it's excluded from search engines (`<meta name="robots" content="noindex">`). It shows real names and phone numbers, so treat its URL as sensitive even though "unlisted" isn't real security on its own:

- **The actual protection is the login + the RLS policy**, not the URL being hard to guess. Without signing in as the exact email `schema.sql` allows, the page loads but the table stays empty — Supabase (correctly) won't say whether that's "no rows" or "not authorized," so a blank dashboard after logging in with the wrong account is expected, not a bug.
- Sessions persist in the browser (Supabase's default), so once you sign in on a device you stay signed in there until you hit **Sign out**. Don't leave it signed in on a shared or public computer.
- If you ever need to revoke access, change that Supabase Auth user's password (or delete the user) from **Authentication → Users**.

## Running it locally

For `index.html`: just open it in a browser — no server or build step, nothing external to fetch.

For `index-split.html`: open it the same way, or serve the folder (`python3 -m http.server 8000`) if your browser is fussy about loading local `css/`/`js/` files directly from disk.

## Deploying with GitHub Pages

**If you're using `index.html` (recommended):** push it, `dashboard.html`, and `README.md` straight into the repo root — drag-and-drop upload is fine here, there's nothing to flatten. `dashboard.html` is self-contained too (it only reaches out to the Supabase CDN and your Supabase project, both by full URL, not a relative path), so it isn't affected by the flattening issue either.

**If you're using the split version:** push `css/` and `js/` as real sub-folders (via `git push`, not drag-and-drop upload), and rename `index-split.html` to `index.html` in the repo so GitHub Pages picks it up as the homepage.

Either way:
1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick your default branch and the `/ (root)` folder.
3. Save — GitHub gives you a `https://<username>.github.io/<repo>/` URL a minute or two later.
4. If it still looks unstyled after this, hard-refresh (Cmd/Ctrl+Shift+R) — GitHub Pages and browsers both cache aggressively, and the old broken version may still be cached. The same applies after wiring up Supabase: hard-refresh to make sure you're testing the live version, not a cached one.

## Before you launch this for real

- Confirm `gharsakhiofficial@gmail.com` is a real inbox someone is actually checking.
- The brand name **GharSakhi** hasn't had a formal trademark search — worth doing one, along with checking domain/social handle availability, before investing further in the name.
- Copy throughout is intentionally honest about being pre-launch (no fabricated review counts, user numbers, or testimonials) — keep that framing until there's a real, live service behind it.
