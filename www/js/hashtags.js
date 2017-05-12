var hashtags = [];
var period = 0;
var numberOfTweets = 10;

$(function () {
    $('#submitButton').click(function () {
        hashtags = $("#hashtags").tagsinput('items');
        period = $("#period").val();
        getTopTweets(hashtags, numberOfTweets, period);
    });

    getTopTweets(hashtags, numberOfTweets, period);
    getTopHashtags();

    setInterval(function () {
        getTopTweets(hashtags, numberOfTweets, period);
        getTopHashtags();
    }, 30 * 1000);
});

function clearTweets() {
    $('#tweets').empty();
}

function showTweets() {
    $('#tweets').show();
}

function hideTweets() {
    $('#tweets').hide();
}

function showProgressIndicator() {
    $('#progress').show();
}

function hideProgress() {
    $('#progress').hide();
}

function showInfo(text) {
    $('#info').show();
    $('#info').text(text);
}

function hideInfo() {
    $('#info').hide();
}

function addTweet(html) {
    $('#tweets').append(html);
}

function getTopHashtags() {
    var params = $.param({
        'numberOfHashtags': 50
    });
    $.getJSON('http://localhost:4567/hashtags?' + params, function (data) {
        var cloud = Object.keys(data).map(function (h) {
            return {
                'text': h,
                'weight': data[h],
                'link': 'https://twitter.com/hashtag/' + h
            };
        });
        $('#hashtagCloud').jQCloud(cloud, {
            width: 750,
            height: 750
        })
    }).fail(function (error) {
        console.log(error);
    });
}

function getTopTweets(hashtags, numberOfTweets, period) {
    hideInfo();
    hideTweets();
    showProgressIndicator();
    var params = $.param({
        'hashtags': hashtags,
        'numberOfTweets': numberOfTweets,
        'period': period
    });
    $.getJSON('http://localhost:4567/tweets?' + params, function (data) {
        clearTweets();
        hideProgress();
        if (data.length === 0) {
            showInfo('No tweets found for given hashtags');
        } else {
            data.forEach(embedTweet);
            showTweets();
        }
    }).fail(function (error) {
        console.log(error);
        hideProgress();
        showInfo('Error');
    });
}

function embedTweet(tweet) {
    var url = 'https://publish.twitter.com/oembed?url=https://twitter.com/' + tweet.username + '/status/' + tweet.id;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (data) {
            addTweet(data.html);
        }
    });
}