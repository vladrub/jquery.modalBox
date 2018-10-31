/*
 *  jquery.modal-box - v2.1.1
 *  The light weight modal plugin with css3 animations for jQuery
 *  https://github.com/vladrub/jquery.modalBox/
 *
 *  Made by Vladislav Rubanovich
 *  Under MIT License
 */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Global
        factory(jQuery);
    }
})(function($) {
    "use strict";

    // Create the defaults once
    var pluginName = "modalBox",
        defaults = {
            closeOnEscape: true,
            closable: true,
            autoClose: false,
            autoCloseDelay: 3000
        };

    // The actual plugin constructor
    function Plugin ( element, action, options ) {
        this.el = element;
        this.$el = $(this.el);
        this.$body = $('body');

        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.init();

        switch (action) {
            case "open":
                this.open();
                if ( this.options.autoClose ) {
                    setTimeout( function () {
                        this.close();
                    }.bind(this), this.options.autoCloseDelay );
                }
                break;
            case "close":
                this.close();
                break;
        }
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
            var them = this;

            /* BIND CLOSE BUTTON */
            $(".close", this.$el).click(function(e){
                if ( ! them.options.closable ) {
                    return;
                }
                e.preventDefault();
                them.close();
            });

            if ( this.options.closeOnEscape ) {
                $(this.$el).bind('keydown', function(e){
                    if ( ! them.options.closable ) {
                        return;
                    }
                    if (e.keyCode === 27) {
                        them.close();
                    }
                });
            }

            this.$el.on('mousedown', function(e){
                if ( ! them.options.closable ) {
                    return;
                }
                if ( $(e.target).closest(".inner").length ) {
                    return;
                }
                them.close();
            });

            // SCROLLBAR
            this.originalBodyPad = 0;

            if ( ! $('.modal-box.active').length ) {
                this.originalBodyPad = parseInt(this.$body.css('padding-right'), 10);
            }

            this.scrollbarWidth = this.measureScrollBar();
        },
        open: function() {
            if ( this.$el.hasClass('modal-box-animated') ) { return; }
            this.$el.addClass('modal-box-animated');

            var them = this;
            this.$el.trigger( "modalBox:beforeOpen", this );

            this.$body.addClass("modal-box-open");
            this.setScrollBar();

            // SET TAB INDEX
            this.$el.attr( 'tabindex', this.getTabIndex() );

            // SET Z-INDEX
            this.$el.css( 'z-index', this.getZIndex() );

            this.$el.addClass("active");

            this.$el.one('transitionend', function(){
                $('>.inner', them.$el)
                    .addClass('show-modal-inner')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        them.$el.trigger( "modalBox:afterOpen", them );
                        them.$el.focus();

                        them.$el.removeClass('modal-box-animated');
                    });
            });
        },
        close: function () {
            if ( this.$el.hasClass('modal-box-animated') ) { return; }
            this.$el.addClass('modal-box-animated');

            var them = this;
            this.$el.trigger( "modalBox:beforeClose", this );

            $('>.inner', them.$el)
                .removeClass('show-modal-inner').addClass('hide-modal-inner')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $('.inner', them.$el).removeClass('hide-modal-inner');

                    them.$el
                        .removeClass('active')
                        .one('transitionend', function(){
                            if ( ! $('.modal-box.active').length ) {
                                them.resetScrollBar();
                                them.$body.removeClass("modal-box-open");
                            }

                            them.$el.css( 'z-index', -1 );

                            them.$el.trigger( "modalBox:afterClose", them );

                            them.$el.removeClass('modal-box-animated');
                        });
                });
        },
        setScrollBar: function () {
            this.$body.css('padding-right', this.originalBodyPad + this.scrollbarWidth);
        },
        resetScrollBar: function () {
            this.$body.css('padding-right', this.originalBodyPad);
        },
        measureScrollBar: function () {
            var scroll = $('<div class="modal-box-scroll-bar">');
            this.$body.append(scroll);
            var width = scroll[0].offsetWidth - scroll[0].clientWidth;
            scroll.remove();
            return width;
        },
        getTabIndex: function () {
            var tabIndex = 1;

            $('div.modal-box[tabindex]').each(function(){
                if ( $(this).attr( 'tabindex' ) > tabIndex ) {
                    tabIndex = Number($(this).attr( 'tabindex' ));
                }
            });

            return tabIndex+1;
        },
        getZIndex: function () {
            var zIndex = 999;

            $('div.modal-box').each(function(){
                if ( $(this).css( 'z-index' ) > zIndex ) {
                    zIndex = Number($(this).css( 'z-index' ));
                }
            });

            return zIndex+1;
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( action, options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, action, options ) );
            } else {
                var plugin = $.data( this, "plugin_" + pluginName );
                plugin.options = $.extend( {}, plugin.options, options );

                switch (action) {
                    case "open":
                        plugin.open();
                        if ( plugin.options.autoClose ) {
                            setTimeout( function () {
                                plugin.close();
                            }, plugin.options.autoCloseDelay );
                        }
                        break;
                    case "close":
                        plugin.close();
                        break;
                }
            }
        } );
    };
});