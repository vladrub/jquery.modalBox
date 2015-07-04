$(function () {
    /************************************************************************************
    ROUTER
    *************************************************************************************/

    App.Router = Backbone.Router.extend({
        routes: {
            'popup/:id': 'openPopUp'
        },

        initialize: function(){

        },

        openPopUp: function( id ) {
            var target = $("div.pop-up#" + id);
            if ( ! target.length ) {
                console.error("popup #" + id + " not found!");
                return;
            }
            $("div.pop-up.active").popUp("close", { clearHashAfterClose: true });
            target.popUp("open", { clearHashAfterClose: true });
        }
    });

    new App.Router();
    Backbone.history.start();
});