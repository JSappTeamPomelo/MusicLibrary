var app=app||{};

app.data=(function(){
    function Data(baseUrl,ajaxRequest){
        this.users=new Users(baseUrl,ajaxRequest);
        this.songs=new Songs(baseUrl,ajaxRequest);
        this.comments = new Comment(baseUrl, ajaxRequest);
        this.playList=new PlayList(baseUrl,ajaxRequest);
    }

    var cradentials=(function(){
        var headers={
            "X-Parse-Application-Id":"NInepsto7D88N6imyYYsnEbDjEJWcYsKj8WPtxCG",
            "X-Parse-REST-API-Key":"d3WxJ6c68zuO0KvhcBlyX3LzltXWepViQB2o6hf4",
            "X-Parse-Session-Token":getSessionToken()


        }

        function getSessionToken(){
            localStorage.getItem('sessionToken')
        }

        function setSessionToken(sessionToken){
            localStorage.setItem('sessionToken',sessionToken)
        }

        function getUsername(sessionToken){
            localStorage.getItem('username')
        }

        function setUsername(sessionToken){
            localStorage.setItem('username',sessionToken)
        }


        function getHeaders(){
            return headers;
        }

        return{
            getSessionToken:getSessionToken,
            setSessionToken:setSessionToken,
            getUsername:getUsername,
            setUsername:setUsername,
            getHeaders:getHeaders


        }
    }())

    var Users=(function(argument){
        function Users(baseUrl,ajaxRequester){
            this._serviceUrl=baseUrl;
            this._ajaxRequester=ajaxRequester;
            this._headers=cradentials.getHeaders();
        }
        Users.prototype.login=function(username,password){
            var url=this._serviceUrl+'login?username='+username+'&password='+password;
            return this._ajaxRequester.get(url,this._headers)
                .then(function(data){
                    cradentials.setSessionToken(data.sessionToken)
                    cradentials.setUsername(data.username)
                    return data;
                })
        }

        Users.prototype.register=function(username,password){
            var user={
                username:username,
                password:password

            }

            var url=this._serviceUrl+'users';
            return this._ajaxRequester.post(url,user,this._headers)
                .then(function(data){
                    cradentials.setSessionToken(data.sessionToken)
                    return data;
                })
        }

        return Users;
    }())

    var PlayList=(function(){
        function PlayList(baseUrl,ajaxRequester){
            this._serviceUrl=baseUrl+'classes/PlayList'
            this._ajaxRequester=ajaxRequester;
            this._headers=cradentials.getHeaders();
        }

        PlayList.prototype.getAllRelationSong=function(queryString){
            return this._ajaxRequester.get(this._serviceUrl+queryString,this._headers)
        }

        PlayList.prototype.editRelation=function(song,objectId){
            var url=this._serviceUrl+'/'+objectId;
            return this._ajaxRequester.put(url,song,this._headers)
        }

        PlayList.prototype.addToPlayList=function(song){
            return this._ajaxRequester.post(this._serviceUrl,song,this._headers)
        }

        return PlayList;

    }())


    var Songs=(function(){
        function Songs(baseUrl,ajaxRequester){
            this._serviceUrl=baseUrl+'classes/Song';
            this._ajaxRequester=ajaxRequester;
            this._headers=cradentials.getHeaders();
        }

        Songs.prototype.getAll=function(queryString){
            return this._ajaxRequester.get(this._serviceUrl+queryString,this._headers)
        }

        Songs.prototype.getById=function(objectId){
            return this._ajaxRequester.get(this._serviceUrl+'/'+objectId,this._headers)
        }

        Songs.prototype.add=function(song){
            return this._ajaxRequester.post(this._serviceUrl,song,this._headers)
        }

        Songs.prototype.edit=function(song,objectId){
            var url=this._serviceUrl+'/'+objectId;
            return this._ajaxRequester.put(url,song,this._headers)
        }

        Songs.prototype.delete=function(objectId){
            var url=this._serviceUrl+'/'+objectId;
            return this._ajaxRequester.delete(url,this._headers)
        }

        Songs.prototype.updateComments = function (objectId) {
            Comment.getCommentsBySong(objectId)
                .then(function (data) {
                    var comments = {
                        'comments': data.results
                    };

                    return this._ajaxRequester.put(url, comments, this._headers)
                });
        };

        return Songs;

    }());

    var Comment = (function () {
        function Comment(baseUrl,ajaxRequester){
            this._serviceUrl=baseUrl+'classes/Comment';
            this._ajaxRequester=ajaxRequester;
            this._headers=cradentials.getHeaders();
        }

        Comment.prototype.add = function(comment) {
            return this._ajaxRequester.post(this._serviceUrl, comment,this._headers)
        };

        Comment.prototype.getCommentsBySong = function (songId) {
            var query = JSON.stringify({
                toSong: {
                    __type: 'Pointer',
                    className: 'Song',
                    objectId: songId
                }
            });

            var url = this._serviceUrl + '?where=' + query + '&include=by';
            return this._ajaxRequester.get(url, this._headers);
        };

        Comment.prototype.getCommentsByPlayList = function (playListId) {
            var query = JSON.stringify({
                toGenre: {
                    __type: "Pointer",
                    className: "Genre",
                    objectId: playListId
                }
            });

            var url = this._serviceUrl + '?where=' + query + '&include=by';
            return this._ajaxRequester.get(url + query, this._headers);
        };

        Comment.prototype.delete=function(objectId){
            var url = this._serviceUrl + '/' + objectId;
            return this._ajaxRequester.delete(url, this._headers);
        };

        return Comment;
    }());

    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester)
        }
    }

}());
