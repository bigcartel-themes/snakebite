$(document).ready(function() {
  $('.nav').setup_navigation();

  $('.nav > li[aria-haspopup="true"] > a').click(function(e) {
    e.preventDefault();
    if ($(window).width() <= 768) {
      var list_element = $(this).next('ul');
      if ($('.nav > li[aria-haspopup="true"] > ul').not(list_element).length) {
        $('.nav > li[aria-haspopup="true"] > ul').not(list_element).slideUp('fast', function() {
          toggleList(list_element);
        });
      }
      else {
        toggleList(list_element);
      }
    }
  });
  function toggleList(list_element) {
    list_element.slideToggle('fast', function() {
      if (list_element.is(":hidden")) {
        list_element.attr("aria-hidden", "true")
      }
      else {
        list_element.attr("aria-hidden", "false")
      }
    });
  }
});
$.fn.setup_navigation = function(settings) {
  settings = jQuery.extend({
    menuHoverClass: 'show-menu',
  }, settings);
  $(this).attr('role', 'menubar').find('li').attr('role', 'menuitem');
  var top_level_links = $(this).find('> li > a');
  $(top_level_links).attr('tabindex','0');
  $(top_level_links).next('ul')
    .attr('data-test','true')
    .attr({ 'aria-hidden': 'true', 'role': 'menu' })
    .find('a')
      .attr('tabIndex',-1);
  $(top_level_links).each(function(){
    if($(this).next('ul').length > 0)
      $(this).parent('li').attr('aria-haspopup', 'true');
  });
  $(top_level_links).focus(function(){
    $(this).closest('ul')
      .find('.'+settings.menuHoverClass)
        .attr('aria-hidden', 'true')
        .removeClass(settings.menuHoverClass)
        .find('a')
          .attr('tabIndex',-1);
    $(this).next('ul')
      .attr('aria-hidden', 'false')
      .addClass(settings.menuHoverClass)
      .find('a').attr('tabIndex',0);
  });
  $(top_level_links).keydown(function(e){
    if(e.keyCode == 37) {
      e.preventDefault();
      if($(this).parent('li').prev('li').length == 0) {
        $(this).parents('ul').find('> li').last().find('a').first().focus();
      } else {
        $(this).parent('li').prev('li').find('a').first().focus();
      }
    } else if(e.keyCode == 38) {
      e.preventDefault();
      if($(this).parent('li').find('ul').length > 0) {
        $(this).parent('li').find('ul')
          .attr('aria-hidden', 'false')
          .addClass(settings.menuHoverClass)
          .find('a').attr('tabIndex',0)
            .last().focus();
      }
    } else if(e.keyCode == 39) {
      e.preventDefault();
      // This is the last item
      if($(this).parent('li').next('li').length == 0) {
        $(this).parents('ul').find('> li').first().find('a').first().focus();
      } else {
        $(this).parent('li').next('li').find('a').first().focus();
      }
    } else if(e.keyCode == 40) {
      e.preventDefault();
      if($(this).parent('li').find('ul').length > 0) {
        $(this).parent('li').find('ul')
          .attr('aria-hidden', 'false')
          .addClass(settings.menuHoverClass)
          .find('a').attr('tabIndex',0)
            .first().focus();
      }
    } else if(e.keyCode == 13 || e.keyCode == 32) {
      // If submenu is hidden, open it
      e.preventDefault();
      $(this).parent('li').find('ul[aria-hidden=true]')
          .attr('aria-hidden', 'false')
          .addClass(settings.menuHoverClass)
          .find('a').attr('tabIndex',0)
            .first().focus();
    } else if(e.keyCode == 27) {
      e.preventDefault();
      $('.'+settings.menuHoverClass)
        .attr('aria-hidden', 'true')
        .removeClass(settings.menuHoverClass)
        .find('a')
          .attr('tabIndex',-1);
    }
  });
  var links = $(top_level_links).parent('li').find('ul').find('a');
  $(links).keydown(function(e){
    if (e.keyCode == 38) {
      e.preventDefault();
      if ($(this).parent('li').prev('li').length == 0) {
        $(this).parents('ul').parents('li').find('a').first().focus();
      } else {
        $(this).parent('li').prev('li').find('a').first().focus();
      }
    } else if (e.keyCode == 40) {
      e.preventDefault();
      if ($(this).parent('li').next('li').length == 0) {
        $(this).parents('ul').parents('li').find('a').first().focus();
      } else {
        $(this).parent('li').next('li').find('a').first().focus();
      }
    } else if (e.keyCode == 27 || e.keyCode == 37) {
      e.preventDefault();
      $(this)
        .parents('ul').first()
          .prev('a').focus()
          .parents('ul').first().find('.'+settings.menuHoverClass)
            .attr('aria-hidden', 'true')
            .removeClass(settings.menuHoverClass)
            .find('a')
              .attr('tabIndex',-1);
    } else if (e.keyCode == 32) {
      e.preventDefault();
      window.location = $(this).attr('href');
    }
  });
  $(this).find('a').last().keydown(function(e){
    if (e.keyCode == 9) {
      $('.'+settings.menuHoverClass)
        .attr('aria-hidden', 'true')
        .removeClass(settings.menuHoverClass)
        .find('a')
          .attr('tabIndex',-1);
    }
  });
  $(document).click(function(){
    $('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1);
  });

  $(this).click(function(e){
    e.stopPropagation();
  });
}