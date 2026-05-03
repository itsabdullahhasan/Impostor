export type PlayerStats = {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  crewGames: number;
  crewWins: number;
  imposterGames: number;
  imposterWins: number;
};

const STATS_KEY = "imposter-game-player-stats";

export function loadAllStats(): Record<string, PlayerStats> {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllStats(stats: Record<string, PlayerStats>): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function recordRound(
  playerNames: string[],
  imposterNames: string[],
  winningSide: "crewmates" | "imposters"
): void {
  const all = loadAllStats();

  for (const name of playerNames) {
    const key = name.trim().toLowerCase();
    if (!key) continue;
    const isImposter = imposterNames.map(n => n.trim().toLowerCase()).includes(key);
    const won = isImposter ? winningSide === "imposters" : winningSide === "crewmates";

    const existing: PlayerStats = all[key] ?? {
      name,
      gamesPlayed: 0,
      gamesWon: 0,
      crewGames: 0,
      crewWins: 0,
      imposterGames: 0,
      imposterWins: 0,
    };

    all[key] = {
      ...existing,
      name, // keep latest casing
      gamesPlayed: existing.gamesPlayed + 1,
      gamesWon: existing.gamesWon + (won ? 1 : 0),
      crewGames: existing.crewGames + (isImposter ? 0 : 1),
      crewWins: existing.crewWins + (!isImposter && won ? 1 : 0),
      imposterGames: existing.imposterGames + (isImposter ? 1 : 0),
      imposterWins: existing.imposterWins + (isImposter && won ? 1 : 0),
    };
  }

  saveAllStats(all);
}

export function winRate(wins: number, played: number): string {
  if (played === 0) return "—";
  return `${Math.round((wins / played) * 100)}%`;
}
