$(function() {

    // List of users to search on Twitch
    var searchList = [
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "freecodecamp",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas",
        "nocopyrightsounds",
        "vgbootcamp",
        "monstercat",
        "sevens1ns",
        "brunofin",
        "comster404"
    ];

    // Search for all streams when the page loads
    getStreamers();

    // Nav -> Button to show all streams of the list
    $(".nav__all").click(function(event) {
        event.preventDefault();
        if ($(this).hasClass("active"))
            return false;
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        getStreamers();
    });
    
    // Nav -> Button to show all ONLINE streams
    $(".nav__online").click(function(event) {
        event.preventDefault();
        if ($(this).hasClass("active"))
            return false;
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        getStreamers("online");
    });

    // Nav -> Button to show all OFFLINE streams
    $(".nav__offline").click(function(event) {
        event.preventDefault();
        if ($(this).hasClass("active"))
            return false;
        $(".nav__item").removeClass("active");
        $(this).addClass("active");
        getStreamers("offline");
    });

    // When all ajax calls are done, hide the Loading section and reveal the Result section
    $(document).ajaxStop( function() {
        $(".loading").fadeOut();
        $(".result").fadeIn();
        if ($(".result").html() == '') {
            $(".not-found").fadeIn();
        }
    });

    /**
     * Runs through the search list and runs the ajax function for each
     * @param {String} status 
     */ 
    function getStreamers(status = '') {
        $(".result").fadeOut();
        $(".not-found").fadeOut();
        $(".loading").fadeIn();
        $(".result>div").remove();
        searchList.sort();
        for (let i = 0; i < searchList.length; i++) {
            getStreamStatus(searchList[i], status);
        }
    }

    /**
     * Accesses Twitch API and collects data of their streams (online or not)
     * @param {String} user (Username of the desired streamer)
     * @param {String} status (Whether the stream must be online or not. Defaults to select both)
     */
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
                if (data.status == 404 || data.status == 422) {
                    stream.display_name = stream.user_name;
                    stream.logo = "http://via.placeholder.com/70x70/453271/453271";
                    stream.url = "#";
                    stream.extra = "This user doesn't exist or has no account anymore.";
                    stream.game = null;
                } else { 
                    stream.display_name = data.display_name;
                    stream.logo = data.logo;
                    stream.url = data.url;
                    stream.extra = data.status;
                    stream.game = data.game;
                }
                printStreamer(stream);
                
            },
            error: function() {
                console.log("Error searching the data");
            }
        });
    } // endof callTwitch()

    /**
     * Builds the list of streamers that are online and/or offline
     * @param {Object} stream (Stream object with all the info of the streamer)
     */ 
    function printStreamer(stream) {
        
        let insert = 
            `<div class="result__${stream.status == null ? 'offline' : 'online'}">
                <div class="media">
                    <div class="media-left media-middle">
                        <a href="${stream.url}" target=${stream.url == "#" ? "" : "_blank"}>
                        <img src="${stream.logo}" class="media-object result__logo">
                        </a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading">
                            <a href="${stream.url}" class="result__name" target=${stream.url == "#" ? "" : "_blank"}>${stream.display_name}</a>
                        </h4>
                        ${stream.status == null ? '' : '<span class="result__game">Playing: <i>'+stream.game+'</i></span><br>'}
                        ${stream.url != "#" ? '' : '<span class="result__status">'+stream.extra+'</span><br>'}
                        <span class="result__status">${stream.status == null ? '- Offline' : '"'+stream.extra+'"'}</span>
                    </div>
                </div>
            </div>`;
        // var insert = `<li class="list__item">${stream.display_name}</li>`;
        $(".result").append(insert);
        
    } // endof printStreamers()

});