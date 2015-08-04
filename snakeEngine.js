module.exports = function(mySnakeId) {
    this.getNextMove = function(gameBoardState) {
    	if (gameBoardState.snakes[1].isAlive) {
			return "STRAIGHT";
		}

		return "";
	}
}