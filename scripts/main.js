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

function createLetterGrid(gridSize) {
  const totalCells = gridSize * gridSize;
  if (totalCells < 26) {
      console.error("Grid size too small to include all 26 letters.");
      return;
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  let letters = [...alphabet]; // start with all 26 letters
  for (let i = 26; i < totalCells; i++) {
      letters.push(generateRandomLetter());
  }
  shuffle(letters); // randomize positions

  // Create grid:
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 0fr)`; 

  let index = 0;
  for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
          const letterButton = document.createElement("button");
          letterButton.classList.add("grid-item");
          letterButton.textContent = letters[index];
          gridContainer.appendChild(letterButton);
          index++;
      }
  }

  document.body.appendChild(gridContainer);

  const gridWrapper = document.createElement("div");
    gridWrapper.classList.add("grid-wrapper");
    // Append the gridContainer to the wrapper
    gridWrapper.appendChild(gridContainer);
    // Append the wrapper to the body
    document.body.appendChild(gridWrapper);

  let expectedLetter = 'A'; // Start with 'A'
  gridContainer.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
          const userChoice = event.target.textContent;
          if (userChoice == expectedLetter) {
              console.log('Success');
              if (expectedLetter === 'Z') {
                  console.log('You Win!');
                  expectedLetter = 'A'; // Reset to start over
              } else {
                  expectedLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
              }
          } else {
              console.log('Wrong');
              alert('You lost! Start over from A.');
              expectedLetter = 'A'; // Reset to 'A' on wrong click
          }
      }
  });
}

createLetterGrid(6);