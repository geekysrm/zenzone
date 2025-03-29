
/**
 * Generates a random two-word name for new users
 * Format: AdjectiveNoun (e.g., "BrilliantFox", "QuickDolphin")
 */

const adjectives = [
  "Amazing", "Brave", "Bright", "Calm", "Clever", 
  "Cool", "Creative", "Curious", "Eager", "Friendly",
  "Gentle", "Happy", "Honest", "Kind", "Lively",
  "Lucky", "Polite", "Proud", "Quick", "Quiet",
  "Smart", "Strong", "Talented", "Thoughtful", "Wise"
];

const nouns = [
  "Bear", "Bird", "Dolphin", "Eagle", "Falcon",
  "Fox", "Koala", "Lion", "Owl", "Panda",
  "Panther", "Penguin", "Phoenix", "Rabbit", "Raccoon",
  "Shark", "Tiger", "Turtle", "Whale", "Wolf"
];

export const generateRandomName = (): string => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}`;
};
