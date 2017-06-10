$(function() {

    // List of users to search on Twitch
    var searchList = [
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "freecodecamp",
        "storbeck",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas"
    ];

    getStreamers();

    function getStreamers() {
        let streamers = [];
        for (let i = 0; i < searchList.length; i++) {
            streamers.push(callTwitch(searchList[i]));
        }
        // Pass the array to a function that will fill the UI?
    }

    /**
     * Returns an object with data and status from the Twitch streamer
     * @param {String} user (Name of the Twitch streamer)
     */
    function callTwitch(user) {
        $.ajax({
            url: "https://wind-bow.glitch.me/twitch-api/streams/"+user+"/",
            dataType: "jsonp",
            beforeSend: function() {
                
            },
            success: function(data) {
                console.log(data);
                return data;
            },
            error: function() {
                console.log("Error searching the data");
            },
            complete: function() {

            }

        })
    }

});