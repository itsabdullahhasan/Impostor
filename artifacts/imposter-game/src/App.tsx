import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameState, StartGameParams, startGame } from "./lib/gameLogic";
import { recordRound } from "./lib/playerStats";
import SetupScreen from "./pages/SetupScreen";
import RevealScreen from "./pages/RevealScreen";
import ThemeEditor from "./pages/ThemeEditor";
import GameReadyScreen from "./pages/GameReadyScreen";
import StatsPage from "./pages/StatsPage";

const SETUP_STORAGE_KEY = "imposter-game-setup";
const LAST_PARAMS_KEY = "imposter-game-last-params";
const SCORE_KEY = "imposter-game-score";

type Score = { crewmates: number; imposters: number };

function loadScore(): Score {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    return raw ? JSON.parse(raw) : { crewmates: 0, imposters: 0 };
  } catch {
    return { crewmates: 0, imposters: 0 };
  }
}

function loadSavedSetup(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(SETUP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      players: Array.isArray(parsed.players) ? parsed.players : undefined,
      mode: parsed.mode ?? undefined,
    };
  } catch {
    return {};
  }
}

function loadLastParams(): StartGameParams | null {
  try {
    const raw = localStorage.getItem(LAST_PARAMS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StartGameParams;
  } catch {
    return null;
  }
}

function App() {
  const saved = loadSavedSetup();

  const [gameState, setGameState] = useState<GameState>({
    players: saved.players ?? [
      { id: "1", name: "Player 1" },
      { id: "2", name: "Player 2" },
      { id: "3", name: "Player 3" },
    ],
    imposterIds: [],
    mode: saved.mode ?? "A",
    selectedTheme: null,
    selectedPair: null,
    crewmateWord: null,
    imposterWord: null,
    phase: "setup",
    currentPlayerIndex: 0,
    useCustomSetup: false,
  });

  const [lastStartParams, setLastStartParams] = useState<StartGameParams | null>(loadLastParams);
  const [score, setScore] = useState<Score>(loadScore);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showStatsPage, setShowStatsPage] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        SETUP_STORAGE_KEY,
        JSON.stringify({ players: gameState.players, mode: gameState.mode })
      );
    } catch {}
  }, [gameState.players, gameState.mode]);

  useEffect(() => {
    if (!lastStartParams) return;
    try {
      localStorage.setItem(LAST_PARAMS_KEY, JSON.stringify(lastStartParams));
    } catch {}
  }, [lastStartParams]);

  useEffect(() => {
    try {
      localStorage.setItem(SCORE_KEY, JSON.stringify(score));
    } catch {}
  }, [score]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const handleGameStart = (params: StartGameParams) => {
    setLastStartParams(params);
  };

  const handleRecordResult = (side: "crewmates" | "imposters") => {
    // Update session score
    setScore((prev) => ({
      ...prev,
      crewmates: side === "crewmates" ? prev.crewmates + 1 : prev.crewmates,
      imposters: side === "imposters" ? prev.imposters + 1 : prev.imposters,
    }));

    // Update permanent per-player stats
    const allNames = gameState.players.map((p) => p.name);
    const imposterNames = gameState.players
      .filter((p) => gameState.imposterIds.includes(p.id))
      .map((p) => p.name);
    recordRound(allNames, imposterNames, side);
  };

  const resetToSetup = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "setup",
      imposterIds: [],
      crewmateWord: null,
      imposterWord: null,
      currentPlayerIndex: 0,
    }));
  };

  const playAgain = () => {
    const params = lastStartParams;
    if (!params) { resetToSetup(); return; }
    try {
      const newState = startGame(params);
      setGameState((prev) => ({ ...prev, ...newState }));
    } catch {
      resetToSetup();
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        {showStatsPage ? (
          <StatsPage onBack={() => setShowStatsPage(false)} />
        ) : showThemeEditor ? (
          <ThemeEditor onBack={() => setShowThemeEditor(false)} />
        ) : gameState.phase === "setup" ? (
          <SetupScreen
            gameState={gameState}
            updateGameState={updateGameState}
            onOpenThemeEditor={() => setShowThemeEditor(true)}
            onOpenStats={() => setShowStatsPage(true)}
            onGameStart={handleGameStart}
          />
        ) : gameState.phase === "reveal" ? (
          <RevealScreen gameState={gameState} updateGameState={updateGameState} onReset={resetToSetup} />
        ) : gameState.phase === "done" ? (
          <GameReadyScreen
            gameState={gameState}
            score={score}
            onRecordResult={handleRecordResult}
            onReset={resetToSetup}
            onPlayAgain={playAgain}
          />
        ) : null}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
