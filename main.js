// TODO hér vantar að sækja viðeigandi föll úr öðrum modules
import { show, createButtons, updateResultScreen} from './lib/ui.js';
import { computerPlay, isValidBestOf, playAsText, checkGame } from './lib/rock-paper-scissors.js';

show('start');

/** Hámarks fjöldi best-of leikja, ætti að vera jákvæð heiltala stærri en 0 */
const MAX_BEST_OF = 10;

/** Fjöldi leikja sem á að spila í núverandi umferð */
let totalRounds;

/** Númer umferðar í núverandi umferð */
let currentRound = 0;

/** Sigrar spilara í núverandi umferð */
let playerWins = 0;

/** Töp spilara í núverandi umferð */
let computerWins = 0;

/**
 * Fjöldi sigra spilara í öllum leikjum. Gætum reiknað útfrá `games` en til
 * einföldunar höldum við utan um sérstaklega.
 */
let totalWins = 0;

/**
 * Utanumhald um alla spilaða leiki, hver leikur er geymdur á forminu:
 *
 * ```
 * {
 *   player: 2,
 *   computer: 1,
 *   win: true,
 * }
 * ```
 */
const games = [];

/**
 * Uppfærir stöðu eftir að spilari hefur spilað.
 * Athugar hvort leik sé lokið, uppfærir stöðu skjá með `updateResultScreen`.
 * Birtir annað hvort `Næsti leikur` takka ef leik er lokið eða `Næsta umferð`
 * ef spila þarf fleiri leiki.
 *
 * @param {number} player Það sem spilari spilaði
 */
function playRound(player) {

  let playerToString = player.toString();
  let playerString = playAsText(playerToString);

  // Komumst að því hvað tölva spilaði og athugum stöðu leiks
  let computer = computerPlay();
  let computerToString = computer.toString();
  let computerString = playAsText(computerToString);

  console.log("PlayerText: " + playerString);
  console.log("computerText: " + computerString);

  console.log("Player: " + player);
  console.log("computer play: " + computer);

  const checkedResaults = checkGame(Number.parseInt(player), Number.parseInt(computer));
  console.log("From checkgame: " + checkedResaults);

  let resaultText;

  switch (checkedResaults) {
    case 1:
      resaultText = "Þú vannst!"
      playerWins += 1;
      break;
    case -1:
      resaultText = "Tölvan vann";
      computerWins += 1;
      break;
    default:
      resaultText = "Jafntefli";
  }

  if (checkedResaults !== 0) {currentRound += 1;}

  // Uppfærum result glugga áður en við sýnum, hér þarf að importa falli
  updateResultScreen({
    player: playerString,
    computer: computerString,
    result: resaultText,
    currentRound: currentRound.toString(),
    totalRounds: totalRounds.toString(),
    playerWins: playerWins.toString(),
    computerWins: computerWins.toString(),
  });

  // Uppfærum teljara ef ekki jafntefli, verðum að gera eftir að við setjum titil


  // Ákveðum hvaða takka skuli sýna
  const btnFinish = document.querySelector('.finishGame');
  btnFinish.classList.add('hidden');
  const btnNextRound = document.querySelector('.nextRound');
  btnNextRound.classList.add('hidden');

  if ((playerWins < Math.ceil(totalRounds / 2)) && (computerWins < Math.ceil(totalRounds / 2))) {
    btnNextRound.classList.remove('hidden');
  } else {
    btnFinish.classList.remove('hidden');
  }

  // Sýnum niðurstöðuskjá
  show('result');
}

/**
 * Fall sem bregst við því þegar smellt er á takka fyrir fjölda umferða
 * @param {Event} e Upplýsingar um atburð
 */
function round(e) {
  // TODO útfæra
  const nORounds = Number.parseInt(e);
  let isRoundsOk = isValidBestOf(nORounds, MAX_BEST_OF);
  if (!isRoundsOk) {
    alert("Það er eitthvað að! Hafðu samband við tæknideild samstundis!")
  }
  totalRounds = nORounds;
  show('play');
  console.log(nORounds);
  console.log(nORounds);
}

// Takki sem byrjar leik
document
  .querySelector('.start button')
  .addEventListener('click', () => show('rounds'));

// Búum til takka
createButtons(1, () => {round(1)})
createButtons(3, () => {round(3)});
createButtons(5, () => {round(5)})
createButtons(7, () => {round(7)})
createButtons(9, () => {round(9)})

// Event listeners fyrir skæri, blað, steinn takka
// TODO

// Takki fyrir SKÆRI
document
  .querySelector('button.scissor')
  .addEventListener('click', () => {playRound(1)});

  // Takki fyrir BLAÐ
document
.querySelector('button.paper')
.addEventListener('click', () => {playRound(2)});

// Takki fyrir STEINN
document
.querySelector('button.rock')
.addEventListener('click', () => {playRound(3)});

// Takki fyrir NÆSTU UMFERÐ
document
.querySelector('button.nextRound')
.addEventListener('click', () => {show('play')});

// Takki fyrir NÆSTA LEIK
document
.querySelector('button.finishGame')
.addEventListener('click', () => {finishGame()});



  /**
 * Uppfærir stöðu yfir alla spilaða leiki þegar leik lýkur.
 * Gerir tilbúið þannig að hægt sé að spila annan leik í framhaldinu.
 */
function finishGame() {
  // Bætum við nýjasta leik
  if (playerWins > computerWins) {
    totalWins += 1;
  }

// Bætum leik við lista af spiluðum leikjum

  let playerWon = false;

  if (playerWins > computerWins) {
    playerWon = true;
  }

  let gameInfo = {
    player: playerWins,
    computer: computerWins,
    win: playerWon,
  }

  games.push(gameInfo);

  // Uppfærum stöðu
  const totalGamesPlayed = games.length;
  const totalLosses = totalGamesPlayed - totalWins;

  const winRatio = (Math.round(((totalWins / totalGamesPlayed) * 100) * 100) / 100).toFixed(2);
  const lossRatio = (Math.round(((totalLosses / totalGamesPlayed) * 100) * 100) / 100).toFixed(2);

  const gamesPlayed = document.querySelector('.games__played');
  gamesPlayed.textContent = totalGamesPlayed;

  const gamesWon = document.querySelector('.games__wins');
  gamesWon.textContent = totalWins;

  const gamesLost = document.querySelector('.games__losses');
  gamesLost.textContent = totalLosses;

  const winningRatio = document.querySelector('.games__winratio');
  winningRatio.textContent = winRatio;

  const losingRatio = document.querySelector('.games__lossratio');
  losingRatio.textContent = lossRatio;

// Núllstillum breytur

totalRounds = 0;

currentRound = 0;

playerWins = 0;

computerWins = 0;

playerWon = false;

  // Byrjum nýjan leik!
show('start');

}
