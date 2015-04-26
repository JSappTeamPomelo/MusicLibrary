var app=app||{};

app.userModel = (function () {
    function Users(baseUrl,ajaxRequester) {
        this._serviceUrl = baseUrl;
        this._ajaxRequester = ajaxRequester;
        this._headers = app.creadentials.getHeaders();
    }

    Users.prototype.login=function(username,password) {
        var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;
        return this._ajaxRequester.get(url,this._headers)
            .then(function(data) {
                app.creadentials.setSessionToken(data.sessionToken);
                app.creadentials.setUsername(data.username);
                return data;
            })
    };

    Users.prototype.register=function(username,password) {
        var user = {
            username:username,
            password:password

        };

        var url = this._serviceUrl + 'users';
        return this._ajaxRequester.post(url,user,this._headers)
            .then(function(data) {
                app.creadentials.setSessionToken(data.sessionToken);
                return data;
            })
    };

    return {
        load: function(baseUrl,ajaxRequester) {
            return new Users(baseUrl,ajaxRequester);
        }
    }
}());
