var _ = require('lodash');

module.exports = function(mySnakeId) {
    this.getNextMove = function(gameBoardState) {

        //===========================
        // Your snake logic goes here
        //===========================

        var mySnake = getSnake(mySnakeId, gameBoardState);

        if (mySnake.isAlive) {
            var occupiedCells = getOccupiedCells(gameBoardState);

            // Check possible moves in random order.
            var moves = [
                "RIGHT",
                "LEFT",
                "STRAIGHT"
            ];

            while (moves) {
                // Select random move and remove it from availiable moves.
                var index = getRandomInt(0, moves.length - 1);
                var move = moves[index];
                moves.splice(index, 1);

                var newHead = getSnakeNewHeadPosition(mySnake, move);

                console.log("test", _.some([{x: 1, y:2}, {x: 3, y:4}, {x: 4, y:5}, {x: 6, y:1}], function(p) {
                    return p.x === 3 && p.y === 4;
                }))

                console.log("occuped", occupiedCells, "newhead", newHead)
                var isOccuped = _.some(occupiedCells, function(p) {
                    return p.x === newHead.x && p.y === newHead.y;
                });

                if (!isOccuped)
                {
                    return move;
                }
            }
        }

        return '';
    }

    var getSnake = function(snakeId, gameBoardState) {
        return _.find(gameBoardState.snakes, { id: mySnakeId});
    };

    var getOccupiedCells = function(gameBoardState) {
        var snakesCells =_.flatten(_.map(gameBoardState.snakes, function(snake) { return snake.cells}));
        return _.union(gameBoardState.walls, snakesCells)
    };

    var offsets = {
        Up: { RIGHT: {x: 1, y: 0}, LEFT: {x:-1, y:0}, STRAIGHT: {x: 0, y:1} },
        Down: { RIGHT: {x: -1, y: 0}, LEFT: {x:1, y:0}, STRAIGHT: {x:0, y:-1} },
        Left: { RIGHT: {x: 0, y: 1}, LEFT: {x:0, y:-1}, STRAIGHT: {x:-1, y:0} },
        Right: { RIGHT: {x: 0, y: -1}, LEFT: {x:0, y:1}, STRAIGHT: {x:1, y:0} }
    }

    var getSnakeNewHeadPosition = function(mySnake, move) {
        var head = mySnake.head;
        var offsetsFromDir = offsets[mySnake.direction];
        if (!offsetsFromDir)
            return head;

        var offset = offsetsFromDir[move];
        if (!offset)
            throw "Invalid move. Use only LEFT, RIGHT, STRAIGHT to calc snakeNewHeadPosition"

        return {x : head.x + offset.x, y: head.y + offset.y };
    }
    
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}