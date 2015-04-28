var app=app||{};

app.controller=(function(){
    function BaseController(data){
        this._data=data;
    }

    var queryString='';

    BaseController.prototype.loadGenres=function(selector){
        var _this = this;

        this._data.genre.getAllGenres('')
            .then(function(data) {
                console.log(data);
                app.genreView.render(selector, data);
            }, function(error) {
                console.log(error);
            })
    };

    BaseController.prototype.loadPlaylist=function(selector){
        var _this=this;

        if(sessionStorage['sessionToken']){
            // to get only current user playlists: _this._data.playList.getAllPlayLists('?where={"ofUser":{"__type":"Pointer","className":"_User","objectId":"' + sessionStorage['currentUserId'] + '"}}')
            _this._data.playList.getAllPlayLists('')
                .then(function(myPlayLists){
                    app.playListsView.render(selector, myPlayLists);
                }, function(error) {
                    console.log(error);
                });
        }
        else{
            $(selector).load('./templates/plsLogin.html')
        }

    };

    BaseController.prototype.loadHome=function(selector){
        this._data.playList.getAllPlayLists('?order=-like')
            .then(function(topPlayLists){
                console.log(topPlayLists);
                var topFivePlayLists = {
                    results: topPlayLists.results.slice(0, 5)
                };
                console.log(topFivePlayLists);
                app.loadHomeView.render(selector, topFivePlayLists);
            }, function(error) {
                console.log(error);
            });
    };

    BaseController.prototype.loadLogin=function(selector){
        app.loadLoginView.render(selector);
    };

    BaseController.prototype.loadRegister=function(selector){
        app.registerView.render(selector);
    };

    BaseController.prototype.loadSongs=function(selector){
        var _this = this;

        this._data.genre.getAllGenres('')
            .then(function(data) {
                app.songsView.render(selector, data);
            }, function(error) {
                console.log(error);
            });

        this._data.songs.getAll('?include=genre')
            .then(function(data){
                var results = data.results;
                results.forEach(function(song) {
                    _this._data.comments.getCommentsBySong(song.objectId)
                        .then(function(comments) {
                            _this._data.playList.getMyPlayLists()
                                .then(function(playlists) {
                                    app.songView.render(song, '#create-song-btn', './templates/song.html', comments, playlists);
                                }, function(error) {
                                    console.log(error);
                                })
                        }, function(error) {
                            console.log(error);
                        });
                });
            })
    };

    return{
        get:function(data){
            return new BaseController(data);
        }
    }
}());
