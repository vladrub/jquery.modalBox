$(function () {
    /************************************************************************************
     MODELS
    *************************************************************************************/

    App.Models.Person = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: ""
        }
    });

    /************************************************************************************
     COLLECTIONS
    *************************************************************************************/

    App.Collections.Persons = Backbone.Collection.extend({
        model: App.Models.Person
    });

    /************************************************************************************
     VIEWS
    *************************************************************************************/

    App.Views.Persons = Backbone.View.extend({
        tagName: "div",

        initialize: function(options) {
        }
    });

    App.Views.Person = Backbone.View.extend({
        //template: templateHelper(""),

        initialize: function() {
        }
    });

});