var app = app || {};

app.loadHomeView = (function() {
    function render(selector, playLists) {
        $.get('./templates/home.html',function(template){
            var output=Mustache.render(template, playLists);
            $(selector).html(output);
        });
    }

    return {
        render: function (selector, playLists) {
            render(selector, playLists);
        }
    };
}());