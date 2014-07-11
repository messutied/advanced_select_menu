(function( $ ) {
  var settings = {};
  var defaultSettings = {
    showHeader: true,
    multiselect: false,
    hidePopupOnSelect: false,
    showApplyButton: false,
    showClearButton: false,
  };

  var setupAmButton = function($el) {
    var amButton = $el.data("am_button");

    if (!(amButton instanceof AmButton)) {
      amButton = new AmButton($el, settings);
    }

    return amButton;
  }

  var methods = {
    init: function(options) {
      var self = this;
      var $this = $(this);

      settings = $.extend(defaultSettings, options);

      $this.each(function () {
        setupAmButton( $(this) );
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


function AmButton(_$el, _options) {

  // private instance variables

  var list, popup, listContainer, bContainer;
  var $el = _$el;
  var options = _options;

  // private methods

  var initialize = function() {
    var id = $el.attr("id");
    list = $("[data-for="+id+"]");

    if (list.length == 0) {
      $.error("No list found for the advanced button "+id);
    }

    setupHtml();
    setupEvents();
  }

  var setupEvents = function() {
    list.find("li").click(function() {
      onListItemClick.call(this, list);
    });

    // setup popup show on button click
    $el.click(function(evt) {
      evt.preventDefault();
      popup.toggle();
    });

    // close on click outside of bContainer
    bContainer.click(function(evt) {
      evt.stopPropagation();
    });

    $el.find("li").click(function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $(this).toggleClass("selected");
    });
  }

  var onListItemClick = function() {
    if (!options.multiselect) list.find("li.selected").removeClass("selected");

    $(this).toggleClass("selected");

    if (!options.multiselect && 
        options.hidePopupOnSelect && 
        list.find("li.selected").size() > 0) {
      list.parents(".am_popup").hide();
    }
  }

  var clearSelection = function() {
    list.find("li.selected").removeClass("selected");
  }

  var setupHtml = function() {
    $el.addClass("am_button");

    // create popup
    popup = $("<div class='am_popup' style='display:none'>");

    // list container
    listContainer = $("<div class='am_list_container'>");
    listContainer.append(list);
    list.show();
    popup.append(listContainer);

    // foother buttons
    if (options.showApplyButton || options.showClearButton) {
      var fButtonsContainer = $("<div class='am_action_buttons_container'>");
      if (options.showApplyButton) {
        var applyButton = $("<button>").text("Apply");
        fButtonsContainer.append(applyButton);
      }
      if (options.showClearButton) {
        var clearButton = $("<button class='clear'>").text("Clear");
        fButtonsContainer.append(clearButton);
        clearButton.click(function() {
          clearSelection();
        });
      }
      listContainer.append(fButtonsContainer);
    }

    // create button container
    bContainer = $("<div class='am_button_container'>");
    bContainer.insertAfter($el);
    bContainer.append($el, popup);

    // add header
    if (options.showHeader) {
      var hText = $("<span>").text("Select an option");
      var closeButton = $("<a href='#'>").html("&times;");
      var header = $("<div class='am_header'>").append(hText, closeButton);
      listContainer.before(header);
      closeButton.click(function(evt) {
        evt.preventDefault();
        popup.hide();
      });
    }
  }

  initialize();
}
