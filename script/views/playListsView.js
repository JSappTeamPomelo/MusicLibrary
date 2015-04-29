var app = app || {};

app.playListsView = (function() {
    function render(selector, playLists) {
        $.get('./templates/playLists.html',function(template){
            var output=Mustache.render(template, playLists);
            $(selector).html(output);
            $("li.playlist-item").css({"cursor":"pointer"});
        });
    }

    return {
        render: function (selector, playLists) {
            render(selector, playLists);
        }
    };
}());