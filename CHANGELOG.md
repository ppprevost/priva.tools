# Changelog

## [1.0.0](https://github.com/ppprevost/priva.tools/compare/v0.6.0...v1.0.0) (2026-03-08)

### Features

* extract Rust WASM to separate npm package `@ppprevost/pdf-wasm` — published on npm, no local Rust build needed ([6c8ea30](https://github.com/ppprevost/priva.tools/commit/6c8ea30))
* add automated SemVer versioning with release-please ([28955cb](https://github.com/ppprevost/priva.tools/commit/28955cb))

### Bug Fixes

* remove Rust wasm-build stage from Dockerfile ([dd0e58f](https://github.com/ppprevost/priva.tools/commit/dd0e58f))


## [0.6.0](https://github.com/ppprevost/priva.tools/compare/v0.5.0...v0.6.0) (2026-03-05)

### Features

* add Edit PDF tool — text box, highlight, form filling, in-place text editing (100% client-side, Rust + lopdf compiled to WASM) ([8ccb182](https://github.com/ppprevost/priva.tools/commit/8ccb182))
* add pdfjs 5.x text layer for text selection and highlight ([29dc641](https://github.com/ppprevost/priva.tools/commit/29dc641))
* add drag & resize on annotations, baseline alignment, loading state ([1efbe62](https://github.com/ppprevost/priva.tools/commit/1efbe62))

### Bug Fixes

* override svgo to 4.0.1 to patch CVE-2026-29074 (HIGH) ([63be27f](https://github.com/ppprevost/priva.tools/commit/63be27f))
* replace btoa with manual base64 encoder (sonarjs/deprecation) ([3309f56](https://github.com/ppprevost/priva.tools/commit/3309f56))


## [0.5.0](https://github.com/ppprevost/priva.tools/compare/v0.4.0...v0.5.0) (2026-03-04)

### Features

* add Sign PDF tool — handwriting canvas, typed signature (handwriting fonts), or uploaded image (100% client-side) ([944b204](https://github.com/ppprevost/priva.tools/commit/944b204))
* apply React 19 `use()` + Suspense pattern for font loading ([37990ef](https://github.com/ppprevost/priva.tools/commit/37990ef))

### Bug Fixes

* guard against malformed data URL and reset font promise on failure ([4585541](https://github.com/ppprevost/priva.tools/commit/4585541))
* resolve font promise on failure, add .catch on renderPage ([ffca6c5](https://github.com/ppprevost/priva.tools/commit/ffca6c5))
* replace atob with fetch(dataUrl) to avoid sonarjs/deprecation ([76828dd](https://github.com/ppprevost/priva.tools/commit/76828dd))


## [0.4.0](https://github.com/ppprevost/priva.tools/compare/v0.3.0...v0.4.0) (2026-03-03)

### Features

* add Protect PDF and Unlock PDF tools (qpdf WASM, 100% client-side) ([2ccbf0b](https://github.com/ppprevost/priva.tools/commit/2ccbf0b))
* add AI-generated neobrutalist illustrations via Replicate ([ee94c02](https://github.com/ppprevost/priva.tools/commit/ee94c02))
* add structured data, breadcrumbs, video embed and accessibility ([ea94358](https://github.com/ppprevost/priva.tools/commit/ea94358))
* clean architecture refactoring + Vitest test suite (110 tests) ([3d9431f](https://github.com/ppprevost/priva.tools/commit/3d9431f))


## [0.3.0](https://github.com/ppprevost/priva.tools/compare/v0.2.0...v0.3.0) (2026-03-02)

### Features

* add Cloudflare Turnstile captcha to contact form ([bf08301](https://github.com/ppprevost/priva.tools/commit/bf08301))
* add admin route for comment moderation with rate limiting ([ea4bde4](https://github.com/ppprevost/priva.tools/commit/ea4bde4))
* add OG image, character favicon and default social sharing image ([09fc8b7](https://github.com/ppprevost/priva.tools/commit/09fc8b7))
* add ESLint, Husky pre-push, GitHub Actions CI and Trivy security scan ([0691951](https://github.com/ppprevost/priva.tools/commit/0691951))

### Bug Fixes

* migrate all URLs from privatools.com to priva.tools ([5404e9d](https://github.com/ppprevost/priva.tools/commit/5404e9d))
* add priva.tools to allowed origins for API requests ([660f45f](https://github.com/ppprevost/priva.tools/commit/660f45f))


## [0.2.0](https://github.com/ppprevost/priva.tools/compare/v0.1.0...v0.2.0) (2026-02-28)

### Features

* rename PrivaTools to Priva.TOOLS, add support page ([a0e5341](https://github.com/ppprevost/priva.tools/commit/a0e5341))
* migrate blog from markdown files to Neon PostgreSQL ([41da6cc](https://github.com/ppprevost/priva.tools/commit/41da6cc))
* add blog API endpoints for mobile app ([0c167c0](https://github.com/ppprevost/priva.tools/commit/0c167c0))
* add mobile API key auth for KMP app ([aec6903](https://github.com/ppprevost/priva.tools/commit/aec6903))
* PNG compression via upng-js quantization + success message on all tools ([4e3a8ad](https://github.com/ppprevost/priva.tools/commit/4e3a8ad))
* live compression preview with quality slider ([6630903](https://github.com/ppprevost/priva.tools/commit/6630903))
* add before/after slider on image compression result ([4f0d22f](https://github.com/ppprevost/priva.tools/commit/4f0d22f))
* add native share button with social fallback on desktop ([4d45f74](https://github.com/ppprevost/priva.tools/commit/4d45f74))
* add SEO content strategy: blog, FAQ schema, trust pages ([bc70053](https://github.com/ppprevost/priva.tools/commit/bc70053))

### Performance Improvements

* `client:idle` on tools, dynamic confetti import, preconnect CDN ([9ab8783](https://github.com/ppprevost/priva.tools/commit/9ab8783))


## [0.1.0](https://github.com/ppprevost/priva.tools/commits/v0.1.0) (2026-02-27)

### Features

* initial release: Priva.TOOLS MVP — 9 privacy tools (image compression, background removal, crop, convert, PDF merge/split/compress/rotate), Astro 5 + React 19 islands ([0e8ca89](https://github.com/ppprevost/priva.tools/commit/0e8ca89))
* add confetti on success + interactive crop ([e31785f](https://github.com/ppprevost/priva.tools/commit/e31785f))
* preload background-removal model on hover + cache ONNX via Service Worker ([4e0b4e2](https://github.com/ppprevost/priva.tools/commit/4e0b4e2))
* add contact page with Neon PostgreSQL persistence ([9fd4d3a](https://github.com/ppprevost/priva.tools/commit/9fd4d3a))
* add Dockerfile and deploy to Coolify ([3131658](https://github.com/ppprevost/priva.tools/commit/3131658))
