# Jay Chawla Portfolio — Windows Handoff Guide

This folder contains the complete source code for Jay Chawla's personal portfolio website. It is a standalone Next.js project and does not depend on the Invisalign tracker or any other project in the original Codex workspace.

## Current state

The website is working and production-buildable. It has been checked with:

```text
npm run lint
npm run build
```

Both checks passed when this archive was created on 21 August 2026.

The website is currently a local project. `http://localhost:3000` only works while the development server is running on your own computer. The site has not yet been connected to a public domain or hosting account.

## What has been built

- A dark, single-page personal portfolio based on Jay's CV.
- A large editorial hero featuring the `JAY CHAWLA` wordmark.
- A portrait placeholder beside the name, ready to be replaced with a real photograph.
- A fixed header with Work, Experience, About, LinkedIn, GitHub, and Résumé links.
- The actual résumé PDF bundled at `public/resume.pdf`.
- A LinkedIn link pointing to `https://www.linkedin.com/in/jaychawlaosu`.
- A GitHub link currently pointing to `https://github.com/JayC0401`.
- Five portfolio projects with original animated technical illustrations.
- Five experience entries with summaries and CV-based accomplishments.
- Skills and education sections.
- A contact section with email and social links.
- A responsive mobile navigation menu.
- Scroll-triggered reveal animation using `IntersectionObserver`.
- A custom pointer for desktop mouse/trackpad devices with a bright core, compact ring, and trailing particles.
- A full-screen WebGL background: a dark black-and-blue magnetic aurora/flow field that reacts to pointer movement.
- Reduced-motion support and a static background fallback when WebGL is unavailable.
- Responsive layouts for desktop, tablet, and phone screens.
- Page metadata, favicon, title, and description.

Several earlier design ideas were deliberately removed: the four-number statistics strip, the large border around the hero/name area, the name text in the top-left header, and the earlier green-heavy/subtle particle backgrounds. The small circular `JC` mark remains in the header as the home button.

## Technology used

- Next.js 16
- React 19
- TypeScript
- Plain CSS
- WebGL/GLSL for the background
- No UI framework
- No database
- No backend API
- No user accounts or authentication
- No analytics or tracking scripts

Because the project has no backend, it is straightforward to host as a normal Next.js website.

## First-time setup on Windows

### 1. Extract the ZIP

Extract the archive to a normal folder such as:

```text
C:\Users\YOUR_NAME\Documents\jay-portfolio
```

Do not try to run the site from inside the ZIP.

### 2. Install Node.js

Install the current Node.js LTS release from:

```text
https://nodejs.org/
```

Keep the default installer options. Restart VS Code or your terminal after installation.

Confirm the installation in PowerShell:

```powershell
node --version
npm --version
```

### 3. Open the project

Open the extracted `jay-portfolio` folder in the ChatGPT/Codex Windows app or Visual Studio Code. Make sure you open this folder itself, not its parent folder.

### 4. Install dependencies

Open PowerShell inside the project directory and run:

```powershell
npm install
```

The archive intentionally excludes `node_modules` because it is large, generated, and operating-system-specific. `npm install` reconstructs it from `package-lock.json`.

### 5. Start the website

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Leave that PowerShell window open while working. Press `Ctrl+C` to stop the server.

If port 3000 is already occupied, Next.js will normally choose another port and print the address in the terminal.

## Commands you will use

```powershell
# Start the editable development version
npm run dev

# Check TypeScript for errors
npm run lint

# Create and verify an optimized production build
npm run build

# Run the production build after npm run build
npm start
```

## Project map

```text
jay-portfolio/
├── app/
│   ├── globals.css          Entire visual design and responsive layout
│   ├── layout.tsx           Fonts, metadata, favicon, and HTML shell
│   └── page.tsx             Loads the main portfolio page
├── components/
│   ├── KineticCursor.tsx    Desktop custom cursor and particle trail
│   ├── PortfolioPage.tsx    Header and every visible page section
│   ├── Reveal.tsx           Scroll-in reveal behaviour
│   └── Starfield.tsx        WebGL black/blue animated background
├── data/
│   └── portfolio.ts         Personal details and almost all written content
├── public/
│   ├── icon.svg             Browser/site icon
│   └── resume.pdf           Downloadable résumé shown by Résumé links
├── package.json             Commands and dependencies
├── package-lock.json        Exact dependency versions
├── README.md                Short project overview
└── START_HERE_WINDOWS.md    This full handoff guide
```

The `.next` and `node_modules` folders are generated locally and are intentionally excluded from the ZIP.

## The safest way to edit content

Most personal information is centralized in:

```text
data/portfolio.ts
```

Edit that file to change:

- Name, role, location, introduction, email, and phone number.
- LinkedIn and GitHub URLs.
- Project names, dates, descriptions, tags, and order.
- Work experience, dates, summaries, and accomplishment bullets.
- Skills.
- Education.

Keep quotation marks, commas, square brackets, and curly braces intact. Run `npm run lint` after editing.

Some prominent sentences are currently written directly in `components/PortfolioPage.tsx`, including:

- `AI/ML and software engineer in Singapore`
- `I turn complex data into systems people can actually use.`
- The About introduction.
- Contact-section wording.

Search for the sentence in that file to replace it.

## Replace the portrait placeholder

The portrait on the hero is currently a designed placeholder, not a real photo.

1. Put the selected image in `public`, preferably as:

```text
public/jay-portrait.webp
```

2. In `components/PortfolioPage.tsx`, find:

```tsx
<figure className="portrait-placeholder">
```

3. Replace the placeholder image block with an image while keeping the figure wrapper. A simple version is:

```tsx
<figure className="portrait-placeholder">
  <img
    className="portrait-photo"
    src="/jay-portrait.webp"
    alt="Jay Chawla"
  />
</figure>
```

4. Add this rule to `app/globals.css`:

```css
.portrait-photo {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center;
}
```

For better Next.js image optimisation, the standard `<img>` can later be replaced with `next/image`.

## Replace the résumé

The current CV is already included at:

```text
public/resume.pdf
```

To update it, replace that file with a new PDF using the exact same filename. All Résumé buttons will continue working automatically. Keep the file lowercase as `resume.pdf`.

## Change social links

Open `data/portfolio.ts` and edit:

```ts
linkedin: "https://www.linkedin.com/in/jaychawlaosu",
github: "https://github.com/JayC0401",
```

The LinkedIn URL was supplied directly. The GitHub URL should be confirmed before public launch.

## Understand the background animation

`components/Starfield.tsx` contains a custom WebGL fragment shader. Despite the historical component name `Starfield`, the current visual is a magnetic aurora/flow field, not a conventional star field.

The key colour values are inside the shader:

```glsl
vec3 deep = vec3(0.001, 0.003, 0.012);
vec3 teal = vec3(0.008, 0.04, 0.15);
vec3 ice = vec3(0.035, 0.15, 0.46);
vec3 signal = vec3(0.08, 0.38, 1.0);
```

The animation is fixed behind the complete website. It responds to pointer movement, uses a capped device-pixel ratio for performance, pauses movement for visitors who request reduced motion, and falls back to CSS gradients if WebGL cannot initialize.

## Understand the custom cursor

`components/KineticCursor.tsx` tracks the mouse, draws a bright core and compact ring, and animates seven small trail particles. The related appearance is in the `.kinetic-cursor` rules in `app/globals.css`.

It intentionally appears only when:

- The device reports a fine pointer, such as a mouse or trackpad.
- The visitor has not enabled reduced motion.

Phones and touch devices use their normal touch interaction and do not show a fake cursor.

## Before publishing

Complete these items before treating the portfolio as final:

1. Replace the portrait placeholder with Jay's real photo.
2. Confirm that `https://github.com/JayC0401` is the intended public GitHub profile.
3. Review every project and experience entry for wording and date accuracy.
4. Decide whether the phone number should remain in the source. It is not visibly displayed at present, but it exists in `data/portfolio.ts`.
5. Open every header and footer link.
6. Test the site at desktop and phone widths.
7. Run:

```powershell
npm run lint
npm run build
```

## Publish it as a real website with Vercel

The cleanest workflow is GitHub plus Vercel.

### A. Create a Git repository

From PowerShell inside the project:

```powershell
git init
git add .
git commit -m "Initial portfolio"
```

Install Git for Windows first if `git` is unavailable:

```text
https://git-scm.com/download/win
```

### B. Upload to GitHub

Create a new empty repository in your GitHub account, then follow the commands GitHub shows under **push an existing repository from the command line**.

Do not upload `.next`, `node_modules`, `.env`, or `.env.local`. The included `.gitignore` already excludes them.

### C. Deploy with Vercel

1. Go to `https://vercel.com` and sign in with GitHub.
2. Choose **Add New → Project**.
3. Import the portfolio repository.
4. Vercel should detect Next.js automatically.
5. Leave the standard build settings unchanged and select **Deploy**.
6. Vercel will provide a public `*.vercel.app` address.

Future GitHub pushes can automatically update the deployed website.

### D. Connect a custom domain later

In the Vercel project, open **Settings → Domains**, add the domain, and follow the DNS instructions shown for the domain registrar. Buying or connecting a domain is not included in this archive.

## How to continue with Codex on Windows

1. Install the ChatGPT/Codex desktop app for Windows.
2. Extract and open this `jay-portfolio` folder as the project.
3. Run `npm install` once.
4. Run `npm run dev`.
5. Give Codex the contents of this handoff document or ask it to read `START_HERE_WINDOWS.md` before making changes.

A useful first prompt is:

```text
Read START_HERE_WINDOWS.md, README.md, data/portfolio.ts, components/PortfolioPage.tsx, components/Starfield.tsx, components/KineticCursor.tsx, and app/globals.css. This is my existing portfolio. Preserve its current dark editorial direction and responsive behaviour. First run npm install, npm run lint, and npm run build, then tell me the current state before changing anything.
```

The old Mac chat is useful context, but this document and the project files are the authoritative handoff. A shared Codex chat link is only a read-only snapshot and does not transfer the local filesystem.

## Troubleshooting

### `npm` is not recognized

Install Node.js LTS, close and reopen PowerShell, then rerun `node --version` and `npm --version`.

### The page does not open

Confirm `npm run dev` is still running and use the exact Local URL printed in the terminal.

### Port 3000 is busy

Use the alternative port printed by Next.js, or stop the other development server.

### The résumé opens as 404

Confirm the file exists at `public/resume.pdf` with matching lowercase spelling.

### The background is static

Check whether Windows/browser reduced-motion accessibility settings are enabled. Also update graphics drivers and test in a current version of Chrome or Edge. A static fallback is expected when WebGL is unavailable.

### The custom cursor is absent

It is disabled on touch devices and when reduced motion is enabled. Test with a mouse or trackpad in Chrome or Edge.

### The build fails after editing content

Run `npm run lint` first. TypeScript normally identifies the affected file and line. The most common content-editing cause is a missing comma, quote, bracket, or brace in `data/portfolio.ts`.

## Archive integrity

This handoff ZIP should contain the editable source and assets but not generated dependencies or build output. After extraction, the expected first command is always:

```powershell
npm install
```

