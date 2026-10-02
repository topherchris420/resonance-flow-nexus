# Project Sentinel

**Less noise. More resonance.** A private, account-free sound and breathing studio built with React, TypeScript, Vite, and the Web Audio API.

## The experience

- **An intentional starting point:** Ground, Focus, Unwind, Rest, Clarity, and Explore preserve the original tone combinations with clear, descriptive names.
- **A complete practice:** choose 5–20 minutes, begin, pause, resume, or finish early. Sessions end automatically at the chosen duration.
- **Sound you can shape:** separate left/right tones, smoothly adjustable carrier and beat frequencies, pink or brown noise, volume, and mute.
- **Breathing at your pace:** even breathing, box breathing, or a longer exhale, with orbit and bloom visuals. Reduced-motion preferences are respected.
- **Useful reflection:** actual practiced time and chosen settings, JSON exports, and up to 20 local session summaries.
- **An imagination lab:** the original meditation recording, random coordinate prompts, a resizable pointer-based sketch pad with undo/PNG export, a temporary written reflection, and descriptive vocabulary.

The studio generates sound and geometry. It does **not** measure coherence, heart rate, stress, cognitive readiness, or any other biometric or mental state. Preset names describe creative intentions, not promised physiological effects. The imagination lab is a creative exercise, not verified remote perception.

## Privacy and behavior

The active studio and imagination lab request no microphone, Bluetooth, or account access. No session data is uploaded. Completed/ended summaries are saved under `sentinel.sessions.v1` in browser local storage; malformed data is ignored and blocked storage does not prevent a session. History can be exported or cleared with confirmation.

Active sessions pause when the tab is hidden. They also stop when leaving the studio. A refresh does not restore an unfinished session. Sketches and reflection text are temporary; export the drawing or copy the text before leaving. The bundled meditation recording is fetched only when requested. Fonts load from Google Fonts.

Use stereo headphones at a comfortable volume. The app is an experimental creative practice tool, not a medical or diagnostic product.

## Development

Node.js 24 is used in CI.

```bash
npm ci
npm run dev
```

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

`typecheck` checks both app and build-tool configurations. The GitHub workflow runs lint, type checks, tests, and the production build on pushes to main and pull requests.

## Structure

- `src/pages/Landing.tsx`: introduction and practice entry points.
- `src/pages/Session.tsx`: timed studio and local history.
- `src/lib/studio/audio.ts`: stereo synthesis, noise switching, and graph lifecycle.
- `src/lib/studio/practice.ts`: presets, breathing phases, duration formatting, and history validation.
- `src/components/studio/`: shared navigation and generative visuals.
- `src/pages/SRV.tsx`: imagination lab, preserving the original route.
- `src/studio.css`: shared responsive design and reduced-motion behavior.
- `tests/`: pure-function and audio-lifecycle regressions.

The earlier experimental engine and `Index.tsx` remain in the source tree for reference; they are not part of the routed studio.

## Verification checklist

Beyond the automated checks, verify the following in a browser:

1. Follow a landing-page intention into the studio; confirm matching settings.
2. Start with a real click (browser audio requires a user gesture), pause/resume quickly, mute, and change the background noise.
3. Hide the tab and return: playback must be paused. Navigate away: audio must stop.
4. Finish early and complete a full timer. Review and export the actual record.
5. Refresh, open history, export a past entry, and test both canceling and confirming deletion.
6. Use a narrow viewport and keyboard navigation. Dialogs close with Escape and return focus; zoom remains enabled.
7. In the lab, draw/undo/export, resize without losing strokes, and export a coordinate prompt.

The app uses a generated service worker to cache the application shell. The meditation recording is not precached. Serve the production build over HTTPS. The included `vercel.json` configures SPA fallbacks for direct links to `/session` and `/srv`, following [Vercel Vite guidance](https://vercel.com/docs/frameworks/frontend/vite). Other hosts need an equivalent fallback.


