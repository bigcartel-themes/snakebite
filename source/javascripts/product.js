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
      } else {
        var maxImageHeight = 2000;
      }
      $('.images, .images img').css({'max-height': maxImageHeight});
    }
    $(window).resize(function() {
      maxImageHeight();
    });
    maxImageHeight();
    
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
  if($('.options').length > 0) {
    var optionID = false;
  } else {
    var optionID = $('.purchase').attr('data-default-option-id');
  }
	$('.options-list').hide();
	$('.option-selected').click(function() {
		if ($('.options-list').is(':visible')) {
			$('.options-list').hide();
		} else {
			$('.options-list').show();
		}
	});
	$('.options-list li').click(function() {
		var option = $(this).html();
		optionID = $(this).attr('data-option-id');
		$('.option-selected-name').html(option);
		$('.options-list').hide();
		$('.options-wrap').height($('.options').outerHeight());
		$('.btn-purchase').removeClass('btn-purchase-inactive');
		$('.btn-purchase span').html('Purchase');
	});
  $('.purchase').on('mousedown', '.btn-purchase:not(.btn-purchase-inactive)', function(e) {
    $(this).addClass('btn-purchase-active');
  }).on('mouseup', '.btn-purchase:not(.btn-purchase-inactive)', function(e) {
    e.preventDefault();
    var purchaseBtn = $(this);
    var purchaseText = purchaseBtn.find('span');
    setTimeout(function() {
      purchaseBtn.removeClass('btn-purchase-active');
    }, 100);
    purchaseText.html('Adding...');
    if(optionID) {
      $(this).addClass('btn-purchase-animate');
      setTimeout(function() {
        purchaseBtn.removeClass('btn-purchase-animate');
      }, 200);
      Cart.addItem(optionID, 1, function(cart) {
        Cart.updateCount(cart);
        purchaseText.html('Added!');
        setTimeout(function() {
          purchaseText.clone().appendTo(purchaseBtn).html('Purchase').hide();
          purchaseBtn.find('span').first().remove();
          purchaseBtn.find('span').first().fadeIn(400);
        }, 1000);
      });
    }
  });
  $(window).resize(function() {
    $('.options-wrap').height($('.options').outerHeight());
  });
  
});