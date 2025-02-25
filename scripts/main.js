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

  function resetGame() {
    expectedLetter = 'A'; // Reset to 'A'
    letters = [...alphabet]; // Reset to all 26 letters
    for (let i = 26; i < totalCells; i++) {
        letters.push(generateRandomLetter()); // Add random extras
    }
    shuffle(letters); 
    const buttons = gridContainer.querySelectorAll('.grid-item');
    buttons.forEach((button, idx) => {
        button.textContent = letters[idx]; // Update text
        button.style.backgroundColor = ''; // Clear color
        button.style.color = ''; // Clear color
    });
  }

  // Gameplay
  const gameMode = localStorage.getItem('gameMode') || 'normal';
  let expectedLetter = 'A'; // Start with 'A'

  gridContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const userChoice = event.target.textContent;
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
                    }
                });
            }
            if (expectedLetter === 'Z') {
                localStorage.setItem('hasWon', 'true');
                if (confirm('You Win! Play again?')) {
                    resetGame();
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                expectedLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
                if (gameMode === 'hard') shuffleBoard(gridContainer);
            }
        } else {
            localStorage.setItem('hasLost', 'true');
            if (confirm('You Lose! Play again?')) {
                resetGame();
            } else {
                window.location.href = 'index.html';
            }
        }
    }
  });
}

createLetterGrid(6);