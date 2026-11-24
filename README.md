# Abid Islam Khalid — Portfolio

Personal portfolio for **Abid Islam Khalid**: Software Engineer, Cybersecurity Specialist, AI Researcher.
It's plain HTML, CSS and vanilla JavaScript. There is no build step and no dependencies.

- Dark mode by default, with a light-mode toggle (your choice is saved)
- Mobile-first layout that works from 360px phones to 4K screens
- Scroll-reveal and hover animations that turn off when `prefers-reduced-motion` is set
- Accessible: semantic HTML, skip link, keyboard-friendly menu, visible focus states, AA contrast
- SEO: meta tags, Open Graph and Twitter cards, JSON-LD `Person` schema, `sitemap.xml`, `robots.txt`, favicon and web manifest
- Contact form sends through [Formspree](https://formspree.io); if Formspree isn't set up, it opens the visitor's email app (`mailto:`) instead
- Local Lighthouse run (mobile): Performance 99, Accessibility 100, Best Practices 100, SEO 100

## File structure

```
.
├── index.html                 # The whole single-page site
├── 404.html                   # Custom "page not found" page
├── css/
│   └── style.css              # Design tokens (CSS variables), layout, components, responsive rules
├── js/
│   └── main.js                # Theme toggle, nav, rotating titles, reveal, counters, contact form
├── assets/
│   ├── cv/
│   │   └── Abid_Islam_Khalid_CV.pdf   # Used by the "Download CV" button
│   └── img/
│       ├── favicon.svg
│       ├── favicon-32.png
│       ├── apple-touch-icon.png       # 180×180
│       ├── icon-192.png / icon-512.png
│       └── og-image.png               # 1200×630 social preview image
├── site.webmanifest
├── sitemap.xml
├── robots.txt
├── vercel.json                # Clean URLs, security headers, caching
└── README.md
```

## What you need to edit

Search the project for `TODO`. Every place you need to change is marked with it. The main ones:

| What | Where |
|---|---|
| Your domain (replace `https://abid102-tech.github.io`) | `index.html` (`<head>` + JSON-LD), `sitemap.xml`, `robots.txt` |
| LinkedIn URL (replace `your-linkedin-handle`) | `index.html` (hero, contact, footer, JSON-LD) |
| Check GitHub URL `github.com/abid102-tech` and your email | `index.html` |
| Projects: descriptions, tech tags, GitHub/Live links | `index.html` → `#projects` |
| Ventures: names and one-line descriptions | `index.html` → `.ventures` |
| Paper titles, venues, status, links | `index.html` → `#research` |
| Experience bullet points (add outcomes and numbers) | `index.html` → `#experience` |
| Skill levels (`data-level="1|2|3"`) | `index.html` → `#skills` |
| Stats (CGPA, papers, projects, roles) | `index.html` → `.stats` |
| Formspree form ID (`YOUR_FORM_ID`) | `index.html` → contact `<form>` |
| CV PDF | Replace `assets/cv/Abid_Islam_Khalid_CV.pdf` and keep the same filename |
| Availability badge in the hero | `index.html` → `.eyebrow` |
| Colour palette (optional) | `css/style.css` → `--accent`, `--accent-2`, `--gradient` |

**Adding a project:** copy one `<article class="project-card">…</article>` block in `#projects` and edit it.

**Adding a photo (optional):** put `assets/img/profile.jpg` (around 600×600, under 100 KB) in the folder and add
`<img src="assets/img/profile.jpg" alt="Portrait of Abid Islam Khalid" width="300" height="300" loading="lazy">` inside `.about-copy`.

## Run locally

Use any static server, for example:

```bash
# Python 3
python3 -m http.server 8080
# or Node
npx serve .
```

Then open http://localhost:8080.

## Set up the contact form (Formspree, free)

1. Sign up at https://formspree.io and create a new form, using your email as the recipient.
2. Copy the form endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, replace `https://formspree.io/f/YOUR_FORM_ID` with that endpoint.
4. Deploy, send yourself a test message, and confirm the email Formspree sends you on the first submission.

## Deploy: GitHub + Vercel

### 1. Push to GitHub

1. Create a new **public** repository at https://github.com/new, e.g. `portfolio`. Don't add a README; this project already has one.
2. In the project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```

### 2. Deploy on Vercel

1. Go to https://vercel.com and sign up with GitHub.
2. Click **Add New… → Project** and import your `portfolio` repository.
3. Use these settings:
   - **Framework Preset:** `Other`
   - **Build Command:** leave it empty
   - **Output Directory:** leave it empty (the site is served from the repository root)
4. Click **Deploy**. After about 30 seconds you'll get a URL like `https://portfolio-xxxx.vercel.app`.
5. Optional: change the subdomain under **Project → Settings → Domains**, e.g. `abid102-tech.github.io`, or add a custom domain like `abidkhalid.dev` and follow Vercel's DNS instructions.

### 3. After the first deploy

1. Replace every `https://abid102-tech.github.io` with your final URL in `index.html`, `sitemap.xml` and `robots.txt`, then commit and push. Vercel redeploys automatically on every push to `main`.
2. Check your social preview with https://www.opengraph.xyz.
3. Submit `https://<your-domain>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
4. Run Lighthouse in Chrome DevTools (Incognito, Mobile) to confirm your scores.

## Browser support

Works in current versions of Chrome, Edge, Firefox and Safari (iOS 15.4+).
Older browsers still get all the content; they may just miss some visual effects.

## License

The code is free to reuse. The content (text, CV, images) is © Abid Islam Khalid.
