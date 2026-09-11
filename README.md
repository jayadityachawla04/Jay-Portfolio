# Jay Chawla — Portfolio

A responsive, single-page portfolio built with Next.js, React, and TypeScript. Content is based on Jay's CV and covers AI/ML engineering, data systems, robotics simulation, full-stack development, professional experience, projects, technical skills, and education.

## Run locally

Use a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify a production build

```bash
npm run lint
npm run build
npm start
```

## Personal details

Portfolio content is centralized in `data/portfolio.ts`. The supplied résumé is available at `public/resume.pdf` and linked from the header, navigation, and contact section.

## Deployment

The app is ready for any Next.js-compatible host such as Vercel. A public deployment requires the owner’s hosting account or an approved target project.

## Checks completed

- TypeScript validation
- Production build
- Dependency audit
- Desktop layout and navigation
- Mobile layout, menu, anchors, and horizontal overflow
- Custom cursor interaction on pointer devices
- Expandable experience rows
- Résumé asset response
- Browser console errors
