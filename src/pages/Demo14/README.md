# Demo14 — The Haunted Website

Local route: `/demo14`. No changes to shared routing, other demos, or project dependencies. All user-facing copy is English.

## Final packages

| Package | Scope | Halloween price (USD) | Internal standard reference |
| --- | --- | --- | --- |
| Website Redesign | Up to 3 existing pages | $399 | $799 |
| Business Website | Up to 5 new standard pages | $899 | $1,699 |
| New Landing Page | 1 page, up to 5–7 standard sections | $349 | $599 |

`content.js` is the source of truth for descriptions, scope, inclusions, terms and enquiry messages. All packages include design and development. Existing platform compatibility must be reviewed. Payment is 50% after agreeing scope/schedule/terms, 50% after approval and before handover or launch. Booking deadline: November 2, 2026.

## Disclosure and pricing

- Hall: Nightmare, package, scope, `SAVE ??%`; no prices or specific discounts.
- Before: BREAK THE CURSE with SEE THE OFFER helper, original imagery and transformation trigger.
- After: THE CURSE IS BROKEN, package and scope; never the activity price. CLAIM MY HALLOWEEN OFFER selects and scrolls to the corresponding card; EXPLORE OTHER OFFERS returns to CHOOSE.
- Final Reveal: current activity prices, inclusions, one enquiry CTA per card, unified expandable terms and contact form.
- `pricing.js` has three independent public comparison flags, all **false** by default. Do not enable standard-price/BEFORE DISCOUNT/discount claims until the actual comparison basis is verified.
- Development-only `/demo14?pricing-preview=1` enables a visibly marked INTERNAL PRICING PREVIEW. The query cannot enable comparisons in a production build. Standard references are never included as payable prices in enquiry messages.
- Inline original-price strikes are 1px within the text width; large cards retain 2px diagonal red strikes. These render only when comparison visibility is enabled.

## Navigation and state

MENU links to entrance, hall, each of the three Before scenes, and Halloween Offers. It closes on selection, outside pointer, Escape or focus leaving the menu. Keyboard users can Tab through native buttons. Main site and sound controls remain available.

Journey is derived from scene: hall → CHOOSE (01), before/transformation → ENTER (02), after → TRANSFORM (03), offers → REVEAL (04). Hero/opening are prologue. Menu navigation does not record a room as transformed. Selected package starts as `null`; direct offer navigation does not promise an arbitrary package. Contact actions remain unavailable until selection. Returning to the hall clears its active preview, preserving other room media.

Scene transitions use a synchronous lock, pause video, reset scroll and manage audio. Current film unmounts on leaving the scene. Reduced Motion skips films after user action and suppresses decorative motion. Normal playback retains video completion and skip/error recovery.

## Source organization

- `Demo14.jsx`: state, transitions, focus, scroll targets and audio coordination.
- `HauntHeader.jsx`: MENU, main-site link, sound hint and Journey.
- `HeroScene.jsx`, `HallScene.jsx`, `RoomScene.jsx`, `OffersScene.jsx`: existing scene markup, without extra layout wrappers.
- `Artwork.jsx`: shared SVGs and gated inline pricing. `Film.jsx`: video playback/recovery.
- `Demo14.css`: ordered imports from `styles/`; keep import order to preserve the cascade. 198 redundant declarations were removed without reordering remaining rules.
- `SceneImage.jsx`, `images.js`, `image-manifest.json`: responsive image selection and fallback.

## Media and performance

Original supplied PNGs, MP4s, MP3s and fonts remain untouched. Scene images have WebP derivatives in `public/demo14/optimized/`. Eight original PNGs total 8,953,358 bytes; full-size WebPs total 2,343,686 bytes, compact variants 1,017,732 bytes. The original PNGs remain recovery paths, so total on-disk asset size increases while browser image transfers shrink.

Generate derivatives after replacing a source image:

```sh
SHARP_MODULE=/absolute/path/to/installed/sharp node src/pages/Demo14/tools/optimize-images.mjs
```

Sharp is a development tool, not an app dependency. Manifest hashes detect stale derivatives. Compact variants are capped at 960px wide, quality 86. Images retain aspect ratio/cropping; card previews are lazy loaded. Entrance does not prefetch the hall/opening film; later scenes warm only the next relevant image and respect Save-Data/slow connections. Videos remain original to preserve visual quality, timing and embedded audio.

Hero film plays once, muted; hero ambience starts only after opt-in. `audio.js` owns one Web Audio mixer, loops ambience with fades, and prepares cues by scene after sound is enabled. `hall-ambience.MP3` retains its case-sensitive filename. Opening video uses its own audio, never a duplicate door-creak track. SOUND OFF stops MP3s and mutes video; visibility/unmount cleanup remains in place.

## Verification

```sh
node --test src/pages/Demo14/*.test.js
node src/pages/Demo14/tools/test-render.mjs
node_modules/.bin/oxlint src/pages/Demo14
npm run verify:demo5
npm run build
```

Content tests cover names/scopes/prices, Journey, disclosure flags, null selection, enquiries and source/derivative integrity. Render tests check Hero/Hall/Before/After/Offers disclosure, CTAs and preview labeling. These are **not** a substitute for an actual browser check.

Final browser checks still required: six menu destinations, Escape/outside/keyboard close, actual video completion and sound, card-target scrolling, 320/390px layouts and cropping, four-stage Journey, enquiry copy/contact links, image fallback, preview and reduced-motion behavior. The attempted desktop/mobile browser run timed out loading the page; further browser launch approval was blocked by an automatic-review usage-limit failure. No browser acceptance pass is claimed.

No commit, push, or deployment is authorized by this task.
