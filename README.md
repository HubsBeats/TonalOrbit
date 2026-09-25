# Visual Music Theory

An interactive mobile app for exploring music theory by seeing it, hearing it, and playing with it.

Visual Music Theory helps musicians and learners explore:

- Musical scales and modes
- Chords and chord tones
- The Circle of Fifths
- Relative and parallel keys
- Chord progressions with adjustable playback timing
- Synthesized audio for notes, chords, scales, and arpeggios
- Light and dark themes

Audio is generated locally in the app, so the core learning experience works without external audio files.

## Built with

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- `expo-audio`
- `AsyncStorage`

## Getting started

### Prerequisites

- Node.js
- pnpm
- Expo Go, an Android emulator, or an iOS simulator

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Start the app

```bash
pnpm --filter @workspace/music-theory run dev
```

Then open the app in Expo Go or an available simulator.

## Project structure

```text
artifacts/music-theory/
├── app/                 # Expo Router screens and tab navigation
├── components/          # Reusable music theory UI components
├── constants/           # Theme and color definitions
├── context/             # Music and theme state
├── hooks/               # Audio and interaction hooks
└── lib/                 # Music theory calculations and audio utilities
```

## Audio playback

The app synthesizes note and chord audio locally using generated waveform data. Interactive elements can play:

- Individual notes
- Chords
- Chord tones
- Scales
- Arpeggios
- Chord progressions

## Contributing

Contributions are welcome. Open an issue to discuss a significant change before submitting a pull request.

When contributing:

1. Create a focused branch.
2. Keep changes scoped to the feature or fix.
3. Run the relevant type checks before opening a pull request.
4. Include a clear description of the user-facing change.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.