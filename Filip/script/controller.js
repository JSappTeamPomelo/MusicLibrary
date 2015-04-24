var app=app||{};

app.controller=(function(){
    function BaseController(data){
        this._data=data;
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
        this._data.songs.getAll()
            .then(function(data){
                $.get('./templates/songs.html',function(template){
                    var output=Mustache.render(template,data);
                    $(selector).html(output);
                })
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
        attachLogoutHandler.call(this,otherSelector)
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
                    alert('You are registered successfully '+username+' Go to login page')
                    location.reload()
                },function(erroe){
                    $('#register-form p').slideDown();
                })
        })
    }



    var attachCreateSongHandler=function(selector){
        var _this=this;
        $(selector).on('click','#create-song',function(ev){
            var title=$('#title').val();
            var songFile=$('#song').val();

            var song={
                songFile:songFile,
                title:title,
                like:0

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
    }


    return{
        get:function(data){
            return new BaseController(data);
        }
    }
}())
