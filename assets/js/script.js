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
    if ((pressedKey === "Backspace" || pressedKey === "Delete") && nextLetter !== 0) { // If Backspace or Delete is pressed and there are letters to delete
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
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]; // Get the current row based on guesses left
    let guessString = ''; // Initialize an empty string to build the guess
    let rightGuess = Array.from(rightGuessString); // Convert the correct word to an array

    for (const val of currentGuess) { // Loop through each letter in the current guess
        guessString += val; // Add each letter to the guess string
    }

    if (guessString.length != 5) { // If the guess is not 5 letters
        alert("Not enough letters!"); // Alert the user
        return; // Stop further execution
    }

    if (!WORDS.includes(guessString)) { // If the guess is not a valid word
        alert("Word not in list!"); // Alert the user
        return; // Stop further execution
    }

    // --- NEW LOGIC TO PRIORITIZE GREENS OVER YELLOWS ---
    let letterColors = Array(5).fill('grey'); // Initialize all colors as grey
    let rightGuessCopy = Array.from(rightGuess); // Copy of the correct word array to track used letters

    // First pass: mark greens (correct letter and position)
    for (let i = 0; i < 5; i++) {
        if (currentGuess[i] === rightGuess[i]) {
            letterColors[i] = 'green'; // Mark as green
            rightGuessCopy[i] = null; // Mark this letter as used
        }
    }

    // Second pass: mark yellows (correct letter, wrong position)
    for (let i = 0; i < 5; i++) {
        if (letterColors[i] !== 'green') { // Only check non-green positions
            let letterIndex = rightGuessCopy.indexOf(currentGuess[i]); // Find the letter in the remaining letters
            if (letterIndex !== -1) {
                letterColors[i] = 'yellow'; // Mark as yellow
                rightGuessCopy[letterIndex] = null; // Mark this letter as used
            }
        }
    }

    // Show colors with animation
    for (let i = 0; i < 5; i++) {
        let box = row.children[i]; // Get the box for this letter
        let letter = currentGuess[i]; // Get the letter
        let delay = 250 * i; // Set a delay for the animation
        setTimeout(() => {
            box.style.backgroundColor = letterColors[i]; // Set the box color
            shadeKeyBoard(letter, letterColors[i]); // Shade the keyboard button
        }, delay);
    }

    if (guessString === rightGuessString) { // If the guess matches the correct word
        alert("You guessed right! Game over!"); // Alert the user
        guessesRemaining = 0; // Set guesses remaining to 0 to end the game
        return; // Stop further execution
    } else {
        guessesRemaining -= 1; // Decrease the number of guesses remaining
        currentGuess = []; // Reset the current guess array
        nextLetter = 0; // Reset the next letter position

        if (guessesRemaining === 0) { // If no guesses are left
            alert("You've run out of guesses! Game over!"); // Alert the user
            alert(`The right word was: "${rightGuessString}"`); // Show the correct word
        }
    }
}

// ** Function to shade the keyboard buttons **//

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) { // Loop through all keyboard buttons
        if (elem.textContent === letter) { // If the button's text matches the letter
            let oldColor = elem.style.backgroundColor // Get the current background color of the button
            if (oldColor === 'green') { // If it's already green, don't overwrite
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') { // If it's yellow and not upgrading to green, don't overwrite
                return
            }

            elem.style.backgroundColor = color // Set the button's background color
            break // Stop looping after updating the correct button
        }
    }
}

// ** Function to Generate Input On-screen Keyboard **//

document.getElementById("keyboard-cont").addEventListener("click", (e) => { // Add a click event listener to the keyboard container
    const target = e.target // Get the element that was clicked

    if (!target.classList.contains("keyboard-button")) { // If the clicked element is not a keyboard button, do nothing
        return
    }
    let key = target.textContent // Get the text content of the clicked button

    if (key === "Del") { // If the button is the delete key
        key = "Backspace" // Change it to "Backspace" to match keyboard event
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key})) // Simulate a keyup event with the corresponding key
})

// ** How to Play Modal Functions **//
// Get modal elements
const modal = document.getElementById("how-to-play-modal");
const howToPlayBtn = document.getElementById("how-to-play-btn");
const closeBtn = document.querySelector(".close-btn");

// Open modal when button is clicked
howToPlayBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Close modal when X is clicked
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Dark Mode Toggle
const darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }
    darkModeBtn.blur(); // Quita el foco para evitar el toggle accidental con Enter
});

initBoard()// Call the function to initialize the board when the script runs