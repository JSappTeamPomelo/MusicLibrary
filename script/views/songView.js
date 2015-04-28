var app = app || {};

app.songView = (function() {
    function render(song, selector, template, comments, playLists) {
        song['comments'] = comments.results;
        song['playlists'] = playLists.results;
        $.get(template, function (template) {
            var output = Mustache.render(template, song);
            $(output).insertBefore($(selector));
        });
    }

    return {
        render: function (song, selector, template, comments, playLists) {
            render(song, selector, template, comments, playLists);
        }
    };
}());