$(function() {
  
  // Slider
  if($('.home-slideshow').length > 0) {
  
    var slideshowAtts = {
      speed: 400,
      swipe: true,
      loader: 'wait',
      autoHeight: 'calc',
      pagerTemplate: '<span><span></span></span>',
      next: $('.home-slideshow img')
    }
    $('.home-slideshow').cycle(slideshowAtts);
    
  }
  
});