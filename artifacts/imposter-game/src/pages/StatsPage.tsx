import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Trophy, Skull, Users, Swords, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadAllStats, saveAllStats, PlayerStats, winRate } from "../lib/playerStats";

type StatsPageProps = {
  onBack: () => void;
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-background/60 rounded-2xl p-3 flex flex-col items-center text-center gap-0.5">
      <p className="text-2xl font-black text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60">{sub}</p>}
    </div>
  );
}

function PlayerCard({ stats, onDelete }: { stats: PlayerStats; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-primary/15 rounded-2xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">{stats.name}</h2>
          <p className="text-sm text-muted-foreground">
            {stats.gamesPlayed} game{stats.gamesPlayed !== 1 ? "s" : ""} played
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-primary">{winRate(stats.gamesWon, stats.gamesPlayed)}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">win rate</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Wins" value={stats.gamesWon} />
        <StatCard label="Losses" value={stats.gamesPlayed - stats.gamesWon} />
        <StatCard label="Win Rate" value={winRate(stats.gamesWon, stats.gamesPlayed)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/8 border border-primary/15 rounded-2xl p-3 space-y-2">
          <p className="text-xs uppercase tracking-widest font-bold text-primary/70 flex items-center gap-1">
            <Users className="w-3 h-3" /> As Crew
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <StatCard label="Played" value={stats.crewGames} />
            <StatCard label="Wins" value={stats.crewWins} />
          </div>
          <p className="text-center text-sm font-bold text-primary">
            {winRate(stats.crewWins, stats.crewGames)} win rate
          </p>
        </div>
        <div className="bg-destructive/8 border border-destructive/15 rounded-2xl p-3 space-y-2">
          <p className="text-xs uppercase tracking-widest font-bold text-destructive/70 flex items-center gap-1">
            <Skull className="w-3 h-3" /> As Imposter
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <StatCard label="Played" value={stats.imposterGames} />
            <StatCard label="Wins" value={stats.imposterWins} />
          </div>
          <p className="text-center text-sm font-bold text-destructive">
            {winRate(stats.imposterWins, stats.imposterGames)} win rate
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        {confirmDelete ? (
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={onDelete}>
              Confirm Delete
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="w-3 h-3" /> Delete Stats
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function StatsPage({ onBack }: StatsPageProps) {
  const [search, setSearch] = useState("");
  const [allStats, setAllStats] = useState(() => loadAllStats());

  const sorted = useMemo(() => {
    return Object.values(allStats).sort((a, b) => {
      const aRate = a.gamesPlayed > 0 ? a.gamesWon / a.gamesPlayed : 0;
      const bRate = b.gamesPlayed > 0 ? b.gamesWon / b.gamesPlayed : 0;
      if (bRate !== aRate) return bRate - aRate;
      return b.gamesPlayed - a.gamesPlayed;
    });
  }, [allStats]);

  const searchKey = search.trim().toLowerCase();
  const searched = searchKey ? allStats[searchKey] ?? null : null;
  const showLeaderboard = sorted.length > 0;

  const handleDelete = (key: string) => {
    const updated = { ...allStats };
    delete updated[key];
    saveAllStats(updated);
    setAllStats(updated);
    if (searchKey === key) setSearch("");
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-3 pt-4 border-b border-primary/10 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-black uppercase tracking-tighter text-foreground flex-1">Player Stats</h1>
        <Trophy className="w-5 h-5 text-primary/50" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" style={{ paddingBottom: "env(safe-area-inset-bottom, 1.5rem)" }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Type a player name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-12 bg-card border-primary/20 text-base"
          />
        </div>

        {/* Search result */}
        <AnimatePresence mode="wait">
          {searchKey && (
            <motion.div
              key={searchKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {searched ? (
                <PlayerCard
                  stats={searched}
                  onDelete={() => handleDelete(searchKey)}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Swords className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No stats found for "{search}"</p>
                  <p className="text-sm mt-1">Stats are recorded automatically when a game result is saved.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        {!searchKey && showLeaderboard && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Leaderboard
            </p>
            {sorted.map((player, i) => (
              <motion.div
                key={player.name.toLowerCase()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-primary/10 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className={`text-lg font-black w-6 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground/40"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.gamesPlayed} played · {player.gamesWon} won
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-primary">{winRate(player.gamesWon, player.gamesPlayed)}</p>
                  <p className="text-xs text-muted-foreground">win rate</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!searchKey && !showLeaderboard && (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">No stats yet</p>
            <p className="text-sm mt-1">Play a game and record the result to start tracking stats.</p>
          </div>
        )}
      </div>
    </div>
  );
}
