import { Theme, WordPair } from "./themes";

export type GameMode = "A" | "B"; // A = classic, B = paired
export type ImposterMode = "manual" | "random";
export type Player = { id: string; name: string };

export type GameState = {
  players: Player[];
  imposterIds: string[];
  mode: GameMode;
  selectedTheme: Theme | null;
  selectedPair: WordPair | null;
  crewmateWord: string | null;
  imposterWord: string | null;
  phase: "setup" | "reveal" | "done";
  currentPlayerIndex: number;
  useCustomSetup: boolean;
};

export type StartGameParams = {
  players: Player[];
  mode: GameMode;
  imposterMode: ImposterMode;
  manualImposterCount: number;
  useCustomSetup: boolean;
  selectedTheme: Theme | null;
  customWordA: string;
  customWordB: string;
  customImposterIds: string[];
};

export function startGame(params: StartGameParams): Partial<GameState> {
  const {
    players,
    mode,
    imposterMode,
    manualImposterCount,
    useCustomSetup,
    selectedTheme,
    customWordA,
    customWordB,
    customImposterIds,
  } = params;

  let imposterIds: string[] = [];
  let crewmateWord: string | null = null;
  let imposterWord: string | null = null;
  let selectedPair: WordPair | null = null;

  if (useCustomSetup) {
    crewmateWord = customWordA;
    if (mode === "B" && customWordB) {
      imposterWord = customWordB;
    }
    imposterIds = [...customImposterIds];
  } else {
    // Standard setup
    if (!selectedTheme || selectedTheme.pairs.length === 0) {
      throw new Error("No theme selected or theme has no word pairs.");
    }

    // Pick random pair
    selectedPair = selectedTheme.pairs[Math.floor(Math.random() * selectedTheme.pairs.length)];
    
    // Assign words based on mode
    if (mode === "A") {
      crewmateWord = Math.random() > 0.5 ? selectedPair.wordA : selectedPair.wordB;
    } else {
      if (Math.random() > 0.5) {
        crewmateWord = selectedPair.wordA;
        imposterWord = selectedPair.wordB;
      } else {
        crewmateWord = selectedPair.wordB;
        imposterWord = selectedPair.wordA;
      }
    }

    // Assign imposters — max is players.length - 1 (at least one crewmate must remain)
    const maxImposters = players.length - 1;
    let numImposters = 1;

    if (imposterMode === "manual") {
      numImposters = Math.max(1, Math.min(manualImposterCount, maxImposters));
    } else {
      numImposters = Math.floor(Math.random() * maxImposters) + 1;
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    imposterIds = shuffledPlayers.slice(0, numImposters).map(p => p.id);
  }

  return {
    players,
    mode,
    imposterIds,
    selectedTheme,
    selectedPair,
    crewmateWord,
    imposterWord,
    phase: "reveal",
    currentPlayerIndex: 0,
    useCustomSetup,
  };
}

export function validateImposterCount(playerCount: number, requestedCount: number): string | null {
  if (playerCount < 3) return "Need at least 3 players.";
  if (requestedCount < 1) return "Need at least 1 imposter.";
  if (requestedCount >= playerCount) return "Must have at least 1 crewmate.";
  return null;
}
