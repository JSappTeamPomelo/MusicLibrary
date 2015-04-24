var app=app||{};

(function(){
    var baseUrl='https://api.parse.com/1/';
    var ajaxRequest=app.ajaxRequester.get();
    var data=app.data.get(baseUrl,ajaxRequest);
    var controller=app.controller.get(data);
    controller.attachEventHandlers();
    app.router=Sammy(function(){
        var selector='#wrapper';

        this.get('#/',function(){
            controller.loadHome(selector)
        })

        this.get('#/login',function(){
            controller.loadLogin(selector)
        })

        this.get('#/register',function(){
            controller.loadRegister(selector)
        })

        this.get('#/songs',function(){
            controller.loadSongs(selector)
        })

    })
    if(sessionStorage['sessionToken']){
        $('#login').hide()
        $('#register').hide()
        $('#login-form').hide();
        $('#register-form').hide();
        var link=$('<a href="#">Logout<a>').attr('id','logout')
        $('<div>').prependTo($('#currentUser')).text('Hi '+sessionStorage['currentUser']+' ').append(link)
        app.router.run('#/Songs')
    }
    else{
        app.router.run('#/')
    }

}())
