var app = angular.module("mastodata",[]);
app.controller("mainController", function($scope) {
	$scope.domains = [];
var domainInput = "<div class='input-group'><span class='input-group-addon'>Instance</span><input type='text' class='form-control' id='instanceInput'></div><button type='button' class='btn btn-primary'>Go!</button>";

var domainList = "<ul><li ng-repeat='domain in domains'>{{domain}}</li></ul>";

var storedDomainsCount;
	
	$scope.sortType = 'count';
	$scope.sortReverse = false;
	$scope.searchInstance = '';
	
    //FOR DEBUG ONLY

    //OK THANKS

	$scope.initialize = function() 
	{
	//do we have a saved domain?
	    
        //how many domains do we have saved?
	   


	    if (typeof localStorage.getItem("mastodata-domain0") != 'string' || typeof localStorage.getItem("storedCount") != 'string' || localStorage.getItem("storedCount") == "0" || parseInt(localStorage.getItem("storedCount")) == "Nan")
		{
			//we don't have a domain saved
			//create input form
	        document.getElementById('intro').innerHTML = domainInput;
		}
		else
		{
	        //we do have a domain saved
	        //how many?
	        storedDomainsCount = parseInt(localStorage.getItem("storedCount"));
	        for (i = 0; i < storedDomainsCount; i++)
	        {
	            $scope.domains.push(JSON.parse(localStorage.getItem("mastodata-domain" + i)));
	            console.log($scope.domains);
	        }

			//ask the user if they would like to continue to use this domain or use a new one
			document.getElementById('intro').innerHTML = domainList;
			//for each stored domain, list them then ask user which they want to use
		}
	
	}
	
});