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

## Demo And Simulated Signals

Some displayed signals are intentionally synthetic while the prototype evolves:

- Signal coherence is derived from local phase, breath, harmonic, and node-stability channels.
- Heart-rate display uses a connected Bluetooth Heart Rate sensor when available, otherwise it falls back to a local microphone-derived estimate.
- Cognitive performance and stress regulation scores are deterministic session composites.
- "Quantum", "biorhythm", and similar labels are visualization metaphors based on local app metrics, not scientific measurements.

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

## Current Improvement Priorities

1. Split the large visualization and sidebar components into smaller units.
2. Add component-level tests around session controls and microphone state.
3. Add real PWA icon assets at standard sizes.
4. Add a bundle-size budget in CI.
