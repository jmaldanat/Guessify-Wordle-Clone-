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
    let rightGuess = Array.from(rightGuessString); // Convert the correct word to an array of letters

    for (const val of currentGuess) {
        guessString += val; // Build the guess string from the current guess array
    }

    if (guessString.length != 5) { // If the guess is not 5 letters
        alert("Not enough letters!"); // Alert the user
        return; // Stop further execution
    }

    if (!WORDS.includes(guessString)) { // If the guess is not in the word list
        alert("Word not in list!"); // Alert the user
        return; // Stop further execution
    }

    let letterColors = Array(5).fill('grey'); // Initialize all letter colors as grey
    let rightGuessCopy = Array.from(rightGuess); // Make a copy of the correct word array

    // First pass: check for correct letters in the correct position (green)
    for (let i = 0; i < 5; i++) {
        if (currentGuess[i] === rightGuess[i]) { // If the letter matches in the correct position
            letterColors[i] = 'green'; // Set color to green
            rightGuessCopy[i] = null; // Remove the matched letter from the copy
        }
    }

    // Second pass: check for correct letters in the wrong position (yellow)
    for (let i = 0; i < 5; i++) {
        if (letterColors[i] !== 'green') { // If not already marked green
            let letterIndex = rightGuessCopy.indexOf(currentGuess[i]); // Find the letter in the copy
            if (letterIndex !== -1) { // If found
                letterColors[i] = 'yellow'; // Set color to yellow
                rightGuessCopy[letterIndex] = null; // Remove the matched letter from the copy
            }
        }
    }

    // Animate the coloring of the boxes and shade the keyboard
    for (let i = 0; i < 5; i++) {
        let box = row.children[i]; // Get the box for this letter
        let letter = currentGuess[i]; // Get the letter
        let delay = 250 * i; // Set a delay for animation
        setTimeout(() => {
            box.style.backgroundColor = letterColors[i]; // Set the box background color
            shadeKeyBoard(letter, letterColors[i]); // Shade the keyboard button
        }, delay);
    }

    if (guessString === rightGuessString) { // If the guess matches the correct word
        setTimeout(() => {
            showWinModal(rightGuessString); // Show the win modal
        }, 1500);
        guessesRemaining = 0; // Set guesses remaining to 0 to end the game
        return; // Stop further execution
    } else {
        guessesRemaining -= 1; // Decrement the guesses remaining
        currentGuess = []; // Reset the current guess array
        nextLetter = 0; // Reset the next letter index

        if (guessesRemaining === 0) { // If no guesses are left
            setTimeout(() => {
                showLoseModal(rightGuessString); // Show the lose modal
            }, 1500);
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
const modal = document.getElementById("how-to-play-modal"); // Get the "how to play" modal element
const howToPlayBtn = document.getElementById("how-to-play-btn"); // Get the button that opens the modal
const closeBtn = document.querySelector(".close-btn"); // Get the close button inside the modal

// Open modal when button is clicked
howToPlayBtn.addEventListener("click", () => { // When the "how to play" button is clicked
    modal.style.display = "block"; // Show the modal
});

// Close modal when X is clicked
closeBtn.addEventListener("click", () => { // When the close button is clicked
    modal.style.display = "none"; // Hide the modal
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => { // Listen for clicks anywhere on the window
    if (e.target === modal) { // If the click is on the modal background (not the content)
        modal.style.display = "none"; // Hide the modal
    }
});

// Dark Mode Toggle
const darkModeBtn = document.getElementById("dark-mode-btn"); // Get the dark mode toggle button

darkModeBtn.addEventListener("click", () => { // When the dark mode button is clicked
    document.body.classList.toggle("dark-mode"); // Toggle the dark mode class on the body
    if (document.body.classList.contains("dark-mode")) { // If dark mode is active
        darkModeBtn.textContent = "☀️ Light Mode"; // Change button text to light mode
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode"; // Otherwise, set text to dark mode
    }
    darkModeBtn.blur(); // Remove focus from the button to prevent accidental toggling with Enter
});

initBoard() // Call the function to initialize the board when the script runs

// Lose Modal Elements
const loseModal = document.getElementById("lose-modal"); // Get the lose modal element
const loseMessage = document.getElementById("lose-message"); // Get the element to display the lose message
const loseCloseBtn = document.getElementById("lose-close-btn"); // Get the close button for the lose modal

// Show lose modal and refresh page after close
function showLoseModal(word) {
    loseMessage.textContent = `The correct word was: "${word.toUpperCase()}"`; // Set the lose message with the correct word in uppercase
    loseModal.style.display = "block"; // Show the lose modal
    // Refresh page after closing the modal
    function closeAndRefresh() {
        loseModal.style.display = "none"; // Hide the lose modal
        window.location.reload(); // Reload the page to restart the game
    }
    loseCloseBtn.onclick = closeAndRefresh; // When the close button is clicked, close modal and refresh
    window.onclick = function(event) { // When anywhere on the window is clicked
        if (event.target === loseModal) { // If the click was outside the modal content (on the modal background)
            closeAndRefresh(); // Close modal and refresh
        }
    };
}

// Win Modal Elements
const winModal = document.createElement("div"); // Create a new div for the win modal
winModal.id = "win-modal"; // Set the id for the win modal
winModal.className = "modal"; // Set the class for modal styling
winModal.innerHTML = `
    <div class="modal-content">
        <span id="win-close-btn" class="close-btn">&times;</span>
        <h2>Congratulations!</h2>
        <p id="win-message"></p>
    </div>
`; // Set the inner HTML for the modal content
document.body.appendChild(winModal); // Add the win modal to the body of the document
const winMessage = document.getElementById("win-message"); // Get the element to display the win message
const winCloseBtn = document.getElementById("win-close-btn"); // Get the close button for the win modal

// Show win modal and refresh page after close
function showWinModal(word) {
    winMessage.textContent = `You guessed right! The word was: "${word.toUpperCase()}"`; // Set the win message with the correct word in uppercase
    winModal.style.display = "block"; // Show the win modal
    function closeAndRefresh() {
        winModal.style.display = "none"; // Hide the win modal
        window.location.reload(); // Reload the page to restart the game
    }
    winCloseBtn.onclick = closeAndRefresh; // When the close button is clicked, close modal and refresh
    window.onclick = function(event) { // When anywhere on the window is clicked
        if (event.target === winModal) { // If the click was outside the modal content (on the modal background)
            closeAndRefresh(); // Close modal and refresh
        }
    };
}