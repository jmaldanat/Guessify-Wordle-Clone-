
import { WORDS } from "./words.js"; // Import the list of possible words from words.js

// ** Variables Initialization **//

const NUMBER_OF_GUESSES = 6; // Set the maximum number of guesses allowed
let guessesRemaining = NUMBER_OF_GUESSES; // Track how many guesses the player has left
let currentGuess = []; // Store the current guess as an array of letters
let nextLetter = 0; // Track the position of the next letter to be entered
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]; // Randomly select the correct word from the list of words
console.log(rightGuessString); // Log the correct word to the console (for debugging)

// ** Function to create the gameboard **//

function initBoard() { // Function to initialize the game board

    let board = document.getElementById("game-board");// Get the game board element from the DOM

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {// Loop through the number of guesses (rows)
        let row = document.createElement("div")// Create a new div for each row
        row.className = "letter-row"// Assign the class "letter-row" to the row

        for (let j = 0; j < 5; j++) {// Loop to create 5 letter boxes for each row
            let box = document.createElement("div")// Create a new div for each letter box
            box.className = "letter-box"// Assign the class "letter-box" to the box
            row.appendChild(box)// Add the letter box to the current row
        }

        board.appendChild(row)// Add the completed row to the game board
    }
}

initBoard()// Call the function to initialize the board when the script runs