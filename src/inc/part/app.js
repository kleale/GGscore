/*
* Global scripts
*/
(function ($) {
  'use strict';

  $(document).ready(function () {
    
    //fancy
    $(".fancybox-thumb").fancybox({
        prevEffect	: 'none',
        nextEffect	: 'none',
        helpers	: {
            title	: {
                type: 'outside'
            },
            thumbs	: {
                width	: 50,
                height	: 50
            }
        }
    });
    
    //team-pop
    $('.team-pop').popover({
        'html': true,
        'trigger': 'hover',
        'placement': 'auto bottom',
        'container': 'body',
        'template':'<div class="popover htip teamtip"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>'
    });
    
    $(".ibg").mousemove(function( event ) {
      $(".ibg").css('transform', 'translate(' + event.pageY /40 + 'px, ' + -event.pageX /40+ 'px)');
    });
    
    // dropdown hide
    $(document).click(function(){
      $("#dropdown").hide();
    });
    
    // bar toggle on mobile
    $("#menu-toggle").click(function() {
      $("body").toggleClass("menu-open");
      $(this).toggleClass("active");
      $(".bar").toggleClass("hiddenbar");
	});
    
    // swappable left bar
    /*
    $(".swipe-area").swipe({
      swipeStatus: function (event, phase, direction, distance, duration, fingers) {
        if (phase == "move" && direction == "right") {
          $(".navbar-collapse").addClass("in");
          $(".navbar-toggle").addClass("active");
          $(".swipe-area").addClass("active");
          return false;
        }
        if (phase == "move" && direction == "left") {
          $(".navbar-collapse").removeClass("in");
          $(".navbar-toggle").removeClass("active");
          $(".swipe-area").removeClass("active");
          return false;
        }
      }
    });
    */
    
    // tabs on mobile
    function setScale(){
      if ($(window).width()  < 768) {
        $('.mtb').each(function(i, elm) {
          $(elm).text($(elm).next('ul').find('li.active a').text());
        });
        $('.mtb').on('click', function(e) {
            e.preventDefault();
            $(e.target).toggleClass('open').next('ul').slideToggle();
        });
        $('.stm_nav_block a[data-toggle="tab"]').on('click', function(e) {
            e.preventDefault();
            $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
        });
      }
      else{
        $('.stm_nav_block').css( "display", "table");
      }
    } //window
    setScale();
    $(window).on("resize", setScale);
        
    // scrolls in tabs and blocks
    $('.tse-sc').perfectScrollbar(); 
    $('.ps').perfectScrollbar();
    //$('.table-responsive').perfectScrollbar();
    
    // bar toggle on mobile
    $(".stage em").click(function() {
      $(".stage").toggleClass("stage-open");
	});
    
    // checkbox to switch
    //$("[name='score']").bootstrapSwitch(); 
    
    // js label in inputs
    $(".withJsLabel input[type='text']").jvFloat();
    
    // countdown on top match list
    /*$('[data-countdown]').each(function() {
      var $this = $(this), finalDate = $(this).data('countdown');
      $this.countdown(finalDate, function(event) {
        $this.html(event.strftime('До начала %H:%M:%S'));
      });
    });*/
    
    // news read more slider
    /*$('.ns1 ul').owlCarousel({
      loop:true,
      navigation: true,
      navigationText: ["назад","вперед"],
      responsiveClass:true,
      items : 4, 
      itemsDesktop : [1000,4], 
      itemsDesktopSmall : [900,3],
      itemsTablet: [600,2],
      afterInit : function(){
        //$(".mlh").width($('.owl-item').width());
        //$(".mlh").height($('.owl-item').height());
      }
    });*/
    
    // слайдер новостей 2
    /*$('.ns2 ul').owlCarousel({
      loop:true,
      navigation: true,
      navigationText: ["назад","вперед"],
      responsiveClass:true,
      responsive:{
          0:{
              items:1,
              nav:true
          },
          600:{
              items:3,
              nav:false
          },
          1000:{
              items:5,
              nav:true,
              loop:false
          }
      }
    });*/
    
    // слайдер новостей 3
    /*$('.ns3 ul').owlCarousel({
      loop:true,
      navigation: true,
      navigationText: ["назад","вперед"],
      responsiveClass:true,
      responsive:{
          0:{
              items:1,
              nav:true
          },
          600:{
              items:3,
              nav:false
          },
          1000:{
              items:5,
              nav:true,
              loop:false
          }
      }
    });*/

    // слайдер замеса горизонт
    /*$('.ns4 ul').owlCarousel({
      loop:true,
      navigation: true,
      navigationText: ["назад","вперед"],
      responsiveClass:true,
      items : 4, 
      itemsDesktop : [1000,4], 
      itemsDesktopSmall : [900,3],
      itemsTablet: [600,2] 
    });*/
  
    // слайдер игроков на странице команды
    /*$('#slPlayers').owlCarousel({
      navigation: true,
      navigationText: ["назад","вперед"],
      responsiveClass:true,
      items : 5, 
      itemsDesktop : [1000,4], 
      itemsDesktopSmall : [900,3],
      itemsTablet: [600,2] 
    });*/ 
    
  }); //end ready

}(jQuery));