var prevHashtags = [];

$(function () {
    $('#submitButton').click(function () {
        var hashtags = $("#hashtags").tagsinput('items');
        getTopTweets(hashtags, 10);
        prevHashtags = hashtags;
    });

    getTopTweets(prevHashtags, 10);
    getTopHashtags();

    setInterval(function () {
        getTopTweets(prevHashtags, 10);
        getTopHashtags();
    }, 30 * 1000);
});

function clearTweets() {
    $('#tweetsTable').find('tbody').empty();
}

function showProgressIndicator() {
    $('#progress').show();
}

function hideProgress() {
    $('#progress').hide();
}

function showTweetsTable() {
    $('#tweetsTable').show();
}

function hideTweetsTable() {
    $('#tweetsTable').hide();
}

function showInfo() {
    $('#info').show();
}

function hideInfo() {
    $('#info').hide();
}

function addTweet(t) {
    $('#tweetsTable')
        .find('tbody')
        .append(''
            + '<tr>'
            + '<td>' + t.text + '</td>'
            + '<td>' + t.retweetCount + '</td>'
            + '<td>' + t.favoriteCount + '</td>'
            + '</tr>'
        )
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

function getTopTweets(hashtags, numberOfTweets) {
    hideTweetsTable();
    hideInfo();
    showProgressIndicator();
    var params = $.param({
        'hashtags': hashtags,
        'numberOfTweets': numberOfTweets
    });
    $.getJSON('http://localhost:4567/tweets?' + params, function (data) {
        clearTweets();
        hideProgress();
        if (data.length === 0) {
            showInfo();
            $('#info').text('No tweets found for given hashtags');
        } else {
            showTweetsTable();
            data.forEach(addTweet)
        }
    }).fail(function (error) {
        console.log(error);
        hideProgress();
        showInfo();
        $('#info').text('Error');
    });
}