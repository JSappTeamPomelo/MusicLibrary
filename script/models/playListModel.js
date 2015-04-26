var app=app||{};

app.playListModel = (function () {
    function PlayList(baseUrl,ajaxRequester) {
        this._serviceUrl = baseUrl + 'classes/PlayList';
        this._ajaxRequester = ajaxRequester;
        this._headers = app.creadentials.getHeaders();
    }

    PlayList.prototype.getAllRelationSong = function(queryString) {
        return this._ajaxRequester.get(this._serviceUrl + queryString, this._headers);
    };

    PlayList.prototype.editRelation = function(song, objectId) {
        var url = this._serviceUrl + '/' + objectId;
        return this._ajaxRequester.put(url, song, this._headers);
    };

    PlayList.prototype.addToPlayList = function(song) {
        return this._ajaxRequester.post(this._serviceUrl, song, this._headers);
    };

    return {
        load: function(baseUrl,ajaxRequester) {
            return new PlayList(baseUrl,ajaxRequester);
        }
    }
}());

