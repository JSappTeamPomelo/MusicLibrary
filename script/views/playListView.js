var app = app || {};

app.playListView = (function() {
    function render(selector, playList) {
        $.get('./templates/playlist.html',function(template){
            var output=Mustache.render(template, playList);
            $(selector).html(output);
        });
    }

    return {
        render: function (selector, playList) {
            render(selector, playList);
        }
    };
}());