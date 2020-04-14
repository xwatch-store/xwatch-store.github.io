function main() {

    (function () {
       'use strict';

   /* ==============================================
    Testimonial Slider
    =============================================== */ 

    // $('.page-scroll').click(function() {
    //     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    //       var target = $(this.hash);
    //       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    //       if (target.length) {
    //         $('html,body').animate({
    //           scrollTop: target.offset().top - 0
    //         }, 1000);
    //         return false;
    //       }
    //     }
    //   });

    /*====================================
    Show Menu on Book
    ======================================*/
    var navbar_init = function(){
        if ($(window).scrollTop() > 50) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    };

    var totop_init = function(){
        var $toTop = $('#totop');
        if ($(window).scrollTop() > 100) {
            $toTop.fadeIn();
        } else {
            $toTop.fadeOut();
        }
    };

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: $('.navbar').height()+1
    })

    $(document).on('click', "a[href='#totop']", function(e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });
    
    navbar_init();
    totop_init();
    $(window).scroll(function() {
        navbar_init();
        totop_init();
    });

    // $(".box-btn-choose").on('click', function(){
    //     $(".payment-step-2").removeClass('hidden',1000);
    //     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    //       var target = $(this.hash);
    //       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    //       if (target.length) {
    //         setTimeout(function(){
    //         $('html,body').animate({
    //           scrollTop: target.offset().top - 20
    //         }, 1500);}, 1200);
    //         return false; 
    //       }
    //     }
    // });

}());


}
main();