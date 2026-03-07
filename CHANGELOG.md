# Changelog

## [1.0.0](https://github.com/ppprevost/priva.tools/commits/v1.0.0) (2026-03-08)

### Features

* extract Rust WASM to separate npm package `@ppprevost/pdf-wasm` ([6c8ea30](https://github.com/ppprevost/priva.tools/commit/6c8ea30))
* edit-pdf improvements: UX, baseline fix, loading state, drag/resize ([1efbe62](https://github.com/ppprevost/priva.tools/commit/1efbe62))
* add Edit PDF tool: text box, highlight, form filling, edit text (100% client-side, Rust WASM) ([8ccb182](https://github.com/ppprevost/priva.tools/commit/8ccb182))
* add pdfjs 5.x text layer support for text selection and highlight ([29dc641](https://github.com/ppprevost/priva.tools/commit/29dc641))
* add Rust WASM crate for client-side PDF editing (lopdf) ([5decfd4](https://github.com/ppprevost/priva.tools/commit/5decfd4))
* add Sign PDF tool: handwriting, typed and image signatures (100% client-side) ([944b204](https://github.com/ppprevost/priva.tools/commit/944b204))
* add Protect PDF and Unlock PDF tools (qpdf WASM, client-side) ([2ccbf0b](https://github.com/ppprevost/priva.tools/commit/2ccbf0b))
* add Cloudflare Turnstile captcha to contact form ([bf08301](https://github.com/ppprevost/priva.tools/commit/bf08301))
* add admin route for comment moderation with rate limiting ([ea4bde4](https://github.com/ppprevost/priva.tools/commit/ea4bde4))
* add support page and rename PrivaTools to Priva.TOOLS ([a0e5341](https://github.com/ppprevost/priva.tools/commit/a0e5341))
* add blog API endpoints for mobile app ([0c167c0](https://github.com/ppprevost/priva.tools/commit/0c167c0))
* add mobile API key auth for KMP app ([aec6903](https://github.com/ppprevost/priva.tools/commit/aec6903))
* migrate blog from markdown files to Neon PostgreSQL ([41da6cc](https://github.com/ppprevost/priva.tools/commit/41da6cc))
* add SEO content strategy: blog, FAQ schema, trust pages ([bc70053](https://github.com/ppprevost/priva.tools/commit/bc70053))
* PNG compression via upng-js quantization + success message on all tools ([4e3a8ad](https://github.com/ppprevost/priva.tools/commit/4e3a8ad))
* live compression preview with quality slider ([6630903](https://github.com/ppprevost/priva.tools/commit/6630903))
* add before/after slider on image compression result ([4f0d22f](https://github.com/ppprevost/priva.tools/commit/4f0d22f))
* preload background-removal model on hover + cache ONNX via Service Worker ([4e0b4e2](https://github.com/ppprevost/priva.tools/commit/4e0b4e2))
* add confetti on success + interactive crop ([e31785f](https://github.com/ppprevost/priva.tools/commit/e31785f))
* add native share button with social fallback on desktop ([4d45f74](https://github.com/ppprevost/priva.tools/commit/4d45f74))
* add AI-generated neobrutalist illustrations via Replicate ([ee94c02](https://github.com/ppprevost/priva.tools/commit/ee94c02))
* add structured data, breadcrumbs, video embed and accessibility (SEO) ([ea94358](https://github.com/ppprevost/priva.tools/commit/ea94358))
* add OG image, character favicon and default social sharing image ([09fc8b7](https://github.com/ppprevost/priva.tools/commit/09fc8b7))
* clean architecture refactoring + Vitest test suite (110 tests) ([3d9431f](https://github.com/ppprevost/priva.tools/commit/3d9431f))
* initial commit: Priva.TOOLS MVP — 9 tools, Astro + React islands ([0e8ca89](https://github.com/ppprevost/priva.tools/commit/0e8ca89))

### Bug Fixes

* remove Rust wasm-build stage from Dockerfile (WASM now via npm) ([dd0e58f](https://github.com/ppprevost/priva.tools/commit/dd0e58f))
* override svgo to 4.0.1 to patch CVE-2026-29074 (HIGH) ([63be27f](https://github.com/ppprevost/priva.tools/commit/63be27f))
* guard against malformed data URL and reset font promise on failure ([4585541](https://github.com/ppprevost/priva.tools/commit/4585541))
* replace atob/btoa with fetch / Buffer.from (sonarjs/deprecation) ([76828dd](https://github.com/ppprevost/priva.tools/commit/76828dd))
* resolve font promise on failure, add .catch on renderPage ([ffca6c5](https://github.com/ppprevost/priva.tools/commit/ffca6c5))
* replace react-easy-crop with react-image-crop for resizable crop area ([45f5170](https://github.com/ppprevost/priva.tools/commit/45f5170))
* migrate all URLs from privatools.com to priva.tools ([5404e9d](https://github.com/ppprevost/priva.tools/commit/5404e9d))
* add priva.tools to allowed origins for API requests ([660f45f](https://github.com/ppprevost/priva.tools/commit/660f45f))

### Performance Improvements

* `client:idle` on tools, dynamic confetti import, preconnect CDN ([9ab8783](https://github.com/ppprevost/priva.tools/commit/9ab8783))
