var app = app || {};

app.loadLoginView = (function() {
    function render(selector) {
        $(selector).load('./templates/login.html')
    }

    return {
        render: function (selector) {
            render(selector);
        }
    };
}());