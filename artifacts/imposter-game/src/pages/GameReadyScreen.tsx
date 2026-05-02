import { motion } from "framer-motion";
import { RefreshCcw, Skull, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameState } from "../lib/gameLogic";

type GameReadyScreenProps = {
  gameState: GameState;
  onReset: () => void;
  onPlayAgain: () => void;
};

export default function GameReadyScreen({ gameState, onReset, onPlayAgain }: GameReadyScreenProps) {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 text-center" data-testid="game-ready-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="w-full max-w-sm space-y-12"
      >
        <div className="space-y-6">
          <motion.div 
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            }} 
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center border border-primary/20"
          >
            <Skull className="w-16 h-16 text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">
              Game Ready
            </h1>
            <p className="text-lg text-muted-foreground">
              All players have been briefed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-primary/10 p-4 rounded-2xl">
            <p className="text-4xl font-black text-foreground">{gameState.players.length}</p>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-1">Players</p>
          </div>
          <div className="bg-card border border-destructive/20 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
            <p className="text-4xl font-black text-destructive">{gameState.imposterIds.length}</p>
            <p className="text-xs uppercase tracking-widest font-bold text-destructive/80 mt-1">Imposters</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Start discussing. Try to find the imposter(s).
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-16 text-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            <RefreshCcw className="mr-3 w-6 h-6" /> Play Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 text-base font-semibold border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary/40"
            onClick={onReset}
            data-testid="button-new-game"
          >
            <Settings className="mr-2 w-4 h-4" /> Change Setup
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
