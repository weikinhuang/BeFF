define([
  'jquery',
  '../Component'
], function($, Component) {
  'use strict';

  return Component.extend({
    init: function(options) {
      options = options || {};
      this.penMargin = options.penMargin || 15;
      this.dropDownMargin = options.dropDownMargin || 10;
      this.moduleClass = options.moduleClass;
      this.offset = options.offset || 0;
      this.$context = options.$context;
      this.leftBoundaryWidth = options.leftBoundaryWidth;
      this.initialPenLeftPosition = null;

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
        var $pen = $(e.currentTarget);
        this._checkAndSetLeftBoundaryForPen($pen);
        this._adjustDropdownFromPen($pen);
      }.bind(this));

      this._setWindowScroller();
    },

    _setWindowScroller: function() {
      var $module = this.$modules.first();
      var scrollTop;

      var update = function() {
        if (!$module.length) { return; }

        var $pen = $module.find('.js-pen');
        var moduleOffsetTop = $module.offset().top;
        var $dropdown = $pen.next('.js-dropdown');
        var offsettedScrollTop = scrollTop + this.offset;

        // top and bottom scroll bounds for each module
        if (offsettedScrollTop > moduleOffsetTop && offsettedScrollTop < this._getScrollBottomLimit($module, $pen)) {
          $pen.css('top', offsettedScrollTop - moduleOffsetTop + this.penMargin);
          this._checkAndSetLeftBoundaryForPen($pen);
          this._fixDropDownPosition($dropdown, $pen);
        }
        else if ($module.outerHeight() < $pen.outerHeight()) {
          $pen.css('top', this.penTopPosForShortModules);
          this._checkAndSetLeftBoundaryForPen($pen);
        }
        else {
          $pen.css('top', this.penMargin);
          this._checkAndSetLeftBoundaryForPen($pen);
          this._fixDropDownPosition($dropdown, $pen);
        }
      }.bind(this);

      this.$context.on('mouseenter.stickyPenScroller', this.moduleClass, function() {
        $module = $(this);
        update();
      });

      $(window).on('scroll.stickyPenScroller', function(e) {
        scrollTop = $(e.target).scrollTop();
        update();
      });
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
          this._checkAndSetLeftBoundaryForDropdown($pen, $dropdown);
        }.bind(this), 1);
      }

      $dropdown.css('top', $pen.position().top + penHeight + this.dropDownMargin);
      this._checkAndSetLeftBoundaryForDropdown($pen, $dropdown);
    },

    _fixDropDownPosition: function($dropdown, $pen) {
      if ($dropdown.is(':visible')) {
        this._adjustDropdownFromPen($pen);
      }
    },

    _checkAndSetLeftBoundaryForPen: function($pen) {
      if (this.leftBoundaryWidth) {
        if (!this.initialPenLeftPosition) {
          this.initialPenLeftPosition = $pen.position().left;
        }
        if ($pen.offset().left <= this.leftBoundaryWidth) {
          $pen.css('left', (this.leftBoundaryWidth - $pen.offset().left) + $pen.position().left);
        }
        else {
          $pen.css('left', this.initialPenLeftPosition);
        }
      }
    },

    _checkAndSetLeftBoundaryForDropdown: function($pen, $dropdown) {
      if (this.leftBoundaryWidth) {
        if ($pen.offset().left < this.leftBoundaryWidth + this.dropDownMargin) {
          $dropdown.css('left', $pen.position().left + 1); // +1 to show left shadow of dropdown
        }
      }
    },

    _positionPenForShortModules: function() {
      this.$modules.on('mouseenter.stickyPenScroller', function(e) {
        var $module = $(e.currentTarget),
            $pen = $module.find('.js-pen');

        this._checkAndSetLeftBoundaryForPen($pen);
        if ($module.outerHeight() < $pen.outerHeight()) {
          $pen.css('top', this.penTopPosForShortModules);
        }
      }.bind(this));
    },

    unbind: function() {
      this.$context.off('.stickyPenScroller');
      this.$modules.off('.stickyPenScroller');
      $(window).off('.stickyPenScroller');
    }
  });
});
