# Preserved concepts

## Demo 5 — FROZEN / PRESERVED

- The permanent Demo 5 route is `/followthrough`. Do not rename, redirect away from, replace, or reuse it.
- Demo 5 may only be changed when the user explicitly asks to **update Demo 5**. General homepage, LeadsTou, redesign, cleanup, dependency, and new-demo work does not authorize changes to it.
- Preserve `public/followthrough/**`, `preservation/demo-5.sha256.json`, and `scripts/verify-demo5.mjs`.
- Preserve the Demo 5 routing rules in `vercel.json`, the isolated document handler in `vite.config.js`, and the `prebuild`/`verify:demo5` package scripts.
- Never couple Demo 5 to shared React components, styles, dependencies, or assets. Its Three.js, fonts, styles and animation code are local and self-contained.
- New demos need separate routes and asset directories. Do not import or edit Demo 5 assets for them.
- Run `npm run verify:demo5` and `npm run build` after changes. Do not regenerate the checksum baseline or disable the guard to make a failing build pass.
- An explicitly authorized Demo 5 update must be reviewed, then update its checksum baseline and preservation record together.
- Keep Demo 5 marked **FROZEN / PRESERVED** in `CONCEPTS.md`.
