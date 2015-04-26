var app = app || {};

app.songsView = (function() {
    function render(selector) {
        $.get('./templates/songs.html',function(template) {
            var output = Mustache.render(template);
            $(selector).html(output);
        });
    }

    return {
        render: function (selector) {
            render(selector);
        }
    };
}());