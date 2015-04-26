var app=app||{};

app.controller=(function(){
    function BaseController(data){
        this._data=data;
    }
    var queryString='';
    BaseController.prototype.loadGenres=function(selector){
        $(selector).load('./templates/genre.html')
    }

    BaseController.prototype.loadPlaylist=function(selector){
        var _this=this;
        if(sessionStorage['sessionToken']){
            var secondString='?where={"name":"' + sessionStorage['currentUserId'] + '"}'
            this._data.playList.getAllRelationSong(secondString)
                .then(function(data){
                    console.log(data.results['0'].objectId)
                    var secondQueryString='?where={"$relatedTo":{"object":{"__type":"Pointer","className":"PlayList","objectId":"' + data.results['0'].objectId + '"},"key":"RelationSong"}}'
                    _this._data.songs.getAll(secondQueryString)
                        .then(function(data){
                            $.get('./templates/playlist.html',function(template){
                                var output=Mustache.render(template,data);
                                $(selector).html(output);
                            })
                        })
                })

//            this._data.songs.getAllRelationSong(secondQueryString)
//            $(selector).load('./templates/playlist.html')
//            $('<div>').appendTo($('#play-list')).text("Hi "+sessionStorage['currentUser'])
        }
        else{
            $(selector).load('./templates/plsLogin.html')
        }

    }

    BaseController.prototype.loadHome=function(selector){
        $(selector).load('./templates/home.html')
    }

    BaseController.prototype.loadLogin=function(selector){
        $(selector).load('./templates/login.html')
    }

    BaseController.prototype.loadRegister=function(selector){
        $(selector).load('./templates/register.html')
    }
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
                    _this._data.comments.getCommentsBySong(song.objectId)
                        .then(function (comments) {
                            song['comments'] = comments.results;
                            $.get('./templates/song.html',function(template){
                                var output=Mustache.render(template,song);
                                //$(selector).prepend(output);
                                $(output).insertBefore($('#create-song-btn'));
                            })
                        }, function (error) {
                            console.log(error.responseText);
                        });
                });
            })
    }

    BaseController.prototype.attachEventHandlers=function(){
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
    }

    var attachLogoutHandler=function(selector){
        $(selector).on('click','#logout',function(){
            sessionStorage['currentUser']='';
            sessionStorage['sessionToken']='';
            sessionStorage['currentUserId']='';
            location.reload()
        })
    }

    var attachLoginHandler=function(selector){
        var _this=this;
        $(selector).on('click','#login',function(){
            var username=$('#username').val();
            var password=$('#password').val();
            _this._data.users.login(username,password)
                .then(function(data){
                    sessionStorage['currentUser']=data.username;
                    sessionStorage['sessionToken']=data.sessionToken;
                    sessionStorage['currentUserId']=data.objectId;
                    $('#login').hide()
                    $('#register').hide()
                    $('#login-form').hide();
                    $('#register-form').hide();
                    var link=$('<a href="#">Logout<a>').attr('id','logout')
                    $('<div>').prependTo($('#currentUser')).text('Hi '+sessionStorage['currentUser']+' ').append(link)
                    app.router.run('#/Songs')
                    //window.history.replaceState('Songs','Songs','#/songs')
                },function(error){
                    $('#login-form p').slideDown();

                })
        })
    }

    var attachRegisterHandler=function(selector){
        var _this=this;
        $(selector).on('click','#register',function(){
            var username=$('#username').val();
            var password=$('#password').val();
            _this._data.users.register(username,password)
                .then(function(data){
                    var playList={
                        "name":data.objectId
                    }
                    _this._data.playList.addToPlayList(playList)
                        .then(function(data){
                            alert('you have playlist')
                        })
                    alert('You are registered successfully '+username+' Go to login page')
                    location.reload()
                },function(erroe){
                    $('#register-form p').slideDown();
                })
        })
    }

    var attachAddToPlayList=function(selector){
        var _this=this;
        $(selector).on('click','.add-to-playlist',function(){
            if(sessionStorage['sessionToken']){
                var objectId=$(this).parent().data('id');
                var song={"RelationSong": {
                    "__op": "AddRelation",
                    "objects": [{"__type": "Pointer",
                        "className": "Song",
                        "objectId": objectId}]
                }};
                var newString='?where={"name":"' + sessionStorage['currentUserId'] + '"}'
                _this._data.playList.getAllRelationSong(newString)
                    .then(function(data){
                        console.log(data.results['0'].objectId);
                        _this._data.playList.editRelation(song,data.results['0'].objectId)
                            .then(function(data){
                                alert('the song is add to playlist')
                            },function(error){
                                console.log('song can not be add to playlist')
                            })
                    })

            }
            else{
                alert('Login pls')
            }
        })
    }

    var attachCreateSongHandler=function(selector){
        var _this=this;
        $(selector).on('click','#create-song',function(ev){
            var title=$('#title').val();
            var songFile=$('#song').val();
            var genre=$('#genre').val() //to do - change this to get the id of the genre
            var song={
                songFile:songFile,
                title:title,
                like:0,
                genre: {
                    "__type": "Pointer",
                    "className": "Genre",
                    "objectId": "XmUjevGoOT" //hardcode for testing until genre is ready
                }
            }
            _this._data.songs.add(song)
                .then(function(data){
                    console.log('add success')
                    _this._data.songs.getById(data.objectId)
                        .then(function(song){
                            location.reload()
                            //var li=$('<li>').append('Song: '+song.songFile);
                            //li=$('<li>').append('Song: '+song.title)
                            //$('#songs ul').append(li);
                            //$('#song').val('');
                            //$('#title').val('');
                        },function(error){
                            console.log(error)
                        })
                },function(error){
                    console.log(error)
                })
        })

        function getSongs(objectId){
            _this._data.songs.getById(objectId)
                .then(function(song){
                    console.log(song)
                },function(error){
                    console.log(error)
                })
        }

    }

    var attachGetSongByGenre=function(selector){
        var _this=this;
        $(selector).on('click','#choose-genre',function(){
            var genre=$('#genre-choose').val();
//            var stringGenre=""+genre;
            var queryString='?where={"genre":"' + genre + '"}';
            _this._data.songs.getAll(queryString)
                .then(function(data){
                    $.get('./templates/genreSong.html',function(template){
                    var output=Mustache.render(template,data);
                    $(selector).html(output);
                })
                },function(error){
                    console.log(error)
                })
        })
    }


    var attachLikeSongHandler=function(selector){
        var _this=this;
        $(selector).on('click','.like-songs-btn',function(ev){
            var likeConfirmed=confirm('Do you Like?')
            if(likeConfirmed){
                var objectId=$(this).parent().data('id');
                var obj;
                _this._data.songs.getById(objectId)
                    .then(function(data){
                        var like=data.like+1;
                        var song={
                                like:like
                            }
                        _this._data.songs.edit(song,objectId)
                            .then(function(data){
                                location.reload()
                            })
                    })

            }

        })


    }

    var attachDeleteSongHandler=function(selector){
        var _this=this;
        $(selector).on('click','.delete-songs-btn',function(ev){
            var deleteConfirmed=confirm('Do you want to delete');
            if(deleteConfirmed){
                var objectId=$(this).parent().data('id');
                _this._data.songs.delete(objectId)
                    .then(function(data){
                        $(ev.target).parent().remove();
                    },function(error){
                        console.log(error)
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
            return new BaseController(data);
        }
    }
}())
