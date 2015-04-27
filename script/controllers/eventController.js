var app=app||{};

app.eventController=(function(){
    function EventController(data){
        this._data=data;
    }

    EventController.prototype.attachEventHandlers = function() {
        var selector='#wrapper';
        var otherSelector='#currentUser';
        attachLoginHandler.call(this,selector);
        attachRegisterHandler.call(this,selector);
        attachCreateSongHandler.call(this,selector);
        attachDeleteSongHandler.call(this,selector);
        attachLikeSongHandler.call(this,selector);
        attachLogoutHandler.call(this,otherSelector);
        attachGetSongByGenre.call(this,selector);
        attachAddCommentHandler.call(this, selector);
        attachAddToPlayList.call(this,selector);
    };

    var attachLogoutHandler = function(selector) {
        $(selector).on('click', '#logout', function() {
            sessionStorage['currentUser'] = '';
            sessionStorage['sessionToken'] = '';
            sessionStorage['currentUserId'] = '';
            location.reload()
        })
    };

    var attachLoginHandler=function(selector) {
        var _this = this;
        $(selector).on('click', '#login', function() {
            var username = $('#username').val();
            var password = $('#password').val();
            _this._data.users.login(username, password)
                .then(function(data) {
                    sessionStorage['currentUser'] = data.username;
                    sessionStorage['sessionToken'] = data.sessionToken;
                    sessionStorage['currentUserId'] = data.objectId;
                    $('#login').hide()
                    $('#register').hide()
                    $('#login-form').hide();
                    $('#register-form').hide();
                    var link=$('<a href="#">Logout<a>').attr('id', 'logout');
                    $('<div>').prependTo($('#currentUser')).text('Hi ' + sessionStorage['currentUser'] + ' ').append(link);
                    app.router.run('#/Songs');
                    //window.history.replaceState('Songs','Songs','#/songs')
                },function(error) {
                    $('#login-form p').slideDown();
                })
        })
    };

    var attachRegisterHandler = function(selector) {
        var _this = this;
        $(selector).on('click', '#register', function() {
            var username=$('#username').val();
            var password=$('#password').val();
            _this._data.users.register(username,password)
                .then(function(data) {
                    var playList={
                        "name": data.objectId
                    };
                    _this._data.playList.addToPlayList(playList)
                        .then(function(data) {
                            alert('you have playlist');
                        });
                    alert('You are registered successfully ' + username + ' Go to login page');
                    location.reload();
                },function(error) {
                    $('#register-form p').slideDown();
                })
        })
    };

    var attachAddToPlayList = function(selector) {
        var _this = this;
        $(selector).on('click', '.add-to-playlist', function() {
            if (sessionStorage['sessionToken']) {
                var objectId=$(this).parent().data('id');
                var song={"RelationSong": {
                    "__op": "AddRelation",
                    "objects": [{"__type": "Pointer",
                        "className": "Song",
                        "objectId": objectId}]
                }};
                var newString = '?where={"name":"' + sessionStorage['currentUserId'] + '"}';
                _this._data.playList.getAllRelationSong(newString)
                    .then(function(data) {
                        console.log(data.results['0'].objectId);
                        _this._data.playList.editRelation(song, data.results['0'].objectId)
                            .then(function(data) {
                                alert('the song is add to playlist');
                            },function(error) {
                                console.log('song can not be add to playlist');
                            })
                    })
            }
            else{
                alert('Login pls');
            }
        })
    }

    var attachCreateSongHandler = function(selector) {
        var _this=this;
        $(selector).on('click', '#create-song', function(ev) {
            var title=$('#title').val(),
                songFile=$('#song'),
                fileUploadControl = $("#song")[0],
                file = fileUploadControl.files[0],
                genre=$('#genre').val(), //to do - change this to get the id of the genre
                userId = sessionStorage['currentUserId'],
                userName = sessionStorage['currentUser'],
                song = {
                    file: file,
                    title: title,
                    like: 0,
                    genre: {
                        "__type": "Pointer",
                        "className": "Genre",
                        "objectId": "XmUjevGoOT" //hardcode for testing until genre is ready
                    },
                    by: {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": userId
                    }
                };

            _this._data.songs.add(song)
                .then(function(data) {
                    _this._data.songs.getById(data.objectId)
                        .then(function(song){
                            _this._data.comments.getCommentsBySong(song.objectId)
                                .then(function(comments) {
                                    app.songView.render(song, '#create-song-btn', './templates/song.html', comments);
                                }, function(error) {
                                    console.log(error);
                                });
                        },function(error) {
                            console.log(error);
                        });
                    $('#song').val('');
                    $('#title').val('');
                }, function(error) {
                    console.log(error)
                })
        });

        function getSongs(objectId) {
            _this._data.songs.getById(objectId)
                .then(function(song) {
                    console.log(song);
                }, function(error) {
                    console.log(error);
                })
        }

    };

    var attachGetSongByGenre = function(selector) {
        var _this = this;
        $(selector).on('click', '#choose-genre', function() {
            $('div.songs').html('<span id="endOfSongs"></span>');
            var genreId=$('#genre-choose option:selected').attr('id'),
                genre = JSON.stringify({
                    genre: {
                        __type: "Pointer",
                        className: "Genre",
                        objectId: genreId
                    }
                });

            var queryString='?where=' + genre;
            _this._data.songs.getAll('?include=genre')
                .then(function(data) {
                    console.log(data.results);
                    data.results.forEach(function(song) {
                        _this._data.comments.getCommentsBySong(song.objectId)
                            .then(function(comments) {
                                app.songView.render(song, '#endOfSongs', './templates/song.html', comments);
                            }, function(error) {
                                console.log(error);
                            });
                    });
                },function(error) {
                    console.log(error);
                })
        })
    };

    var attachLikeSongHandler=function(selector){
        var _this=this;
        $(selector).on('click','.like-songs-btn',function(ev) {
            var likeConfirmed = confirm('Do you Like?');
            if (likeConfirmed) {
                var objectId = $(this).parent().data('id');
                var obj;
                _this._data.songs.getById(objectId)
                    .then(function(data){
                        var like = data.like+1;
                        var song = {
                            like:like
                        };
                        _this._data.songs.edit(song,objectId)
                            .then(function(data) {
                                location.reload();
                            })
                    })
            }
        })
    };

    var attachDeleteSongHandler = function(selector) {
        var _this = this;
        $(selector).on('click','.delete-songs-btn',function(ev) {
            var deleteConfirmed = confirm('Do you want to delete');
            if (deleteConfirmed) {
                var objectId = $(this).parent().data('id');
                _this._data.songs.delete(objectId)
                    .then(function(data) {
                        $(ev.target).parent().remove();
                    },function(error) {
                        console.log(error);
                    })
            }
        })
    };

    var attachAddCommentHandler = function(selector) {
        var _this = this;
        $(selector).on('click','.add-comment-btn', function(ev){
            var textarea = $(this).prev(),
                content=textarea.val(),
                songDiv = $(this).parent().parent(),
                songId = songDiv.attr('data-id'),
                userId = sessionStorage['currentUserId'],
                userName = sessionStorage['currentUser'],
                comment = {};

            if (songDiv.attr('class') == 'play-list') {
                comment = {
                    content: content,
                    toPlayList: {
                        __type: "Pointer",
                        className: "PlayList",
                        objectId: songId
                    },
                    by: {
                        __type: "Pointer",
                        className: "_User",
                        objectId: userId
                    }
                };
            } else {
                comment = {
                    content: content,
                    toSong: {
                        __type: "Pointer",
                        className: "Song",
                        objectId: songId
                    },
                    by: {
                        __type: "Pointer",
                        className: "_User",
                        objectId: userId
                    }
                };
            }

            _this._data.comments.add(comment)
                .then(function(data) {
                    var newComment = {
                        'objectId': data.objectId,
                        'content': content,
                        'by': {
                            'objectId': userId,
                            'username': userName
                        },
                        'createdAt': data.createdAt
                    };

                    $.get('./templates/addComment.html',function(template){
                        var output = Mustache.render(template, newComment);
                        $(output).insertBefore(textarea);
                    });

                    textarea.val('');

                },function(error) {
                    console.log(error);
                });
        })
    };

    return{
        get:function(data){
            return new EventController(data);
        }
    }
}());

