var app=app||{};

app.creadentials = (function () {
    var credentials = (function() {
        var headers={
            "X-Parse-Application-Id":"NInepsto7D88N6imyYYsnEbDjEJWcYsKj8WPtxCG",
            "X-Parse-REST-API-Key":"d3WxJ6c68zuO0KvhcBlyX3LzltXWepViQB2o6hf4",
            "X-Parse-Session-Token":getSessionToken()
        };

        function getSessionToken() {
            localStorage.getItem('sessionToken');
        }

        function setSessionToken(sessionToken) {
            localStorage.setItem('sessionToken',sessionToken);
        }

        function getUsername(sessionToken) {
            localStorage.getItem('username');
        }

        function setUsername(sessionToken) {
            localStorage.setItem('username',sessionToken);
        }

        function getHeaders() {
            return headers;
        }

        return{
            getSessionToken:getSessionToken,
            setSessionToken:setSessionToken,
            getUsername:getUsername,
            setUsername:setUsername,
            getHeaders:getHeaders


        }
    }());

    return credentials;
}());