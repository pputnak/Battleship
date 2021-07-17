/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function() {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var container = document.getElementById("shipContainer");
var rotated = false;
var previousMoves = [];
function CreateShip(length, shipName) {
    var HP = length;
    var name = shipName;
    return {
        getName: function () {
            return name;
        },
        getHP: function () {
            return HP;
        },
        fullHeal: function () {
            HP = length;
        },
        hit: function () {
            HP -= 1;
        },
        isSunk: function () {
            if (HP <= 0)
                return true;
            return false;
        },
    };
}
function getCoordinates(id, length) {
    var coordinates = [];
    var spot = parseInt(id, 10);
    if (!rotated) {
        for (var i = 0; i < length; i += 1) {
            coordinates.push(spot + i);
        }
    }
    if (rotated) {
        for (var i = spot; i < spot + length * 10; i += 10) {
            coordinates.push(i);
        }
    }
    return coordinates;
}
function changeUI(text) {
    var UI = document.querySelector("h2");
    UI.innerText = text;
}
function printID() {
    var grids = document.querySelectorAll(".grid");
    for (var i = 0; i < grids.length; i += 1) {
        grids[i].id = "" + i;
    }
}
function checkReady() {
    var ships = container === null || container === void 0 ? void 0 : container.querySelectorAll(".warship");
    var arr = Array.prototype.slice.call(ships);
    if (arr.every(function (ship) { return ship.style.display === "none"; }))
        return true;
    return false;
}
function CreateGameBoard(name) {
    printID();
    var leftSide = Array.from(Array(100).keys());
    var boardInt = name === "player2" ? leftSide.map(function (grid) { return grid + 100; }) : leftSide;
    var board = boardInt.map(function (arg) { return arg.toString(); });
    var fleet = {
        carrier: CreateShip(5, "carrier"),
        battleship: CreateShip(4, "battleship"),
        cruiser: CreateShip(3, "cruiser"),
        submarine: CreateShip(3, "submarine"),
        destroyer: CreateShip(2, "destroyer"),
    };
    var fleetPlaced = [];
    return {
        name: name,
        fleet: fleet,
        fleetPlaced: fleetPlaced,
        board: board,
        placeFleet: function (coordinates, shipName) {
            var count = 10 * coordinates.length;
            if (!rotated &&
                coordinates.some(function (co) { return co % 10 === 0 && co !== coordinates[0]; }))
                return false;
            if (rotated && coordinates[0] + count - 10 > 100)
                return false;
            if (coordinates.some(function (co) { return Number.isNaN(parseInt(board[co], 10)); }))
                return false;
            coordinates.forEach(function (co) {
                board[co] = shipName;
            });
            fleetPlaced.push(coordinates.length);
            return true;
        },
        gameOver: function () {
            if (Object.values(fleet).every(function (_a) {
                var isSunk = _a.isSunk;
                return isSunk();
            }))
                return true;
            return false;
        },
    };
}
var player1 = CreateGameBoard("player1");
var player2 = CreateGameBoard("player2");
function rotateShip() {
    if (!container)
        return;
    var ships = container === null || container === void 0 ? void 0 : container.getElementsByClassName("warship");
    var arr = Array.prototype.slice.call(ships);
    container.style.flexDirection =
        container.style.flexDirection === "row" ? "column" : "row";
    arr.forEach(function (ship) {
        if (ship.className === "warship " + ship.id) {
            ship.classList.remove(ship.id);
            ship.classList.add(ship.id + "Rotated");
            ship.style.margin = "10px";
            rotated = true;
        }
        else {
            ship.classList.remove(ship.id + "Rotated");
            ship.classList.add(ship.id);
            rotated = false;
        }
    });
}
function placeFleetRandom(player) {
    var fleet = __assign({}, player.fleet);
    while (player.fleetPlaced.length !== 5) {
        var first = Object.values(fleet)[0];
        if (!first)
            return;
        var random = Math.floor(Math.random() * 100);
        if (random < 51)
            rotated = true;
        if (player.placeFleet(getCoordinates(random.toString(), first.getHP()), first.getName())) {
            delete fleet[Object.keys(fleet)[0]];
        }
        rotated = false;
    }
}
function gameStart() {
    if (!checkReady())
        return;
    var shipContainer = document.getElementById("shipContainer");
    var player2Board = document.getElementById("player2Board");
    if (!shipContainer || !player2Board)
        return;
    shipContainer.style.display = "none";
    player2Board.style.display = "flex";
    placeFleetRandom(player2);
    changeUI("Game starts");
}
function markAttack(id, player, grid) {
    var gridAttackedDOM = document.getElementById(id);
    if (!gridAttackedDOM)
        return;
    gridAttackedDOM.innerText = "•";
    gridAttackedDOM.style.color = Number.isNaN(parseInt(player.board[grid], 10))
        ? "red"
        : "white";
}
function changeLife(isSunk, _a) {
    var _b;
    var name = _a.name;
    var life = ((_b = document.getElementById(name + "SunkShip")) === null || _b === void 0 ? void 0 : _b.firstElementChild);
    while ((life === null || life === void 0 ? void 0 : life.style.color) === "black")
        life = life === null || life === void 0 ? void 0 : life.nextElementSibling;
    if (isSunk) {
        life.style.color = "black";
    }
}
function checkSunk(player, shipName) {
    if (player.fleet[shipName].isSunk())
        return true;
    return false;
}
function checkGameOver(player) {
    var enemy = player.name === "player1" ? player2 : player1;
    if (player.gameOver()) {
        changeUI(enemy.name + " wins!");
        document.getElementById("content").style.display = "none";
        document.getElementById("restart").style.display = "block";
    }
}
function displayBattleUI(player, grid) {
    if (checkSunk(player, player.board[grid]))
        changeUI(player.name + "'s " + [player.board[grid]] + " sinks");
    else
        changeUI(player.name + "'s " + [player.board[grid]] + " gets hit");
}
function checkHit(player, grid) {
    if (Number.isNaN(parseInt(player.board[grid], 10))) {
        player.fleet[player.board[grid]].hit();
        displayBattleUI(player, grid);
        changeLife(checkSunk(player, player.board[grid]), player);
        player.board[grid] = "-3";
        checkGameOver(player);
    }
    else {
        player.board[grid] = "-2";
    }
    return player.board[grid];
}
function takeTurn(player, coordinate) {
    var _a;
    if (((_a = document.getElementById(coordinate)) === null || _a === void 0 ? void 0 : _a.innerText) === "•")
        return false;
    var enemy = player.name === "player1" ? player2 : player1;
    var grid = player.name === "player1"
        ? parseInt(coordinate, 10) - 100
        : parseInt(coordinate, 10);
    markAttack(coordinate, enemy, grid);
    if (player === player2) {
        var moves = { index: 0, result: 0, ship: "" };
        moves.ship = enemy.board[grid];
        moves.result = checkHit(enemy, grid);
        moves.index = grid;
        previousMoves.push(moves);
    }
    else {
        checkHit(enemy, grid);
    }
    return true;
}
function convertEvent(e) {
    var target = e.target;
    var coordinates = parseInt(target.id, 10);
    return coordinates.toString();
}
var hunt = false;
function AIPlay() {
    var _a;
    var board = __spreadArray([], player1.board);
    var random = Math.floor(Math.random() * 100);
    var randomEven = random;
    while (randomEven % 2 === 1) {
        randomEven = Math.floor(Math.random() * 100);
        if (board[randomEven] === "-2" || board[randomEven] === "-3")
            randomEven = Math.floor(Math.random() * 100);
    }
    var move;
    if (previousMoves.length < 1)
        return random;
    if (previousMoves.length < 2 && !hunt)
        return random;
    var l1Spot = previousMoves[previousMoves.length - 1];
    var moveRight = l1Spot.index + 1;
    if (!hunt && l1Spot.result === "-3") {
        move = moveRight;
        hunt = true;
        if (previousMoves.length < 2)
            return move.toString();
    }
    var l2Spot = previousMoves[previousMoves.length - 2];
    var moveLeft = l2Spot.index - 1;
    var moveTop = l2Spot.index - 9;
    var moveBottom = l2Spot.index + 11;
    var stopRight = false;
    var stopLeft = false;
    var stopTop = false;
    var stopBottom = false;
    while (board[moveRight] === "-2" || board[moveRight] === "-3") {
        if (!stopRight)
            moveRight += 1;
        if (moveRight % 10 === 0)
            stopRight = true;
        if (stopRight)
            moveRight += 1;
    }
    while (board[moveLeft] === "-2" || board[moveLeft] === "-3") {
        if (!stopLeft)
            moveLeft -= 1;
        if (moveLeft % 10 === 0)
            stopLeft = true;
        if (stopLeft)
            moveLeft += 1;
    }
    while (board[moveTop] === "-2" || board[moveTop] === "-3") {
        if (!stopTop)
            moveTop -= 10;
        if (moveTop < 0)
            stopTop = true;
        if (stopTop)
            moveTop += 10;
        if (moveTop > 100)
            break;
    }
    while (board[moveBottom] === "-2" || board[moveBottom] === "-3") {
        if (!stopBottom)
            moveBottom += 10;
        if (moveBottom > 100)
            stopBottom = true;
        if (stopBottom)
            moveBottom -= 10;
        if (moveBottom < 0)
            break;
    }
    if ((_a = player1.fleet[l1Spot.ship]) === null || _a === void 0 ? void 0 : _a.isSunk()) {
        move = random;
        hunt = false;
    }
    else if (hunt && l1Spot.result === "-3" && l2Spot.result === "-3") {
        if (l1Spot.index - l2Spot.index === 10)
            move = l1Spot.index + 10;
        if (l1Spot.index - l2Spot.index === -10)
            move = l1Spot.index - 10;
        if (l1Spot.index - l2Spot.index === 1)
            move = l1Spot.index + 1;
        if (l1Spot.index - l2Spot.index === -1)
            move = l1Spot.index - 1;
    }
    else if (hunt &&
        l1Spot.result === "-2" &&
        l2Spot.result === "-2" &&
        previousMoves[previousMoves.length - 3].result === "-2") {
        move = moveBottom;
    }
    else if (hunt && l1Spot.result === "-2" && l2Spot.result === "-2") {
        move = moveTop;
    }
    else if (hunt && l1Spot.result === "-2") {
        move = moveLeft;
    }
    else if (!hunt && l1Spot.result === "-2")
        move = random;
    if (!move || l1Spot.index === move || move < 0 || move > 100) {
        while (board[random] === "-2" || board[random] === "-3") {
            random = Math.floor(Math.random() * 100);
        }
        move = random;
        console.log("random");
    }
    return move.toString();
}
function playGame(e) {
    if (takeTurn(player1, convertEvent(e)))
        takeTurn(player2, AIPlay());
}
function restart() {
    for (var i = 0; i < player1.board.length; i += 1) {
        player1.board[i] = i.toString();
        player2.board[i] = (i + 100).toString();
    }
    Object.values(player1.fleet).forEach(function (ship) { return ship.fullHeal(); });
    Object.values(player2.fleet).forEach(function (ship) { return ship.fullHeal(); });
    player1.fleetPlaced = [];
    player2.fleetPlaced = [];
    document.querySelectorAll(".grid").forEach(function (grid) {
        grid.className = "grid";
        grid.style.color = "none";
        grid.innerText = "";
    });
    document.querySelectorAll(".warship").forEach(function (ship) {
        ship.style.display = "block";
    });
    document.querySelectorAll(".life").forEach(function (life) {
        life.style.color = "red";
    });
    if (rotated)
        rotateShip();
    changeUI("Place your ships");
    document.getElementById("content").style.display = "flex";
    document.getElementById("shipContainer").style.display = "flex";
    document.getElementById("player2Board").style.display = "none";
    document.getElementById("restart").style.display = "none";
}
var shipID = "";
var currentPosition = "";
function dragstart(e) {
    var _a;
    var target = e.target;
    shipID = target.id;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", target === null || target === void 0 ? void 0 : target.className);
}
function dropShip(e) {
    var _a;
    var boardTarget = e.currentTarget;
    currentPosition = boardTarget.id;
    var target = e.target;
    var data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text");
    target.className += " " + data;
}
function removeShip(e) {
    if (currentPosition !== "player1MainBoard")
        return;
    var target = e.target;
    target.style.display = "none";
    currentPosition = "";
}
function addListeners() {
    var warships = document.querySelectorAll(".warship");
    var playerBoard = document.querySelector(".mainBoard");
    var AIBoard = document.getElementById("player2Board");
    var AIGrids = AIBoard === null || AIBoard === void 0 ? void 0 : AIBoard.querySelectorAll(".grid");
    var rotateButton = document.querySelector("button");
    var restartButton = document.getElementById("restart");
    var validMove = true;
    warships.forEach(function (warship) {
        return warship.addEventListener("dragstart", dragstart);
    });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("dragover", function (e) { return e.preventDefault(); });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("drop", function (e) {
        var _a;
        var target = e.target;
        var move = player1.placeFleet(getCoordinates(target.id, (_a = player1.fleet[shipID]) === null || _a === void 0 ? void 0 : _a.getHP()), shipID);
        if (!move) {
            validMove = false;
            return;
        }
        dropShip(e);
        validMove = true;
    });
    warships.forEach(function (warship) {
        return warship.addEventListener("dragend", function (e) {
            if (!validMove)
                return;
            removeShip(e);
            gameStart();
        });
    });
    AIGrids === null || AIGrids === void 0 ? void 0 : AIGrids.forEach(function (grid) {
        return grid.addEventListener("click", function (e) { return playGame(e); });
    });
    rotateButton === null || rotateButton === void 0 ? void 0 : rotateButton.addEventListener("click", rotateShip);
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener("click", restart);
}
addListeners();
// TODO fix AI


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map