const deck = [];
const shuffleLength = 100;
const dealerHand = [];
const myHand = [];

function fillSuit(suit) {
  for (let i = 1; i < 14; i++) {
    let card = i + suit;
    deck.push(card);
  }
}

function fillDeck() {
  fillSuit("h");
  fillSuit("d");
  fillSuit("s");
  fillSuit("c");
}

function shuffle(shuffleLength) {
  for (let i = 0; i < shuffleLength; i++) {
    let first = Math.floor(Math.random() * 52);
    let second = Math.floor(Math.random() * 52);
    let temp = deck[first];
    deck[first] = deck[second];
    deck[second] = temp;
  }
}

function draw() {
  return deck.pop();
}

function dealHand() {
  myHand.push(draw());
  dealerHand.push(draw());

  myHand.push(draw());
  dealerHand.push(draw());

  console.log("dealer hand: " + dealerHand[0]);
  console.log("your hand: " + myHand);
}

function checkHand(hand) {
  let smallTotal = 0;
  let bigTotal = 0;
  for (let card of hand) {
    let cardValue = parseInt(card.slice(0, -1));
    if (cardValue >= 10) {
      smallTotal += 10;
      bigTotal += 10;
    } else if (cardValue === 1) {
      smallTotal += 1;
      bigTotal += 11;
    } else {
      smallTotal += cardValue;
      bigTotal += cardValue;
    }
  }
  if (smallTotal === 21 || bigTotal === 21) {
    console.log("Black Jack!");
    return 0;
  } else if (smallTotal < 21 && bigTotal < 21) {
    if (smallTotal == bigTotal) {
      console.log(smallTotal);
    } else {
      console.log(smallTotal + " or " + bigTotal);
    }
    return 1;
  } else if (smallTotal < 21) {
    console.log(smallTotal);
    return 1;
  } else if (bigTotal < 21) {
    console.log(bigTotal);
    return 1;
  } else {
    console.log("Bust!");
    return 2;
  }
}

async function checkMyHand() {
  switch (checkHand(myHand)) {
    case 0:
      console.log("You win");
      break;
    case 1:
      await askInput();
      break;
    case 2:
      console.log("You lose");
      break;
  }
}

function checkDealer() {
  let smallTotal = 0;
  let bigTotal = 0;
  for (let card of dealerHand) {
    let cardValue = parseInt(card.slice(0, -1));
    if (cardValue >= 10) {
      smallTotal += 10;
      bigTotal += 10;
    } else if (cardValue === 1) {
      smallTotal += 1;
      bigTotal += 11;
    } else {
      smallTotal += cardValue;
      bigTotal += cardValue;
    }
  }
  if (smallTotal === bigTotal) {
    console.log(smallTotal);
  } else {
  }
  if (smallTotal === 21 || bigTotal === 21) {newGame
    console.log(smallTotal + " or " + bigTotal);
    console.log("Black Jack!");
    return 0;
  } else if (smallTotal < 21 && bigTotal < 21) {
    if (smallTotal == bigTotal) {
      if (smallTotal < 17) {
        console.log(smallTotal);
        return 1;
      } else {
        console.log(smallTotal + " or " + bigTotal);
        return 2;
      }
    } else {
      console.log(smallTotal + " or " + bigTotal);
      if (smallTotal < 17 || bigTotal < 17) {
        return 1;
      } else {
        return 2;
      }
    }
  } else if (smallTotal < 21) {
    console.log(smallTotal);
    if (smallTotal < 17) {
      return 1;
    } else {
      return 2;
    }
  } else if (bigTotal < 21) {
    console.log(bigTotal);
    if (bigTotal < 17) {
      return 1;
    } else {
      return 2;
    }
  } else {
    console.log(smallTotal);
    console.log("Bust!");
    return 3;
  }
}

async function askInput() {
  return new Promise((resolve) => {
    process.stdout.write("Hit or stand (h/s)? ");
    process.stdin.once("data", (data) => {
      const input = data.toString().trim();
      if (input === "h") {
        hit(myHand);
        checkMyHand().then(() => resolve());
      } else if (input === "s") {
        console.log("dealer hand: " + dealerHand);
        stand().then(() => resolve());
      } else {
        console.log(
          "Invalid input. Please enter 'h' for hit or 's' for stand."
        );
        resolve(askInput());
      }
    });
  });
}

function hit(hand) {
  let newCard = draw();
  console.log(newCard);
  hand.push(newCard);
}

function countHand(hand) {
  let smallTotal = 0;
  let bigTotal = 0;
  for (let card of hand) {
    let cardValue = parseInt(card.slice(0, -1));
    if (cardValue >= 10) {
      smallTotal += 10;
      bigTotal += 10;
    } else if (cardValue === 1) {
      smallTotal += 1;
      bigTotal += 11;
    } else {
      smallTotal += cardValue;
      bigTotal += cardValue;
    }
  }
  if (bigTotal > 21) {
    bigTotal = smallTotal;
  }
  return [smallTotal, bigTotal];
}

async function stand() {
  switch (checkDealer()) {
    case 0:
      console.log("You lose");
      break;
    case 1:
      console.log("dealer hits!");
      hit(dealerHand);
      stand();
      break;
    case 2:
      console.log("dealer stands!");
      let myValue = Math.max(...countHand(myHand));
      let dealerValue = Math.max(...countHand(dealerHand));
      if (myValue > dealerValue) {
        console.log("You win");
      } else {
        console.log("You lose");
      }
      break;
    case 3:
      console.log("you win");
      break;
  }
}

async function endGame() {
  return new Promise((resolve) => {
    process.stdout.write("Play again (y/n)? ");
    process.stdin.once("data", (data) => {
      const input = data.toString().trim();
      if (input === "y") {
        resolve(false);
      } else if (input === "n") {
        resolve(true);
      } else {
        console.log("Invalid input. Please enter 'y' for yes or 'n' for no.");
        endGame().then(resolve);
      }
    });
  });
}

function newGame() {
  if (deck.length < 10) {
    deck.length = 0;
    console.log("reshuffling deck");
    fillDeck();
    shuffle(shuffleLength);
  }
  dealerHand.length = 0;
  myHand.length = 0;
}

fillDeck();
shuffle(shuffleLength);

console.log("Blackjack");

async function playGame() {
  dealHand();
  await checkMyHand();
  let res = await endGame();
  if (res) {
    process.exit();
  } else {
    newGame();
    playGame();
  }
}

playGame();
