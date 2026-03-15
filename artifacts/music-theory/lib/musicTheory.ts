export type NoteName =
  | "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "F"
  | "F#" | "Gb" | "G" | "G#" | "Ab" | "A" | "A#" | "Bb" | "B";

export type ScaleName =
  | "Major"
  | "Natural Minor"
  | "Harmonic Minor"
  | "Melodic Minor"
  | "Dorian"
  | "Phrygian"
  | "Lydian"
  | "Mixolydian"
  | "Locrian"
  | "Pentatonic Major"
  | "Pentatonic Minor"
  | "Blues"
  | "Whole Tone"
  | "Diminished (HW)"
  | "Diminished (WH)"
  | "Chromatic"
  | "Hungarian Minor"
  | "Double Harmonic"
  | "Phrygian Dominant"
  | "Lydian Dominant"
  | "Super Locrian"
  | "Bebop Dominant"
  | "Bebop Major";

export type ChordQuality = "maj" | "min" | "dim" | "aug" | "maj7" | "min7" | "7" | "min7b5" | "dim7";

export interface Chord {
  degree: number;
  romanNumeral: string;
  quality: ChordQuality;
  name: string;
  notes: string[];
  fullName: string;
}

export interface ScaleInfo {
  name: ScaleName;
  intervals: number[];
  pattern: string[];
  description: string;
  moods: string[];
  relativeScale?: string;
}

export interface ScaleData {
  key: string;
  scale: ScaleName;
  notes: string[];
  chords: Chord[];
  progressions: { name: string; degrees: number[]; numerals: string[] }[];
  relativeMinor?: string;
  relativeMajor?: string;
  parallelMinor?: string;
  parallelMajor?: string;
  scaleInfo: ScaleInfo;
}

export const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const ENHARMONIC_MAP: Record<string, string> = {
  "C#": "Db", "Db": "C#",
  "D#": "Eb", "Eb": "D#",
  "F#": "Gb", "Gb": "F#",
  "G#": "Ab", "Ab": "G#",
  "A#": "Bb", "Bb": "A#",
};

export const FLAT_KEYS = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
export const SHARP_KEYS = ["G", "D", "A", "E", "B", "F#", "C#"];

export const ALL_KEYS: string[] = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F",
  "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
];

export const DISPLAY_KEYS: string[] = [
  "C", "G", "D", "A", "E", "B", "F#",
  "F", "Bb", "Eb", "Ab", "Db", "Gb",
  "Cb", "C#"
];

export const SCALE_DEFINITIONS: Record<ScaleName, ScaleInfo> = {
  "Major": {
    name: "Major",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    pattern: ["W", "W", "H", "W", "W", "W", "H"],
    description: "The most common scale in Western music. Bright, happy, and stable.",
    moods: ["Happy", "Bright", "Resolved", "Stable"],
    relativeScale: "Natural Minor",
  },
  "Natural Minor": {
    name: "Natural Minor",
    intervals: [2, 1, 2, 2, 1, 2, 2],
    pattern: ["W", "H", "W", "W", "H", "W", "W"],
    description: "The natural form of the minor scale. Dark, melancholic, and expressive.",
    moods: ["Sad", "Dark", "Melancholic", "Expressive"],
    relativeScale: "Major",
  },
  "Harmonic Minor": {
    name: "Harmonic Minor",
    intervals: [2, 1, 2, 2, 1, 3, 1],
    pattern: ["W", "H", "W", "W", "H", "A2", "H"],
    description: "Minor scale with a raised 7th. Creates tension and exotic sound.",
    moods: ["Dramatic", "Exotic", "Tense", "Mysterious"],
  },
  "Melodic Minor": {
    name: "Melodic Minor",
    intervals: [2, 1, 2, 2, 2, 2, 1],
    pattern: ["W", "H", "W", "W", "W", "W", "H"],
    description: "Ascending form of melodic minor. Jazz and classical use.",
    moods: ["Sophisticated", "Jazz", "Smooth", "Complex"],
  },
  "Dorian": {
    name: "Dorian",
    intervals: [2, 1, 2, 2, 2, 1, 2],
    pattern: ["W", "H", "W", "W", "W", "H", "W"],
    description: "Minor mode with a raised 6th. Common in jazz and folk music.",
    moods: ["Funky", "Jazz", "Folk", "Cool"],
  },
  "Phrygian": {
    name: "Phrygian",
    intervals: [1, 2, 2, 2, 1, 2, 2],
    pattern: ["H", "W", "W", "W", "H", "W", "W"],
    description: "Minor mode with a lowered 2nd. Spanish and flamenco feel.",
    moods: ["Spanish", "Flamenco", "Dark", "Intense"],
  },
  "Lydian": {
    name: "Lydian",
    intervals: [2, 2, 2, 1, 2, 2, 1],
    pattern: ["W", "W", "W", "H", "W", "W", "H"],
    description: "Major mode with a raised 4th. Dreamy, ethereal sound.",
    moods: ["Dreamy", "Ethereal", "Bright", "Floating"],
  },
  "Mixolydian": {
    name: "Mixolydian",
    intervals: [2, 2, 1, 2, 2, 1, 2],
    pattern: ["W", "W", "H", "W", "W", "H", "W"],
    description: "Major mode with a lowered 7th. Bluesy, rock feel.",
    moods: ["Bluesy", "Rock", "Dominant", "Strong"],
  },
  "Locrian": {
    name: "Locrian",
    intervals: [1, 2, 2, 1, 2, 2, 2],
    pattern: ["H", "W", "W", "H", "W", "W", "W"],
    description: "The most dissonant mode. Rarely used as a tonal center.",
    moods: ["Unstable", "Tense", "Dark", "Dissonant"],
  },
  "Pentatonic Major": {
    name: "Pentatonic Major",
    intervals: [2, 2, 3, 2, 3],
    pattern: ["W", "W", "WH", "W", "WH"],
    description: "5-note major scale. Universal and consonant.",
    moods: ["Simple", "Universal", "Positive", "Folk"],
  },
  "Pentatonic Minor": {
    name: "Pentatonic Minor",
    intervals: [3, 2, 2, 3, 2],
    pattern: ["WH", "W", "W", "WH", "W"],
    description: "5-note minor scale. Foundation of blues and rock.",
    moods: ["Blues", "Rock", "Soulful", "Gritty"],
  },
  "Blues": {
    name: "Blues",
    intervals: [3, 2, 1, 1, 3, 2],
    pattern: ["WH", "W", "H", "H", "WH", "W"],
    description: "Pentatonic minor with added blue note (b5). The sound of the blues.",
    moods: ["Soulful", "Expressive", "Raw", "Emotional"],
  },
  "Whole Tone": {
    name: "Whole Tone",
    intervals: [2, 2, 2, 2, 2, 2],
    pattern: ["W", "W", "W", "W", "W", "W"],
    description: "All whole steps. Floating, ambiguous, impressionistic.",
    moods: ["Dreamy", "Ambiguous", "Impressionistic", "Floating"],
  },
  "Diminished (HW)": {
    name: "Diminished (HW)",
    intervals: [1, 2, 1, 2, 1, 2, 1, 2],
    pattern: ["H", "W", "H", "W", "H", "W", "H", "W"],
    description: "8-note scale alternating half and whole steps. Tense and dissonant.",
    moods: ["Tense", "Dramatic", "Chromatic", "Complex"],
  },
  "Diminished (WH)": {
    name: "Diminished (WH)",
    intervals: [2, 1, 2, 1, 2, 1, 2, 1],
    pattern: ["W", "H", "W", "H", "W", "H", "W", "H"],
    description: "8-note scale alternating whole and half steps. Used over dominant chords.",
    moods: ["Dominant", "Jazzy", "Complex", "Tense"],
  },
  "Chromatic": {
    name: "Chromatic",
    intervals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    pattern: ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
    description: "All 12 semitones. Used for passing tones and chromatic runs.",
    moods: ["Chromatic", "Complex", "Passing", "Atonal"],
  },
  "Hungarian Minor": {
    name: "Hungarian Minor",
    intervals: [2, 1, 3, 1, 1, 3, 1],
    pattern: ["W", "H", "A2", "H", "H", "A2", "H"],
    description: "Exotic scale with two augmented seconds. Eastern European sound.",
    moods: ["Exotic", "Eastern", "Dramatic", "Mysterious"],
  },
  "Double Harmonic": {
    name: "Double Harmonic",
    intervals: [1, 3, 1, 2, 1, 3, 1],
    pattern: ["H", "A2", "H", "W", "H", "A2", "H"],
    description: "Arabic scale with two augmented seconds. Also called Byzantine scale.",
    moods: ["Middle Eastern", "Arabic", "Exotic", "Intense"],
  },
  "Phrygian Dominant": {
    name: "Phrygian Dominant",
    intervals: [1, 3, 1, 2, 1, 2, 2],
    pattern: ["H", "A2", "H", "W", "H", "W", "W"],
    description: "5th mode of harmonic minor. Spanish, Middle Eastern sound.",
    moods: ["Spanish", "Middle Eastern", "Flamenco", "Dramatic"],
  },
  "Lydian Dominant": {
    name: "Lydian Dominant",
    intervals: [2, 2, 2, 1, 2, 1, 2],
    pattern: ["W", "W", "W", "H", "W", "H", "W"],
    description: "Mixolydian with raised 4th. Jazz and fusion sound.",
    moods: ["Jazz", "Fusion", "Bright", "Complex"],
  },
  "Super Locrian": {
    name: "Super Locrian",
    intervals: [1, 2, 1, 2, 2, 2, 2],
    pattern: ["H", "W", "H", "W", "W", "W", "W"],
    description: "Altered scale. Used over dominant 7th chords in jazz.",
    moods: ["Jazz", "Altered", "Tense", "Complex"],
  },
  "Bebop Dominant": {
    name: "Bebop Dominant",
    intervals: [2, 2, 1, 2, 2, 1, 1, 1],
    pattern: ["W", "W", "H", "W", "W", "H", "H", "H"],
    description: "Mixolydian with added major 7th. Classic bebop sound.",
    moods: ["Bebop", "Jazz", "Swing", "Classic"],
  },
  "Bebop Major": {
    name: "Bebop Major",
    intervals: [2, 2, 1, 2, 1, 1, 2, 1],
    pattern: ["W", "W", "H", "W", "H", "H", "W", "H"],
    description: "Major scale with added #5. Bebop jazz sound.",
    moods: ["Bebop", "Jazz", "Smooth", "Classic"],
  },
};

export const SCALE_CATEGORIES: Record<string, ScaleName[]> = {
  "Diatonic": ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"],
  "Modes": ["Dorian", "Phrygian", "Lydian", "Mixolydian", "Locrian"],
  "Pentatonic & Blues": ["Pentatonic Major", "Pentatonic Minor", "Blues"],
  "Symmetric": ["Whole Tone", "Diminished (HW)", "Diminished (WH)", "Chromatic"],
  "Exotic": ["Hungarian Minor", "Double Harmonic", "Phrygian Dominant"],
  "Jazz": ["Lydian Dominant", "Super Locrian", "Bebop Dominant", "Bebop Major"],
};

function getNoteIndex(note: string): number {
  const normalized = note.replace("b", "#");
  const idx = CHROMATIC_NOTES.indexOf(note);
  if (idx !== -1) return idx;
  const enharmonic = ENHARMONIC_MAP[note];
  if (enharmonic) return CHROMATIC_NOTES.indexOf(enharmonic);
  return 0;
}

function getNote(rootIndex: number, semitones: number, preferFlats: boolean): string {
  const idx = (rootIndex + semitones) % 12;
  const note = CHROMATIC_NOTES[idx];
  if (preferFlats && ENHARMONIC_MAP[note]) {
    return ENHARMONIC_MAP[note];
  }
  return note;
}

function preferFlatsForKey(key: string): boolean {
  return FLAT_KEYS.includes(key) || ["Ab", "Eb", "Bb"].includes(key);
}

export function getScaleNotes(key: string, scaleName: ScaleName): string[] {
  const scaleInfo = SCALE_DEFINITIONS[scaleName];
  const rootIndex = getNoteIndex(key);
  const preferFlats = preferFlatsForKey(key);
  const notes: string[] = [key];
  let semitones = 0;
  for (let i = 0; i < scaleInfo.intervals.length - 1; i++) {
    semitones += scaleInfo.intervals[i];
    notes.push(getNote(rootIndex, semitones, preferFlats));
  }
  return notes;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const CHORD_QUALITIES_MAJOR: ChordQuality[] = ["maj", "min", "min", "maj", "7", "min", "dim"];
const CHORD_QUALITIES_NATURAL_MINOR: ChordQuality[] = ["min", "dim", "maj", "min", "min", "maj", "maj"];
const CHORD_QUALITIES_HARMONIC_MINOR: ChordQuality[] = ["min", "dim", "aug", "min", "7", "maj", "dim"];
const CHORD_QUALITIES_MELODIC_MINOR: ChordQuality[] = ["min", "min", "aug", "maj", "7", "min7b5", "min7b5"];
const CHORD_QUALITIES_DORIAN: ChordQuality[] = ["min", "min", "maj", "maj", "min", "dim", "maj"];
const CHORD_QUALITIES_PHRYGIAN: ChordQuality[] = ["min", "maj", "maj", "min", "dim", "maj", "min"];
const CHORD_QUALITIES_LYDIAN: ChordQuality[] = ["maj", "maj", "min", "dim", "maj", "min", "min"];
const CHORD_QUALITIES_MIXOLYDIAN: ChordQuality[] = ["maj", "min", "dim", "maj", "min", "min", "maj"];
const CHORD_QUALITIES_LOCRIAN: ChordQuality[] = ["dim", "maj", "min", "min", "maj", "maj", "min"];

function getQualitySymbol(q: ChordQuality): string {
  switch (q) {
    case "maj": return "";
    case "min": return "m";
    case "dim": return "°";
    case "aug": return "+";
    case "maj7": return "maj7";
    case "min7": return "m7";
    case "7": return "7";
    case "min7b5": return "ø7";
    case "dim7": return "°7";
  }
}

function getRomanNumeral(degree: number, quality: ChordQuality): string {
  const base = ROMAN_NUMERALS[degree - 1];
  const isMinor = ["min", "dim", "min7", "min7b5", "dim7"].includes(quality);
  const roman = isMinor ? base.toLowerCase() : base;
  switch (quality) {
    case "dim": return roman + "°";
    case "aug": return roman + "+";
    case "7": return roman + "7";
    case "maj7": return roman + "Δ";
    case "min7": return roman + "7";
    case "min7b5": return roman + "ø";
    case "dim7": return roman + "°7";
    default: return roman;
  }
}

function buildChordNotes(rootNote: string, quality: ChordQuality, allNotes: string[]): string[] {
  const rootIdx = getNoteIndex(rootNote);
  const preferFlats = FLAT_KEYS.includes(allNotes[0]) || ["Ab", "Eb", "Bb"].includes(allNotes[0]);
  switch (quality) {
    case "maj": return [rootNote, getNote(rootIdx, 4, preferFlats), getNote(rootIdx, 7, preferFlats)];
    case "min": return [rootNote, getNote(rootIdx, 3, preferFlats), getNote(rootIdx, 7, preferFlats)];
    case "dim": return [rootNote, getNote(rootIdx, 3, preferFlats), getNote(rootIdx, 6, preferFlats)];
    case "aug": return [rootNote, getNote(rootIdx, 4, preferFlats), getNote(rootIdx, 8, preferFlats)];
    case "maj7": return [rootNote, getNote(rootIdx, 4, preferFlats), getNote(rootIdx, 7, preferFlats), getNote(rootIdx, 11, preferFlats)];
    case "min7": return [rootNote, getNote(rootIdx, 3, preferFlats), getNote(rootIdx, 7, preferFlats), getNote(rootIdx, 10, preferFlats)];
    case "7": return [rootNote, getNote(rootIdx, 4, preferFlats), getNote(rootIdx, 7, preferFlats), getNote(rootIdx, 10, preferFlats)];
    case "min7b5": return [rootNote, getNote(rootIdx, 3, preferFlats), getNote(rootIdx, 6, preferFlats), getNote(rootIdx, 10, preferFlats)];
    case "dim7": return [rootNote, getNote(rootIdx, 3, preferFlats), getNote(rootIdx, 6, preferFlats), getNote(rootIdx, 9, preferFlats)];
    default: return [rootNote];
  }
}

function getScaleChordQualities(scaleName: ScaleName): ChordQuality[] {
  switch (scaleName) {
    case "Major": return CHORD_QUALITIES_MAJOR;
    case "Natural Minor": return CHORD_QUALITIES_NATURAL_MINOR;
    case "Harmonic Minor": return CHORD_QUALITIES_HARMONIC_MINOR;
    case "Melodic Minor": return CHORD_QUALITIES_MELODIC_MINOR;
    case "Dorian": return CHORD_QUALITIES_DORIAN;
    case "Phrygian": return CHORD_QUALITIES_PHRYGIAN;
    case "Lydian": return CHORD_QUALITIES_LYDIAN;
    case "Mixolydian": return CHORD_QUALITIES_MIXOLYDIAN;
    case "Locrian": return CHORD_QUALITIES_LOCRIAN;
    case "Pentatonic Major": return ["maj", "min", "min", "maj", "min"];
    case "Pentatonic Minor": return ["min", "maj", "min", "min", "maj"];
    case "Blues": return ["min", "maj", "dim", "min", "maj", "maj"];
    default: return [];
  }
}

export function buildChords(notes: string[], scaleName: ScaleName): Chord[] {
  const qualities = getScaleChordQualities(scaleName);
  return notes.slice(0, qualities.length).map((note, i) => {
    const q = qualities[i];
    const degree = i + 1;
    return {
      degree,
      romanNumeral: getRomanNumeral(degree, q),
      quality: q,
      name: note + getQualitySymbol(q),
      notes: buildChordNotes(note, q, notes),
      fullName: getFullChordName(note, q),
    };
  });
}

function getFullChordName(note: string, q: ChordQuality): string {
  switch (q) {
    case "maj": return note + " Major";
    case "min": return note + " Minor";
    case "dim": return note + " Diminished";
    case "aug": return note + " Augmented";
    case "maj7": return note + " Major 7th";
    case "min7": return note + " Minor 7th";
    case "7": return note + " Dominant 7th";
    case "min7b5": return note + " Half Diminished";
    case "dim7": return note + " Diminished 7th";
  }
}

export const CHORD_PROGRESSIONS: Record<ScaleName, { name: string; degrees: number[]; numerals: string[] }[]> = {
  "Major": [
    { name: "I–IV–V–I (Classic)", degrees: [1, 4, 5, 1], numerals: ["I", "IV", "V", "I"] },
    { name: "I–V–vi–IV (Pop)", degrees: [1, 5, 6, 4], numerals: ["I", "V", "vi", "IV"] },
    { name: "ii–V–I (Jazz)", degrees: [2, 5, 1], numerals: ["ii", "V", "I"] },
    { name: "I–vi–IV–V (50s)", degrees: [1, 6, 4, 5], numerals: ["I", "vi", "IV", "V"] },
    { name: "I–IV–vi–V", degrees: [1, 4, 6, 5], numerals: ["I", "IV", "vi", "V"] },
    { name: "iii–vi–ii–V", degrees: [3, 6, 2, 5], numerals: ["iii", "vi", "ii", "V"] },
  ],
  "Natural Minor": [
    { name: "i–VII–VI–VII (Rock)", degrees: [1, 7, 6, 7], numerals: ["i", "VII", "VI", "VII"] },
    { name: "i–iv–v (Minor)", degrees: [1, 4, 5], numerals: ["i", "iv", "v"] },
    { name: "i–VI–III–VII", degrees: [1, 6, 3, 7], numerals: ["i", "VI", "III", "VII"] },
    { name: "i–iv–VII–III", degrees: [1, 4, 7, 3], numerals: ["i", "iv", "VII", "III"] },
    { name: "i–v–VI–VII", degrees: [1, 5, 6, 7], numerals: ["i", "v", "VI", "VII"] },
  ],
  "Harmonic Minor": [
    { name: "i–iv–V–i (Harmonic)", degrees: [1, 4, 5, 1], numerals: ["i", "iv", "V", "i"] },
    { name: "i–VII–V–i", degrees: [1, 7, 5, 1], numerals: ["i", "VII", "V", "i"] },
    { name: "i–iv–VII–V", degrees: [1, 4, 7, 5], numerals: ["i", "iv", "VII", "V"] },
  ],
  "Melodic Minor": [
    { name: "i–ii–V–i", degrees: [1, 2, 5, 1], numerals: ["i", "ii", "V", "i"] },
    { name: "i–IV–vii°–i", degrees: [1, 4, 7, 1], numerals: ["i", "IV", "vii°", "i"] },
  ],
  "Dorian": [
    { name: "i–IV (Dorian)", degrees: [1, 4], numerals: ["i", "IV"] },
    { name: "i–IV–VII–i", degrees: [1, 4, 7, 1], numerals: ["i", "IV", "VII", "i"] },
    { name: "ii–v–i–IV", degrees: [2, 5, 1, 4], numerals: ["ii", "v", "i", "IV"] },
  ],
  "Phrygian": [
    { name: "i–II (Phrygian)", degrees: [1, 2], numerals: ["i", "II"] },
    { name: "i–II–i", degrees: [1, 2, 1], numerals: ["i", "II", "i"] },
    { name: "i–VII–VI–VII", degrees: [1, 7, 6, 7], numerals: ["i", "VII", "VI", "VII"] },
  ],
  "Lydian": [
    { name: "I–II (Lydian)", degrees: [1, 2], numerals: ["I", "II"] },
    { name: "I–II–vii°–I", degrees: [1, 2, 7, 1], numerals: ["I", "II", "vii°", "I"] },
    { name: "I–V–II–I", degrees: [1, 5, 2, 1], numerals: ["I", "V", "II", "I"] },
  ],
  "Mixolydian": [
    { name: "I–VII–IV–I (Rock)", degrees: [1, 7, 4, 1], numerals: ["I", "VII", "IV", "I"] },
    { name: "I–VII–I", degrees: [1, 7, 1], numerals: ["I", "VII", "I"] },
    { name: "IV–I–VII–I", degrees: [4, 1, 7, 1], numerals: ["IV", "I", "VII", "I"] },
  ],
  "Locrian": [
    { name: "i°–II–i°", degrees: [1, 2, 1], numerals: ["i°", "II", "i°"] },
    { name: "i°–VII–VI", degrees: [1, 7, 6], numerals: ["i°", "VII", "VI"] },
  ],
  "Pentatonic Major": [
    { name: "I–IV–V", degrees: [1, 4, 5], numerals: ["I", "IV", "V"] },
    { name: "I–II–V", degrees: [1, 2, 5], numerals: ["I", "II", "V"] },
  ],
  "Pentatonic Minor": [
    { name: "i–IV–VII", degrees: [1, 4, 7], numerals: ["i", "IV", "VII"] },
    { name: "i–III–VII", degrees: [1, 3, 7], numerals: ["i", "III", "VII"] },
  ],
  "Blues": [
    { name: "12-Bar Blues (I)", degrees: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5], numerals: ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"] },
    { name: "8-Bar Blues", degrees: [1, 5, 4, 1, 2, 5, 1, 5], numerals: ["I", "V", "IV", "I", "ii", "V", "I", "V"] },
    { name: "Quick Change Blues", degrees: [1, 4, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5], numerals: ["I", "IV", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"] },
  ],
  "Whole Tone": [],
  "Diminished (HW)": [],
  "Diminished (WH)": [],
  "Chromatic": [],
  "Hungarian Minor": [],
  "Double Harmonic": [],
  "Phrygian Dominant": [],
  "Lydian Dominant": [
    { name: "I–II–I", degrees: [1, 2, 1], numerals: ["I", "II", "I"] },
  ],
  "Super Locrian": [],
  "Bebop Dominant": [
    { name: "I–IV–V", degrees: [1, 4, 5], numerals: ["I", "IV", "V"] },
    { name: "ii–V–I", degrees: [2, 5, 1], numerals: ["ii", "V", "I"] },
  ],
  "Bebop Major": [
    { name: "I–V–I", degrees: [1, 5, 1], numerals: ["I", "V", "I"] },
    { name: "I–IV–V–I", degrees: [1, 4, 5, 1], numerals: ["I", "IV", "V", "I"] },
  ],
};

export function getRelativeKey(key: string, scaleName: ScaleName): { minor?: string; major?: string } {
  const rootIndex = getNoteIndex(key);
  const preferFlats = preferFlatsForKey(key);
  if (scaleName === "Major" || scaleName === "Lydian" || scaleName === "Mixolydian" || scaleName === "Bebop Major") {
    const minorIdx = (rootIndex + 9) % 12;
    return { minor: getNote(0, minorIdx, preferFlats) };
  }
  if (scaleName === "Natural Minor" || scaleName === "Dorian" || scaleName === "Phrygian") {
    const majorIdx = (rootIndex + 3) % 12;
    return { major: getNote(0, majorIdx, preferFlats) };
  }
  return {};
}

export function getParallelKey(key: string, scaleName: ScaleName): { minor?: string; major?: string } {
  if (scaleName === "Major") return { minor: key };
  if (scaleName === "Natural Minor") return { major: key };
  return {};
}

export function buildScaleData(key: string, scaleName: ScaleName): ScaleData {
  const notes = getScaleNotes(key, scaleName);
  const chords = buildChords(notes, scaleName);
  const progressions = CHORD_PROGRESSIONS[scaleName] || [];
  const { minor: relativeMinor, major: relativeMajor } = getRelativeKey(key, scaleName);
  const { minor: parallelMinor, major: parallelMajor } = getParallelKey(key, scaleName);

  return {
    key,
    scale: scaleName,
    notes,
    chords,
    progressions,
    relativeMinor,
    relativeMajor,
    parallelMinor,
    parallelMajor,
    scaleInfo: SCALE_DEFINITIONS[scaleName],
  };
}

export const CIRCLE_OF_FIFTHS = [
  { key: "C", major: "C", minor: "Am", sharpsFlats: 0 },
  { key: "G", major: "G", minor: "Em", sharpsFlats: 1 },
  { key: "D", major: "D", minor: "Bm", sharpsFlats: 2 },
  { key: "A", major: "A", minor: "F#m", sharpsFlats: 3 },
  { key: "E", major: "E", minor: "C#m", sharpsFlats: 4 },
  { key: "B", major: "B", minor: "G#m", sharpsFlats: 5 },
  { key: "F#", major: "F#", minor: "D#m", sharpsFlats: 6 },
  { key: "Db", major: "Db", minor: "Bbm", sharpsFlats: -5 },
  { key: "Ab", major: "Ab", minor: "Fm", sharpsFlats: -4 },
  { key: "Eb", major: "Eb", minor: "Cm", sharpsFlats: -3 },
  { key: "Bb", major: "Bb", minor: "Gm", sharpsFlats: -2 },
  { key: "F", major: "F", minor: "Dm", sharpsFlats: -1 },
];

export function getIntervalName(semitones: number): string {
  const names: Record<number, string> = {
    0: "P1 (Unison)",
    1: "m2 (Minor 2nd)",
    2: "M2 (Major 2nd)",
    3: "m3 (Minor 3rd)",
    4: "M3 (Major 3rd)",
    5: "P4 (Perfect 4th)",
    6: "TT (Tritone)",
    7: "P5 (Perfect 5th)",
    8: "m6 (Minor 6th)",
    9: "M6 (Major 6th)",
    10: "m7 (Minor 7th)",
    11: "M7 (Major 7th)",
    12: "P8 (Octave)",
  };
  return names[semitones] || `${semitones} semitones`;
}

export function getScaleIntervals(scaleName: ScaleName): { from: string; to: string; semitones: number; name: string }[] {
  const intervals = SCALE_DEFINITIONS[scaleName].intervals;
  const result = [];
  let total = 0;
  for (let i = 0; i < intervals.length - 1; i++) {
    result.push({
      from: `Note ${i + 1}`,
      to: `Note ${i + 2}`,
      semitones: intervals[i],
      name: intervals[i] === 1 ? "H" : intervals[i] === 2 ? "W" : intervals[i] === 3 ? "W+H" : `${intervals[i]}st`,
    });
    total += intervals[i];
  }
  return result;
}
