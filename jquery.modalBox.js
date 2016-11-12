/*
 * Jquery modalBox plugin
 * https://github.com/vladrub/jquery.modalBox
 *
 * Author: Vladislav Rubanovich
 * Licensed under the MIT license
 */
;(function ( $ ) {

    $.modalBox = function ( el, action, options ) {
        var app = this;
        app.$el = $(el);
        app.$body = $('body');
        app.el = el;

        app.init = function () {
            app.options = $.extend({}, $.modalBox.defaultOptions, options);

            /* BIND CLOSE BUTTON */
            app.$el.find(".close").click(function(e){
                e.preventDefault();
                app.close();
            });

            if ( app.options.closeOnEscape ) {
                $(app.$el).bind('keydown', function(e){
                    if (e.keyCode == 27) app.close();
                });
            }

            app.$el.click(function(e){
                if ( $(e.target).closest(".inner").length ) return;
                app.close();
            });

            app.hasCssTransitionSupport = app.detectCSSFeature("transition");

            // SCROLLBAR
            app.originalBodyPad = 0;

            if ( ! $('.modal-box.active').length )
                app.originalBodyPad = parseInt(app.$body.css('padding-right'), 10);

            app.scrollbarWidth = app.measureScrollBar();
        };

        app.open = function() {
            app.$el.trigger( "modalBox:beforeOpen", app );

            if ( $('>.inner', app.$el).outerHeight(true) > $(window).height() ) {
                app.$body.addClass("modal-box-open");
                app.setScrollBar();
            }

            app.centering();

            // SET TAB INDEX
            app.$el.attr( 'tabindex', app.getTabIndex() );

            // SET Z-INDEX
            app.$el.css( 'z-index', app.getZIndex() );

            if ( app.hasCssTransitionSupport ) {
                app.$el.addClass("active");

                app.transitionDuration(app.$el, app.options.openAnimationDuration);
                app.animationDuration($('.inner', app.$el), app.options.openAnimationDuration);

                app.animate(app.options.openAnimationEffect, function(){
                    app.$el.trigger( "modalBox:afterOpen", app );
                    app.$el.focus();
                });
            } else {
                app.$el.stop(true, false)
                    .addClass("active").fadeOut(0)
                    .fadeIn( app.options.openAnimationDuration, function () {
                        app.$el.trigger( "modalBox:afterOpen", app );
                        app.$el.focus();
                    });
            }
        };

        app.close = function() {
            app.$el.trigger( "modalBox:beforeClose", app );

            if ( app.hasCssTransitionSupport ) {
                app.$el.removeClass("active");

                app.transitionDuration(app.$el, app.options.closeAnimationDuration);
                app.animationDuration($('.inner', app.$el), app.options.closeAnimationDuration);

                app.animate(app.options.closeAnimationEffect, function(){
                    if ( ! $('.modal-box.active').length ) {
                        app.resetScrollBar();
                        app.$body.removeClass("modal-box-open");
                    }

                    app.$el.css( 'z-index', -1 );

                    app.$el.trigger( "modalBox:afterClose", app );
                });
            } else {
                app.$el.stop(true, false).fadeOut( app.options.closeAnimationDuration, function (){
                    app.$el.removeClass("active");

                    if ( ! $('.modal-box.active').length ) {
                        app.resetScrollBar();
                        app.$body.removeClass("modal-box-open");
                    }

                    app.$el.trigger( "modalBox:afterClose", app );
                });
            }
        };

        app.animate = function(effect, callback) {
            $('.inner', app.$el)
                .addClass(effect + ' animated')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass(effect);
                    if ( typeof callback != 'undefined' ) callback.call(this);
                });
        };

        app.animationDuration = function(el, duration) {
            el.css({ 'animation-duration': duration + 'ms' });
        };

        app.transitionDuration = function(el, duration) {
            el.css({ 'transition-duration': duration + 'ms' });
        };

        app.setScrollBar = function () {
            app.$body.css('padding-right', app.originalBodyPad + app.scrollbarWidth);
        };

        app.resetScrollBar = function () {
            app.$body.css('padding-right', app.originalBodyPad);
        };

        app.measureScrollBar = function () {
            var scroll = $('<div class="modal-box-scroll-bar">');
            app.$body.append(scroll);
            var width = scroll[0].offsetWidth - scroll[0].clientWidth;
            scroll.remove();
            return width;
        };

        app.centering = function() {
            if ( app.options.centeringVertical )
                if ( $(window).height() > $('>.inner', app.$el).height()  ) {
                    app.$el.find(".inner").css({
                        "margin-top": "-" + (app.$el.find(".inner").innerHeight() / 2) + "px",
                        "top": "50%"
                    });
                } else {
                    app.$el.find(".inner").removeAttr('style');
                }
        };

        app.getTabIndex = function() {
            var tabIndex = 1;

            $('div.modal-box[tabindex]').each(function(){
                if ( $(this).attr( 'tabindex' ) > tabIndex ) {
                    tabIndex = Number($(this).attr( 'tabindex' ));
                }
            });

            return tabIndex+1;
        };

        app.getZIndex = function() {
            var zIndex = 999;

            $('div.modal-box').each(function(){
                if ( $(this).css( 'z-index' ) > zIndex ) {
                    zIndex = Number($(this).css( 'z-index' ));
                }
            });

            return zIndex+1;
        };

        app.detectCSSFeature = function(featurename) {
            var feature = false,
                domPrefixes = 'Webkit Moz ms O'.split(' '),
                elm = document.createElement('div'),
                featurenameCapital = null;

            featurename = featurename.toLowerCase();

            if( elm.style[featurename] !== undefined ) { feature = true; }

            if( feature === false ) {
                featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
                for( var i = 0; i < domPrefixes.length; i++ ) {
                    if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
                        feature = true;
                        break;
                    }
                }
            }
            return feature;
        };

        var target = app.$el.data().modalBox;
        if ( typeof target == 'undefined' ) {
            app.init();
            app.$el.data( "modalBox" , app );
        } else {
            app = target;
            app.options = $.extend({}, app.options, options);
        }

        if (action == "open") {
            app.open();

            if ( app.options.autoClose )
                setTimeout( app.close, app.options.autoCloseDelay );
        }
        else if (action == "close") {
            app.close();
        }
        else if ( action == "center" ) {
            app.centering();
        }
    };

    $.modalBox.defaultOptions = {
        openAnimationDuration: 500,
        closeAnimationDuration: 500,
        openAnimationEffect: 'default-in',
        closeAnimationEffect: 'default-out',
        closeOnEscape: true,
        centeringVertical: false,
        autoClose: false,
        autoCloseDelay: 3000
    };

    $.fn.modalBox = function( action, options ) {
        return this.each(function() {
            (new $.modalBox(this, action, options))
        });
    };

})( jQuery );