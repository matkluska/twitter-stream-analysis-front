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
        exitDelay: 3000 // Milliseconds
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
        // defaultFill: '#E5DBD2',
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

var func = function (geo, data) {
    var tip = "<div><h3><span style='vertical-align:middle'>@" + data.name + '</span><img style="vertical-align:middle" height="70" width="70" src="' + data.pic + '"></h3></div>';
    tip += "<h6>" + data.date + "</h6>";
    tip += "<h4>" + data.text + "</h4>";
    tip += "Sentiment:<font size='6em' color=" + determineColor(parseInt(data.fillKey)) + ">" + determineEmoji(parseInt(data.fillKey)) + "</font>";
    return "<div class='hoverinfo tooltip'>" + tip + '</div>';
};

$(document).ready(function () {

    // test
    var socket = io();
    socket.on('message', function (msg) {
        // console.log(msg);
        data = msg.split("~|~");
        var bubble = {
            "id": data[0],
            "name": data[1],
            "text": data[2],
            "fillKey": data[3],
            // "fillKey": 0,
            "latitude": data[4],
            "longitude": data[5],
            "pic": data[6],
            "date": data[7]
        };
        console.log(bubble);

        var bubble_array = [];
        bubble_array.push(bubble);
        worldMap.bubbles(bubble_array, {
            popupTemplate: func
        });
    });

});