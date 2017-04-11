angular.module('mastodata',[])
.controller('mainController', function($scope) {
	$scope.domains = [];
var domainInput = "<div class='input-group'><span class='input-group-addon'>Instance</span><input type='text' class='form-control' id='instanceInput'></div><button type='button' class='btn btn-primary'>Go!</button>";

var domainList = "<ul><li ng-repeat='domain in domains'>{{domain}}</li></ul>";

var storedDomainsCount;
	
	$scope.sortType = 'count';
	$scope.sortReverse = false;
	$scope.searchInstance = '';
	
	

	$scope.initialize = function() 
	{
	//do we have a saved domain?
	//TODO: multidimensional saved domains
		storedDomainsCount = localStorage.getItem("s")
		if (typeof localStorage.getItem("mastodata-domain") != 'string')
		{
			//we don't have a domain saved
			//create input form
			document.getElementById('intro').innerHTML = domainInput;
		}
		else
		{
			//we do have a domain saved
			//ask the user if they would like to continue to use this domain or use a new one
			$scope.domains = JSON.parse(localStorage.getItem("mastodata-domain"));
			console.log($scope.domains);
			document.getElementById('intro').innerHTML = domanList;
			//for each stored domain, list them then ask user which they want to use
		}
	
	}
	
});