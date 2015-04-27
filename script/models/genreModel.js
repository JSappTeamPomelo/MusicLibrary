var app=app||{};

app.genreModel = (function () {
    function Genre(baseUrl,ajaxRequester) {
        this._serviceUrl = baseUrl + 'classes/Genre';
        this._ajaxRequester = ajaxRequester;
        this._headers = app.creadentials.getHeaders();
    }

    Genre.prototype.getAllGenres = function(queryString) {
        return this._ajaxRequester.get(this._serviceUrl + queryString, this._headers);
    };

    Genre.prototype.add = function(genre) {
        return this._ajaxRequester.post(this._serviceUrl, genre, this._headers);
    };

    return {
        load: function(baseUrl,ajaxRequester) {
            return new Genre(baseUrl,ajaxRequester);
        }
    }
}());