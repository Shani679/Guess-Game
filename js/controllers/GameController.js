app.controller('GameController', ($scope, $http, GameService) => {
	const retrieveData = () => {
		const gameData = JSON.parse(localStorage.getItem('gameData'));
		$scope.min = gameData.minValue;
		$scope.max = gameData.maxValue;
		$scope.guessCounter = gameData.counter;
		$scope.guessNum = gameData.guessNum;
		$scope.step2 = true;
	}

	const getGameStatus = () => GameService.ajaxCall('https://guessing-game-backend-v90sychixp46.runkit.sh/status', 'get').then(({data}) => data.enabled ? getGameRange() : displayError()).catch(err => displayError());

	localStorage.getItem('gameData') ? retrieveData() : getGameStatus();

	const displayError = () => $scope.err = true;
	
	const getGameRange = () => GameService.ajaxCall('https://guessing-game-backend-v90sychixp46.runkit.sh/range', 'get').then(({data}) => {
		data.min === 0 && data.max === 100 ? displayRange(data) : displayError();
	}).catch(err => displayError());

	const displayRange = (data) => {
		$scope.range = data;
		$scope.step1 = true;
	}

	$scope.initGame = (min, max) => {
		$scope.guessCounter = 1;
		$scope.min = min;
		$scope.max = max;
		$scope.guessNum = randomNumber($scope.min, $scope.max);
		$scope.step1 = false;
		$scope.step2 = true;
	}

	$scope.updateRange = (value) => value > $scope.guessNum ? nextGuess(value, $scope.max) : nextGuess($scope.min, value);

	const nextGuess = (min, max) => {
        if($scope.guessNum === min || $scope.guessNum === max){
            return alert('Out of range');  
        } 
        $scope.min = min;
        $scope.max = max;
		$scope.guessCounter++;
		$scope.guessNum = randomNumber(min, max);
		updateLocalStorage(min, max);
	}

	$scope.correctNum = () => {
		localStorage.clear();
		$scope.step2 = false;
		$scope.step3 = true;
	}

	$scope.playAgain = () => {
		$scope.step3 = false;
		getGameStatus();
	}

	const randomNumber = (min, max) => Math.floor(Math.random()*(max - min + 1) + min);

	const updateLocalStorage = (min, max) => {
		const gameData = {minValue: min, maxValue: max, guessNum: $scope.guessNum, counter: $scope.guessCounter}
		localStorage.setItem('gameData', JSON.stringify(gameData));
	}
});