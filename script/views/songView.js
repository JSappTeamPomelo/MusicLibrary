var app = app || {};

app.songView = (function() {
    function render(song, selector, template, comments) {
        song['comments'] = comments.results;
        $.get(template, function (template) {
            var output = Mustache.render(template, song);
            $(output).insertBefore($(selector));
        });
    }

    return {
        render: function (song, selector, template, comments) {
            render(song, selector, template, comments);
        }
    };
}());