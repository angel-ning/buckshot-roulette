let player1Health;
let player2Health;
let turn;
let blankShells;
let liveShells;
let chamber;

const statusElement = document.getElementById("status");
const player1HealthElement = document.getElementById("player-1-health");
const player2HealthElement = document.getElementById("player-2-health");
const turnIndicatorElement = document.getElementById("turn-indicator");
const shotgun = document.getElementById("shotgun");

function setStatus(message) {
    statusElement.innerHTML = message;
}

function damage(player, amount) {
    if (player === "player1") {
        player1Health -= amount;
    }

    if (player === "player2") {
        player2Health -= amount;
    }
    renderHealth();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shoot(player) {

    const shell = chamber.pop();
    if (shell === 'live') {

        if (turn == 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Fired a live shell!");
                    damage("player2", 1);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Fired a live shell!");
                    damage("player1", 1);
                }, 1000);

            }
        }

        if (turn == 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Fired a live shell!");
                    damage("player1", 1);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Fired a live shell!");
                    damage("player2", 1);
                }, 1000);

            }
        }


    } else {

        if (turn == 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Fired a blank shell!");
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Fired a blank shell!");
                    nextTurn();
                }, 1000);

            }
        }

        if (turn == 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Fired a blank shell!");
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Fired a blank shell!");
                    nextTurn();
                }, 1000);
            }
        }
    }
    if (chamber === 0) {
        reload();
    }

    nextTurn();
}


function renderHealth() {
    if (player1Health <= 0) {
        setTimeout(() => {
            alert("Player 2 won!");
            startGame();
        }, 1000);
    }

    if (player2Health <= 0) {
        setTimeout(() => {
            alert("Player 1 won!");
            startGame();
        }, 1000);
    }
    player1HealthElement.innerText = '⚡️'.repeat(player1Health);
    player2HealthElement.innerText = '⚡️'.repeat(player2Health);
}

function nextTurn() {
    setTimeout(() => {
        shotgun.dataset.aim = "";
        if (turn == 1) {
            turn = 2;
        } else {
            turn = 1;
        }
        renderTurn();
    }, 1000);
}

function renderTurn() {
    if (turn == 1) {
        document.getElementById("player-2").classList.remove("active");
        document.getElementById("player-1").classList.add("active");
    } else {
        document.getElementById("player-1").classList.remove("active");
        document.getElementById("player-2").classList.add("active");
    }
}

function reload() {
    alert("No shells left! Reloading...");
    liveShells = 3;
    blankShells = 2;
    alert(`${liveShells} live & ${blankShells} blank shells`);
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);
}

function startGame() {
    liveShells = 1;
    blankShells = 2;
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);
    player1Health = 2;
    player2Health = 2;
    renderHealth();
    turn = Math.floor(Math.random() * 2) + 1;
    renderTurn();
    alert(`Game started! ${liveShells} live & ${blankShells} blank shells`);
}

startGame();
