let player1Health;
let player2Health;
let turn;
let blankShells;
let liveShells;
let chamber;
let player1Items = [];
let player2Items = [];
let shotgunDamage = 1;

const DEFAULT_HEALTH = 4;
const statusElement = document.getElementById("status");
const instructionsElement = document.getElementById("instructions");
const player1HealthElement = document.getElementById("player-1-health");
const player2HealthElement = document.getElementById("player-2-health");
const player1ItemsElement = document.getElementById("player-1-items");
const player2ItemsElement = document.getElementById("player-2-items");
const turnIndicatorElement = document.getElementById("turn-indicator");
const shotgun = document.getElementById("shotgun");
const shootOpponentButton = document.getElementById("shoot-opponent");
const shootSelfButton = document.getElementById("shoot-self");
const useItemButton = document.getElementById("use-item");

function setStatus(message) {
    statusElement.innerHTML = message;
}

function setInstructions(message) {
    instructionsElement.innerHTML = message;
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
        if (turn === 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    setStatus("Fired a live shell!");
                    damage("player2", shotgunDamage);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    setStatus("Fired a live shell!");
                    damage("player1", shotgunDamage);
                }, 1000);
            }
        }

        if (turn === 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    setStatus("Fired a live shell!");
                    damage("player1", shotgunDamage);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    setStatus("Fired a live shell!");
                    damage("player2", shotgunDamage);
                }, 1000);
            }
        }

    } else {
        if (turn === 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    setStatus("Fired a blank shell!");
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    setStatus("Fired a blank shell!");
                    nextTurn();
                }, 1000);

            }
        }

        if (turn === 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    setStatus("Fired a blank shell!");
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    setStatus("Fired a blank shell!");
                    nextTurn();
                }, 1000);
            }
        }
    }
    if (chamber.length === 0) {
        reload();
    }

    nextTurn();
}

function renderHealth() {
    if (player1Health <= 0) {
        setTimeout(() => {
            setStatus("Player 2 won!");
            startGame();
        }, 1000);
    }

    if (player2Health <= 0) {
        setTimeout(() => {
            setStatus("Player 1 won!");
            startGame();
        }, 1000);
    }
    player1HealthElement.innerText = '⚡️'.repeat(player1Health);
    player2HealthElement.innerText = '⚡️'.repeat(player2Health);
}

function renderItems() {
    player1ItemsElement.innerHTML = player1Items.join(' ');
    player2ItemsElement.innerHTML = player2Items.join(' ');
}

function nextTurn() {
    setTimeout(() => {
        shotgun.dataset.aim = "";
        if (turn === 1) {
            turn = 2;
        } else {
            turn = 1;
        }
        renderTurn();
    }, 1000);
}

function renderTurn() {
    if (turn === 1) {
        document.getElementById("player-2").classList.remove("active");
        document.getElementById("player-1").classList.add("active");
    } else {
        document.getElementById("player-1").classList.remove("active");
        document.getElementById("player-2").classList.add("active");
    }
}

function reload() {
    setStatus("No shells left! Reloading...");
    liveShells = 3;
    blankShells = 2;
    setStatus(`${liveShells} live & ${blankShells} blank shells`);
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);
}

function startGame() {
    liveShells = 1;
    blankShells = 2;
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);
    player1Health = DEFAULT_HEALTH;
    player2Health = DEFAULT_HEALTH;
    player1Items = generateRandomItems();
    player2Items = generateRandomItems();
    renderHealth();
    renderItems();
    turn = Math.floor(Math.random() * 2) + 1;
    renderTurn();
    setInstructions(`Game started! ${liveShells} live & ${blankShells} blank shells`);
}

function generateRandomItems() {
    const items = ["🚬", "🍺", "🔪", "🔍", "⛓"];
    const numberOfItems = Math.floor(Math.random() * 4) + 1;
    let playerItems = [];
    for (let i = 0; i < numberOfItems; i++) {
        playerItems.push(items[Math.floor(Math.random() * items.length)]);
    }
    return playerItems;
}

function useItem(player, item) {
    if (player === "player1") {
        const index = player1Items.indexOf(item);
        if (index > -1) {
            player1Items.splice(index, 1);
        }
    } else if (player === "player2") {
        const index = player2Items.indexOf(item);
        if (index > -1) {
            player2Items.splice(index, 1);
        }
    }

    switch (item) {
        case "🚬":
            addHealth(player, 1);
            break;
        case "🍺":
            chamber.pop();
            setStatus("Shotgun has been racked.");
            break;
        case "🔪":
            shotgunDamage = 2;
            setStatus("Shotgun now does 2 damage.");
            break;
        case "🔍":
            setStatus(`The next round is ${chamber[chamber.length - 1]}`);
            break;
        case "⛓":
            if (player === "player1") {
                nextTurn();
            } else {
                nextTurn();
            }
            break;
        default:
            setStatus("Unknown item.");
    }
    renderItems();
}

function addHealth(player, amount) {
    if (player === "player1") {
        player1Health += amount;
    } else if (player === "player2") {
        player2Health += amount;
    }
    renderHealth();
}

// Event Listeners
shootOpponentButton.addEventListener('click', () => shoot('opponent'));
shootSelfButton.addEventListener('click', () => shoot('self'));
useItemButton.addEventListener('click', () => {
    const item = prompt('Enter the item you want to use:');
    useItem(turn === 1 ? 'player1' : 'player2', item);
});

startGame();
