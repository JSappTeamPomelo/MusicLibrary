var app = app || {};

app.registerView = (function() {
    function render(selector) {
        $(selector).load('./templates/register.html')
    }

    return {
        render: function (selector) {
            render(selector);
        }
    };
}());