(function( $ ) {
  var options = {};
  var defaultOptions = {
    debugging: false,
    showHeader: true,
    multiselect: false,
    hidePopupOnSelect: false,
    showApplyButton: false,
    showClearButton: false,
  };

  var setupASelectMenu = function($el) {
    var asMenu = $el.data("as_menu");

    if (!(asMenu instanceof ASelectMenu)) {
      asMenu = new ASelectMenu($el, options);
    }

    return asMenu;
  }

  var methods = {
    init: function(_options) {
      options = $.extend(defaultOptions, _options);

      $(this).each(function () {
        setupASelectMenu( $(this) );
      });
    }
  };

  $.fn.aSelectMenu = function(method) {
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


function ASelectMenu(_$el, _options) {

  // private instance variables

  var list, popup, listContainer, bContainer, tabs;
  var $el = _$el;
  var options = _options;
  var eid = $el.attr("id");
  var debugging = options.debugging;


  // private methods

  var initialize = function() {
    list = $("[data-for="+eid+"]");

    if (list.length == 0) {
      $.error("No list found for the advanced select menu "+eid);
    }

    setupHtml();
    setupEvents();
  }

  var setupEvents = function() {
    // hide popup on click outside
    $('html').click(function() {
      popup.hide();
    });

    // items select
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

    // setup tabs
    if (tabs) {
      tabs.find("a").click(function(evt) {
        evt.preventDefault();
        var id = $(this).parent().data("tab-id");
        selectTab(id);
      });
    }
  }

  var onListItemClick = function() {
    if (!options.multiselect) list.find("li.selected").removeClass("selected");

    $(this).toggleClass("selected");

    // hide popup on single select
    if (!options.multiselect && 
        options.hidePopupOnSelect && 
        list.find("li.selected").size() > 0) {
      list.parents(".as_popup").hide();
    }

    trigger( "select_item", {selected: getSelectedItems()} );
  }

  var trigger = function(event_name, obj) {
    $el.trigger("am:"+event_name, obj);
    dlog("- triggered \""+event_name+"\" with param: "+JSON.stringify(obj));

    var event_method = options["on_"+event_name];

    if (typeof event_method == "function") {
      event_method.call($el, obj);
    }
  }

  var clearSelection = function() {
    list.find("li.selected").removeClass("selected");
    trigger("clear");
  }

  var apply = function() {
    trigger( "apply", {selected: getSelectedItems()} );
  }

  var getSelectedItems = function() {
    var selItems = [];

    if (!options.multiselect) {
      selItems = list.find("li.selected").data("value");
    }
    else {
      list.find("li.selected").each(function() {
        selItems.push($(this).data("value"));
      });
    }

    return selItems;
  }

  var setupHtml = function() {
    $el.addClass("as_menu");

    // create popup
    popup = $("<div class='as_popup' style='display:none'>");

    // list container
    listContainer = $("<div class='as_list_container'>");
    popup.append(listContainer);
    listContainer.append(list);

    // setup tabs
    if (list.size() > 1) {
      tabs = $("<ul class='as_tabs'>");
      list.each(function() {
        var title = $(this).data("tab-title");
        var id = $(this).data("tab-id");
        var tab = $("<li>").append( $("<a href='#'>").text(title) ).attr("data-tab-id", id);
        tabs.append(tab);
      });

      var selTab = tabs.find("li:first").addClass("selected").data("tab-id");
      selectTab(selTab);

      listContainer.before( $("<div class='as_tabs_container'>").append(tabs) );
    }
    else {
      // no tabs
      list.show();
    }

    // foother buttons
    if (options.showApplyButton || options.showClearButton) {
      var fButtonsContainer = $("<div class='as_action_buttons_container'>");
      if (options.showApplyButton) {
        var applyButton = $("<button>").text("Apply");
        fButtonsContainer.append(applyButton);
        applyButton.click(apply);
      }
      if (options.showClearButton) {
        var clearButton = $("<button class='clear'>").text("Clear");
        fButtonsContainer.append(clearButton);
        clearButton.click(clearSelection);
      }
      listContainer.append(fButtonsContainer);
    }

    // create button container
    bContainer = $("<div class='as_menu_container'>");
    bContainer.insertAfter($el);
    bContainer.append($el, popup);

    // add header
    if (options.showHeader) {
      var hText = $("<span>").text("Select an option");
      var closeButton = $("<a href='#'>").html("&times;");
      var header = $("<div class='as_header'>").append(hText, closeButton);
      popup.prepend(header);
      closeButton.click(function(evt) {
        evt.preventDefault();
        popup.hide();
      });
    }
  }

  var selectTab = function(tabId) {
    tabs.find("li").removeClass("selected");
    tabs.find("li[data-tab-id="+tabId+"]").addClass("selected");

    list.hide();
    listContainer.find("[data-tab-id="+tabId+"]").show();
  }

  var dlog = function(mssg) {
    if (debugging) console.log(mssg);
  }

  initialize();
}
