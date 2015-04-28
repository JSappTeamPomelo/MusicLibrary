var app = app || {};

app.playListView = (function() {
    function render(selector, playList) {
        $.get('./templates/playList.html',function(template){
            var output=Mustache.render(template, playList);
            $('#currentPlayList').html(output);
        });
    }

    return {
        render: function (selector, playList) {
            render(selector, playList);
        }
    };
}());