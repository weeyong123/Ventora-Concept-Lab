# Demo14 — The Haunted Website

Route: `/demo14`. Existing lazy route reused without modifying the homepage or another demo. No added runtime dependencies. All user-facing copy is English.

## Source map

| Scene | Supplied media under `public/demo14/` |
| --- | --- |
| Entrance | `mansion-hero-loop.mp4` (plays once, then holds) |
| Opening | `mansion-door-opening.mp4` |
| Hall | `three-doors-hall.png` |
| Outdated Website | `door1-before.png`, `outdated-website-transformation.mp4`, `door1-after.png` |
| Missing Presence | `door2-before.png`, `missing-presence-transformation.mp4`, `door2-after.png` |
| Lost Leads | `door3-before.png`, `lost-leads-transformation.mp4`, `door3-after.png` |
| Reveal | `final-reveal-bg.png` — actual supplied spelling, explicitly mapped in `content.js` |
| Brand | `ventora-logo-white.png` |

`mansion-poster.jpg` is a JPEG extraction of the supplied loop's first frame, not a generated or replacement image. Original files remain untouched. Black logo is unused.

## Interaction and loading

Scenes: `hero`, `opening`, `hall`, `before`, `transformation`, `after`, `offers`. A synchronous transition lock prevents repeated clicks. The current video is unmounted/paused when leaving its scene; offscreen metadata preloads never play. Next-scene stills are warmed separately. Hall hotspots use percentages of the uncropped image, so their geometry follows the image at every size. Mobile also has three explicitly named choices.

Reduced Motion keeps a static mansion poster and skips opening/transformation films after the corresponding action. All cinematic playback has a visible continue/skip button. Autoplay rejection exposes a retry button; errors expose recovery text. Background tab video playback pauses. Video audio defaults off and follows the global switch.

Audio is controlled by `audio.js`, a single Web Audio mixer unlocked by SOUND ON. Initial state is silent. Hall ambience uses the actual supplied `audio/hall-ambience.MP3` spelling, loops at 18% gain, fades in over 700ms and fades out with the 320ms scene transition. `door-creak.mp3` plays at 42% gain only for a hall door selection. `cursed-click.mp3` plays at 30% during the transition and stops before embedded transformation video audio begins. `reveal-impact.mp3` plays once per entrance into the final reveal at 38%; package changes never replay it. Active videos use 65% volume where the browser supports media volume control.

The current opening video contains its own audio track; no separate door creak is added to it. Hero video plays once while muted and holds its final frame. `mansion-ambience.mp3` loops independently before the door opens, at 22% gain with a 700ms fade-in and 320ms fade-out.

GainNodes provide MP3 fades on mobile as well as desktop. SOUND OFF immediately silences/stops all MP3 sources and mutes active videos. Hidden pages stop MP3 sources; returning resumes only the current Hero or hall ambience when applicable. Scene transitions invalidate pending cue loads, prevent duplicate sources and clean up completed nodes; unmount aborts pending loads and closes the audio context. Failed fetch/decode/playback never blocks navigation.

The message generator is entirely local. Clipboard success is shown only after a resolved clipboard write. Failure selects the read-only message for manual copying. Facebook opens via a normal new-tab link while copying is attempted; WhatsApp and email encode the current message. No messages are sent automatically, and no backend or secret configuration is required.

## Verification

- `node --test src/pages/Demo14/content.test.js`
- `node_modules/.bin/oxlint src/pages/Demo14`
- `npm run verify:demo5`
- `npm run build`
- `NODE_PATH=<Playwright package directory> node verification/demo14/flow.test.cjs`
- `NODE_PATH=<Playwright package directory> node verification/demo14/recovery.test.cjs`

Browser tests use installed Chrome. Start Vite on `127.0.0.1:5174`, or set `DEMO14_URL` for the main flow test. Evidence lives in `verification/demo14/`. No commit, push or deployment was performed.

Audio acceptance: `NODE_PATH=<Playwright package directory> node verification/demo14/audio.test.cjs`.

## Halloween visual polish

Main headings use locally bundled Cormorant Garamond Medium Italic; Cinzel remains on smaller ceremonial labels and card titles. Green is limited to nightmare/curse emphasis and interaction feedback; offer prices remain orange. The header's edition sentence is removed. Shared secondary buttons use softened angled corners and warm edge highlights.

`HauntedPointer.jsx` adds a decorative will-o'-the-wisp for fine pointers with hover, while preserving the native cursor. It is pointer-transparent, hidden over form inputs and during films, disabled on touch/reduced-motion devices, and cleans up listeners and queued animation frames on unmount. Pointer position updates are coalesced into one animation frame per event batch; there is no continuous render loop.
