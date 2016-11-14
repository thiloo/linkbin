
function setLocalStorage() {
    // script to verify which links a user has upvoted
    var $http = angular.injector(["ng"]).get("$http");
    // var username = 'harry';
    var votes;

    // obtain the array of upvoted articles from the database
    $http.get(`/userVoted`).then(function(result){
        votes = JSON.stringify(result.data.file[0].voted_links);
        console.log(votes);
        // store the array in local storage
        localStorage.setItem('userVotes', votes);
    }).catch(function(err) {
        console.log(err);
    })
}
setLocalStorage();


// get the array from local storage
function getVotes() {
    return JSON.parse(localStorage.getItem('userVotes'));
}

// update client view to indicate upvoted articles


// update localstorage upon changes in user vote
