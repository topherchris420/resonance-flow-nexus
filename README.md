# Project Sentinel

Project Sentinel is a Vite/React prototype for audio-guided cognitive readiness sessions. It combines local microphone spectrum analysis, generated binaural tones, canvas-based resonance visuals, guided meditation playback, and an SRV practice page.

The current app is experimental. It should be treated as a training and visualization prototype, not as a medical, diagnostic, biometric, or safety-critical tool.

## What Works Today

- Local microphone analysis through the Web Audio API.
- Optional Web Bluetooth heart-rate sensor input for compatible devices.
- Adaptive binaural tone generation for active sessions.
- Canvas visualizations driven by detected frequency peaks and session state.
- Focus state controls for `Focus 12`, `Focus 15`, `Focus 21`, `CRL-T`, `CRL-M`, and `CRL-P`.
- After-action review charting for session log entries.
- SRV practice page with guided audio playback, coordinate generation, ideogram drawing, and vocabulary.
- Progressive Web App build output through `vite-plugin-pwa`.

## Privacy Notes

- Microphone processing happens in the browser.
- The app does not upload microphone samples.
- Stress inoculation mode uses external Google-hosted audio URLs, so enabling that feature can make network requests outside the app.
- Session logs live only in React state unless exported by the user.

## Development

Install dependencies:

```bash
npm ci
```

Run the app:

```bash
npm run dev
```

Run verification:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

## Project Structure

- `src/pages/Index.tsx` - main session shell and top-level state.
- `src/components/DRREngine.tsx` - local analyser loop and derived session metrics.
- `src/components/AudioEngine.tsx` - binaural tone synthesis.
- `src/components/CymaticCanvas.tsx` - visual rendering.
- `src/pages/SRV.tsx` - SRV practice workflow.
- `src/utils/audioProcessing.ts` - pure audio metric helpers with unit coverage.
- `tests/` - Node test-runner tests.
