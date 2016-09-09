define([
  'jquery',
  'nbd/util/curry'
], function($, curry) {
  'use strict';

  // Make a select from a ul/ol
  function makeSelect($ul, multiple) {
    var $select = $('<select>', {
      name: $ul[0].id,
      multiple: multiple || false
    }).hide();

    // A singular select, empty default value
    if (!multiple) {
      $('<option>', { selected: true, disabled: true }).appendTo($select);
    }

    $ul.children('li').each(function() {
      $('<option>', { value: $(this).data('value') }).appendTo($select);
    });

    $select.insertAfter($ul);
    return $select;
  }

  function bindList(multiple, $ul) {
    $ul = $($ul);
    $ul = $ul.is('ul,ol') ? $ul : $('ul,ol', $ul);
    $ul.each(function() {
      var $select = makeSelect(
        $(this).on('click', '>li', function() {
          var $li = $(this),
              val = $li.data('value'),
              $option = $select.find('[value="' + val + '"]'),
              selected = !$option.prop('selected');

          // Set <option> selected state
          $option.prop('selected', selected);
          selected = $option.prop('selected');

          (multiple ?
            $ul.find('[data-value="' + val + '"]') :
            $li.siblings().removeClass('active').end()
          ).toggleClass('active', selected);
        }), multiple);
    });
  }

  return {
    selectList: curry.call(bindList, false),
    multiList: curry.call(bindList, true)
  };
});
