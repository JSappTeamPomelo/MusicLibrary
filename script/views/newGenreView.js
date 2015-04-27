var app = app || {};

app.newGenreView = (function() {
    function render(selector, data) {
        $.get('./templates/newGenre.html',function(template){
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
