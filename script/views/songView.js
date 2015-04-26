var app = app || {};

app.songView = (function() {
    function render(_this, song, selector, template) {
        _this._data.comments.getCommentsBySong(song.objectId)
            .then(function (comments) {
                song['comments'] = comments.results;
                $.get(template,function(template){
                    var output=Mustache.render(template,song);
                    $(output).insertBefore($(selector));
                });
            }, function (error) {
                console.log(error.responseText);
            });
    }

    return {
        render: function (_this, song, selector, template) {
            render(_this, song, selector, template);
        }
    };
}());