const ajaxCallService = ($http) => {
	
	const ajaxCall = (url, method) => $http({url, method});

	return {ajaxCall}
}

app.factory('GameService', ajaxCallService);