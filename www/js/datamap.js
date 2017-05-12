var worldMap = new Datamap({
    scope: 'world',
    title: 'Sentiment',
    projection: 'equirectangular',
    element: document.getElementById("worldmap"),
    geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
    },
    bubblesConfig: {
        radius: 7,
        exitDelay: 10000 // milliseconds
    },
    responsive: true,
    done: function (datamap) {
        datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
        $("#resetZoom").on("click", function(){ resetZoom(); });
        function redraw() {
            datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        function resetZoom() {
            datamap.svg.selectAll("g").attr("transform", "translate(0,0)scale(1.0)");
        }
    },
    fills: {
        defaultFill: '#ABDDA4',
        "0": 'blue',
        "-1": 'red',
        "1": 'green'
    }
});

worldMap.legend({
    labels: {
        "1": 'Positive',
        "0": 'Neutral',
        "-1": 'Negative'
    }
});

d3.select(window).on('resize', function () {
    worldMap.resize();
});

function determineColor(sentiment) {
    return sentiment === 0 ? "blue" : (sentiment === -1 ? "red" : "green");
}

function determineEmoji(sentiment) {
    return sentiment === 0 ? "&#x1F44C;" : (sentiment === -1 ? "&#x1F44E;" : "&#128077;");
}

var func = function (geo, tweet) {
    var tip = "<div><h3><span style='vertical-align:middle'>@" + tweet.userName + '</span><img style="vertical-align:middle" height="70" width="70" src="' + tweet.avatarURL + '"></h3></div>';
    tip += "<h6>" + tweet.creationDate + "</h6>";
    tip += "<h4>" + tweet.tweetText + "</h4>";
    tip += "Sentiment:<font size='6em' color=" + determineColor(parseInt(tweet.fillKey)) + ">" + determineEmoji(parseInt(tweet.fillKey)) + "</font>";
    return "<div class='hoverinfo tooltip'>" + tip + '</div>';
};

$(document).ready(function () {

    var socket = io();
    socket.on('message', function (msg) {
        var tweet = JSON.parse(msg);
        // console.log(tweet);
        var bubble_array = [];
        bubble_array.push(tweet);
        worldMap.bubbles(bubble_array, {
            popupTemplate: func
        });
    });

});