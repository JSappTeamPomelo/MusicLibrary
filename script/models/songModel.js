var app=app||{};

app.songModel = (function () {
    function Songs(baseUrl,ajaxRequester){
        this._serviceUrl=baseUrl+'classes/Song';
        this._ajaxRequester=ajaxRequester;
        this._headers=app.creadentials.getHeaders();
    }

    Songs.prototype.getAll=function(queryString){
        return this._ajaxRequester.get(this._serviceUrl+queryString,this._headers)
    };

    Songs.prototype.getById=function(objectId){
        return this._ajaxRequester.get(this._serviceUrl+'/'+objectId + '?include=genre',this._headers)
    };

    Songs.prototype.add=function(song){
        var _this = this,
            file = song.file,
            url = 'https://api.parse.com/1/files/'+ song.title + '.' + file.name.substr(file.name.lastIndexOf('.')+1),
            result = {};

        var defer= Q.defer();

        _this._ajaxRequester.postFile(url, file, _this._headers)
            .then(function(data) {
                alert("File with name: " + file.name + " was successfully uploaded");
                console.log(data);
                song.file = {
                    __type: "File",
                    name: data.name,
                    url: data.url
                };

                console.log(song);
                _this._ajaxRequester.post(_this._serviceUrl, song, _this._headers)
                    .then(function(data) {
                        defer.resolve(data);
                    }, function(error) {
                        defer.reject(error);
                    });
            },
            function(data) {
                var obj = jQuery.parseJSON(data);
                alert(obj.error);
            }
        );

        return defer.promise;
    };

    Songs.prototype.edit=function(song,objectId){
        var url=this._serviceUrl+'/'+objectId;
        return this._ajaxRequester.put(url,song,this._headers)
    };

    Songs.prototype.delete=function(objectId){
        var url=this._serviceUrl+'/'+objectId;
        return this._ajaxRequester.delete(url,this._headers)
    };

    return {
        load: function(baseUrl,ajaxRequester) {
            return new Songs(baseUrl,ajaxRequester);
        }
    }
}());
