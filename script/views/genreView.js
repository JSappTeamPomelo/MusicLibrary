var app = app || {};

app.genreView = (function() {
    function render(selector, data) {
        $.get('./templates/genre.html',function(template){
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
