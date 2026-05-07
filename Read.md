# Imposter Word Game (Website)

Imposter is a party word game built for the web. Players are assigned hidden roles and words, then try to identify the imposter through discussion.

## What This Website Includes

- Local multiplayer setup for 3+ players
- Two game modes:
  - **Classic (A):** imposters get no word
  - **Paired (B):** imposters get a similar/different paired word
- Random or manual imposter count
- Built-in and custom themes/word pairs
- Custom Game Master mode (manual words + manual/random imposters)
- Reveal flow for passing one device between players
- Discussion timer and round score tracking
- Player stats leaderboard

## How to Play

1. Open the game and add all player names (minimum 3).
2. Choose a mode:
   - **Classic:** crew gets one word, imposters see “IMPOSTER”.
   - **Paired:** crew and imposters each get a related but different word.
3. Choose setup style:
   - **Standard:** select a theme and imposter count (random or fixed).
   - **Custom Game Master:** enter your own word(s) and pick imposters manually or randomly.
4. Tap **Start Game**.
5. Pass the device to each player:
   - Tap **Tap to Reveal**
   - Player sees their role/word
   - Tap **Hide & Pass** to continue
6. After everyone has revealed, start discussion.
7. Use the built-in timer if needed.
8. At round end, record winner:
   - **Crew Won** or **Imposters Won**
9. Play again or change setup for a new round.

## Winning the Round

- **Crewmates win** if they identify the imposter(s).
- **Imposters win** if they avoid detection.

## Tips for Better Games

- Keep player names clear and unique.
- In paired mode, choose themes with closely related words for better bluffing.
- Use custom setup for inside jokes, events, or classroom/team sessions.
- Rotate who starts speaking each round.

## Run Locally (Developer)

From repository root:

```bash
pnpm install
pnpm --filter @workspace/imposter-game run dev
```

Build website:

```bash
pnpm --filter @workspace/imposter-game run build
```

## Tech Notes

- Frontend: React + TypeScript + Vite
- State/data persistence: browser localStorage
- Designed for mobile-friendly, pass-the-phone gameplay
