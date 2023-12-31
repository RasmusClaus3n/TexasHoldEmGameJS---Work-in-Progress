import Card from '../classes/Card.js';
import Player from '../classes/Player.js';
import {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createTestFlop,
  createMainPlayerTestHand,
  createCPU1TestHand,
  createCPU2TestHand,
} from './deck-manager.js';
import { scoreCards } from './score-hand.js';
import {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasFourOfAKind,
  hasStraightFlush,
  hasLowStraightFlush,
  hasLowStraight,
} from './evaluate-hand.js';
import { rankHandRanks } from './determine-winner.js';
import { displayToDOM, updateUI } from './dom-handler.js';
import { setBlinds } from './blinds.js';

const randomNames = [
  'Steve',
  'Rey',
  'Glen',
  'Rey',
  'Rick',
  'Raul',
  'Paul',
  'Josh',
  'Bob',
  'Will',
  'Jerry',
  'Scott',
  'Shaun',
  'Dean',
  'Mike',
  'Max',
  'Tim',
  'Karl',
  'Todd',
  'Mary',
  'Lucy',
  'Eve',
  'Jean',
  'Tess',
  'Leah',
  'May',
  'Anne',
  'Gwen',
  'Sally',
  'Rose',
  'Paige',
  'Ruth',
  'Jill',
  'Alice',
  'Edith',
  'Sarah',
  'Carol',
  'Erin',
  'Judy',
];

let cpuPlayers;
let mainPlayer;
let winner;
let blindTurnNum;
let pot;

if (!cpuPlayers || !mainPlayer) {
  cpuPlayers = createCPUplayers();
  mainPlayer = createMainPlayer();
  blindTurnNum = 0;
  pot = 0;
}

const allPlayers = [mainPlayer, ...cpuPlayers];

startGame(mainPlayer, cpuPlayers, allPlayers, pot, blindTurnNum);

function startGame(mainPlayer, cpuPlayers, allPlayers, pot, blindTurnNum) {
  const deck = createDeck([]);
  const comCards = [];

  shuffleDeck(deck);
  setMainPlayerHoleCards(mainPlayer, deck);
  setCpuHoleCards(cpuPlayers, deck);
  // createFlop(deck, comCards);
  // createTestFlop(deck, comCards);

  setHandRanks(mainPlayer, cpuPlayers, comCards);
  displayToDOM(mainPlayer, cpuPlayers, comCards);
  setBlinds(allPlayers, pot, blindTurnNum);

  winner = rankHandRanks(mainPlayer, cpuPlayers);

  console.log(winner);

  if (Array.isArray(winner)) {
    console.log('Tied winners!: ');
    for (const player of winner) {
      console.log(player.getName());
    }
  } else {
    console.log(winner.getName() + ' wins');
  }
}

function createCPUplayers() {
  let cpuPlayers = [];

  for (let i = 0; i < 5; i++) {
    let cpu = new Player();

    cpu.setMoney(1000);

    // Generate a random index to select a name
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    const randomName = randomNames[randomIndex];

    // Set the name and remove it from the copy
    cpu.setName(randomName);
    randomNames.splice(randomIndex, 1);

    cpuPlayers.push(cpu);
  }

  return cpuPlayers;
}

function createMainPlayer() {
  let mainPlayer = new Player();
  mainPlayer.setMoney(1000);
  mainPlayer.setName('You');

  return mainPlayer;
}

function setCpuHoleCards(cpuPlayers, deck) {
  cpuPlayers.forEach((cpu) => {
    let cpuCards = [];
    cpu.setHand(createHand(deck, cpuCards));
  });
}

function setMainPlayerHoleCards(mainPlayer, deck) {
  let mainPlayerCards = [];
  mainPlayer.setHand(createHand(deck, mainPlayerCards));
  // mainPlayer.setHand(createMainPlayerTestHand(deck, mainPlayerCards));
}

function setHandRanks(mainPlayer, cpuPlayers, comCards) {
  mainPlayer.setHandRank(scoreCards(comCards, mainPlayer));
  for (let cpu of cpuPlayers) {
    cpu.setHandRank(scoreCards(comCards, cpu));
  }
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// pkrBtn.addEventListener('click', function () {
//   createTurnOrRiver(deck, comCards);
//   setHandRanks(mainPlayer, cpuPlayers);
//   displayToDOM(comCards, mainPlayer, cpuPlayers);
//   if (comCards.length === 5) {
//     pkrBtn.classList.add('hidden');
//   }
// });

// Test purposes:
// createAceLowStraightPlayerCards(deck, playerCards);
// createAceLowStraightComCards(deck, comCards);
// createAceHighStraightPlayerCards(deck, playerCards);
// createAceHighStraightComCards(deck, comCards);
// createAceHighStraightFlushPlayerCards(deck, playerCards);
// createAceHighStraightFlushComCards(deck, comCards);

export { mainPlayer, cpuPlayers, allPlayers };
