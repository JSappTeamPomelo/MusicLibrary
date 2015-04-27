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
            var secondString='?where={"name":"' + sessionStorage['currentUserId'] + '"}'
            this._data.playList.getAllRelationSong(secondString)
                .then(function(data){
                    var playListId = data.results['0'].objectId,
                        playList = {};

                    _this._data.comments.getCommentsByPlayList(playListId)
                        .then(function (comments) {
                            console.log(comments.results);
                            playList = {
                                objectId: playListId,
                                comments: comments.results
                            };

                            app.playListView.render(selector, playList);

                            console.log(data.results['0'].objectId);
                            var secondQueryString='?where={"$relatedTo":{"object":{"__type":"Pointer","className":"PlayList","objectId":"'
                                + data.results['0'].objectId + '"},"key":"RelationSong"}}'
                            _this._data.songs.getAll(secondQueryString + '&include=genre')
                                .then(function(data){
                                    data.results.forEach(function(song) {
                                        _this._data.comments.getCommentsBySong(song.objectId)
                                            .then(function(comments) {
                                                app.songView.render(song, 'div.comments', './templates/songInPlayList.html', comments);
                                            }, function(error) {
                                                console.log(error);
                                            });
                                    });
                                });
                        }, function(error) {
                           console.log(error);
                        });
                })
        }
        else{
            $(selector).load('./templates/plsLogin.html')
        }

    }

    BaseController.prototype.loadHome=function(selector){
        app.loadHomeView.render(selector);
    };

    BaseController.prototype.loadLogin=function(selector){
        app.loadLoginView.render(selector);
    };

    BaseController.prototype.loadRegister=function(selector){
        app.registerView.render(selector);
    };

    BaseController.prototype.loadSongs=function(selector){
        var _this = this;

        app.songsView.render(selector);

        this._data.songs.getAll('?include=genre')
            .then(function(data){
                var results = data.results;
                results.forEach(function(song) {
                    _this._data.comments.getCommentsBySong(song.objectId)
                        .then(function(comments) {
                            app.songView.render(song, '#create-song-btn', './templates/song.html', comments);
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
