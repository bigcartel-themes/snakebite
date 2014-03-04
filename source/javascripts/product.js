$(function() {
  
  // Slider
  var slideshowAtts = {
    speed: 400,
    swipe: true,
    loader: 'wait',
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
    $(window).load(function() {
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
  if($('.options').length > 0) {
    var optionID = false;
  } else {
    var optionID = $('.purchase').attr('data-default-option-id');
  }
	$('.options-list').hide();
	$('.option-selected').click(function() {
	  var optionsList = $('.options-list');
		if (optionsList.is(':visible')) {
			optionsList.slideUp(100);
		} else {
			optionsList.slideDown(100);
		}
	});
	$('body').click(function(e) {
    if (!$('.options').is(e.target) && $('.options').has(e.target).length === 0) {
      $('.options-list').slideUp(100);
    }
  });
	$('.options-list li').click(function() {
		var option = $(this).html();
		optionID = $(this).attr('data-option-id');
		$('.option-selected-name').html(option);
		$('.options-list').hide();
		$('.options-wrap').height($('.options').outerHeight());
		$('.btn-purchase').removeClass('btn-inactive').addClass('btn-active');
		$('.btn-purchase span').html('Purchase');
	});
	var purchaseReady = true;
  $('.purchase').on('mouseup', '.btn-active', function(e) {
    if(purchaseReady) {
      purchaseReady = false;
      setTimeout(function() { 
        purchaseReady = true;
      }, 1000);
      e.preventDefault();
      var purchaseBtn = $(this);
      var purchaseText = purchaseBtn.find('span');
      if(optionID) {
        $(this).addClass('btn-pulse');
        setTimeout(function() {
          purchaseBtn.removeClass('btn-pulse');
        }, 100);
        Cart.addItem(optionID, 1, function(cart) {
          Cart.updateCount(cart);
          purchaseText.html('Added!');
          setTimeout(function() {
            purchaseText.clone().appendTo(purchaseBtn).html('Purchase').hide();
            purchaseBtn.find('span').first().remove();
            purchaseBtn.find('span').first().fadeIn(400);
          }, 800);
        });
      }
    }
  });
  $(window).resize(function() {
    $('.options-wrap').height($('.options').outerHeight());
  });
  
  // Social link popups
  $('.social-links a').click(function(e) {
    e.preventDefault();
    var shareURL = $(this).attr('href');
    window.open( shareURL, "myWindow", "status = 1, height = 400, width = 600, resizable = 0" )
  });
  
});