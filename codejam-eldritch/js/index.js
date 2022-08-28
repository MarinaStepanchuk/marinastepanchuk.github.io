import cards from '../data/mythicCards/index.js';
import ancients from '../data/ancients.js';

const shuffleDeck = document.querySelector('.shuffle-deck');
const cardBlock = document.querySelector('.card-wrapper');
const playCard = document.querySelector('.play-card');
const coverCard = document.querySelector('.cover-card');
const currents = document.querySelectorAll('.dot');
const ancientAll = document.querySelectorAll('.ancient-card');
const deckShowContainer = document.querySelector('.deck');
let decksShow;
let choiceAncients ;
let level;
let levelCards;
let firstStageDeck;
let secondStageDeck;
let thirdStageDeck;
let deckMix;
let deck;
let amountInAncientsByColor = {};
let currentCards = 0;

let cleanDeckShow = (container) => {
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
}

document.querySelector('.ancient').addEventListener('click', (event) => {
    shuffleDeck.classList.remove('show');
    cardBlock.classList.remove('show');
    for (let i = 0; i < ancientAll.length; i++) {
        ancientAll[i].classList.remove('scale');
    }
    event.target.classList.add('scale');
    currentCards = 0;
    document.querySelector('select').value = 'choice';
    ancients.forEach((elem) => {
        if(event.target.id === elem.id) {
            choiceAncients = elem;
        }
    });
    amountInAncientsByColor.greenCards = choiceAncients.firstStage.greenCards + choiceAncients.secondStage.greenCards + choiceAncients.thirdStage.greenCards;
    amountInAncientsByColor.brownCards = choiceAncients.firstStage.brownCards + choiceAncients.secondStage.brownCards + choiceAncients.thirdStage.brownCards;
    amountInAncientsByColor.blueCards = choiceAncients.firstStage.blueCards + choiceAncients.secondStage.blueCards + choiceAncients.thirdStage.blueCards;

});

let selectionCards = (deck, difficulty1, difficulty2) => {
    let deckColor = [];
    deckColor = cards[deck].filter( (item) => {
        return (item.difficulty === difficulty1 || item.difficulty === difficulty2) && item
    })
    return deckColor;
};

let mixCards = (lengthDeck, sortedDeck) => {
    let deck = [];
    while(deck.length < lengthDeck){
        let z = sortedDeck[Math.floor(Math.random()*sortedDeck.length)];
        if(!deck.includes(z)) {
            deck.push(z);
        }
    }
    return deck
};

let deckBuilding = (level, difficulty1, difficulty2) => {
    levelCards = {};
    for (let colorDeck in cards) {
        let selectionCardsColor
        if(level === 'veryLight' || level === 'veryComplicated') {
            selectionCardsColor = selectionCards(colorDeck, difficulty1);
            if(selectionCardsColor.length < amountInAncientsByColor[colorDeck]) {
                let selectionNormalCardsColor = selectionCards(colorDeck, 'normal');
                selectionCardsColor = [].concat(selectionCardsColor, mixCards(amountInAncientsByColor[colorDeck]-selectionCardsColor.length, selectionNormalCardsColor));
            } 
        } else {
            selectionCardsColor = selectionCards(colorDeck, difficulty1, difficulty2);
            levelCards[colorDeck] = selectionCardsColor;
        }
        levelCards[colorDeck] = mixCards(selectionCardsColor.length, selectionCardsColor);
    }
    return levelCards;
};

document.querySelector('select').addEventListener('click', (event) => {
    if(!choiceAncients) {
        alert('Древний не выбран! Для продолжения игры, пожалуйста, выберите древнего.');
        shuffleDeck.classList.remove('show');
        document.querySelector('select').value = 'choice';
        return  
    } 
    level = event.target.value;
        cardBlock.classList.remove('show');
        shuffleDeck.classList.add('show');
        currentCards = 0;
        switch(level) {
            case 'veryLight':
                deckBuilding(level, 'easy');
                break;
            case 'light':
                deckBuilding(level, 'easy', 'normal');
                break;
            case 'average':
                levelCards = cards;
                break;
            case 'complicated':
                deckBuilding(level, 'normal', 'hard');
                break;
            case 'veryComplicated':
                deckBuilding(level, 'hard');
                break;
            default:
                alert('Уровень не задан! Выберите уровень сложности.');
                shuffleDeck.classList.remove('show');
        }
});

shuffleDeck.addEventListener('click', () => {
    cleanDeckShow(deckShowContainer);
    cardBlock.classList.add('show');
    shuffleDeck.classList.remove('show');
    coverCard.classList.remove('hidden');
    document.querySelector('.deck-text').classList.remove('hidden');
    playCard.classList.remove('show');

    let green = mixCards(amountInAncientsByColor.greenCards,levelCards.greenCards);
    let brown = mixCards(amountInAncientsByColor.brownCards,levelCards.brownCards);
    let blue = mixCards(amountInAncientsByColor.blueCards,levelCards.blueCards);

    let totalCardsInDeck = [
        choiceAncients.firstStage.greenCards, choiceAncients.firstStage.brownCards, choiceAncients.firstStage.blueCards,
        choiceAncients.secondStage.greenCards, choiceAncients.secondStage.brownCards, choiceAncients.secondStage.blueCards,
        choiceAncients.thirdStage.greenCards, choiceAncients.thirdStage.brownCards, choiceAncients.thirdStage.blueCards
    ];

    for (let i = 0; i < currents.length; i++) {
        currents[i].innerHTML = totalCardsInDeck[i];
    };

    firstStageDeck = [].concat(
        green.slice(0,totalCardsInDeck[0]),
        brown.slice(0,totalCardsInDeck[1]),
        blue.slice(0,totalCardsInDeck[2])
    );

    secondStageDeck = [].concat(
        green.slice(totalCardsInDeck[0],totalCardsInDeck[0] + totalCardsInDeck[3]),
        brown.slice(totalCardsInDeck[1],totalCardsInDeck[1] + totalCardsInDeck[4]),
        blue.slice(totalCardsInDeck[2],totalCardsInDeck[2] + totalCardsInDeck[5])
    );

    thirdStageDeck = [].concat(
        green.slice(totalCardsInDeck[0] + totalCardsInDeck[3],totalCardsInDeck[0] + totalCardsInDeck[3] + totalCardsInDeck[6]),
        brown.slice(totalCardsInDeck[1] + totalCardsInDeck[4],totalCardsInDeck[1] + totalCardsInDeck[4] + totalCardsInDeck[7]),
        blue.slice(totalCardsInDeck[2] + totalCardsInDeck[5],totalCardsInDeck[2] + totalCardsInDeck[5] + totalCardsInDeck[8])
    );

    deck = [].concat(firstStageDeck, secondStageDeck, thirdStageDeck)
    let left = 0;
    deck.forEach((card) => {
        let div = document.createElement('div');
        deckShowContainer.append(div);
        div.className = 'deck-card';
        div.style.backgroundImage = `url('/assets/MythicCards/${card.color}/${card.id}.png')`;
        div.style.left = `${left}%`;
        left += 6;
    })

    decksShow = document.querySelectorAll('.deck-card');

    deckMix = [].concat(mixCards(firstStageDeck.length,firstStageDeck), mixCards(secondStageDeck.length,secondStageDeck), mixCards(thirdStageDeck.length,thirdStageDeck));
});

let decreaseCounter = (currentNumber, color) => {
    if(currentNumber < firstStageDeck.length) {
        for (let i = 0; i < 3; i++) {
            if(currents[i].classList.contains(color)) {
                currents[i].innerHTML -= 1;
            }
        };
    } else if (currentNumber < (firstStageDeck.length + secondStageDeck.length)) {
        for (let i = 3; i < 6; i++) {
            if(currents[i].classList.contains(color)) {
                currents[i].innerHTML -= 1;
            }
        };
    } else {
        for (let i = 6; i < 9; i++) {
            if(currents[i].classList.contains(color)) {
                currents[i].innerHTML -= 1;
            }
        };
    }
};

coverCard.addEventListener('click', () => {
    if(currentCards < deckMix.length) {
        playCard.src = `/assets/MythicCards/${deckMix[currentCards].color}/${deckMix[currentCards].id}.png`;
        playCard.classList.add('show');
        decreaseCounter(currentCards, deckMix[currentCards].color)
        for(let i = 0; i < decksShow.length; i++) {
            if(decksShow[i].style.backgroundImage.includes(`${deckMix[currentCards].id}.png`)) {
                decksShow[i].style.bottom = '100%'
            }
        }
        if(currentCards === deckMix.length-1) {
            coverCard.classList.add('hidden');
            document.querySelector('.deck-text').classList.add('hidden');
        }
        currentCards += 1;
    } else {
        currentCards = 0;
    }
});