# Active Prompt & Task Tracking (PROMPT.md)

## Active User Prompt
> "use AGENTS.md
> tasks:
> read the app goals and make it work.
> differ between the android app and the demo app (landing-page) with fixed artifacts which is helpful for testing and presenting the app flow using a default video.
> --
> the design needs re-thinking and the app main goal which is to sync between video play and tts-play is not working well.
> later ensure correct subtitles is choosen along the video play and ensure correct text highlight per word boundry when tts-play is active."

## Actionable Worklist

- [ ] **Architecture & Platform Separation**:
  - [ ] Distinctly separate Android Native Shell vs Web Companion Demo (Landing Page).
  - [ ] Add a dedicated "Web Demo & Fixed Artifacts" showcase toolbar on the web platform with the default video (`FcRzAdI8R9U`), authentic 1,578-cue multi-lingual tracks (Russian, Hebrew, Italian, Arabic, English), and 1-click language switchers.
  - [ ] Disable intrusive APK update/installer banners on the web demo, cleanly branding it as the Interactive Web Companion.

- [ ] **Design Re-thinking & Modern UI**:
  - [ ] Elevate aesthetics to a premium, dark-mode glassmorphic design system with vibrant accents, refined typography, and smooth micro-animations.
  - [ ] Ensure the default web landing page presents both the Video Player and the Subtitles Teacher Panel in a coordinated, dual-view workstation.
  - [ ] Add a prominent, sleek **Speech Flow Sync Bar** right at the player with mode toggles, live status badges, and sentence looping.

- [ ] **Video Play & TTS-Play Synchronization**:
  - [ ] Resolve the conflicting dual TTS loops: eliminate the naive cue-start pause in `VideoPlayer.tsx` and unify playback coordination through `useSyncEngine`.
  - [ ] Enforce the authentic sentence-by-sentence learning loop: Video plays cue dialogue first (`cue.start` to `cue.start + cue.duration`) -> Video automatically pauses -> TTS speaks translation -> Video automatically resumes for next cue.
  - [ ] Guarantee strict mutual exclusion between YouTube playback and TTS narration with zero audio overlap.

- [ ] **Accurate Subtitle Selection & Word-Boundary Highlighting**:
  - [ ] Ensure correct subtitle cue selection along video playback and seeking, eliminating stuck cues during gaps.
  - [ ] Guarantee real-time word-boundary visual highlighting (`data-testid="active-tts-word-highlight"`) with high-contrast amber glow in `HighlightableText.tsx` during TTS playback, supported by simulated boundary cadence fallback for browsers lacking native speech boundary events.
