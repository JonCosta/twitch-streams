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
        "noobs2ninjas",
        "nocopyrightsounds",
        "vgbootcamp",
        "monstercat"
    ];

    var streamers = [];

    // getStreamers();

    $(".nav__all").click(function(event) {
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        event.preventDefault();
        getStreamers();
    });
    
    $(".nav__online").click(function(event) {
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        event.preventDefault();
        getStreamers("online");
    });

    $(".nav__offline").click(function(event) {
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        event.preventDefault();
        getStreamers("offline");
    });

    $(document).ajaxStart(function () {
        $(".loading").fadeIn();
        $(".block__list").fadeOut();        
    })

    $(document).ajaxStop( function() {
        $(".loading").fadeOut();
        $(".block__list").fadeIn();
    });

    function getStreamers(status = '') {
        $(".list__item").remove();
        searchList.sort();
        for (let i = 0; i < searchList.length; i++) {
            getStreamStatus(searchList[i], status);
        }
    }

    function getStreamStatus(user, status = '') {
        $.ajax({
            url: `https://wind-bow.glitch.me/twitch-api/streams/${user}`,
            dataType: "jsonp",
            success: function (data) {
                switch (status) {
                    case "online":
                        if (data.stream != null) {
                            let stream = {status: data.stream, user_name: user};
                            getStreamerData(stream);
                        }
                        break;
                    case "offline":
                        if (data.stream == null) {
                            let stream = {status: data.stream, user_name: user};
                            getStreamerData(stream);
                        }
                        break;
                    default:
                        let stream = {status: data.stream, user_name: user};
                        getStreamerData(stream);
                }
                
            }, 
            error: function () {
                console.log("Error searching the data");                
            }
        })
    }

    /**
     * Returns an object with data and status from the Twitch streamer
     * @param {String} user (Name of the Twitch streamer)
     */
    function getStreamerData(stream) {
        $.ajax({
            url: `https://wind-bow.glitch.me/twitch-api/channels/${stream.user_name}`,
            dataType: "jsonp",
            success: function(data) {
                stream.display_name = data.display_name;
                stream.logo = data.logo;
                stream.url = data.url;
                printStreamer(stream);
            },
            error: function() {
                console.log("Error searching the data");
            }
        });
    } // endof callTwitch()

    /**
     * Builds the list of streamers that are online and/or offline
     * @param {Array} streamers 
     */ 
    function printStreamer(stream) {
        var insert = `<li class="list__item">${stream.display_name}</li>`;
        $(".block__list").append(insert);
        
    } // endof printStreamers()

});