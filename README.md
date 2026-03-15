# Zollo Electricals – Projects Page

Standalone Next.js app for the **Our Projects** collage. Designed to be hosted on Vercel and proxied at `https://zolloelectricals.com/projects/`.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- Static project data in `src/data/projects.json`
- Images served from Cloudinary (uploaded via script; no API keys in the app)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed images (Cloudinary)

1. Copy `.env.example` to `.env` in the project root.
2. Set in `.env` (never commit this file):
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Run:

   ```bash
   npm run upload-images
   ```

This uploads Pexels-sourced images to your Cloudinary cloud and writes the resulting URLs into `src/data/projects.json`. Add secrets only in GitHub environment secrets or locally in gitignored `.env`; never expose keys in the repo.

## Deploy on Vercel

1. Push this folder to a **new GitHub repo** (e.g. `zolloelectricals-projects`).
2. In [Vercel](https://vercel.com): **Add New Project** → Import the repo.
3. Set **Root Directory** to the repo root (or leave default if the repo contains only this app).
4. **Environment variables**: Add any needed vars in the Vercel dashboard only (e.g. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` if you use it). For static seed data + JSON, the app typically needs no Cloudinary env vars in Vercel; the upload script is run locally.
5. Deploy. Note the Vercel URL (e.g. `zolloelectricals-projects.vercel.app`).

## Serve at zolloelectricals.com/projects/ (WordPress iframe)

To serve this app at `https://zolloelectricals.com/projects/`:

- **Reverse proxy (Nginx/Apache)**: Add a location for `/projects` that proxies to `https://your-app.vercel.app`. Preserve the path or rewrite so the app receives requests correctly.
- **WordPress**: Use a reverse-proxy or iframe plugin so the page at `/projects/` shows the Vercel app (or embed the iframe pointing to the Vercel URL).
- **Hosting panel**: Some hosts let you set a “proxy subpath” to an external URL; point `/projects` to your Vercel deployment.

The app is built to be served at `/`; when proxied, the browser will show zolloelectricals.com so the page blends with your site.

## Collage layouts

- **Grid** – 3-column grid  
- **Masonry** – Pinterest-style columns  
- **Bento** – Mixed tile sizes  
- **Featured** – One large + four smaller  
- **Staggered** – Offset grid  

Layout switcher uses your palette: deep black, brown, yellow, green.
