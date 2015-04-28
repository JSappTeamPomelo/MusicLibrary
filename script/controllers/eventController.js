var app=app||{};

app.eventController=(function(){
    function EventController(data){
        this._data=data;
    }

    EventController.prototype.attachEventHandlers = function() {
        var selector='#wrapper';
        var otherSelector='#currentUser';
        attachLoginHandler.call(this, selector);
        attachRegisterHandler.call(this, selector);
        attachCreateSongHandler.call(this, selector);
        attachDeleteSongHandler.call(this, selector);
        attachLikeSongHandler.call(this, selector);
        attachLogoutHandler.call(this, otherSelector);
        attachGetSongByGenre.call(this, selector);
        attachAddCommentHandler.call(this, selector);
        attachAddToPlayList.call(this, selector);
        attachAddGenre.call(this, selector);
        attachCreatePlayList.call(this, selector);
        attachLoadPlayList.call(this, selector);
        attachLikePlayListHandler.call(this, selector);
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
                    window.location.href = 'index.html#/';
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
                    alert('You are registered successfully ' + username + ' Go to login page');
                    window.location.href = 'index.html#/login';
                },function(error) {
                    $('#register-form p').slideDown();
                })
        })
    };

    var attachAddToPlayList = function(selector) {
        var _this = this;
        $(selector).on('click', '.add-to-playlist', function() {
            if (sessionStorage['sessionToken']) {
                var objectId=$(this).parent().data('id'),
                    song={"RelationSong": {
                        "__op": "AddRelation",
                        "objects": [{"__type": "Pointer",
                            "className": "Song",
                            "objectId": objectId}]
                    }},
                    previous = $(this).prev(),
                    playListId = previous.children('.playlist-choose option:selected').attr('id');

                _this._data.playList.editRelation(song, playListId)
                    .then(function(data) {
                        alert('the song is add to playlist');
                    },function(error) {
                        console.log('song can not be add to playlist');
                    });
            }
            else{
                alert('Login pls');
            }
        })
    }

    var attachCreateSongHandler = function(selector) {
        var _this=this;
        $(selector).on('click', '#create-song', function(ev) {
            if (sessionStorage['sessionToken']) {
                var title=$('#title').val(),
                    songFile=$('#song'),
                    fileUploadControl = $("#song")[0],
                    file = fileUploadControl.files[0],
                    genreId=$('#genre-choose option:selected').attr('id'),
                    userId = sessionStorage['currentUserId'],
                    userName = sessionStorage['currentUser'],
                    song = {
                        file: file,
                        title: title,
                        like: 0,
                        genre: {
                            "__type": "Pointer",
                            "className": "Genre",
                            "objectId": genreId
                        },
                        by: {
                            "__type": "Pointer",
                            "className": "_User",
                            "objectId": userId
                        }
                    };

                    var ext = $('#song').val().split('.').pop().toLowerCase();

                    if (file.size/1024/1024 > 10) {
                        alert('The file must be less than 10 MB');
                    } else if ($.inArray(ext, ['mp3', 'wav']) == -1) {
                        alert('The file extension must be mp3 or wav');
                    } else {
                        _this._data.songs.add(song)
                            .then(function(data) {
                                _this._data.songs.getById(data.objectId)
                                    .then(function(song){
                                        _this._data.comments.getCommentsBySong(song.objectId)
                                            .then(function(comments) {
                                                _this._data.playList.getMyPlayLists()
                                                    .then(function(playlists) {
                                                        app.songView.render(song, '#create-song-btn', './templates/song.html', comments, playlists);
                                                    }, function(error) {
                                                        console.log(error);
                                                    });
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
                    }
            }
            else {
                $(selector).load('./templates/plsLogin.html')
            }
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
                                _this._data.playList.getMyPlayLists()
                                    .then(function(playlists) {
                                        app.songView.render(song, '#endOfSongs', './templates/song.html', comments, playlists);
                                    }, function(error) {
                                        console.log(error);
                                    });
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
            if(sessionStorage['currentUserId']) {
                var likeConfirmed = confirm('Do you Like?');
                if (likeConfirmed) {
                    var objectId = $(this).parent().data('id');
                    var obj;
                    _this._data.songs.getById(objectId)
                        .then(function (data) {
                            var like = data.like + 1;
                            var song = {
                                like: like
                            };
                            if(localStorage[objectId]!=sessionStorage['currentUserId']+objectId){
                                _this._data.songs.edit(song, objectId)
                                    .then(function (data) {
                                        localStorage.setItem(objectId,sessionStorage['currentUserId']+objectId);
                                        $("div[data-id='" + objectId + "'] div.like").html('Like: ' + like);
                                    })
                            }
                            else{
                                alert('‎you already like this song')
                            }

                        })
                }
            }
            else{
                alert('Please login, to like this song')
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
        $(selector).on('click','.add-comment-btn', function(ev) {
            if (sessionStorage['sessionToken']) {
                var textarea = $(this).prev(),
                    content = textarea.val(),
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
                    .then(function (data) {
                        var newComment = {
                            'objectId': data.objectId,
                            'content': content,
                            'by': {
                                'objectId': userId,
                                'username': userName
                            },
                            'createdAt': data.createdAt
                        };

                        $.get('./templates/addComment.html', function (template) {
                            var output = Mustache.render(template, newComment);
                            $(output).insertBefore(textarea);
                        });

                        textarea.val('');

                    }, function (error) {
                        console.log(error);
                    });
            }
            else {
                $(selector).load('./templates/plsLogin.html')
            }
        })
    };

    var attachAddGenre = function(selector) {
        var _this=this;
        $(selector).on('click', '#create-genre', function(ev) {
            var genreName = $('#genreName').val(),
                newGenre = {
                  name: genreName
                };

            _this._data.genre.add(newGenre)
                .then(function(data) {
                    var newGenre = {
                        name: genreName,
                        objectId: data.objectId
                    };

                    app.newGenreView.render('#genre-choose', newGenre);
                }, function(error) {
                    console.log(error);
                })
        })
    };

    var attachCreatePlayList = function(selector) {
        var _this=this;
        $(selector).on('click', '#create-playList', function(ev) {
            if (sessionStorage['sessionToken']) {
                var userObjectId = sessionStorage['currentUserId'],
                    name = $('#newPlayListName').val(),
                    playList = {
                    "name": name,
                    "like": 0,
                    "ofUser": {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": userObjectId
                    }
                };

                _this._data.playList.createPlayList(playList)
                    .then(function (data) {
                        var newPlaylist = {
                            name: name,
                            objectId: data.objectId
                        };

                        app.newPlaylistView.render('ul.ul-playlist', newPlaylist);
                        $('#newPlayListName').val('');
                    });
            }
            else {
                alert('Login pls');
            }
        });
    };

    var attachLoadPlayList = function(selector) {
        var _this = this;
        $(selector).on('click', '.playlist-item', function(ev) {
            var playListId = $(this).attr('id');
            _this._data.playList.getAllPlayLists('/' + playListId)
                .then(function (data) {
                    var playList = {},
                        likes = data.like;

                    _this._data.comments.getCommentsByPlayList(playListId)
                        .then(function (comments) {
                            playList = {
                                objectId: playListId,
                                comments: comments.results,
                                like: likes
                            };

                            app.playListView.render(selector, playList);

                            var secondQueryString = '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"PlayList","objectId":"'
                                + playListId + '"},"key":"RelationSong"}}';
                            _this._data.songs.getAll(secondQueryString + '&include=genre')
                                .then(function (data) {
                                    data.results.forEach(function (song) {
                                        _this._data.comments.getCommentsBySong(song.objectId)
                                            .then(function (comments) {
                                                _this._data.playList.getMyPlayLists()
                                                    .then(function(playlists) {
                                                        app.songView.render(song, 'div.comments', './templates/songInPlayList.html', comments, playlists);
                                                    }, function(error) {
                                                        console.log(error);
                                                    })
                                            }, function (error) {
                                                console.log(error);
                                            });
                                    });
                                });
                        }, function (error) {
                            console.log(error);
                        });
                })
        });
    };

    var attachLikePlayListHandler = function(selector) {
        var _this = this;
        $(selector).on('click', '.like-playlists-btn', function(ev) {
            if (sessionStorage['currentUserId'] ) {
                var likeConfirmed = confirm('Do you Like?');
                if (likeConfirmed) {
                    var objectId = $(this).next().data('id');
                    var obj;
                    _this._data.playList.getById(objectId)
                        .then(function (data) {
                            var like = data.like + 1;
                            var playlist = {
                                like: like
                            };
                            if(localStorage[objectId]!=sessionStorage['currentUserId']+objectId){
                                _this._data.playList.edit(playlist, objectId)
                                    .then(function (data) {
                                        localStorage.setItem(objectId, sessionStorage['currentUserId'] + objectId);
                                        $('#likePlayList').html('Like: ' + like);
                                    })
                            }
                            else{
                                alert('‎you already like this playlist');
                            }

                        })
                }
            }
            else{
                alert('Please login, to like this song');
            }
        })
    };

    return{
        get:function(data){
            return new EventController(data);
        }
    }
}());

