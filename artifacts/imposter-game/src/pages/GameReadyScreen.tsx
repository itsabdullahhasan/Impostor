import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Skull, Settings, Eye, EyeOff, Play, Pause, RotateCcw, Trophy, Timer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameState } from "../lib/gameLogic";

type Score = { crewmates: number; imposters: number };

type GameReadyScreenProps = {
  gameState: GameState;
  score: Score;
  onRecordResult: (side: "crewmates" | "imposters") => void;
  onReset: () => void;
  onPlayAgain: () => void;
};

const TIMER_PRESETS = [
  { label: "2m", seconds: 120 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
  { label: "7m", seconds: 420 },
  { label: "10m", seconds: 600 },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function GameReadyScreen({ gameState, score, onRecordResult, onReset, onPlayAgain }: GameReadyScreenProps) {
  const [showReveal, setShowReveal] = useState(false);
  const [timerPreset, setTimerPreset] = useState(300);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [resultRecorded, setResultRecorded] = useState<"crewmates" | "imposters" | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const imposters = gameState.players.filter((p) => gameState.imposterIds.includes(p.id));
  const crewWord = gameState.crewmateWord;
  const imposterWord = gameState.imposterWord;

  // Wake lock — keep screen on while game is active
  useEffect(() => {
    const acquire = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        }
      } catch {}
    };
    acquire();
    return () => {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        (navigator as any).wakeLock?.request("screen").then((l: WakeLockSentinel) => {
          wakeLockRef.current = l;
        }).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) { setTimerRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const handlePreset = (s: number) => {
    setTimerPreset(s);
    setTimerSeconds(s);
    setTimerRunning(false);
  };

  const handleTimerReset = () => {
    setTimerSeconds(timerPreset);
    setTimerRunning(false);
  };

  const handleRecordResult = (side: "crewmates" | "imposters") => {
    setResultRecorded(side);
    onRecordResult(side);
  };

  const timerDone = timerSeconds === 0;
  const timerPct = timerPreset > 0 ? timerSeconds / timerPreset : 0;
  const timerColor = timerPct > 0.4 ? "text-foreground" : timerPct > 0.15 ? "text-yellow-400" : "text-destructive";

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-y-auto" data-testid="game-ready-screen">
      <div className="w-full max-w-sm mx-auto px-4 py-6 flex flex-col gap-5" style={{ paddingBottom: "1.5rem" }}>

        {/* Score + record result */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground text-center">
            {resultRecorded ? "Result Saved" : "Record Winner"}
          </p>

          {resultRecorded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-primary/15 rounded-2xl p-4 flex items-center justify-center gap-3 text-primary"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold text-lg capitalize">
                {resultRecorded === "crewmates" ? "Crew" : "Imposters"} win recorded — stats updated!
              </span>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-primary/15 rounded-2xl p-3 flex flex-col items-center gap-2">
                <p className="text-xs uppercase tracking-widest font-bold text-primary/70 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Crew
                </p>
                <p className="text-4xl font-black text-foreground">{score.crewmates}</p>
                <Button
                  size="sm"
                  className="w-full h-8 text-xs font-bold"
                  onClick={() => handleRecordResult("crewmates")}
                >
                  Crew Won
                </Button>
              </div>
              <div className="bg-card border border-destructive/20 rounded-2xl p-3 flex flex-col items-center gap-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
                <p className="text-xs uppercase tracking-widest font-bold text-destructive/70 flex items-center gap-1">
                  <Skull className="w-3 h-3" /> Imposters
                </p>
                <p className="text-4xl font-black text-destructive">{score.imposters}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-xs font-bold border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRecordResult("imposters")}
                >
                  Imposters Won
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
          className="text-center space-y-2"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center border border-primary/20"
          >
            <Skull className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Game Ready</h1>
          <p className="text-sm text-muted-foreground">
            {gameState.players.length} players · {gameState.imposterIds.length} imposter{gameState.imposterIds.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-primary/10 rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" /> Discussion Timer
            </p>
            {timerDone && (
              <span className="text-xs font-bold text-destructive uppercase tracking-wider animate-pulse">Time's up!</span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TIMER_PRESETS.map(({ label, seconds }) => (
              <button
                key={label}
                onClick={() => handlePreset(seconds)}
                className={`px-3 h-8 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
                  timerPreset === seconds
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/50 border border-primary/20 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-5xl font-black tabular-nums flex-1 ${timerColor}`}>
              {formatTime(timerSeconds)}
            </span>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 border-primary/20"
                onClick={() => setTimerRunning((r) => !r)}
                disabled={timerDone}
              >
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 text-muted-foreground"
                onClick={handleTimerReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-base font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            onClick={() => setShowReveal(true)}
          >
            <Eye className="mr-2 w-5 h-5" /> Reveal Imposters
          </Button>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            <RefreshCcw className="mr-3 w-5 h-5" /> Play Again
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-11 text-sm font-semibold border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary/40"
            onClick={onReset}
            data-testid="button-new-game"
          >
            <Settings className="mr-2 w-4 h-4" /> Change Setup
          </Button>
        </motion.div>
      </div>

      {/* Imposter reveal overlay */}
      <AnimatePresence>
        {showReveal && (
          <motion.div
            key="reveal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50 text-center"
            onClick={() => setShowReveal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="w-full max-w-sm space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <motion.div
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Skull className="w-16 h-16 text-destructive mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-destructive">
                  {imposters.length === 1 ? "The Imposter" : "The Imposters"}
                </h2>
              </div>

              <div className="space-y-2">
                {imposters.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-destructive/15 border border-destructive/30 rounded-2xl px-6 py-4"
                  >
                    <p className="font-black text-destructive break-words overflow-hidden" style={{ fontSize: "clamp(1.25rem, 6vw, 1.5rem)", wordBreak: "break-word", overflowWrap: "anywhere" }}>{p.name}</p>
                  </motion.div>
                ))}
              </div>

              {crewWord && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: imposters.length * 0.15 + 0.1 }}
                  className="space-y-2"
                >
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">The Word</p>
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4">
                    <p className="text-3xl font-black text-primary">{crewWord}</p>
                  </div>
                  {imposterWord && (
                    <div className="bg-card border border-primary/10 rounded-2xl px-6 py-3">
                      <p className="text-xs text-muted-foreground mb-1">Imposter's word</p>
                      <p className="text-xl font-bold text-foreground">{imposterWord}</p>
                    </div>
                  )}
                </motion.div>
              )}

              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary/20 text-muted-foreground"
                onClick={() => setShowReveal(false)}
              >
                <EyeOff className="mr-2 w-4 h-4" /> Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
