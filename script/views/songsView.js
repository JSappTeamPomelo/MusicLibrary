var app = app || {};

app.songsView = (function() {
    function render(selector, data) {
        $.get('./templates/songs.html',function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        render: function (selector, data) {
            render(selector, data);
        }
    };
}());