# Priva.TOOLS - Project Instructions

## Design System

Style : **Neobrutalism**

- Fond : off-white `#FAFAFF`, cards blanches `#FFFFFF`
- Bordures epaisses noires `border-slate-900` (2px ou 3px)
- Ombres decalees solides : `shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]`
- Coins arrondis genereux : `rounded-2xl`, `rounded-xl`, `rounded-full`
- Typo : `font-black`, `tracking-tight`, uppercase pour les labels

### Palette pastel (couleurs de surface)

- PDF : `rose-50` / `rose-500`
- Image : `cyan-50` / `cyan-500`
- Privacy/trust : `emerald-50` / `emerald-500`
- Performance : `amber-50` / `amber-500`
- Primary/brand : `indigo-50` / `indigo-500` (`#6366F1`)

### Composants cles

- Cards : fond pastel + `border-[3px] border-slate-900` + shadow brutalist
- Boutons : `border-2 border-slate-900` + shadow brutalist + `hover:-translate-y-1`
- Header : `bg-white/80 backdrop-blur-md border-b-[3px] border-slate-900`
- Blobs decoratifs : SVG flous (`blur-3xl opacity-40`) en arriere-plan, indigo + pink
- Icones : Lucide React, `strokeWidth={2.5}`

## Code Style

- Functional only: `type` aliases (no `interface`), factory functions (no `class`)
- No DI containers, no abstract classes

## Pre-push Review

A Claude Code hook blocks `git push` until a code review is done.
Workflow: hook denies push -> launch `code-standards-guardian` agent -> review passes -> `touch /tmp/.claude-review-passed-{branch}` -> retry push.
