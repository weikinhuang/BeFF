define([
  'jquery',
  'lodash.debounce',
  '../Component'
], function($, debounce, Component) {
  'use strict';

  return Component.extend({
    init: function(options) {
      options = options || {};
      this.penMargin = options.penMargin || 15;
      this.dropDownMargin = options.dropDownMargin || 10;
      this.moduleClass = options.moduleClass;
      this.offset = options.offset || 0;
      this.$context = options.$context;

      this.penTopPosForShortModules = -10;
      this.$modules = $(this.moduleClass);
      this.$pens = this.$context.find('.js-pen');

      this._setupScroller();
      this._positionPenForShortModules();
    },

    _setupScroller: function() {
      this.$pens.each(function(index, pen) {
        var $pen = $(pen);

        $pen.attr('data-index', index);
      }.bind(this));

      this.$context.on('mouseup.stickyPenScroller', '.js-pen', function(e) {
        this._adjustDropdownFromPen($(e.currentTarget));
      }.bind(this));

      this._setWindowScroller();
    },

    _setWindowScroller: function() {
      $(window).on('scroll.stickyPenScroller', debounce(function(e) {
        this.$context.find(this.moduleClass).each(function(_, module) {
          var $module = $(module),
              $pen = $module.find('.js-pen'),
              moduleOffsetTop = $module.offset().top,
              scrollTop = $(e.target).scrollTop() + this.offset,
              $dropdown = $pen.next('.js-dropdown');

          // top and bottom scroll bounds for each module
          if (scrollTop > moduleOffsetTop && scrollTop < this._getScrollBottomLimit($module, $pen)) {
            $pen.css('top', scrollTop - moduleOffsetTop + this.penMargin);
            this._fixDropDownPosition($dropdown, $pen);
          }
          else if ($module.outerHeight() < $pen.outerHeight()) {
            $pen.css('top', this.penTopPosForShortModules);
          }
          else {
            $pen.css('top', this.penMargin);
            this._fixDropDownPosition($dropdown, $pen);
          }
        }.bind(this));
      }.bind(this), 100));
    },

    _getScrollBottomLimit: function($module, $pen) {
      var $dropdown = $pen.next('.js-dropdown'),
          limit = $module.offset().top + $module.innerHeight() - $pen.outerHeight() - this.penMargin;

      if ($dropdown.is(':visible')) {
        limit -= $dropdown.outerHeight();
      }

      return limit;
    },

    _adjustDropdownFromPen: function($pen) {
      var penHeight = $pen.innerHeight(),
          $dropdown = $pen.next('.js-dropdown');

      if (!$dropdown.length) {
        window.setTimeout(function() {
          $dropdown = $pen.next('.js-dropdown');
          $dropdown.css('top', $pen.position().top + penHeight + this.dropDownMargin);
        }.bind(this), 1);
      }

      $dropdown.css('top', $pen.position().top + penHeight + this.dropDownMargin);
    },

    _fixDropDownPosition: function($dropdown, $pen) {
      if ($dropdown.is(':visible')) {
        this._adjustDropdownFromPen($pen);
      }
    },

    _positionPenForShortModules: function() {
      this.$modules.on('mouseenter.stickyPenScroller', function(e) {
        var $module = $(e.currentTarget),
            $pen = $module.find('.js-pen');

        if ($module.outerHeight() < $pen.outerHeight()) {
          $pen.css('top', this.penTopPosForShortModules);
        }
      }.bind(this));
    },

    unbind: function() {
      this.$context.off('mouseup.stickyPenScroller');
      this.$modules.off('mouseenter.stickyPenScroller');
      $(window).off('scroll.stickyPenScroller');
    }
  });
});
