import { useState, useEffect } from "react";
import { Plus, X, Settings2, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { GameState, StartGameParams, startGame, validateImposterCount, GameMode, ImposterMode } from "../lib/gameLogic";
import { getAllThemes, Theme } from "../lib/themes";

type SetupScreenProps = {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onOpenThemeEditor: () => void;
};

export default function SetupScreen({ gameState, updateGameState, onOpenThemeEditor }: SetupScreenProps) {
  const { toast } = useToast();
  
  // Local form state
  const [players, setPlayers] = useState(gameState.players);
  const [mode, setMode] = useState<GameMode>(gameState.mode);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("");
  const [imposterMode, setImposterMode] = useState<ImposterMode>("random");
  const [manualImposterCount, setManualImposterCount] = useState<number>(1);
  
  // Custom setup state
  const [useCustomSetup, setUseCustomSetup] = useState(gameState.useCustomSetup);
  const [customWordA, setCustomWordA] = useState("");
  const [customWordB, setCustomWordB] = useState("");
  const [customImposterIds, setCustomImposterIds] = useState<string[]>([]);

  useEffect(() => {
    const loadedThemes = getAllThemes();
    setThemes(loadedThemes);
    if (loadedThemes.length > 0 && !selectedThemeId) {
      setSelectedThemeId(loadedThemes[0].id);
    }
  }, [selectedThemeId]);

  const handleAddPlayer = () => {
    setPlayers([...players, { id: crypto.randomUUID(), name: `Player ${players.length + 1}` }]);
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setCustomImposterIds(prev => prev.filter(pid => pid !== id));
  };

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const toggleCustomImposter = (id: string) => {
    setCustomImposterIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleStartGame = () => {
    // Validate players
    if (players.length < 3) {
      toast({ title: "Not enough players", description: "You need at least 3 players to start.", variant: "destructive" });
      return;
    }
    if (players.some(p => !p.name.trim())) {
      toast({ title: "Invalid names", description: "All players must have a name.", variant: "destructive" });
      return;
    }

    if (useCustomSetup) {
      if (!customWordA.trim()) {
        toast({ title: "Missing Word", description: "You must provide Word A.", variant: "destructive" });
        return;
      }
      if (mode === "B" && !customWordB.trim()) {
        toast({ title: "Missing Word", description: "You must provide Word B for Paired mode.", variant: "destructive" });
        return;
      }
      if (customImposterIds.length === 0) {
        toast({ title: "No Imposters", description: "You must select at least one imposter.", variant: "destructive" });
        return;
      }
      const err = validateImposterCount(players.length, customImposterIds.length);
      if (err) {
        toast({ title: "Invalid Imposters", description: err, variant: "destructive" });
        return;
      }
    } else {
      const selectedTheme = themes.find(t => t.id === selectedThemeId);
      if (!selectedTheme) {
        toast({ title: "No Theme", description: "Please select a theme.", variant: "destructive" });
        return;
      }
      if (imposterMode === "manual") {
        const err = validateImposterCount(players.length, manualImposterCount);
        if (err) {
          toast({ title: "Invalid Imposters", description: err, variant: "destructive" });
          return;
        }
      }
    }

    const selectedTheme = themes.find(t => t.id === selectedThemeId) || null;

    try {
      const newGameState = startGame({
        players,
        mode,
        imposterMode,
        manualImposterCount,
        useCustomSetup,
        selectedTheme,
        customWordA,
        customWordB,
        customImposterIds
      });
      updateGameState(newGameState);
    } catch (e: any) {
      toast({ title: "Error starting game", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 py-8 space-y-8" style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }} data-testid="setup-screen">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-primary">IMPOSTER</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Word Game</p>
      </div>

      {/* PLAYERS */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Players</CardTitle>
            <span className="text-sm text-muted-foreground">{players.length} Total</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence initial={false}>
            {players.map((player, index) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <Input 
                    value={player.name}
                    onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="bg-background/50 border-primary/10 focus-visible:ring-primary h-12 text-lg"
                    data-testid={`input-player-${index}`}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemovePlayer(player.id)}
                  disabled={players.length <= 3}
                  className="h-12 w-12 shrink-0 text-muted-foreground hover:text-destructive"
                  data-testid={`button-remove-player-${index}`}
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button 
            variant="outline" 
            className="w-full h-12 border-dashed border-primary/30 hover:border-primary/50 text-primary"
            onClick={handleAddPlayer}
            data-testid="button-add-player"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Player
          </Button>
        </CardContent>
      </Card>

      {/* GAME SETTINGS */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Game Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === "A" ? "default" : "outline"}
                className={`h-auto py-3 px-4 flex flex-col items-start gap-1 justify-start ${mode === "A" ? "bg-primary text-primary-foreground" : "bg-transparent border-primary/20"}`}
                onClick={() => setMode("A")}
                data-testid="button-mode-a"
              >
                <span className="font-bold">Classic</span>
                <span className="text-xs font-normal opacity-80 text-left">Imposters get nothing</span>
              </Button>
              <Button
                variant={mode === "B" ? "default" : "outline"}
                className={`h-auto py-3 px-4 flex flex-col items-start gap-1 justify-start ${mode === "B" ? "bg-primary text-primary-foreground" : "bg-transparent border-primary/20"}`}
                onClick={() => setMode("B")}
                data-testid="button-mode-b"
              >
                <span className="font-bold">Paired</span>
                <span className="text-xs font-normal opacity-80 text-left">Imposters get similar word</span>
              </Button>
            </div>
          </div>

          <Separator className="bg-primary/10" />

          <div className="flex items-center justify-between">
            <Label htmlFor="custom-setup" className="flex flex-col gap-1 cursor-pointer">
              <span className="text-base font-semibold">Custom Game Master</span>
              <span className="text-xs text-muted-foreground">Manually choose words and imposters</span>
            </Label>
            <Switch 
              id="custom-setup" 
              checked={useCustomSetup} 
              onCheckedChange={setUseCustomSetup}
              data-testid="switch-custom-setup"
            />
          </div>

          <AnimatePresence mode="wait">
            {!useCustomSetup ? (
              <motion.div 
                key="auto-setup"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Theme</Label>
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={onOpenThemeEditor} data-testid="button-edit-themes">
                      <Settings2 className="h-4 w-4 mr-1" /> Edit Themes
                    </Button>
                  </div>
                  <Select value={selectedThemeId} onValueChange={setSelectedThemeId}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20" data-testid="select-theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map(t => (
                        <SelectItem key={t.id} value={t.id} data-testid={`theme-option-${t.id}`}>
                          {t.name} {t.isCustom && "(Custom)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Imposter Count</Label>
                  <div className="flex gap-2 flex-wrap">
                    {/* Random pill */}
                    <button
                      onClick={() => setImposterMode("random")}
                      className={`flex items-center gap-2 px-5 h-14 rounded-2xl font-bold text-base transition-all duration-150 active:scale-95 ${
                        imposterMode === "random"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-background/50 border border-primary/20 text-muted-foreground hover:border-primary/40"
                      }`}
                      data-testid="button-imposter-random"
                    >
                      <Shuffle className="w-4 h-4 shrink-0" />
                      Random
                    </button>
                    {/* Numbered pills — one per valid count (all counts up to players - 1) */}
                    {Array.from({ length: players.length - 1 }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => { setImposterMode("manual"); setManualImposterCount(n); }}
                        className={`h-14 w-14 rounded-2xl font-black text-xl transition-all duration-150 active:scale-95 ${
                          imposterMode === "manual" && manualImposterCount === n
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-background/50 border border-primary/20 text-muted-foreground hover:border-primary/40"
                        }`}
                        data-testid={`button-imposter-count-${n}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {imposterMode === "random"
                      ? `Will randomly pick between 1 and ${players.length - 1} imposters.`
                      : `${manualImposterCount} imposter${manualImposterCount > 1 ? "s" : ""} out of ${players.length} players.`
                    }
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="custom-setup"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden pt-2"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Words</Label>
                    <Input 
                      placeholder="Word A (Crewmates)" 
                      value={customWordA}
                      onChange={(e) => setCustomWordA(e.target.value)}
                      className="h-12 bg-background/50 border-primary/20 text-lg"
                      data-testid="input-custom-word-a"
                    />
                    {mode === "B" && (
                      <Input 
                        placeholder="Word B (Imposters)" 
                        value={customWordB}
                        onChange={(e) => setCustomWordB(e.target.value)}
                        className="h-12 bg-background/50 border-primary/20 text-lg"
                        data-testid="input-custom-word-b"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select Imposters</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {players.map((p) => (
                        <Button
                          key={p.id}
                          variant={customImposterIds.includes(p.id) ? "destructive" : "outline"}
                          className={`h-12 justify-start overflow-hidden ${!customImposterIds.includes(p.id) && "border-primary/20 bg-background/50"}`}
                          onClick={() => toggleCustomImposter(p.id)}
                          data-testid={`button-custom-imposter-${p.id}`}
                        >
                          <span className="truncate">{p.name}</span>
                        </Button>
                      ))}
                    </div>
                    {customImposterIds.length >= players.length && (
                      <p className="text-xs text-destructive mt-1">
                        At least one player must be a crewmate.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-primary/10 px-4 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <Button 
          className="w-full h-16 text-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20" 
          size="lg"
          onClick={handleStartGame}
          data-testid="button-start-game"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
