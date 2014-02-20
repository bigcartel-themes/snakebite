$(function() {
 
  // Retina support
	if(window.devicePixelRatio >= 1.2){
    var images = document.getElementsByTagName('img');
    for(var i=0;i < images.length;i++){
        var attr = images[i].getAttribute('data-src-retina');
        if(attr){
            images[i].src = attr;
        }
    }
  }
  
  // Fade in page content on load
  if($(window).width() > 700) {
    var waitForLoad = $('.main .inner, footer');
    waitForLoad.hide();
    $(window).load(function() {
      waitForLoad.fadeIn(400);
    });
  }
  
  // Dropdown menu
  $('.nav-main li:not(.cart-status, .mobile-nav-trigger)').mouseenter(function() {
    $(this).addClass('active');
  });
  $('.nav-main li:not(.cart-status, .mobile-nav-trigger)').mouseleave(function() {
    $(this).removeClass('active');
  });
  
  // Mobile nav
  $('.mobile-nav-trigger').click(function(e) {
    e.preventDefault();
    mobileNav = $('.nav-mobile');
    if(mobileNav.is(':visible')) {
      mobileNav.slideUp(200);
    } else {
      mobileNav.slideDown(200);
    }
  });
  $(window).resize(function() {
    $('.nav-mobile').hide();
  });
  $('.accordion-trigger').click(function(e) {
    e.preventDefault();
    var accordion = $(this).parent().find('.accordion');
    if(accordion.is(':visible')) {
      $(this).parent().find('.accordion').slideUp(200);
    } else {
      $('.accordion').slideUp(200);
      $(this).parent().find('.accordion').slideDown(200);
    }
  });
  
  // Wordmark shortening
  var wordmarkEl = $('.wordmark');
  var wordmarkLong = wordmarkEl.attr('data-store-name');
  var wordmarkThreshold = 9;
  var wordmarkShort = wordmarkLong;
  if(wordmarkLong.length > wordmarkThreshold) {
    wordmarkShort = wordmarkLong.substring(0,wordmarkThreshold);
    wordmarkShort = $.trim(wordmarkShort) + '...';
  }
  var wordmarkSpace = $('.wordmark').width() + 40;
  function wordmarkSizing() {
    var availableSpace = $('header .inner').width() - $('.nav-main').width();
    if(wordmarkSpace > availableSpace) {
      wordmarkEl.html(wordmarkShort);
    } else {
      wordmarkEl.html(wordmarkLong);
    }
  }
  $(window).resize(function() {
    wordmarkSizing();
  });
  wordmarkSizing();

  // Cart orb hover animation
  $('.cart-status').mousedown(function() {
    $('.cart-orb').addClass('cart-orb-shrink');
  });
  
});