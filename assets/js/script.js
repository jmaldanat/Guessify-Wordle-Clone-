
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

// ** Arrow function to accept user input **//

document.addEventListener("keyup", (e) => { // Listen for keyup events on the whole document

    if (guessesRemaining === 0) { // If no guesses are left, do nothing
        return
    }

    let pressedKey = String(e.key) // Get the key pressed as a string
    if (pressedKey === "Backspace" && nextLetter !== 0) { // If Backspace is pressed and there are letters to delete
        deleteLetter() // Call function to delete the last letter
        return
    }

    if (pressedKey === "Enter") { // If Enter is pressed
        checkGuess() // Call function to check the current guess
        return
    }

    let found = pressedKey.match(/[a-z]/gi) // Check with RegEx if the pressed key is a letter (case-insensitive)
    if (!found || found.length > 1) { // If not a single letter, ignore the input
        return
    } else {
        insertLetter(pressedKey) // Otherwise, insert the letter into the current guess
    }
})

// ** Function for inserting letters **//

function insertLetter (pressedKey) {
    if (nextLetter === 5) { // If already 5 letters in the current guess, do nothing
        return
    }
    pressedKey = pressedKey.toLowerCase() // Convert the pressed key to lowercase

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining] // Get the current row based on guesses left
    let box = row.children[nextLetter] // Get the next letter box in the row
    box.textContent = pressedKey // Display the pressed letter in the box
    box.classList.add("filled-box") // Add a class to style the filled box
    currentGuess.push(pressedKey) // Add the letter to the current guess array
    nextLetter += 1 // Move to the next letter position
}

// ** Function for deleting letters **//

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining] // Get the current row based on guesses left
    let box = row.children[nextLetter - 1] // Get the last filled letter box in the row
    box.textContent = "" // Clear the letter from the box
    box.classList.remove("filled-box") // Remove the filled style from the box
    currentGuess.pop() // Remove the last letter from the current guess array
    nextLetter -= 1 // Move back one position for the next letter
}

// ** Function to check the current guess **//

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining] // Get the current row based on guesses left
    let guessString = '' // Initialize an empty string to build the guess
    let rightGuess = Array.from(rightGuessString) // Convert the correct word to an array

    for (const val of currentGuess) { // Loop through each letter in the current guess
        guessString += val // Add each letter to the guess string
    }

    if (guessString.length != 5) { // If the guess is not 5 letters
        alert("Not enough letters!") // Alert the user
        return // Stop further execution
    }

    if (!WORDS.includes(guessString)) { // If the guess is not a valid word
        alert("Word not in list!") // Alert the user
        return // Stop further execution
    }

    // Loop through each letter in the guess to check correctness
    for (let i = 0; i < 5; i++) {
        let letterColor = '' // Variable to store the color for the letter
        let box = row.children[i] // Get the current letter box in the row
        let letter = currentGuess[i] // Get the current letter

        let letterPosition = rightGuess.indexOf(currentGuess[i]) // Find the position of the letter in the correct word
        // Check if the letter is in the correct word
        if (letterPosition === -1) {
            letterColor = 'grey' // Letter is not in the word
        } else {
            // Letter is in the word
            // Check if the letter is in the correct position
            if (currentGuess[i] === rightGuess[i]) {
                // Letter is in the correct position
                letterColor = 'green' // Color the box green
            } else {
                // Letter is in the word but wrong position
                letterColor = 'yellow' // Color the box yellow
            }

            rightGuess[letterPosition] = "#" // Mark this letter as used
        }

        let delay = 250 * i // Set a delay for the animation
        setTimeout(()=> {
            // Shade the box with the correct color after the delay
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor) // Also shade the keyboard button
        }, delay)
    }

    if (guessString === rightGuessString) { // If the guess matches the correct word
        alert("You guessed right! Game over!") // Alert the user
        guessesRemaining = 0 // Set guesses remaining to 0 to end the game
        return // Stop further execution
    } else {
        guessesRemaining -= 1; // Decrease the number of guesses remaining
        currentGuess = []; // Reset the current guess array
        nextLetter = 0; // Reset the next letter position

        if (guessesRemaining === 0) { // If no guesses are left
            alert("You've run out of guesses! Game over!") // Alert the user
            alert(`The right word was: "${rightGuessString}"`) // Show the correct word
        }
    }
}

initBoard()// Call the function to initialize the board when the script runs