# Cassandra Douglas — Portfolio

## Project Overview
A personal portfolio site for Cassandra Douglas, UX Designer & Creative Technologist with 8+ years of experience. Built as a static HTML/CSS/JS site — no framework, no build system. Deployable to GitHub Pages or Vercel.

## File Structure
```
portfolio/
├── index.html          # Homepage — hero, marquee, about, featured work, CTA
├── work.html           # All 5 case studies listed in single-column grid
├── resume.html         # Resume with PDF download (window.print())
├── contact.html        # Contact form with mailto + success state
├── password.html       # Password gate — shown before any page if not authed
├── case-study-1.html   # Newest project (displays at top of work page)
├── case-study-2.html
├── case-study-3.html
├── case-study-4.html
├── case-study-5.html   # Oldest project (first written, Chubb early work)
├── css/styles.css      # Single shared stylesheet — all design tokens here
└── js/main.js          # Cursor, nav scroll, IntersectionObserver, form, print
```

## Design System
- **Background:** `#F8F7F4` warm off-white
- **Primary accent:** `#5B3DF5` violet
- **Secondary accent:** `#FF5C35` coral (personality moments)
- **Fonts:** Plus Jakarta Sans (headings) · Inter (body) · Space Mono (mono labels)
- **Key tokens:** defined in `:root` in `css/styles.css`

## Password Protection
- Gate page: `password.html`
- Auth stored in `sessionStorage` key `cd_auth`
- All pages redirect to `password.html` if not authenticated
- Password encoded as `btoa()` in `password.html` — search for `const HASH`
- To change password: replace `HASH` value with `btoa('yourNewPassword')`

## Case Study Structure (all 5 follow this template)
Every case study has:
1. **Hero** — Title + 1-sentence hook
2. **Stats bar** — Role · Timeline · Tools · Impact (`.cs-stats` / `.cs-stat`)
3. **01 Context & Challenge** — The problem and why it was hard
4. **02 My Role & Process** — What Cass specifically did
5. **03 What I'd Do Differently** — Honest reflection in `.cs-callout` block
6. **04 Outcomes & Impact** — Results, even if mixed

**Tone:** Confident & reflective. Never apologetic, never overselling.
Use "I" not "we" where Cass drove the work. Lead with the human problem.

## Case Study Order
- **Writing order:** CS5 → CS4 → CS3 → CS2 → CS1 (oldest to newest work)
- **Display order on site:** CS1 at top = newest project, CS5 at bottom = earliest Chubb work
- Titles are placeholders — rename after real content is added

## Resume
- Experience: Chubb, Oct 2022 – Present
- Placeholder fields: `[Field of Study]`, `[University Name]`, `[Graduation Year]`
- PDF download triggers `window.print()` — print styles in `css/styles.css`

## Dev Server
```bash
cd /Users/cass/portfolio && python3 -m http.server 3000
```
Visit: http://localhost:3000

## Key CSS Classes (case studies)
- `.cs-section` — section wrapper
- `.cs-section__label` — small mono label (e.g. "01 — Context & Challenge")
- `.cs-section__title` — section heading
- `.cs-callout` — highlighted callout block (used for "What I'd Do Differently")
- `.cs-quote-attr` — attribution line under a quote
- `.cs-stats` / `.cs-stat` / `.cs-stat__label` / `.cs-stat__value` — stats bar
- `.cs-hero__title` / `.cs-hero__desc` — hero area
- `.cs-image-block` — placeholder image block
- `.cs-nav` — prev/next project navigation
