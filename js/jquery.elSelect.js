(function( $ ) {
  var settings = {};
 
  // private methods
  var somePrivateMethod = function() {
  }
  
  // public methods
  var methods = {
    init: function(options) {
      var $this = $(this);
 
      settings = $.extend({}, options);
 
      $this.each(function () {
        var $element = $(this);
      });
    },
    
    next: function(_class, callback) {
      var class_plain = _class.replace(".", "");
      var list = $(this);
      var sel = list.find(_class);
      if (sel.size() < 1) list.find(":first").addClass(class_plain);
      var next = sel.next();

      if (next.size() > 0) {
        if (callback != undefined) {
          callback.call(this, next.data("tab-id"));
        }
        else {
          sel.removeClass(class_plain);
          next.addClass(class_plain);
        }
      }
    },
    
    prev: function(_class, callback) {
      var class_plain = _class.replace(".", "");
      var list = $(this);
      var sel = list.find(_class);
      if (sel.size() < 1) list.find(":last").addClass(class_plain);
      var prev = sel.prev();

      if (prev.size() > 0) {
        if (callback != undefined) {
          callback.call(this, prev.data("tab-id"));
        }
        else {
          sel.removeClass(class_plain);
          prev.addClass(class_plain);
        }
      }
    }
  };
 
  $.fn.elSelect = function(method) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jquery.zenti.basicPluginName' );
    }    
  };
})( jQuery );