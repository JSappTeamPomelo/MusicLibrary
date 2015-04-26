var app = app || {};

app.loadHomeView = (function() {
    function render(selector) {
        $(selector).load('./templates/home.html')
    }

    return {
        render: function (selector) {
            render(selector);
        }
    };
}());