
import { WORDS } from "./words"; // Import the list of possible words from words.js

const NUMBER_OF_GUESSES = 6; // Set the maximum number of guesses allowed
let guessesRemaining = NUMBER_OF_GUESSES; // Track how many guesses the player has left
let currentGuess = []; // Store the current guess as an array of letters
let nextLetter = 0; // Track the position of the next letter to be entered
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]; // Randomly select the correct word from the list of words
console.log(rightGuessString); // Log the correct word to the console (for debugging)