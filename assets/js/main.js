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

    //$('.modalBox.active').modalBox("open");

    $(document).on('click', "a.modal-box.test1", function(e){
        e.preventDefault();

        $( $(this).attr("href") ).modalBox("open", {
            openAnimationEffect: 'lightSpeedIn',
            closeAnimationEffect: 'lightSpeedOut'
        });
    });

    $(document).on('click', "a.modal-box.test2", function(e){
        e.preventDefault();

        $( $(this).attr("href") ).modalBox("open", {
            openAnimationEffect: 'rotateIn',
            closeAnimationEffect: 'rotateOut'
        });
    });

    $(document).on('click', "a.modal-box.test3", function(e){
        e.preventDefault();

        $( $(this).attr("href") ).modalBox("open", {
            openAnimationEffect: 'zoomIn',
            closeAnimationEffect: 'zoomOut' // Можно комбинировать
        });
    });

    $(document).on('click', "a.modal-box.test4", function(e){
        e.preventDefault();

        $( $(this).attr("href") ).modalBox("open", {
            openAnimationEffect: 'rollIn',
            closeAnimationEffect: 'rollOut'
        });
    });

});