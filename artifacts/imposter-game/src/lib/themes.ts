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
      { wordA: "Pasta", wordB: "Noodles" },
      { wordA: "Steak", wordB: "Lamb Chop" },
      { wordA: "Salmon", wordB: "Tuna" },
      { wordA: "Croissant", wordB: "Bagel" },
      { wordA: "Pancakes", wordB: "Waffles" },
      { wordA: "Burrito", wordB: "Wrap" },
      { wordA: "Ice Cream", wordB: "Gelato" },
      { wordA: "Fries", wordB: "Chips" },
      { wordA: "Fried Chicken", wordB: "Chicken Wings" },
      { wordA: "Brownie", wordB: "Cookie" },
      { wordA: "Milkshake", wordB: "Smoothie" },
      { wordA: "Coffee", wordB: "Tea" },
      { wordA: "Beer", wordB: "Cider" },
      { wordA: "Wine", wordB: "Champagne" },
      { wordA: "Lemonade", wordB: "Iced Tea" },
      { wordA: "Curry", wordB: "Stir Fry" },
      { wordA: "Omelette", wordB: "Scrambled Eggs" },
      { wordA: "Peanut Butter", wordB: "Nutella" },
      { wordA: "Ketchup", wordB: "Mustard" },
      { wordA: "Strawberry", wordB: "Raspberry" },
      { wordA: "Blueberry", wordB: "Blackberry" },
      { wordA: "Pineapple", wordB: "Coconut" },
      { wordA: "Lemon", wordB: "Lime" },
      { wordA: "Corn", wordB: "Peas" },
      { wordA: "Scone", wordB: "Crumpet" },
      { wordA: "Pretzel", wordB: "Breadstick" },
      { wordA: "Naan", wordB: "Chapati" },
      { wordA: "Falafel", wordB: "Shawarma" },
      { wordA: "Custard", wordB: "Pudding" },
      { wordA: "Butter", wordB: "Margarine" },
      { wordA: "Espresso", wordB: "Americano" },
      { wordA: "Latte", wordB: "Cappuccino" },
      { wordA: "Hot Chocolate", wordB: "Chai" },
      { wordA: "Sparkling Water", wordB: "Coconut Water" },{ wordA: "Pizza", wordB: "Pasta" },
      { wordA: "Burger", wordB: "Fries" },
      { wordA: "Sushi", wordB: "Ramen" },
      { wordA: "Rice", wordB: "Curry" },
      { wordA: "Bread", wordB: "Butter" },
      { wordA: "Chicken", wordB: "Rice" },
      { wordA: "Steak", wordB: "Potatoes" },
      { wordA: "Fish", wordB: "Chips" },
      { wordA: "Taco", wordB: "Burrito" },
      { wordA: "Donut", wordB: "Coffee" },
      { wordA: "Cereal", wordB: "Milk" },
      { wordA: "Waffle", wordB: "Ice Cream" },
      { wordA: "Grapes", wordB: "Wine" },
      { wordA: "Tomato", wordB: "Cucumber" },
      { wordA: "Carrot", wordB: "Peas" },
      { wordA: "Beans", wordB: "Rice" },
      { wordA: "Chocolate", wordB: "Biscuit" },
      { wordA: "Cake", wordB: "Icing" },
      { wordA: "Cookie", wordB: "Milk" },
      { wordA: "Chips", wordB: "Dip" },
      { wordA: "Popcorn", wordB: "Soda" },
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
      { wordA: "Lion", wordB: "Cheetah" },
      { wordA: "Elephant", wordB: "Rhinoceros" },
      { wordA: "Gorilla", wordB: "Chimpanzee" },
      { wordA: "Crocodile", wordB: "Alligator" },
      { wordA: "Frog", wordB: "Toad" },
      { wordA: "Butterfly", wordB: "Moth" },
      { wordA: "Bee", wordB: "Wasp" },
      { wordA: "Spider", wordB: "Scorpion" },
      { wordA: "Snake", wordB: "Lizard" },
      { wordA: "Turtle", wordB: "Tortoise" },
      { wordA: "Parrot", wordB: "Macaw" },
      { wordA: "Penguin", wordB: "Flammingo" },
      { wordA: "Owl", wordB: "Bat" },
      { wordA: "Moose", wordB: "Reindeer" },
      { wordA: "Bear", wordB: "Panda" },
      { wordA: "Polar Bear", wordB: "Grizzly Bear" },
      { wordA: "Zebra", wordB: "Horse" },
      { wordA: "Donkey", wordB: "Mule" },
      { wordA: "Camel", wordB: "Llama" },
      { wordA: "Octopus", wordB: "Squid" },
      { wordA: "Crab", wordB: "Lobster" },
      { wordA: "Hamster", wordB: "Guinea Pig" },
      { wordA: "Hedgehog", wordB: "Porcupine" },
      { wordA: "Squirrel", wordB: "Chipmunk" },
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
      { wordA: "Basketball", wordB: "Netball" },
      { wordA: "Baseball", wordB: "Softball" },
      { wordA: "Cricket", wordB: "Rounders" },
      { wordA: "Golf", wordB: "Disc Golf" },
      { wordA: "Volleyball", wordB: "Beach Volleyball" },
      { wordA: "Table Tennis", wordB: "Squash" },
      { wordA: "Archery", wordB: "Darts" },
    ],
  },
  {
  id: "movies",
  name: "Movies",
  pairs: [
    // Genres
    { wordA: "Horror", wordB: "Thriller" },
    { wordA: "Comedy", wordB: "Romance" },
    { wordA: "Action", wordB: "Adventure" },
    { wordA: "Sci-Fi", wordB: "Fantasy" },
    { wordA: "Drama", wordB: "Mystery" },
    { wordA: "Crime", wordB: "Detective" },
    { wordA: "War", wordB: "History" },
    { wordA: "Superhero", wordB: "Animation" },
    { wordA: "Musical", wordB: "Family" },
    { wordA: "Zombie", wordB: "Vampire" },

    // Concepts
    { wordA: "Sequel", wordB: "Prequel" },
    { wordA: "Remake", wordB: "Reboot" },
    { wordA: "Hero", wordB: "Villain" },
    { wordA: "Alien", wordB: "Robot" },
    { wordA: "Space", wordB: "Earth" },
    { wordA: "Future", wordB: "Past" },
    { wordA: "Magic", wordB: "Science" },
    { wordA: "School", wordB: "College" },
    { wordA: "Police", wordB: "Gangster" },

    // Big franchises
    { wordA: "Harry Potter", wordB: "Lord of the Rings" },
    { wordA: "Star Wars", wordB: "Star Trek" },
    { wordA: "Avengers", wordB: "Justice League" },
    { wordA: "Batman", wordB: "Spider-Man" },
    { wordA: "Frozen", wordB: "Moana" },
    { wordA: "Toy Story", wordB: "Shrek" },
    { wordA: "Cars", wordB: "Planes" },
    { wordA: "Jaws", wordB: "Jurassic Park" },
    { wordA: "Titanic", wordB: "Avatar" },
    { wordA: "The Lion King", wordB: "Finding Nemo" },

    // Popular films
    { wordA: "Home Alone", wordB: "Home Alone 2" },
    { wordA: "The Matrix", wordB: "Inception" },
    { wordA: "Mission Impossible", wordB: "James Bond" },
    { wordA: "The Hunger Games", wordB: "Maze Runner" },
    { wordA: "Twilight", wordB: "Vampire Diaries" },
    { wordA: "Minions", wordB: "Despicable Me" },
    { wordA: "Kung Fu Panda", wordB: "How to Train Your Dragon" },
    { wordA: "Deadpool", wordB: "Venom" },
    { wordA: "Black Panther", wordB: "Thor" },

    // MORE (new additions)

    // Disney / animation
    { wordA: "Aladdin", wordB: "Hercules" },
    { wordA: "Cinderella", wordB: "Snow White" },
    { wordA: "Rapunzel", wordB: "Brave" },
    { wordA: "Inside Out", wordB: "Up" },
    { wordA: "Coco", wordB: "Encanto" },
    { wordA: "Monsters Inc", wordB: "The Incredibles" },

    // Action / blockbuster
    { wordA: "John Wick", wordB: "Blade Runner" },
    
    // Sci-fi / fantasy
    { wordA: "Interstellar", wordB: "Matrix" },
    { wordA: "Doctor Strange", wordB: "Spiderman" },
    { wordA: "Dune", wordB: "Star Wars" },
    { wordA: "E.T.", wordB: "Alien" },

    // Misc recognisable
    { wordA: "Rocky", wordB: "Rocky 2" },
    { wordA: "Karate Kid", wordB: "Cobra Kai" },
    { wordA: "Indiana Jones", wordB: "Uncharted" },
    { wordA: "Pirates of the Caribbean", wordB: "Peter Pan" },
    { wordA: "Sherlock Holmes", wordB: "Enola Holmes" },
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
      { wordA: "Berlin", wordB: "Vienna" },
      { wordA: "Madrid", wordB: "Barcelona" },
      { wordA: "Amsterdam", wordB: "Brussels" },
      { wordA: "Dubai", wordB: "Abu Dhabi" },
      { wordA: "Singapore", wordB: "Hong Kong" },
      { wordA: "Shanghai", wordB: "Beijing" },
      { wordA: "Mumbai", wordB: "Delhi" },
      { wordA: "Mexico City", wordB: "Guadalajara" },
      { wordA: "Los Angeles", wordB: "San Francisco" },
      { wordA: "Cairo", wordB: "Marrakesh" },
      { wordA: "Istanbul", wordB: "Ankara" },
      { wordA: "Stockholm", wordB: "Copenhagen" },
      { wordA: "Oslo", wordB: "Helsinki" },
      { wordA: "Zurich", wordB: "Geneva" },
      { wordA: "Milan", wordB: "Naples" },
      { wordA: "Florence", wordB: "Venice" },
      { wordA: "Moscow", wordB: "St Petersburg" },
      { wordA: "Tehran", wordB: "Baghdad" },
      { wordA: "Tel Aviv", wordB: "Jerusalem" },
      { wordA: "Riyadh", wordB: "Doha" },
      { wordA: "Kuwait City", wordB: "Abu Dhabi" },
      { wordA: "Karachi", wordB: "Lahore" },
      { wordA: "Kathmandu", wordB: "Thimphu" },
      { wordA: "Bangkok", wordB: "Kuala Lumpur" },
      { wordA: "Taipei", wordB: "Osaka" },
      { wordA: "Kyoto", wordB: "Hiroshima" },
      { wordA: "Phoenix", wordB: "Las Vegas" },
      { wordA: "New Orleans", wordB: "Nashville" },
      { wordA: "Edinburgh", wordB: "Glasgow" },
      { wordA: "Dublin", wordB: "Belfast" },
      { wordA: "Cardiff", wordB: "Bristol" },
      { wordA: "Leeds", wordB: "Birmingham" },
      { wordA: "Liverpool", wordB: "Sheffield" },
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
