
function setLocalStorage() {
    // script to verify which links a user has upvoted
    var $http = angular.injector(["ng"]).get("$http");
    var username = 'harry';
    var votes;

    // obtain the array of upvoted articles from the database
    $http.get(`/userVoted/${username}`).then(function(result){
        votes = result.data.file[0].voted_links;

        // store the array in local storage
        localStorage.setItem('userVotes', votes);
        console.log(localStorage.getItem('userVotes'));
    });
}



// get the array from local storage
function getVotes() {
    return localStorage.getItem('userVots');
}

// update client view to indicate upvoted articles


// update localstorage upon changes in user vote
