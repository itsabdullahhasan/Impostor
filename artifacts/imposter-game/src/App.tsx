import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameState } from "./lib/gameLogic";
import SetupScreen from "./pages/SetupScreen";
import RevealScreen from "./pages/RevealScreen";
import ThemeEditor from "./pages/ThemeEditor";
import GameReadyScreen from "./pages/GameReadyScreen";

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      { id: "1", name: "Player 1" },
      { id: "2", name: "Player 2" },
      { id: "3", name: "Player 3" },
    ],
    imposterIds: [],
    mode: "A",
    selectedTheme: null,
    selectedPair: null,
    crewmateWord: null,
    imposterWord: null,
    phase: "setup",
    currentPlayerIndex: 0,
    useCustomSetup: false,
  });

  const [showThemeEditor, setShowThemeEditor] = useState(false);

  useEffect(() => {
    // Force dark mode on document element
    document.documentElement.classList.add('dark');
  }, []);

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
          <GameReadyScreen gameState={gameState} onReset={resetToSetup} />
        ) : null}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
