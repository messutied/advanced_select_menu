(function( $ ) {
  var settings = {};
  var defaultSettings = {
    showHeader: true
  };

  var initialize = function($el) {
    var id = $el.attr("id");
    var list = $("[data-for="+id+"]");

    if (list.length == 0) {
      $.error("No list found for the advanced button "+id);
    }

    $el.addClass("am_button");

    // create popup
    var popup = $("<div class='am_popup' style='display:none'>");
    popup.append(list);
    list.show();

    // create button container
    var bContainer = $("<div class='am_button_container'>");
    bContainer.insertAfter($el);
    bContainer.append($el, popup);

    // add header
    if (settings.showHeader) {
      var hText = $("<span>").text("Select an option");
      var closeButton = $("<a href='#'>").html("&times;");
      var header = $("<div class='am_header'>").append(hText, closeButton);
      list.before(header);
      closeButton.click(function(evt) {
        evt.preventDefault();
        popup.hide();
      });
    }

    // setup popup show on button click
    $el.click(function(evt) {
      evt.preventDefault();
      popup.toggle();
    });

    // close on click outside of bContainer
    bContainer.click(function(evt) {
      evt.stopPropagation();
    });

    setUpMenuItemsEvents($el);
  }

  var setUpMenuItemsEvents = function($el) {
    $el.find("li").click(function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $(this).toggleClass("selected");
    });
  }

  var methods = {
    init: function(options) {
      var self = this;
      var $this = $(this);

      settings = $.extend(defaultSettings, options);

      $this.each(function () {
        var $element = $(this);
        initialize($element);
      });

      // hide popup on click outside
      $('html').click(function() {
        $(".am_popup").hide();
      });
    }
  };

  $.fn.amButton = function(method) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jquery.zenti.amButton' );
    }    
  };
})( jQuery );
