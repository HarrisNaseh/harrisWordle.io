//Imports words that can be used in game
import { WORDS } from "./words.js";
//List of all possible 5 letter words but not all will be used in game
import { ALLWORDS } from "./allwords.js";

const NUM_OF_GUESSES = 6;
let guessesLeft = NUM_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
//Chooses a random word from WORDS array
let word = "tests";//WORDS[Math.floor(Math.random() * WORDS.length)];
word = word.toUpperCase();
let board = document.getElementById("game-board");
let darkMode = false;
let filled = "filled-box";
let ready = false;
overlay();
let nightButtondiv = document.getElementById("nightbutton");
let end = document.createElement("div");
// nightButtondiv.appendChild(end);
// end.className = "end";
// end.innerHTML = `<p>Correct Word: ${word}<p>`;

//document.body.appendChild(end);

// end.className = "end";
// end.innerHTML = `<p>Correct Word: "${word}"<p>`;
// document.body.appendChild(end);

document.getElementById("close-button").addEventListener("click", function () {
  document.getElementById("overlay").style.display = "none";
  ready = true;
});

/**
 * Creates rows and box elements
 * Boxes are children of rows and rows are children of
 * game-board
 */
function initBoard() {
  for (let i = 0; i < NUM_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";
    //row.classList.add("night-available");

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
      // box.classList.add("night-available");
    }

    board.appendChild(row);
  }
}

/**
 * Event listener for when a keyboard button is pressed
 * Only A-Z, Backspace, and Enter can be used
 */
document.addEventListener("keyup", (e) => {
  if (guessesLeft == 0 || !ready) {
    return;
  }

  let keyPressed = String(e.key);

  if (keyPressed == "Backspace" && nextLetter != 0) {
    deleteLetter();
  } else if (keyPressed == "Enter" && nextLetter != 0) {
    checkGuess();
  } else {
    let valid = keyPressed.match(/[a-z]/gi);

    if (valid && valid.length <= 1) {
      insertLetter(keyPressed);
      return;
    } else if (keyPressed != "Backspace") {
      toastr.error("Not valid letter","Opps",{timeOut:1492,  positionClass: "toast-top-center" });
      //toastr.error("Not valid letter");
    }
  }
});


/**
 *
 * @param {String} letter
 *        A letter that will be placed in a given box based on the guessesleft and
 *        which letter it is in the word
 * @returns
 *          Nothing if conditions to insert a letter are not met
 */
function insertLetter(letter) {
  if (nextLetter == 5) {
    return;
  }

  letter = letter.toUpperCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesLeft];
  let box = row.children[nextLetter];
  //Animates box when typing
  animateCSS(box, "pulse");
  box.textContent = letter;
  box.classList.add("filled-box");
  box.classList.add(filled);
  currentGuess.push(letter);
  nextLetter += 1;
}

/**
 * Deletes the last letter that was typed
 */
function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesLeft];
  let box = row.children[nextLetter - 1];
  animateCSS(box, "pulse");
  box.textContent = "";
  box.classList.remove("filled-box");
  box.classList.remove(filled);
  currentGuess.pop();
  nextLetter--;
}

function overlay(){
    for(let i = 0; i < 3; i++){
      let box = document.getElementsByClassName("flip")[i];
      box.style.setProperty("--animate-duration", "1s");
      box.classList.add("animate__animated", "animate__flipInX");
    }
  
  }
  



/**
 * Checks the currentWord against the correct answer.
 * Checks if the word is long enough, is a valid word and that the
 * player has enough guesses left to play
 * @returns
 *          Nothing if something is invalid
 */
function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesLeft];
  let rightWord = Array.from(word);
  let currWord = "";

  //Since currentGuess is array contents need to be converted to string
  for (const val of currentGuess) {
    currWord += val;
  }
  if (!ALLWORDS.includes(currWord) && nextLetter == 5) {
    animateCSS(row, "shakeX");
    toastr.error("Not a valid word","Opps",{timeOut:1492,  positionClass: "toast-top-center" });
    return;
  }

  if (nextLetter != 5) {
    animateCSS(row, "shakeX");

    toastr.error("Please enter 5 letters","Opps",{timeOut:1492,  positionClass: "toast-top-center" });

    return;
  }

  //Determines if currentGuess has the letter in correct place
  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let letter = currentGuess[i];
    let color = "";

    let position = rightWord.indexOf(letter);

    box.classList.remove("night");
    let delay = 300 * i;
    if (position == -1) {
      color = "gray";
    } else {
      if (letter == rightWord[i]) {
        color = "green";
        rightWord[position] = "#";
      } else {
        color = "yellow";
      }
      
    }
    setTimeout(() => {
      if (color == "gray") {
        box.classList.add("not-in-word");
      } else {
        if (color == "green") {
          box.classList.add("correct");
        } else {
          box.classList.add("in-word");
        }
      }
      //Slows animation down
      box.style.setProperty("--animate-duration", "0.6s");
      box.classList.add("animate__animated", "animate__flipInX");

      shadeKeyBoard(letter, color);
    }, delay);
  }
 

  if (currWord == word) {
   
  end.className = "end";
  end.id = "endCorrect";
  if(guessesLeft == 6){
    end.style.top = '140px';
  }
  end.style.setProperty("--animate-duration", "1s");
  end.classList.add("animate__animated", "animate__fadeIn");
  end.innerHTML = `<p>MadLad!<p>`;  
  
  nightButtondiv.appendChild(end);

    animateCSS(row, "jackInTheBox");
    guessesLeft = 0;
  } else {
    guessesLeft--;
    currentGuess = [];
    nextLetter = 0;

    if (guessesLeft == 0) {
      //toastr.info("You ran out of guesses");
      //setTimeout(() => {
        nightButtondiv.appendChild(end);
        end.className = "end";
        end.innerHTML = `<p>Correct Word: "${word}"<p>`;
        end.style.setProperty("--animate-duration", "1s");
        end.classList.add("animate__animated", "animate__fadeIn");
        //toastr.info(`The right word was: "${word}"`,"You ran out of guesses",{timeOut:0, positionClass: "toast-top-center", extendedTimeOut: 0});

        
      //}, 1500);
    }
  }
}

/**
 *
 * @param {String} letter
 *        The letter on the keyboard that will
 *        be shaded
 * @param {String} color
 *        The color the on-screen keyboard will turn
 * @returns
 */
function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent.toUpperCase() === letter) {
      if (elem.classList.contains("correct")) {
        return;
      }

      if (color == "green" && elem.classList.contains("in-word")) {
        elem.classList.remove("in-word");
      }

      if (color == "green") {
        elem.classList.add("correct");
      } else if (color == "yellow") {
        elem.classList.add("in-word");
      } else {
        elem.classList.add("not-in-word");
      }
      animateCSS(elem, "pulse");

      break;
    }
  }
}

document.getElementById("keyboard").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }

  let key = target.textContent;

  if (key === "del") {
    key = "Backspace";
  }

  if (key === "enter") {
    checkGuess();
  } else {
    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
  }
});

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

initBoard();


document.querySelector(".checkbox").addEventListener("click", () => {
  document.querySelectorAll(".night-available").forEach((ele) => {
    ele.classList.toggle("night");
  });

  if (!darkMode) {
    //document.body.style.backgroundColor = "black";
    darkMode = true;
    filled = "filled-box-night";
  } else {
    //document.body.style.backgroundColor = "white";
    darkMode = false;
    filled = "filled-box";
  }

  document.querySelectorAll(".filled-box").forEach((e) => {
    e.classList.toggle("filled-box-night");
  });
});

document.getElementById("night-mode").click();

// setTimeout(function () {
//   document.getElementById("night-mode").checked = true;
// }, 100);







