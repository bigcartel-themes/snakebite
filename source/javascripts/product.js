$(function() {

  // Slider
  var slideshowAtts = {
    speed: 400,
    swipe: true,
    autoHeight: 'calc',
    pagerTemplate: '<span><span></span></span>',
    next: $('.slideshow img')
  }
  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = "Don't call this twice without a uniqueId";
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();

  if($('.stacked-images').length === 0) {

    // Slidehsow
    $('.slideshow').cycle(slideshowAtts);

    // Slider max height
    function maxImageHeight() {
      if($(window).width() > 880) {
        var maxImageHeight = $(window).height() - $('header').outerHeight();
        $('.images, .images img').css({'max-height': maxImageHeight});
      } else {
        $('.images, .images img').css({'max-height': 9999});
      }
    }
    $(window).resize(function() {
      maxImageHeight();
    });
    $(window).on('load', function () {
      maxImageHeight();
    });

  } else {

    function startSlideshow() {
      if($(window).width() > 880) {
        $('.cycle-pager').hide();
        $('.slideshow').cycle('destroy');
      } else {
        $('.cycle-pager').show();
        $('.slideshow').cycle(slideshowAtts);
      }
    }
    startSlideshow();

    $(window).smartresize(function(){
      startSlideshow();
    });

  }

  // Pause slideshow on page click
  $('.slideshow').on('cycle-pager-activated cycle-prev cycle-next', function( event, opts ) {
    $(this).cycle('pause');
  });

  // Purchasing

  $('.product-form').submit(function(e) {
    e.preventDefault();
    var quantity = $(".product-quantity").val()
    , itemID = $("#option").val()
    , addButton = $('.add-to-cart-button')
    , addButtonText = addButton.find('.status_text')
    , addedText = addButton.attr('data-added-text')
    , addingText = addButton.attr('data-adding-text')
    , addButtonTextValue = addButtonText.html();
    if (!addButton.hasClass('adding')) {
      if (quantity > 0 && itemID > 0) {
        addButton.addClass('btn-pulse');
        addButtonText.html(addingText);
        setTimeout(function() {
          addButton.removeClass('btn-pulse');
        }, 100);
        Cart.addItem(itemID, quantity, function(cart) {
          Cart.updateCount(cart);
          addButtonText.html(addedText);

          setTimeout(function() {
            addButtonText.clone().appendTo(addButton).html(addButtonTextValue).hide();
            addButton.find('.status_text').first().remove();
            addButton.find('.status_text').fadeIn(400);
          }, 800);


        });

      }
    }
  });

});