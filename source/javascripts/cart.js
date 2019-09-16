$(function() {
  // Custom error handler
  var errorTimeout;
  API.onError = function(errors) {
    if($('body').hasClass('product')) {
      clearTimeout(errorTimeout);
      $.each(errors, function( index, value ) {
        $('.errors').html('<li>' + value + '</li>').fadeIn();
      });
      errorTimeout = setTimeout(function() {
        $('.errors').fadeOut();
      }, 5000);
    }
  }

  // Custom cart methods
  Cart.updateCount = function(cart) {
    var cartCountEl = $('.cart-count');
    var cartOrbEl = $('.cart-orb');
    cartOrbEl.show();
    cartOrbEl.addClass('cart-orb-animate');
    var curCount = parseInt(cartCountEl.html());
    if(cart.item_count === 0) {
      $('.cart-wrap').hide();
      $('.cart-empty-modal').fadeIn();
      cartCountEl.addClass('cart-count-animate');
      setTimeout(function() {
        cartCountEl.html(cart.item_count);
        cartCountEl.removeClass('cart-count-animate');
      }, 150);
      setTimeout(function() {
        document.location.href = '/';
      }, 1500);
    } else if(curCount != cart.item_count) {
      cartCountEl.addClass('cart-count-animate');
      setTimeout(function() {
        cartCountEl.html(cart.item_count);
        cartCountEl.removeClass('cart-count-animate');
      }, 150);
      setTimeout(function() {
        cartCountEl.html(cart.item_count);
        cartOrbEl.removeClass('cart-orb-animate');
      }, 500);
    }
  }
  Cart.updateTotals = function(cart) {
    $('.header-subtotal-number').html(Format.money(cart.subtotal, true, true));
    $('.grand-total').html(Format.money(cart.total, true, true));
  }
  Cart.updateItemPrice = function(cart, index) {
    el = $('.cart-item')[index];
    el = $(el).find('.price-update');
    var price = cart.items[index].price;
    el.html(Format.money(price, true, true));
  }
  Cart.removeItemAnimate = function(itemID, el) {
    el.slideUp(150);
    Cart.updateItem(itemID, 0, function(cart) {
      Cart.updateTotals(cart);
      Cart.updateCount(cart);
    });
  }
  Cart.checkout = function() {
    var form = $('#cart-form');
    form.append('<input type="hidden" name="checkout" value="1" />');
    form.submit();
  }

  // Cart UI
  var cartItem = {}
  function getCartItem(el) {
    cartItem.el = el.closest('.cart-item');
    cartItem.id = cartItem.el.attr('data-item-id');
    cartItem.index = $('.cart-item').index(cartItem.el);
  }
  $('.cart-item-remove').click(function(e) {
    getCartItem($(this));
    Cart.removeItemAnimate(cartItem.id, cartItem.el);
  });

  $('.cart-item-quantity input').on("click", function () {
    $(this).select();
  });
  $('.cart-item-quantity input').on('change', function() {
    getCartItem($(this));
    var quantity = parseFloat($(this).val());
    if(quantity === 0) {
      Cart.removeItemAnimate(cartItem.id, cartItem.el);
    } else if(quantity) {
      Cart.updateItem(cartItem.id, quantity, function(cart) {
        Cart.updateTotals(cart);
        Cart.updateCount(cart);
        Cart.updateItemPrice(cart, cartItem.index);
      });
    }
  });

  var incrementTimer;
  $('.quantity-increment').click(function(e) {
    e.preventDefault();
    getCartItem($(this));
    var input = cartItem.el.find('input');
    var curQuantity = parseInt(input.val());
    var newQuantity = curQuantity + 1;
    input.val(newQuantity);
    clearTimeout(incrementTimer);
    incrementTimer = setTimeout(function() {
      Cart.updateItem(cartItem.id, newQuantity, function(cart) {
        Cart.updateTotals(cart);
        Cart.updateCount(cart);
        Cart.updateItemPrice(cart, cartItem.index);
      });
    }, 500);
  });

  var decrementTimer;
  $('.quantity-decrement').click(function(e) {
    e.preventDefault();
    getCartItem($(this));

    var input = cartItem.el.find('input');
    var curQuantity = parseInt(input.val());
    clearTimeout(decrementTimer);
    var newQuantity = curQuantity - 1;
    input.val(newQuantity);
    if(newQuantity > 0) {
      decrementTimer = setTimeout(function() {
        Cart.updateItem(cartItem.id, newQuantity, function(cart) {
          Cart.updateTotals(cart);
          Cart.updateCount(cart);
          Cart.updateItemPrice(cart, cartItem.index);
        });
      }, 500);
    } else {
      Cart.removeItemAnimate(cartItem.id, cartItem.el);
    }
  });

});
