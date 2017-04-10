var client_id = '248ec9c765e3313b26b50b9d6cdb7f6d12c47f8ae10661d138c6d02a17d9c6a4'
var domain = 'mastodon.xyz';
var redirect = 'https://xibanya.github.io/mastodata/index.html';

function authenticate() {
	authURL = "https://" + domain + '/oauth/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect;
	console.log(authURL);
	document.getElementById("authlink").innerHTML = "<a href='"+authURL+"'>hi</a>";
	return authURL;
};

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

	var reachedEnd = false;
	var response = [];
	var allDomains = [];
	var token = findGetParameter('code');
	//console.log('Token: ' + token);
	
	if (token != null) {
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function () {
	        if (this.readyState == 4 && this.status == 200) {
				
					//get every single domain in the response
					for (var x in JSON.parse(this.responseText)) {

						var temp = JSON.parse(this.responseText)[x].acct; //this is the full account name
						tempArr = [];
						tempArr = temp.split("@");
						if (tempArr[1] == null) {
							response.push(domain);
						}
						else {
							response.push(tempArr[1]);
						}
					}
					
						var linkHeader = xmlhttp.getResponseHeader('Link');
						if (linkHeader.includes("next")) {
							var getLink = linkHeader.split(">")[0].substring(1);
							console.log(getLink);
							
								xmlhttp.open("GET", getLink, true);
								xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
								xmlhttp.send();
						}
						else {
							PrepChartData();
						}
			}
		}

		function PrepChartData() {
			//put all the unique domains into an array
			for (var n in response) {
	            if (!allDomains.includes(response[n])) {
	                allDomains.push(response[n]);
	            }
	        }
				            //count frequency of domains
	            var domainFreq = {};
	            for (var i = 0; i < response.length; i++) {
	                var num = response[i];
	                domainFreq[num] = domainFreq[num] ? domainFreq[num] + 1 : 1;
	            }
				var counts = [];
	            for (var i in allDomains) {
	                console.log(allDomains[i] + ": " + domainFreq[allDomains[i]]);
	                counts.push(domainFreq[allDomains[i]]);
	            }

				DrawChart(allDomains, counts);				
		}
		
		function DrawChart(domains, dataset) {
			var ctx = document.getElementById("myChart");
			var pieData = {
	                labels: domains,
	                datasets: [
                        {
                            data: dataset,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
								"aliceblue",
								"antiquewhite",
								"aqua",
								"aquamarine",
								"azure",
								"beige",
								"bisque",
								"blanchedalmond",
								"blue",
								"blueviolet",
								"brown",
								"burlywood",
								"cadetblue",
								"chartreuse",
								"chocolate",
								"coral",
								"cornflowerblue",
								"consilk"
								
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
								"aliceblue",
								"antiquewhite",
								"aqua",
								"aquamarine",
								"azure",
								"beige"
								"bisque",
								"blanchedalmond",
								"blue",
								"blueviolet",
								"brown",
								"burlywood",
								"cadetblue",
								"chartreuse",
								"chocolate",
								"coral",
								"cornflowerblue",
								"consilk"								
                            ]
                        }]
	            };

	            var myChart = new Chart(ctx, {
	                type: 'pie',
	                responsive: true,
	                data: pieData,
	                options: {
	                    title: {
	                        display: true,
	                        text: 'Followers',
	                        position: 'bottom',
	                        fullWidth: true
	                    }
	                }
	            });
		}
	            
	    xmlhttp.open("GET", "https://mastodon.xyz/api/v1/accounts/7775/followers", true);
	    xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
	    xmlhttp.send();

	}
//todo, if token is null load setup form, if not proceed to load charts