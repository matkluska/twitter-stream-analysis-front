var prevHashtags = [];
var prevNumberOfTweets = 10;

$(function () {
    $('#submitButton').click(function () {
        var hashtags = $("#hashtags").tagsinput('items');
        getTopTweets(hashtags, 10);
        prevHashtags = hashtags;
        prevNumberOfTweets = 10;
    });

    getTopTweets(prevHashtags, prevNumberOfTweets);

    setInterval(function () {
        console.log('interval...');
        getTopTweets(prevHashtags, prevNumberOfTweets);
    }, 10 * 1000);
});

function clearTweets() {
    $('#tweets').empty();
}

function enableProgressIndicator() {
    clearTweets();
    $('#tweets').text('update...');
}

function prepareGetParams(hashtags) {
    return hashtags
        .map(function (h) {
            return 'hashtags=' + h
        })
        .join('&')
}

function getTopTweets(hashtags, numberOfTweets) {
    enableProgressIndicator();
    var params = prepareGetParams(hashtags);
    $.getJSON('http://localhost:4567/?' + params, function (data) {
        clearTweets();
        data.forEach(function (t) {
            $('#tweets').append('<a href="#" class="list-group-item">' + t.text + '</a>')
        })
    }).fail(function (error) {
        console.log(error);
    });
}