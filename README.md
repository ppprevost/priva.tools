# Priva.TOOLS

Privacy-first file tools that run entirely in your browser. No upload, no server processing, no tracking. Your files never leave your device.

**Live at [priva.tools](https://priva.tools)**

## What it does

PDF and image tools powered by Web Workers and WebAssembly, all client-side:

| Tool | Route |
| :--- | :---- |
| Compress PDF | `/compress-pdf` |
| Merge PDF | `/merge-pdf` |
| Split PDF | `/split-pdf` |
| JPG to PDF | `/jpg-to-pdf` |
| Compress Image | `/compress-image` |
| Resize Image | `/resize-image` |
| Crop Image | `/crop-image` |
| Convert to JPG | `/convert-to-jpg` |
| Remove Background | `/remove-background` |

Other pages: `/blog`, `/about`, `/contact`, `/support`, `/privacy`

## Tech stack

- **Astro 5** + **React 19** with hybrid SSR (Node adapter)
- **Tailwind CSS v4** with a brutalist design system
- **Web Workers** for all file processing (no main thread blocking)
- **Neon PostgreSQL** (serverless) for contact form, comments, and blog
- **Cloudflare Turnstile** for captcha on forms
- **Docker** + **Coolify** for deployment

## Getting started

```sh
pnpm install
pnpm dev
```

The app runs at `localhost:4321`. All file tools work without any configuration since they run client-side.

## Environment variables

Only needed if you want the server-side features (contact form, comments, blog API, admin):

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `PUBLIC_PAYPAL_LINK` | PayPal.me link for the support page (must be `PUBLIC_` prefixed for Astro buildtime) |
| `MOBILE_API_KEY` | API key for the KMP mobile app |
| `ADMIN_SECRET` | Bearer token for `/api/admin/comments` |

Without these variables, the tools still work perfectly. The contact form and comments just won't be functional.

## Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build to `./dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |

## License

MIT
