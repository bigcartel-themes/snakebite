$(function() {

  // Captcha focus state
  $("#captcha").focus(function(){
    $(this).closest('.captcha-wrap').addClass('active');
  
  }).blur(function(){
    $(this).closest('.captcha-wrap').removeClass('active');
  })
  
});