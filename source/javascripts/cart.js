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
});

$('body')
  .on( 'click','.quantity-controls button', function(e) {
    e.preventDefault();
    var $t = $(this)
    , input = $(this).closest('.cart-item').find('input[type="text"]')
    , val = parseInt(input.val())
    , valMin = 1
    , item_id = $(this).parent().closest('.cart-item').data("item-id");
    if (isNaN(val) || val < valMin) {
      var new_val = valMin;
    }
    if ($(this).hasClass('quantity-increment')) {
      var new_val = val + 1;
    }
    else {
      if (val > valMin) {
        var new_val = val - 1;
      }
    }
    if (new_val > 0) {
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
    }
    else {
      Cart.removeItem(item_id, function(cart) {
        processUpdate(input, item_id, 0, cart);
      });
    }
  })
  .on( 'click', '.cart-item-remove', function(e) {
    e.preventDefault();
    item_id = $(this).parent().closest('.cart-item').data("item-id");
    new_val = 0;
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate('', item_id, '', cart);
    });
  })
  .on('change','.cart-item-quantity input[type="text"]', function(e) {
    var item_id = $(this).parent().closest('.cart-item').data("item-id");
    var new_val = $(this).val();
    var input = $(this);
    Cart.updateItem(item_id, new_val, function(cart) {
      processUpdate(input, item_id, new_val, cart);
    });
  })
  .on('keydown','.cart-item-quantity input[type="text"]', function(e) {
    if (e.keyCode == 13) {
      item_id = $(this).closest('.cart-item').data("item-id");
      new_val = $(this).val();
      input = $(this);
      Cart.updateItem(item_id, new_val, function(cart) {
        processUpdate(input, item_id, new_val, cart);
      });
      e.preventDefault();
      return false;
    }
  })

const shouldUseWebShare = () => {
  const hasShareApi = 'share' in navigator;
  
  const isMobileUserAgentData = 'userAgentData' in navigator && navigator.userAgentData.mobile;
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  return hasShareApi && (isMobileUserAgentData || isIOS || isAndroid);
};

document.querySelector('.copy-cart-link')?.addEventListener('click', async (event) => {
  event.preventDefault();
  const link = event.currentTarget;
  const originalText = link.textContent;
  const text = link.dataset.clipboardText;

  if (shouldUseWebShare()) {
    try {
      await navigator.share({
        title: 'Check out this cart I saved',
        url: text
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('Share failed:', error);
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      link.textContent = 'Link copied!';
      setTimeout(() => {
        link.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.warn('Clipboard copy failed:', error);
    }
  }
});

function updateShareableLink() {
  fetch('/cart/shareable_link.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data?.shareable_link) {
        throw new Error('Invalid response format');
      }
      const linkElement = document.querySelector('.copy-cart-link');
      if (linkElement) {
        linkElement.href = data.shareable_link;
        linkElement.dataset.clipboardText = data.shareable_link;
      }
    })
    .catch(error => {
      console.warn('Failed to update shareable cart link:', error);
      const linkElement = document.querySelector('.copy-cart-link');
      if (linkElement) {
        linkElement.style.display = 'none';
      }
    });
}

var processUpdate = function(input, item_id, new_val, cart) {
  Cart.updateCount(cart)
  var sub_total = Format.money(cart.total, true, true);
  var item_count = cart.item_count;

  $('.grand-total').html(sub_total);
  $('.cart-count').html(item_count);

  updateShareableLink();

  if (item_count == 0) {
    $('.cart-wrap').hide();
    $('.cart-empty-modal').fadeIn();
  }
  else {
    $('.errors').hide();
    if (input) {
      input.val(new_val);
    }
  }
  if (new_val > 0) {
    for (itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
      if (cart.items[itemIndex].id == item_id) {
        item_price = cart.items[itemIndex].price;
        formatted_item_price = Format.money(item_price, true, true);
        $('.cart-item[data-item-id="'+item_id+'"]').find('.price-update').html(formatted_item_price)
      }
    }
  }
  else {
    $('.cart-item[data-item-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}
Cart.checkout = function() {
  var form = $('#cart-form');
  form.append('<input type="hidden" name="checkout" value="1" />');
  form.submit();
}
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
