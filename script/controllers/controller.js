var app=app||{};

app.controller=(function(){
    function BaseController(data){
        this._data=data;
    }

    var queryString='';

    BaseController.prototype.loadGenres=function(selector){
        $(selector).load('./templates/genre.html')
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

                            $.get('./templates/playlist.html',function(template){
                                var output=Mustache.render(template, playList);
                                $(selector).html(output);
                            });

                            console.log(data.results['0'].objectId);
                            var secondQueryString='?where={"$relatedTo":{"object":{"__type":"Pointer","className":"PlayList","objectId":"'
                                + data.results['0'].objectId + '"},"key":"RelationSong"}}'
                            _this._data.songs.getAll(secondQueryString + '&include=genre')
                                .then(function(data){
                                    data.results.forEach(function(song) {
                                        app.songView.render(_this, song, 'div.comments', './templates/songInPlayList.html');
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
        $(selector).load('./templates/home.html')
    };

    BaseController.prototype.loadLogin=function(selector){
        $(selector).load('./templates/login.html')
    };

    BaseController.prototype.loadRegister=function(selector){
        $(selector).load('./templates/register.html')
    };

    BaseController.prototype.loadSongs=function(selector){
        var _this = this;

        $.get('./templates/songs.html',function(template){
            var output=Mustache.render(template);
            $(selector).html(output);
        });

        this._data.songs.getAll('?include=genre')
            .then(function(data){
                var results = data.results;

                results.forEach(function (song) {
                    app.songView.render(_this, song, '#create-song-btn', './templates/song.html');
                });
            })
    };

    return{
        get:function(data){
            return new BaseController(data);
        }
    }
}());
