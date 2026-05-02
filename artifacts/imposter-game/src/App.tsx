import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameState, startGame } from "./lib/gameLogic";
import SetupScreen from "./pages/SetupScreen";
import RevealScreen from "./pages/RevealScreen";
import ThemeEditor from "./pages/ThemeEditor";
import GameReadyScreen from "./pages/GameReadyScreen";

const SETUP_STORAGE_KEY = "imposter-game-setup";

function loadSavedSetup(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(SETUP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      players: Array.isArray(parsed.players) ? parsed.players : undefined,
      mode: parsed.mode ?? undefined,
      selectedTheme: parsed.selectedTheme ?? undefined,
    };
  } catch {
    return {};
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
    selectedTheme: saved.selectedTheme ?? null,
    selectedPair: null,
    crewmateWord: null,
    imposterWord: null,
    phase: "setup",
    currentPlayerIndex: 0,
    useCustomSetup: false,
  });

  const [showThemeEditor, setShowThemeEditor] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Persist setup fields whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        SETUP_STORAGE_KEY,
        JSON.stringify({
          players: gameState.players,
          mode: gameState.mode,
          selectedTheme: gameState.selectedTheme,
        })
      );
    } catch {
      // localStorage unavailable — silently skip
    }
  }, [gameState.players, gameState.mode, gameState.selectedTheme]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
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
    const { players, mode, selectedTheme, useCustomSetup } = gameState;
    try {
      const newState = startGame({
        players,
        mode,
        imposterMode: "random",
        manualImposterCount: 1,
        useCustomSetup: false,
        selectedTheme,
        customWordA: "",
        customWordB: "",
        customImposterIds: [],
      });
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
