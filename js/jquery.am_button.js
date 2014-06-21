(function( $ ) {
  var settings = {};

  var initialize = function($el) {
    var id = $el.attr("id");
    var list = $("[data-for="+id+"]");

    if (list.length == 0) {
      $.error("No list found for the advanced button "+id);
    }

    var span = $("<span>").text( $el.text() );
    $el.html(span).append(list);
    $el.addClass("am-button");

    $el.click(function(evt) {
      evt.preventDefault();
      list.toggle();
    });
  }

  var methods = {
    init: function(options) {
      var self = this;
      var $this = $(this);

      settings = $.extend({
      }, options);

      $this.each(function () {
        var $element = $(this);
        initialize($element);
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
