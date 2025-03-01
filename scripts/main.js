function generateRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleBoard(gridContainer) {
    // Get all buttons
    const buttons = Array.from(gridContainer.querySelectorAll('.grid-item'));
    if (buttons.length === 0) {
        console.error('No grid-item buttons found in gridContainer');
        return;
    }
    // Store current styles and text
    const buttonStates = buttons.map(button => ({
        text: button.textContent,
        backgroundColor: button.style.backgroundColor,
        color: button.style.color
    }));
    shuffle(buttonStates);
    buttons.forEach((button, index) => {  // Apply shuffled states back to buttons
        button.textContent = buttonStates[index].text;
        button.style.backgroundColor = buttonStates[index].backgroundColor;
        button.style.color = buttonStates[index].color;
    });
}

// Custom modal function that returns a Promise
function showModal(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('game-modal');
        const modalMessage = document.getElementById('modal-message');
        const yesButton = document.getElementById('modal-yes');
        const cancelButton = document.getElementById('modal-cancel');

        // Set the message
        modalMessage.textContent = message;

        // Show the modal
        modal.style.display = 'flex';

        // Event listeners for buttons
        const onYes = () => {
            modal.style.display = 'none';
            yesButton.removeEventListener('click', onYes);
            cancelButton.removeEventListener('click', onCancel);
            resolve(true); // Resolve with true (play again)
        };

        const onCancel = () => {
            modal.style.display = 'none';
            yesButton.removeEventListener('click', onYes);
            cancelButton.removeEventListener('click', onCancel);
            resolve(false); // Resolve with false (return to menu)
        };

        yesButton.addEventListener('click', onYes);
        cancelButton.addEventListener('click', onCancel);
    });
}

function createLetterGrid(gridSize) {
  const totalCells = gridSize * gridSize;
  if (totalCells < 26) {
      console.error("Grid size too small to include all 26 letters.");
      return;
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  let letters = [...alphabet]; // start with all 26 letters
  for (let i = 26; i < totalCells; i++) {
      letters.push(generateRandomLetter()); // Add random extras
  }
  shuffle(letters); // randomize positions

  // Create grid:
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 0fr)`; 

  let index = 0;
  const buttons = [];
  // Define base sizes (matching CSS)
  const BASE_FONT_SIZE = 100; // 100% (in percentage)
  const BASE_DIMENSION = 60; // 60px (in pixels)
  for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
          const letterButton = document.createElement("button");
          letterButton.classList.add("grid-item");
          letterButton.textContent = letters[index];
          gridContainer.appendChild(letterButton);
          buttons.push(letterButton); // Store buttons for later use
          index++;
      }
  }

    const gridWrapper = document.createElement("div");
    gridWrapper.classList.add("grid-wrapper");
    // Append the gridContainer to the wrapper
    gridWrapper.appendChild(gridContainer);
    // Append the wrapper to the body
    document.body.appendChild(gridWrapper);

    let sizeMultiplier = 1; // Start with original size (100%)
    let startTime = Date.now();
    let timerInterval = null;
    let elapsedTime = 0;
    let isTimerRunning = false;

    function startTimer() {
        if (!isTimerRunning) {
            startTime = Date.now() - elapsedTime * 1000; // Adjust for elapsed time if paused
            timerInterval = setInterval(updateTimer, 1000);
            isTimerRunning = true;
        }
    }

    function stopTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            isTimerRunning = false;
        }
    }

    function updateTimer() {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function getFormattedTime() {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = '00:00';
    }

  function resetGame() {
    expectedLetter = 'A'; // Reset to 'A'
    sizeMultiplier = 1; // Reset size multiplier
    letters = [...alphabet]; // Reset to all 26 letters
    for (let i = 26; i < totalCells; i++) {
        letters.push(generateRandomLetter()); // Add random extras
    }
    shuffle(letters); 
    buttons.forEach((button, idx) => {
        button.textContent = letters[idx]; // Update text
        button.style.backgroundColor = ''; // Clear color
        button.style.color = ''; // Clear color
        updateButtonSizes(); // Reset sizes
    });
    resetTimer();
    startTimer();
  }

  function updateButtonSizes() {
    // Clamp sizeMultiplier to prevent buttons from becoming too small
    sizeMultiplier = Math.max(sizeMultiplier, 0.5); // Minimum 50% of original size
    buttons.forEach(button => {
        button.style.fontSize = `${BASE_FONT_SIZE * sizeMultiplier}%`;
        button.style.minWidth = `${BASE_DIMENSION * sizeMultiplier}px`;
        button.style.minHeight = `${BASE_DIMENSION * sizeMultiplier}px`;
    });
  }

  function increaseButtonSizes() {
    sizeMultiplier += 0.05; // Increase by 5%
    updateButtonSizes();
  }

  function decreaseButtonSizes() {
    sizeMultiplier -= 0.02; // Decrease by 2%
    updateButtonSizes();
  }

  // Gameplay
  const gameMode = localStorage.getItem('gameMode') || 'normal';
  let expectedLetter = 'A'; // Start with 'A'

  // Start the timer when the game begins
  startTimer();

  gridContainer.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const userChoice = event.target.textContent;
         event.target.classList.add('bounce'); 

        if (userChoice === expectedLetter) {
            if (gameMode !== 'hard') { // Normal or Easy: highlight clicked letter
                event.target.style.backgroundColor = 'green';
                event.target.style.color = 'white';
            }
            if (gameMode === 'easy') { // Highlight duplicates of the clicked letter in Easy Mode
                buttons.forEach(button => {
                    if (button.textContent === userChoice) {
                        button.style.backgroundColor = 'green';
                        button.style.color = 'white';
                        button.classList.add('bounce'); // Apply animation to duplicates in Easy Mode
                    }
                });
                increaseButtonSizes(); // Increase size of all buttons in Easy Mode

                const nextLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
                if (nextLetter <= 'Z') {
                    buttons.forEach(button => {
                        if (button.textContent === nextLetter) {
                            button.classList.add('rumble');
                        }
                    });
                }
            }
            if (expectedLetter === 'Z') {
                stopTimer();
                localStorage.setItem('hasWon', 'true');
                const finalTime = getFormattedTime();
                const playAgain = await showModal(`You Win! Time: ${finalTime}`);
                if (playAgain) {
                    resetGame();
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                expectedLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
                if (gameMode === 'hard') {
                    shuffleBoard(gridContainer);
                    decreaseButtonSizes();
                
                    const randomLetters = new Set();
                    const nextLetter = String.fromCharCode(expectedLetter.charCodeAt(0));
                    while (randomLetters.size < 3) { // Generate 3 unique random letters
                        const randomCharCode = Math.floor(Math.random() * 26) + 65;
                        const randomLetter = String.fromCharCode(randomCharCode);
                        if (randomLetter !== nextLetter) {
                            randomLetters.add(randomLetter);
                        }
                    }
                
                    buttons.forEach(button => {
                        if (randomLetters.has(button.textContent)) {
                            button.classList.add('distract');
                        }
                    });
                }       
            }
        } else {
            stopTimer();
            localStorage.setItem('hasLost', 'true');
            const finalTime = getFormattedTime();
            const playAgain = await showModal(`You Lose! Time: ${finalTime}`);
                if (playAgain) {
                    resetGame();
            } else {
                window.location.href = 'index.html';
            }
        }
    }
  });
}

createLetterGrid(6);