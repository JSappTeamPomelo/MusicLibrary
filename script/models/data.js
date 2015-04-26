var app=app||{};

app.data=(function(){
    function Data(baseUrl,ajaxRequest){
        this.users = app.userModel.load(baseUrl,ajaxRequest);
        this.songs = app.songModel.load(baseUrl,ajaxRequest);
        this.comments = app.commentModel.load(baseUrl, ajaxRequest);
        this.playList = app.playListModel.load(baseUrl,ajaxRequest);
    }

    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester)
        }
    }
}());
