export type WordPair = { wordA: string; wordB: string };

export type Theme = {
  id: string;
  name: string;
  pairs: WordPair[];
  isCustom?: boolean;
};

export const PREBUILT_THEMES: Theme[] = [
  {
    id: "food",
    name: "Food",
    pairs: [
      { wordA: "Pizza", wordB: "Burger" },
      { wordA: "Milk", wordB: "Juice" },
      { wordA: "Cake", wordB: "Muffin" },
      { wordA: "Sushi", wordB: "Tacos" },
      { wordA: "Apple", wordB: "Pear" },
    ],
  },
  {
    id: "animals",
    name: "Animals",
    pairs: [
      { wordA: "Dog", wordB: "Wolf" },
      { wordA: "Cat", wordB: "Tiger" },
      { wordA: "Dolphin", wordB: "Shark" },
      { wordA: "Eagle", wordB: "Hawk" },
      { wordA: "Rabbit", wordB: "Hare" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    pairs: [
      { wordA: "Tennis", wordB: "Badminton" },
      { wordA: "Soccer", wordB: "Rugby" },
      { wordA: "Swimming", wordB: "Diving" },
      { wordA: "Boxing", wordB: "Wrestling" },
      { wordA: "Cycling", wordB: "Running" },
    ],
  },
  {
    id: "movies",
    name: "Movies",
    pairs: [
      { wordA: "Horror", wordB: "Thriller" },
      { wordA: "Comedy", wordB: "Romance" },
      { wordA: "Sci-Fi", wordB: "Fantasy" },
      { wordA: "Action", wordB: "Adventure" },
      { wordA: "Drama", wordB: "Mystery" },
    ],
  },
  {
    id: "cities",
    name: "Cities",
    pairs: [
      { wordA: "Paris", wordB: "Rome" },
      { wordA: "Tokyo", wordB: "Seoul" },
      { wordA: "New York", wordB: "Chicago" },
      { wordA: "London", wordB: "Manchester" },
      { wordA: "Sydney", wordB: "Melbourne" },
    ],
  },
];

const STORAGE_KEY = "imposter-game-custom-themes";

export function loadCustomThemes(): Theme[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Theme[];
  } catch (e) {
    console.error("Failed to load custom themes", e);
    return [];
  }
}

export function saveCustomThemes(themes: Theme[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch (e) {
    console.error("Failed to save custom themes", e);
  }
}

export function getAllThemes(): Theme[] {
  return [...PREBUILT_THEMES, ...loadCustomThemes()];
}
