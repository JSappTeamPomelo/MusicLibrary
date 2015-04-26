var app=app||{};

app.commentModel = (function () {
    function Comment(baseUrl, ajaxRequester) {
        this._serviceUrl = baseUrl + 'classes/Comment';
        this._ajaxRequester = ajaxRequester;
        this._headers = app.creadentials.getHeaders();
    }

    Comment.prototype.add = function(comment) {
        return this._ajaxRequester.post(this._serviceUrl, comment,this._headers);
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
            toPlayList: {
                __type: 'Pointer',
                className: 'PlayList',
                objectId: playListId
            }
        });

        var url = this._serviceUrl + '?where=' + query + '&include=by';
        return this._ajaxRequester.get(url + query, this._headers);
    };

    Comment.prototype.delete = function(objectId) {
        var url = this._serviceUrl + '/' + objectId;
        return this._ajaxRequester.delete(url, this._headers);
    };

    return {
        load: function(baseUrl,ajaxRequester) {
            return new Comment(baseUrl,ajaxRequester);
        }
    }
}());
