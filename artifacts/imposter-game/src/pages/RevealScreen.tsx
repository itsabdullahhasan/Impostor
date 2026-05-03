import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldQuestion, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameState } from "../lib/gameLogic";

type RevealScreenProps = {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onReset: () => void;
};

export default function RevealScreen({ gameState, updateGameState, onReset }: RevealScreenProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const { players, currentPlayerIndex, imposterIds, mode, crewmateWord, imposterWord } = gameState;
  const isDone = currentPlayerIndex >= players.length;

  if (isDone) {
    // Should not render, App.tsx should handle phase change, but just in case
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];
  const isImposter = imposterIds.includes(currentPlayer.id);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsRevealed(false);
    if (currentPlayerIndex + 1 >= players.length) {
      updateGameState({ phase: "done" });
    } else {
      updateGameState({ currentPlayerIndex: currentPlayerIndex + 1 });
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6" data-testid="reveal-screen">
      {/* New Game button — only shown on the safe pass screen, never during reveal */}
      {!isRevealed && (
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground gap-1.5"
            data-testid="button-new-game"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key={`pass-${currentPlayer.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center justify-center text-center space-y-12"
          >
            <div className="space-y-4">
              <ShieldQuestion className="w-24 h-24 text-primary/50 mx-auto" />
              <h2 className="text-2xl text-muted-foreground uppercase tracking-widest font-semibold">Pass to</h2>
              <h1
                className="font-black text-foreground w-full px-4"
                style={{
                  fontSize: "clamp(1.75rem, 11vw, 3rem)",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >{currentPlayer.name}</h1>
            </div>
            
            <p className="text-muted-foreground">Make sure nobody else is looking.</p>

            <Button 
              size="lg" 
              className="w-full h-20 text-2xl font-bold uppercase tracking-widest shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.5)] transition-all duration-300"
              onClick={handleReveal}
              data-testid="button-reveal"
            >
              <Eye className="mr-3 w-8 h-8" /> Tap to Reveal
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`reveal-${currentPlayer.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-full max-w-sm flex flex-col items-center justify-center text-center space-y-12 p-8 rounded-3xl border-2 ${isImposter && mode === "A" ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"}`}
          >
            <div className="space-y-6 w-full">
              {isImposter && mode === "A" ? (
                <>
                  <h2 className="text-2xl text-destructive uppercase tracking-widest font-black">You are the</h2>
                  <h1 className="text-6xl font-black text-destructive tracking-tighter" style={{ textShadow: "0 0 30px hsl(var(--destructive)/0.5)" }}>
                    IMPOSTER
                  </h1>
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-primary uppercase tracking-widest font-black">
                    {isImposter ? "Your Word Is" : "You are a CREWMATE"}
                  </h2>
                  <div className="bg-background/80 py-8 px-4 rounded-2xl border border-primary/20 shadow-inner overflow-hidden w-full">
                    <h1
                      className="font-black text-foreground tracking-tight w-full"
                      style={{
                        fontSize: "clamp(1.75rem, 10vw, 3.5rem)",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        hyphens: "auto",
                      }}
                    >
                      {isImposter ? imposterWord : crewmateWord}
                    </h1>
                  </div>
                </>
              )}
            </div>

            <Button 
              variant={isImposter && mode === "A" ? "destructive" : "default"}
              size="lg" 
              className="w-full h-16 text-xl font-bold uppercase tracking-widest"
              onClick={handleNext}
              data-testid="button-hide-pass"
            >
              Hide & Pass
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
