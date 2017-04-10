var client_id = '248ec9c765e3313b26b50b9d6cdb7f6d12c47f8ae10661d138c6d02a17d9c6a4'
var domain = 'mastodon.xyz';
var redirect = 'https://xibanya.github.io/mastodata/index.html';

var account;
var token = localStorage.getItem("mastodata-token");
var code = localStorage.getItem("mastodata-code");


	if(typeof code == 'string') {
		//TODO: remove when done debugging
		console.log("Already have code: " + code);
	}
	else
	{
		if (findGetParameter('code') != null) {
			code = findGetParameter('code');
			localStorage.setItem("mastodata-code", code);
			document.getElementById("intro").innerHTML = "<p>You have a code!</p>";
		}
		else
		{
		console.log("Don't have code yet");
		authURL = "https://" + domain + '/oauth/authorize?response_type=code&client_id=' + client_id +'&redirect_uri=' + redirect;
		console.log(authURL);
		document.getElementById("intro").innerHTML = "<a href='"+authURL+"'>Click to authenticate</a>";
		}
	}


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


if (code != null && typeof token != 'string') 
{
	var data = new FormData();
	data.append("grant_type", "authorization_code");
	data.append("client_id", client_id);
	data.append("client_secret", "08b9e26a6fb1c22aedf430ab0b8f7a4e0ce1b7c508b24e7f6c8510294f496f89");
	data.append("redirect_uri", "https://xibanya.github.io/mastodata/index.html");
	data.append("code", code);

	var getToken = new XMLHttpRequest();
	getToken.onreadystatechange = function () {
		if (getToken.readyState == XMLHttpRequest.DONE && getToken.status == 200) {
			token = JSON.parse(this.responseText).access_token;
			localStorage.setItem("mastodata-token", token);
			console.log("Token: " + token);
			GetUser();
		}
	}
		
	getToken.open("POST", "https://mastodon.xyz/oauth/token", true);
	getToken.send(data);
	console.log("Sent POST to get token");
	
}

if(typeof token == 'string')
{
	GetUser();
}

	function GetUser() {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
				userID = JSON.parse(this.responseText).id;
				account = JSON.parse(this.responseText).username;
				console.log("userID: " + userID + ", account: " + account);
				document.getElementById("intro").innerHTML = "<p>Hello " + account + "!</p>";	

				GetFollowers();
			}
		}
		
		xmlhttp.open("GET", "https://mastodon.xyz/api/v1/accounts/verify_credentials", true);
	    xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
	    xmlhttp.send();		
	}
	
	function GetFollowers() {
		var reachedEnd = false;
		var response = [];
		var allDomains = [];
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
							PrepChartData(response, allDomains);
						}
			}
		}
		
		xmlhttp.open("GET", "https://mastodon.xyz/api/v1/accounts/" + userID + "/followers", true);
	    xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
	    xmlhttp.send();
	}

		function PrepChartData(rawResponse, domains) {
			//put all the unique domains into an array
			for (var n in rawResponse) {
	            if (!domains.includes(rawResponse[n])) {
	                domains.push(rawResponse[n]);
	            }
	        }
				            //count frequency of domains
	            var domainFreq = {};
	            for (var i = 0; i < rawResponse.length; i++) {
	                var num = rawResponse[i];
	                domainFreq[num] = domainFreq[num] ? domainFreq[num] + 1 : 1;
	            }
				var counts = [];
	            for (var i in domains) {
	                console.log(domains[i] + ": " + domainFreq[domains[i]]);
	                counts.push(domainFreq[domains[i]]);
	            }

				DrawChart(domains, counts);				
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
								"cornsilk"
								
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
								"cornsilk"								
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
	                        text: account + "'s Followers",
	                        position: 'bottom',
	                        fullWidth: true
	                    }
	                }
	            });
		}
	           

	
//todo, if token is null load setup form, if not proceed to load charts