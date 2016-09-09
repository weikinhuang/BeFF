define(['jquery'], function($) {
  'use strict';

  function makeCheckbox($el) {
    var $checkbox = $('<input>', {
      type: 'checkbox',
      name: $el[0].id,
      value: '1',
      checked: $el.hasClass('active')
    }).hide();

    $checkbox.insertAfter($el);
    return $checkbox;
  }

  return {
    /**
     * Creates checkboxes out of arbitrary elements
     * Toggles the active class on the element,
     * backs it up using a hidden checkbox
     */
    toggleElement: function($el) {
      $el.each(function(i) {
        var $checkbox = makeCheckbox(i = $(this).on('click', function() {
          var selected = !$checkbox.prop('checked');
          $checkbox.prop('checked', selected).change();
          i.toggleClass('active', selected);
        }));
      });
    }
  };
});
