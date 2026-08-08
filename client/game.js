// ============================================================
// ROYAL QUEST
// Luxury Family Board Game
// GAME ENGINE
// ============================================================


// ------------------------------------------------------------
// SCREEN ELEMENTS
// ------------------------------------------------------------

const startScreen = document.getElementById("start-screen");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const winnerScreen = document.getElementById("winner-screen");

const startButton = document.getElementById("start-button");
const beginButton = document.getElementById("begin-button");
const rollButton = document.getElementById("roll-button");
const restartButton = document.getElementById("restart-button");

const diceElement = document.getElementById("dice");
const currentPlayerElement =
    document.getElementById("current-player");

const scoreboard =
    document.getElementById("scoreboard");

const winnerName =
    document.getElementById("winner-name");

const winnerScore =
    document.getElementById("winner-score");


// ------------------------------------------------------------
// CANVAS
// ------------------------------------------------------------

const canvas =
    document.getElementById("game-board");

const ctx = canvas.getContext("2d");


// ------------------------------------------------------------
// GAME VARIABLES
// ------------------------------------------------------------

let players = [];

let currentPlayerIndex = 0;

let isRolling = false;

let gameFinished = false;

let animationFrame = null;


// ------------------------------------------------------------
// BOARD SETTINGS
// ------------------------------------------------------------

const BOARD_SIZE = 900;

const CENTER_X = 450;

const CENTER_Y = 450;

const BOARD_RADIUS = 310;

const TOTAL_TILES = 28;


// ------------------------------------------------------------
// BOARD TILES
// ------------------------------------------------------------

const tiles = [];


// Create circular board

for (let i = 0; i < TOTAL_TILES; i++) {

    const angle =
        (-Math.PI / 2) +
        (Math.PI * 2 * i / TOTAL_TILES);

    tiles.push({

        x:
            CENTER_X +
            BOARD_RADIUS *
            Math.cos(angle),

        y:
            CENTER_Y +
            BOARD_RADIUS *
            Math.sin(angle)

    });

}


// ------------------------------------------------------------
// SPECIAL TILES
// ------------------------------------------------------------

const specialTiles = {

    2: {
        type: "bonus",
        points: 15
    },

    5: {
        type: "treasure",
        points: 25
    },

    8: {
        type: "bonus",
        points: 20
    },

    12: {
        type: "royal",
        points: 35
    },

    16: {
        type: "bonus",
        points: 15
    },

    19: {
        type: "treasure",
        points: 30
    },

    23: {
        type: "royal",
        points: 45
    },

    26: {
        type: "treasure",
        points: 25
    }

};


// ------------------------------------------------------------
// PLAYER COLORS
// ------------------------------------------------------------

const playerColors = [

    "#e7bd65",

    "#a9d7ed",

    "#d6a7d0",

    "#9dd3a5"

];


// ------------------------------------------------------------
// START GAME SCREEN
// ------------------------------------------------------------

startButton.addEventListener(
    "click",
    () => {

        startScreen.classList.add("hidden");

        setupScreen.classList.remove("hidden");

    }
);


// ------------------------------------------------------------
// CREATE PLAYERS
// ------------------------------------------------------------

beginButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    const names = [

        document.getElementById("player1").value.trim(),

        document.getElementById("player2").value.trim(),

        document.getElementById("player3").value.trim(),

        document.getElementById("player4").value.trim()

    ];


    const validNames =
        names.filter(
            name => name.length > 0
        );


    // Need at least two players

    if (validNames.length < 2) {

        alert(
            "Please enter at least 2 player names."
        );

        return;

    }


    // Create player objects

    players =
        validNames.map(
            (name, index) => {

                return {

                    name: name,

                    position: 0,

                    score: 0,

                    laps: 0,

                    color:
                        playerColors[index],

                    moving: false

                };

            }
        );


    currentPlayerIndex = 0;

    gameFinished = false;


    setupScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    updateGame();

    drawBoard();

}


// ------------------------------------------------------------
// UPDATE GAME UI
// ------------------------------------------------------------

function updateGame() {

    if (players.length === 0) {

        return;

    }


    const player =
        players[currentPlayerIndex];


    currentPlayerElement.textContent =
        player.name;


    updateScoreboard();

    drawBoard();

}


// ------------------------------------------------------------
// SCOREBOARD
// ------------------------------------------------------------

function updateScoreboard() {

    scoreboard.innerHTML = "";


    players.forEach(
        (player, index) => {

            const card =
                document.createElement("div");


            card.className =
                "score-card";


            if (
                index ===
                currentPlayerIndex
            ) {

                card.classList.add(
                    "active"
                );

            }


            card.innerHTML = `

                <strong>
                    ${escapeHTML(player.name)}
                </strong>

                <span>
                    ${player.score} points
                </span>

            `;


            scoreboard.appendChild(card);

        }
    );

}


// ------------------------------------------------------------
// ESCAPE PLAYER NAMES
// ------------------------------------------------------------

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ------------------------------------------------------------
// ROLL DICE
// ------------------------------------------------------------

rollButton.addEventListener(
    "click",
    rollDice
);


function rollDice() {

    if (isRolling) {

        return;

    }


    if (gameFinished) {

        return;

    }


    isRolling = true;

    rollButton.disabled = true;


    diceElement.classList.add(
        "rolling"
    );


    let rollNumber = 0;


    const diceAnimation =
        setInterval(
            () => {

                rollNumber =
                    Math.floor(
                        Math.random() * 6
                    ) + 1;


                diceElement.textContent =
                    rollNumber;

            },
            80
        );


    setTimeout(
        () => {

            clearInterval(
                diceAnimation
            );


            const finalRoll =
                Math.floor(
                    Math.random() * 6
                ) + 1;


            diceElement.textContent =
                finalRoll;


            diceElement.classList.remove(
                "rolling"
            );


            movePlayer(finalRoll);

        },
        700
    );

}


// ------------------------------------------------------------
// MOVE PLAYER
// ------------------------------------------------------------

function movePlayer(steps) {

    const player =
        players[currentPlayerIndex];


    const startingPosition =
        player.position;


    const targetPosition =
        (
            player.position +
            steps
        ) % TOTAL_TILES;


    // Check if player completed a lap

    if (
        startingPosition +
        steps >=
        TOTAL_TILES
    ) {

        player.laps++;

        player.score += 50;

    }


    animatePlayerMovement(
        player,
        targetPosition,
        steps
    );

}


// ------------------------------------------------------------
// PLAYER MOVEMENT ANIMATION
// ------------------------------------------------------------

function animatePlayerMovement(
    player,
    targetPosition,
    steps
) {

    let moved = 0;


    player.moving = true;


    const movement =
        setInterval(
            () => {

                player.position =
                    (
                        player.position +
                        1
                    ) % TOTAL_TILES;


                moved++;


                drawBoard();


                if (
                    moved >= steps
                ) {

                    clearInterval(
                        movement
                    );


                    player.moving =
                        false;


                    landedOnTile(
                        player
                    );

                }

            },
            220
        );

}


// ------------------------------------------------------------
// LAND ON TILE
// ------------------------------------------------------------

function landedOnTile(player) {

    const tile =
        specialTiles[
            player.position
        ];


    if (tile) {

        player.score +=
            tile.points;

        showTileMessage(
            tile,
            player
        );

    }


    updateGame();


    // Small delay before next player

    setTimeout(
        () => {

            checkForWinner();

        },
        500
    );

}


// ------------------------------------------------------------
// TILE MESSAGE
// ------------------------------------------------------------

function showTileMessage(
    tile,
    player
) {

    let message = "";


    if (
        tile.type ===
        "bonus"
    ) {

        message =
            `✦ BONUS! +${tile.points} points`;

    }


    if (
        tile.type ===
        "treasure"
    ) {

        message =
            `💎 TREASURE! +${tile.points} points`;

    }


    if (
        tile.type ===
        "royal"
    ) {

        message =
            `👑 ROYAL BONUS! +${tile.points} points`;

    }


    console.log(
        `${player.name}: ${message}`
    );

}


// ------------------------------------------------------------
// CHECK WINNER
// ------------------------------------------------------------

function checkForWinner() {

    const winner =
        players.find(
            player =>
                player.laps >= 2
        );


    if (winner) {

        finishGame(winner);

        return;

    }


    nextTurn();

}


// ------------------------------------------------------------
// NEXT PLAYER
// ------------------------------------------------------------

function nextTurn() {

    currentPlayerIndex =
        (
            currentPlayerIndex + 1
        ) % players.length;


    isRolling = false;

    rollButton.disabled = false;


    updateGame();

}


// ------------------------------------------------------------
// FINISH GAME
// ------------------------------------------------------------

function finishGame(winner) {

    gameFinished = true;

    rollButton.disabled = true;


    winnerName.textContent =
        winner.name;


    winnerScore.textContent =
        `${winner.score} Points`;


    gameScreen.classList.add(
        "hidden"
    );


    winnerScreen.classList.remove(
        "hidden"
    );

}


// ------------------------------------------------------------
// RESTART GAME
// ------------------------------------------------------------

restartButton.addEventListener(
    "click",
    () => {

        winnerScreen.classList.add(
            "hidden"
        );

        setupScreen.classList.remove(
            "hidden"
        );


        players = [];

        currentPlayerIndex = 0;

        gameFinished = false;

        diceElement.textContent = "?";

    }
);


// ============================================================
// BOARD DRAWING
// ============================================================

function drawBoard() {

    ctx.clearRect(
        0,
        0,
        BOARD_SIZE,
        BOARD_SIZE
    );


    // --------------------------------------------------------
    // BACKGROUND
    // --------------------------------------------------------

    const background =
        ctx.createRadialGradient(
            CENTER_X,
            CENTER_Y,
            50,
            CENTER_X,
            CENTER_Y,
            500
        );


    background.addColorStop(
        0,
        "#292230"
    );


    background.addColorStop(
        1,
        "#08070c"
    );


    ctx.fillStyle =
        background;


    ctx.fillRect(
        0,
        0,
        BOARD_SIZE,
        BOARD_SIZE
    );


    // --------------------------------------------------------
    // OUTER BOARD
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        CENTER_X,
        CENTER_Y,
        350,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#111019";


    ctx.fill();


    ctx.strokeStyle =
        "rgba(232,189,99,0.45)";


    ctx.lineWidth = 5;


    ctx.stroke();


    // --------------------------------------------------------
    // INNER RING
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        CENTER_X,
        CENTER_Y,
        245,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle =
        "rgba(232,189,99,0.18)";


    ctx.lineWidth = 2;


    ctx.stroke();


    // --------------------------------------------------------
    // CONNECTING PATH
    // --------------------------------------------------------

    ctx.beginPath();


    tiles.forEach(
        (tile, index) => {

            if (index === 0) {

                ctx.moveTo(
                    tile.x,
                    tile.y
                );

            } else {

                ctx.lineTo(
                    tile.x,
                    tile.y
                );

            }

        }
    );


    ctx.closePath();


    ctx.strokeStyle =
        "rgba(232,189,99,0.22)";


    ctx.lineWidth = 3;


    ctx.stroke();


    // --------------------------------------------------------
    // TILES
    // --------------------------------------------------------

    tiles.forEach(
        (tile, index) => {

            drawTile(
                tile,
                index
            );

        }
    );


    // --------------------------------------------------------
    // CENTER
    // --------------------------------------------------------

    drawCenterLogo();


    // --------------------------------------------------------
    // PLAYERS
    // --------------------------------------------------------

    players.forEach(
        (player, index) => {

            drawPlayer(
                player,
                index
            );

        }
    );

}


// ------------------------------------------------------------
// DRAW TILE
// ------------------------------------------------------------

function drawTile(
    tile,
    index
) {

    const special =
        specialTiles[index];


    ctx.beginPath();

    ctx.arc(
        tile.x,
        tile.y,
        32,
        0,
        Math.PI * 2
    );


    if (special) {

        if (
            special.type ===
            "treasure"
        ) {

            ctx.fillStyle =
                "#6b4c1b";

        }

        else if (
            special.type ===
            "royal"
        ) {

            ctx.fillStyle =
                "#49365e";

        }

        else {

            ctx.fillStyle =
                "#51411f";

        }

    } else {

        ctx.fillStyle =
            "#19151f";

    }


    ctx.fill();


    ctx.strokeStyle =
        special
            ? "#e8bd63"
            : "rgba(255,255,255,0.10)";


    ctx.lineWidth = 2;


    ctx.stroke();


    // Tile number

    ctx.fillStyle =
        "#eee4ce";


    ctx.font =
        "bold 14px Arial";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    let symbol =
        index + 1;


    if (special) {

        if (
            special.type ===
            "treasure"
        ) {

            symbol = "◆";

        }

        else if (
            special.type ===
            "royal"
        ) {

            symbol = "♛";

        }

        else {

            symbol = "✦";

        }

    }


    ctx.fillText(
        symbol,
        tile.x,
        tile.y
    );

}


// ------------------------------------------------------------
// CENTER LOGO
// ------------------------------------------------------------

function drawCenterLogo() {

    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillStyle =
        "#f2dda7";


    ctx.font =
        "bold 48px Georgia";


    ctx.fillText(
        "ROYAL",
        CENTER_X,
        CENTER_Y - 25
    );


    ctx.font =
        "bold 26px Georgia";


    ctx.fillText(
        "QUEST",
        CENTER_X,
        CENTER_Y + 20
    );


    ctx.fillStyle =
        "#9e9689";


    ctx.font =
        "11px Arial";


    ctx.fillText(
        "COLLECT • PLAY • WIN",
        CENTER_X,
        CENTER_Y + 55
    );

}


// ------------------------------------------------------------
// DRAW PLAYER
// ------------------------------------------------------------

function drawPlayer(
    player,
    playerIndex
) {

    const tile =
        tiles[player.position];


    // Offset players slightly
    // when they are on the same tile

    const offsetX =
        (playerIndex % 2) * 18 - 9;


    const offsetY =
        Math.floor(playerIndex / 2) *
        18 - 9;


    const x =
        tile.x + offsetX;


    const y =
        tile.y + offsetY;


    // Glow

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        18,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        player.color;


    ctx.shadowColor =
        player.color;


    ctx.shadowBlur = 20;


    ctx.fill();


    ctx.shadowBlur = 0;


    // Outer ring

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        12,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth = 2;


    ctx.stroke();

}


// ============================================================
// KEYBOARD SUPPORT
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code ===
            "Space"
        ) {

            if (
                !gameScreen.classList.contains(
                    "hidden"
                )
            ) {

                rollDice();

            }

        }

    }
);


// ============================================================
// INITIAL DRAW
// ============================================================

drawBoard();