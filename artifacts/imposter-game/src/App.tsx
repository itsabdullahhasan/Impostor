import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameState, StartGameParams, startGame } from "./lib/gameLogic";
import SetupScreen from "./pages/SetupScreen";
import RevealScreen from "./pages/RevealScreen";
import ThemeEditor from "./pages/ThemeEditor";
import GameReadyScreen from "./pages/GameReadyScreen";

const SETUP_STORAGE_KEY = "imposter-game-setup";
const LAST_PARAMS_KEY = "imposter-game-last-params";

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
  const [showThemeEditor, setShowThemeEditor] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Persist players + mode whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        SETUP_STORAGE_KEY,
        JSON.stringify({ players: gameState.players, mode: gameState.mode })
      );
    } catch {}
  }, [gameState.players, gameState.mode]);

  // Persist last start params whenever they change
  useEffect(() => {
    if (!lastStartParams) return;
    try {
      localStorage.setItem(LAST_PARAMS_KEY, JSON.stringify(lastStartParams));
    } catch {}
  }, [lastStartParams]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const handleGameStart = (params: StartGameParams) => {
    setLastStartParams(params);
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
        {showThemeEditor ? (
          <ThemeEditor onBack={() => setShowThemeEditor(false)} />
        ) : gameState.phase === "setup" ? (
          <SetupScreen
            gameState={gameState}
            updateGameState={updateGameState}
            onOpenThemeEditor={() => setShowThemeEditor(true)}
            onGameStart={handleGameStart}
          />
        ) : gameState.phase === "reveal" ? (
          <RevealScreen gameState={gameState} updateGameState={updateGameState} onReset={resetToSetup} />
        ) : gameState.phase === "done" ? (
          <GameReadyScreen gameState={gameState} onReset={resetToSetup} onPlayAgain={playAgain} />
        ) : null}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
