// hackity hack challenge for TalentIT 2016 woopwoop 
// Puzzle made by @Antonio and coded by @Arian 1.11.2016

// GENERAL CONSTANTS
var totalMoves = 11;
var playerLocation = [0, 0];
var finishPoint = [7, 3];
var mazeWidth = 12;
var mazeHeight = 10;
var maze = [
    [0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
]

var movesLeft = totalMoves;
var moves = [];
var isLoop = false;
var whileConstruct = "";
var keepGoing = true;
var isWhile = false;
var whileCondition;

var resetGame = function() {
    playerLocation = [0, 0];
    movesLeft = totalMoves;
    isLoop = false;
    whileConstruct = "";
    keepGoing = true;
    isWhile = false;
    whileCondition = "";
    moves = [];
    document.getElementById("feedback").innerText = "";
    document.getElementById("movesLeft").innerText = movesLeft;
    document.getElementById("movesList").innerText = "None";
    document.getElementById("whileDetails").innerText = "";
    document.getElementById("whileToggle").innerText = "Start 'While' loop";
    document.getElementById("winner").innerText = "";
}

var move = function(direction) {
    if (areMovesLeft()) {
        moves.push(direction);
        deductMove();
    }
}

var areMovesLeft = function() {
    if (movesLeft > 0) {
        document.getElementById("feedback").innerText = "";
        return true;
    } else {
        document.getElementById("feedback").innerText = "You're out of moves! Press 'Submit' to evaluate your solution!";
        return false;
    }
}

var deductMove = function() {
    movesLeft -= 1
    document.getElementById("movesLeft").innerText = movesLeft;
    document.getElementById("movesList").innerHTML = "";
    document.getElementById("movesList").appendChild(makeUL(moves));
}

var makeUL = function(array) {
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        var item = document.createElement('li');

        item.appendChild(document.createTextNode(array[i]));

        list.appendChild(item);
    }

    return list;
}

var toggleLoop = function() {
    if (!areMovesLeft()) {
        return;
    }

    isLoop = !isLoop;
    if (isLoop) {
        whileConstruct = "while ( ";
        document.getElementById("whileDetails").innerText = "while: *CHOOSE CONDITION*";
        document.getElementById("whileToggle").innerText = "End 'While' loop";
    } else {
        if (whileConstruct.length === 0) {
            if (moves[moves.length - 1].includes("while")) {
                moves.pop();
            } else {
                moves.push("(end while)");
                deductMove();
            }
        }
        document.getElementById("whileDetails").innerText = "";
        document.getElementById("whileToggle").innerText = "Start 'While' loop";
    }
}

var loopConstructor = function(direction) {
    if (!isLoop || whileConstruct.length === 0) {
        document.getElementById("feedback").innerText = "You need to start your `While` loop before adding moves to it!";
        return;
    }

    whileConstruct += direction + " )";
    moves.push(whileConstruct);
    document.getElementById("whileDetails").innerText = whileConstruct;
    whileConstruct = "";
}

var submitSolution = function() {
    for (var i = 0; i < moves.length; i++) {
        if (isWhile && moves[i] !== "(end while)") {
            continue;
        }

        evaluateMove(moves[i], i);
        if (!keepGoing) {
            break;
        }
    }

    if (playerLocation[0] === finishPoint[0] && playerLocation[1] === finishPoint[1]) {
        document.getElementById("winner").innerText = "Congratulations! You have solved the puzzle! Come visit us and show your solution (the move list printed below) to get your reward!"
    } else {
        document.getElementById("feedback").innerText = "Unfortunately your solution is not correct, as you didn't end up in the END block. Click `Reset` below to try again!";
    }
}

var evaluateMove = function(move, position) {
    switch (move) {
        case "up":
            if (playerLocation[1] - 1 > -1 && maze[playerLocation[0]][playerLocation[1] - 1] === 0) {
                playerLocation[1] -= 1;
            } else {
                keepGoing = false;
            }
            break;
        case "down":
            if (playerLocation[1] + 1 < mazeHeight && maze[playerLocation[0]][playerLocation[1] + 1] === 0) {
                playerLocation[1] += 1;
            } else {
                keepGoing = false;
            }
            break;
        case "left":
            if (playerLocation[0] - 1 > -1 && maze[playerLocation[0] - 1][playerLocation[1]] === 0) {
                playerLocation[0] -= 1;
            } else {
                keepGoing = false;
            }
            break;
        case "right":
            if (playerLocation[0] + 1 < mazeWidth && maze[playerLocation[0] + 1][playerLocation[1]] === 0) {
                playerLocation[0] += 1;
            } else {
                keepGoing = false;
            }
            break;
        case "while ( up )":
            isWhile = true;
            whileCondition = "up";
            constructWhile(position + 1);
            break;
        case "while ( down )":
            isWhile = true;
            whileCondition = "down";
            constructWhile(position + 1);
            break;
        case "while ( left )":
            isWhile = true;
            whileCondition = "left";
            constructWhile(position + 1);
            break;
        case "while ( right )":
            isWhile = true;
            whileCondition = "right";
            constructWhile(position + 1);
            break;
        case "(end while)":
            isWhile = false;
            break;
    }
}

var constructWhile = function(position) {
    var pos = position;
    whileLoop = [];
    while (moves[pos] !== "(end while)") {
        whileLoop.push(moves[pos]);
        pos += 1;
    };
    while (whileConditionHolds(whileCondition)) {
        for (var i = 0; i < whileLoop.length; i++) {
            evaluateMove(whileLoop[i], i);
        }
    };
}

var whileConditionHolds = function(condition) {
    switch (condition) {
        case "up":
            if (playerLocation[1] - 1 > -1 && maze[playerLocation[0]][playerLocation[1] - 1] === 0) {
                return true;
            } else {
                return false;
            }
            break;
        case "down":
            if (playerLocation[1] + 1 < mazeHeight && maze[playerLocation[0]][playerLocation[1] + 1] === 0) {
                return true;
            } else {
                return false;
            }
            break;
        case "left":
            if (playerLocation[0] - 1 > -1 && maze[playerLocation[0] - 1][playerLocation[1]] === 0) {
                return true;
            } else {
                return false;
            }
            break;
        case "right":
            if (playerLocation[0] + 1 < mazeWidth && maze[playerLocation[0] + 1][playerLocation[1]] === 0) {
                return true;
            } else {
                return false;
            }
            break;
    }
}