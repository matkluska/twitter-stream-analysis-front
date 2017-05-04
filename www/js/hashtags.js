$(function () {
    $('#submitButton').click(function () {
        var hashtags = $("#hashtags").tagsinput('items');
        var params = prepareGetParams(hashtags);
        $.getJSON('http://localhost:4567/?' + params, function (data) {
            $('#tweets').empty();
            data.forEach(function (t) {
                $('#tweets').append('<a href="#" class="list-group-item">' + t.text + '</a>')
            })
        }).fail(function (error) {
            console.log(error);
        });
    });
});

function prepareGetParams(hashtags) {
    return hashtags
        .map(function (h) {
            return 'hashtags=' + h
        })
        .join('&')
}