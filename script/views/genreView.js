var app = app || {};

app.genreView = (function() {
    function render(selector) {
        $(selector).load('./templates/genre.html')
    }

    return {
        render: function (selector) {
            render(selector);
        }
    };
}());
