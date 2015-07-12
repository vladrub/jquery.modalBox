$(document).ready(function(){
    $('#nav').affix({
        offset: {
            top: $('#nav').offset().top
        }
    });

    $('div.tip').qtip({
        show: {
            solo: true
        },
        hide: 'unfocus',
        content: {
            text: function(){
                return $(this).siblings('div.hidden').html();
            },
            title: 'Example:'
        },
        position: {
            my: 'center right',
            at: 'center left',
            viewport: true,
            adjust: { x: -5 }
        },
        style: { classes: 'qtip-bootstrap' }
    });

    $('tr.tip').qtip({
        show: {
            solo: true
        },
        hide: 'unfocus',
        content: {
            text: function(){
                return $(this).find('div.hidden').html();
            },
            title: 'Example:'
        },
        position: {
            my: 'center right',
            at: 'center left',
            viewport: true,
            adjust: { x: -5 }
        },
        style: { classes: 'qtip-bootstrap' }
    });

    $('.scroll-to').click(function(e){
        e.preventDefault();
        $(window).scrollTo($(this).attr('href'), 600);
    });

    $(function(){
        window.prettyPrint && prettyPrint()
    });

    $('div.modal-box').modalBox();
    $('div.modalBox.active').modalBox("open");

    $(document).on('click', "a.modal-box", function(e){
        e.preventDefault();

        var api = $( $(this).attr("href") ).data('modalBox');

        if ( $(this).data('animation-open-duration') ) {
            api.options.openAnimationDuration = $(this).data('animation-open-duration');
            api.options.closeAnimationDuration = $(this).data('animation-close-duration');
        } else {
            api.options.openAnimationDuration = 500;
            api.options.closeAnimationDuration = 500;
        }

        api.options.openAnimationEffect = $(this).data('animation-open');
        api.options.closeAnimationEffect = $(this).data('animation-close');

        var text = $( $(this).attr("href") ).find('.hidden').html();
        text = text.replace("___1___", api.options.openAnimationEffect);
        text = text.replace("___2___", api.options.closeAnimationEffect);
        console.log(text);

        $( $(this).attr("href") ).find('.prettyprint').html(text);
        prettyPrint();

        api.open();
    });
});