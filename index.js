// Landing Page
function playButton() {
    const landingPage = document.querySelector(".start");
    landingPage.style.display = "none";
    const gamePage = document.querySelector(".game");
    gamePage.style.display ="flex";
    // const end = document.querySelector(".end");
    // end.style.display = "none";
    // game();
    displayBets();
}

// Blackjack Code

const deck = [];
const shuffleLength = 100;
const dealerHand = [];
const playerHand = [];
let balance = 10;
let betAmount = 0;

createDeck();
shuffle(shuffleLength);

function game() {
    console.log();
    console.log("new game");
    console.log();
    deal();
    if(is21(playerHand)) {
        win();
    }
}

function bet(amount) {
    const message = document.querySelector(".message");
    message.style.display = "none";
    betAmount = amount;
    balance -= betAmount;
    updateBalance(balance);
    displayDecisions();
    game();
}

function loan(){
    balance += 10;
    updateBalance(balance);
    displayBets();
}

function updateBalance(newBalance) {
    const bal = document.querySelector(".game h1");
    bal.innerHTML = "Balance: " + newBalance + "$";
}

function win() {
    const outcome = document.querySelector(".outcome");
    outcome.textContent = "You win!";
    outcome.style.display = "block";
    balance += (betAmount * 2);
    updateBalance(balance);
    displayEnd();
}

function lose() {
    const outcome = document.querySelector(".outcome");
    outcome.textContent = "Dealer wins";
    outcome.style.display = "block";
    displayEnd();
}

function tie() {
    const outcome = document.querySelector(".outcome");
    outcome.textContent = "Tie!";
    outcome.style.display = "block";
    balance += betAmount;
    updateBalance(balance);
    displayEnd();
}

function createSuit(suit) {
    for(let i = 1; i < 14; i++){
        deck.push(i + suit);
    }
}

function createDeck() {
    createSuit("c");
    createSuit("d");
    createSuit("h");
    createSuit("s");
}



function shuffle(shuffleLength) {
    for(let i = 0; i < shuffleLength; i++) {
        let firstCard = Math.floor(Math.random() * 52);
        let secondCard = Math.floor(Math.random() * 52);
        let temp = deck[firstCard];
        deck[firstCard] = deck[secondCard];
        deck[secondCard] = temp;
    }
}


function showCard(hand, card) {
    const newCard = document.createElement('div');
    newCard.className = "card";

    const referenceHand = document.querySelector(hand);
    referenceHand.appendChild(newCard);

    const newImage = document.createElement('img');
    newImage.src = "./public/img/" + card + ".png";

    newCard.appendChild(newImage);
}

function deal() {
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    showCard(".dealer.hand", dealerHand[0]);
    showCard(".dealer.hand", "back2");

    showCard(".player.hand", playerHand[0]);
    showCard(".player.hand", playerHand[1]);

    updateCounter();
}

function handValue(hand) {
    let values = [0];
    
    for(let card of hand) {
        let cardValue = parseInt(card.slice(0, -1));

        if(cardValue >= 10) {
            for(let i = 0; i < values.length; i++) {
                values[i] += 10;
            }
        } else if (cardValue === 1) {
            let size = values.length;
            values = values.concat(values);
            for(let i = 0; i < size; i++) {
                values[i] += 1;
            }
            for(let i = size; i < values.length; i++) {
                values[i] += 11;
            }
        } else {
            for(let i = 0; i < values.length; i++) {
                values[i] += cardValue;
            }
        }
    }
    return values;
}

function validValues() {
    let values = handValue(playerHand);
    for(let i = 0; i < values.length; i++) {
        if(values[i] > 21) {
            values.splice(i, i);
        }
    }
    return values;
}

function updateCounter(){
    const counter = document.querySelector(".counter");
    let playerValue = handValue(playerHand);
    if(playerValue.length === 1) {
        counter.innerHTML = "<p>" + playerValue[0] + "</p>";
    } else {
        let counterText = "";
        for(let i = 0; i < playerValue.length; i++) {
            if(i === 0) {
                counterText += playerValue[i];
            } else {
                counterText += ("/" + playerValue[i]);
            }
        }
        counter.innerHTML = "<p>" + counterText + "</p>";
    }
}

function is21(hand) {
    let values = handValue(hand);
    for(let i = 0; i < values.length; i++) {
        if(values[i] === 21) {
            return true;
        }
    }
    return false;
}

function isBust(hand) {
    let values = handValue(hand);
    for(let i = 0; i < values.length; i++) {
        if(values[i] <= 21) {
            return false;
        }
    }
    return true;
}

function toggleClickablePlays() {
    const plays = document.querySelectorAll(".play");
    for(let play of plays) {
        play.disabled = !play.disabled;
    }
}

function toggleClickableEnd() {
    const end = document.querySelector(".end");
    end.disabled = !end.disabled;
}

function displayDecisions() {
    const decisions = document.querySelectorAll(".decision");
    for(let decision of decisions) {
            decision.style.display = "none";
    }
    const plays = document.querySelectorAll(".decision.play");
    for(let play of plays) {
        play.style.display = "inline-block";
    }
}

function displayEnd() {
    const decisions = document.querySelectorAll(".decision");
    for(let decision of decisions) {
            decision.style.display = "none";
    }
    const plays = document.querySelectorAll(".decision.end");
    for(let play of plays) {
        play.style.display = "inline-block";
    }
}

function displayBets() {
    const decisions = document.querySelectorAll(".decision");
    for(let decision of decisions) {
            decision.style.display = "none";
    }

    const counter = document.querySelector(".counter");
    counter.innerHTML = "";

    const message = document.querySelector(".message");
    message.style.display = "flex";
    if(balance > 0) {
        const bets = document.querySelectorAll(".decision.bet");
        for(let bet of bets) {
            if(parseInt(bet.id) <= balance) {
                bet.style.display = "inline-block";
            } else {
                bet.style.display = "none";
            }
        }
        message.innerHTML = "<p>Place your bet</p>";
    } else {
        const loan = document.querySelector(".decision.loan");
        loan.style.display = "inline-block";
        message.innerHTML = "<p>99% of investors quit before their big win</p>";
    }
    
}

function hit(hand) {
    console.log("hit");
    toggleClickablePlays();
    hand.push(deck.pop());
    if(hand === playerHand) {
        showCard(".player.hand", hand[hand.length - 1]);
        updateCounter();
    } else {
        showCard(".dealer.hand", hand[hand.length - 1]);
    }
    console.log("Bust check" + hand + ", " + isBust(hand));
    if(isBust(hand)) {
        if(hand === playerHand) {
            const dealer = document.querySelector(".dealer.hand");
            dealer.innerHTML = "";
            showCard(".dealer.hand", dealerHand[0]);
            showCard(".dealer.hand", dealerHand[1]);
            lose();
        } else {
            win();
        }
    } else if(is21(hand)) {
        if(hand === playerHand) {
            win();
        } else {
            lose();
        }
    } else{
        if(hand === dealerHand) {
            stand();
        }
    }
    toggleClickablePlays();
}

function again() {
    dealerHand.length = 0;
    playerHand.length = 0;
    if(deck.length < 10) {
        deck.length = 0;
        createDeck();
        shuffle(shuffleLength);
        console.log("shuffling again");
    }
    const dealer = document.querySelector(".dealer.hand");
    dealer.innerHTML = "";
    const player = document.querySelector(".player.hand");
    player.innerHTML = "";
    const outcome = document.querySelector(".outcome");
    outcome.style.display = "none";
    displayBets();
    // displayDecisions();
    // game();
}

function is17orHigher() {
    let value = handValue(dealerHand)[0];
    if(value >= 17) {
        return true;
    }
    return false;
}

function playerHighestValue() {
    let values = handValue(playerHand);
    for(let i = values.length - 1; i >= 0; i--) {
        if(values[i] <= 21) {
            return values[i];
        }
    }
}

function dealerHighestValue() {
    let values = handValue(dealerHand);
    for(let i = values.length - 1; i >= 0; i--) {
        if(values[i] <= 21) {
            return values[i];
        }
    }
}

function stand() {
    toggleClickablePlays();
    if (dealerHand.length === 2) {
        const dealer = document.querySelector(".dealer.hand");
        dealer.innerHTML = "";
        showCard(".dealer.hand", dealerHand[0]);
        showCard(".dealer.hand", dealerHand[1]);
    }
    if(is21(dealerHand)) {
        lose();
    } else if(is17orHigher()) {
        console.log(playerHighestValue() + ", " + dealerHighestValue());
        if(playerHighestValue() > dealerHighestValue()) {
            win();
        } else if (playerHighestValue() == dealerHighestValue()){
            tie();
        } else {
            lose();
        }
    } else {
        hit(dealerHand);
    }
    toggleClickablePlays();
}