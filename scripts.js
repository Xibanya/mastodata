var domain = localStorage.getItem("mastodata-domain");
var client_id = localStorage.getItem("mastodata-clientid");
var secret = localStorage.getItem("mastodata-secret");
var redirect = 'https://xibanya.github.io/mastodata/index.html';

var xyz_client_id = '248ec9c765e3313b26b50b9d6cdb7f6d12c47f8ae10661d138c6d02a17d9c6a4';
var xyz_secret = '08b9e26a6fb1c22aedf430ab0b8f7a4e0ce1b7c508b24e7f6c8510294f496f89';
var xyz_domain = 'mastodon.xyz';

var social_client_id = '345b07536e79d4ce14af8e0d59042ffd53629faed1077808addbecdaab5d4bc1';
var social_secret = '5c331ff73e59bfcc4bd16ee4370e125f496d0718ebc94df86ce3f12991fe6084';
var social_domain = 'mastodon.social';

var cloud_client_id = '8e1853376cb66d9379e02c118189f4b0ec807aba87b666c00f84e5949d8ed123';
var cloud_secret = '764487e298c0df1dc4be4e4dc67bf94b8f03463e3671240611e33643a259988f';
var cloud_domain = 'mastodon.cloud';

var club_client_id = 'd2232d81f57ba41cc0c4637dadc26fcf36c4d3786f2c317de0708c81eb9ed6fd';
var club_domain = 'mastodon.club';
var club_secret = 'aa4c9638c4f1504e27d81b05bf33aab850a7f602f7499f47a9fc48b06cbbe7b4';

var account;
var token = localStorage.getItem("mastodata-token");
var code = localStorage.getItem("mastodata-code");
var fullFollowers = [];
var fullFollowing = [];

function logout(reload) {
	localStorage.clear();
	if (reload) {
	location.reload();
	}
}

function xyz () {
	logout(false);
	domain = xyz_domain;
	client_id = xyz_client_id;	
	secret = xyz_secret;
	GetAuthLink();
}

function social () {
	logout(false);
	domain = social_domain;
	client_id = social_client_id;
	secret = social_secret;
	GetAuthLink();
}

function club () {
	logout(false);
	domain = club_domain;
	client_id = club_client_id;	
	secret = club_secret;
	GetAuthLink();
}

function cloud () {
	logout(false);
	domain = cloud_domain;
	client_id = cloud_client_id;
	secret = cloud_secret;	
	GetAuthLink();
}

	if(typeof code == 'string') {
		//TODO: remove when done debugging
		console.log("Already have code: " + code);	
	}
	else if (findGetParameter('code') != null) {
			code = findGetParameter('code');
			localStorage.setItem("mastodata-code", code);
			document.getElementById("intro").innerHTML = "<p>Please wait while I analyze your data!</p>";
		}

	function GetAuthLink () {		
		localStorage.setItem("mastodata-domain", domain);
		localStorage.setItem("mastodata-clientid", client_id);
		localStorage.setItem("mastodata-secret", secret);
		console.log("Don't have code yet");
		authURL = "https://" + domain + '/oauth/authorize?response_type=code&client_id=' + client_id +'&redirect_uri=' + redirect;
		console.log(authURL);
		window.location.replace(authURL);
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
	data.append("client_secret", secret);
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
		
	getToken.open("POST", "https://" + domain + "/oauth/token", true);
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
				document.getElementById("intro").innerHTML = "<p>Hello " + account + "!  Wait just a moment while I grab your follower data!</p>";	

				GetFollowers();
				GetFollowing();
			}
		}
		
		xmlhttp.open("GET", "https://" + domain + "/api/v1/accounts/verify_credentials", true);
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
						fullFollowers.push(temp);
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
							PrepFollowerChartData(response, allDomains);
						}
			}
		}
		
		xmlhttp.open("GET", "https://" + domain + "/api/v1/accounts/" + userID + "/followers", true);
	    xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
	    xmlhttp.send();
	}
	
	function GetFollowing() {
		var reachedEnd = false;
		var response = [];
		var allDomains = [];
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function () {
	        if (this.readyState == 4 && this.status == 200) {
				
					//get every single domain in the response
					for (var x in JSON.parse(this.responseText)) {

						var temp = JSON.parse(this.responseText)[x].acct; //this is the full account name
						fullFollowing.push(temp);
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
							PrepFollowingChartData(response, allDomains);
						}
			}
		}
		
		xmlhttp.open("GET", "https://" + domain + "/api/v1/accounts/" + userID + "/following", true);
	    xmlhttp.setRequestHeader("Authorization", "Bearer " + token);
	    xmlhttp.send();
	}	

		function PrepFollowerChartData(rawResponse, domains) {
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
					var tempHTML = "<tr><td>" + domains[i] + "</td><td>" + domainFreq[domains[i]] + "</td></tr>";
					//document.getElementById('followerTable').innerHTML += tempHTML;
	                counts.push(domainFreq[domains[i]]);
	            }

				//for (var i in fullFollowers) {
				//	console.log(fullFollowers[i]);					
				//}
				
				var chartTitle = account + "@" + domain + "'s Followers";
				DrawChart(domains, counts, "myChart", chartTitle);				
		}
		
		function PrepFollowingChartData(rawResponse, domains) {
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
					var tempHTML = "<tr><td>" + domains[i] + "</td><td>" + domainFreq[domains[i]] + "</td></tr>";
					//document.getElementById('followingTable').innerHTML += tempHTML;
	                counts.push(domainFreq[domains[i]]);
	            }

				//for (var i in fullFollowing) {
				//	console.log(fullFollowing[i]);
				//}
				
				var chartTitle = account + "@" + domain + "'s Follows";
				DrawChart(domains, counts, "followingChart", chartTitle);				
		}
		
		function DrawChart(domains, dataset, chartID, chartTitle) {
			var ctx = document.getElementById(chartID);
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
	                        text: chartTitle,
	                        position: 'top',
	                        fullWidth: true
	                    },
						legend: {
							display: false
						}
	                }
	            });
				
				document.getElementById("intro").innerHTML = "<p>If you enjoyed this, let me know at <a href=\"https://mastodon.xyz/@Xibanya\" target=\"new\">Xibanya@Mastodon.xyz</a> or <a href=\"https://twitter.com/manuelaxibanya\" target=\"new\">@ManuelaXibanya</a>!</p>";
		}
	           
