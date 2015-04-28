var app = app || {};

app.newPlaylistView = (function() {
    function render(selector, data) {
        $.get('./templates/newPlaylist.html',function(template){
            var output = Mustache.render(template, data);
            $(selector).append(output);
        });
    }

    return {
        render: function (selector, data) {
            render(selector, data);
        }
    };
}());
