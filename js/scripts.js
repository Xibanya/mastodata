var client_id = '248ec9c765e3313b26b50b9d6cdb7f6d12c47f8ae10661d138c6d02a17d9c6a4'
var domain = 'https://mastodon.xyz';
var redirect = 'https://xibanya.github.io/mastodata/index.html';

function authenticate() {
	authURL = domain + '/oauth/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect;
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

	var token = findGetParameter('code');
	console.log('Token: ' + token);
	
	//todo, if token is null load setup form, if not proceed to load charts