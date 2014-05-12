define(['jquery'], function($) {
  'use strict';

  function defaultTemplate(text) {
    return '<div class="tag">' + text + '</div>';
  }

  function render(input, template) {
    template = template || defaultTemplate;
    var el = $.parseHTML(template(input))[0];
    if (!el) { return; }

    el.contentEditable = false;
    el.unselectable = 'on';
    $(el).data('value', input).addClass('js-tag');
    return el;
  }

  var commitText = function(e, options) {
    var nonText = 0,
    texts = Array.prototype.filter.call(this.childNodes, function(node) {
      if (/\bjs-tag\b/.test(node.className)) {
        nonText++;
      }
      return node.nodeType === Node.TEXT_NODE;
    });

    if (e) {
      e.preventDefault();
    }
    if (!texts.length || nonText >= options.limit) { return; }

    texts.some(function(text) {
      this.insertBefore(render(text.textContent.trim(), options.template), text);
      this.removeChild(text);
      return ++nonText >= options.limit;
    }, this);
    $(this).trigger('input change');

    if (window.getSelection) {
      window.getSelection().collapse(this, this.childNodes.length);
    }
  },

  deleteTag = function(e) {
    if (!window.getSelection) { return; }

    var selection = window.getSelection(),
        anchor = selection.anchorNode,
        anchorOffset = selection.anchorOffset;

    // Remove previous child
    if (anchor === this && anchorOffset > 0) {
      if (e) { e.preventDefault(); }
      this.childNodes[anchorOffset - 1].remove();
      $(this).trigger('input change');
    }
    else if (anchor.nodeType === Node.TEXT_NODE && anchorOffset === 0) {
      if (anchor.previousSibling) {
        if (e) { e.preventDefault(); }
        anchor.previousSibling.remove();
        $(this).trigger('input change');
      }
    }
  },

  keydownMap = {
    // Enter
    13: commitText,
    // Comma
    188: commitText,
    // Backspace
    8: deleteTag
  };

  return function tagify($context, options) {
    options = options || {};
    var value = $context.val();
    value = options.deserialize ? options.deserialze(value) : value.split('|');

    return $('<div>', {
      contenteditable: true,
      placeholder: $context[0].placeholder,
      class: $context[0].className
    })
    .on({
      'input keypress': function() {
        $(this).toggleClass('has-value', !!this.textContent);
        if (!(window.getSelection && this.childNodes.length)) { return; }

        var lastChild = this.childNodes[this.childNodes.length - 1];
        if (lastChild.nodeType === Node.TEXT_NODE && lastChild.textContent === '' ||
            lastChild.nodeName === 'BR') { return; }

        this.appendChild(document.createElement('br'));
      },
      keydown: function(event) {
        var fn;
        return (fn = keydownMap[event.which]) && fn.call(this, event, options);
      },
      click: function() {
        this.focus();
      },
      blur: function() {
        return commitText.call(this, null, options);
      },
      change: function() {
        var value = $(this).find('.js-tag').toArray()
        .map(function(tag) {
          return $(tag).data('value');
        });

        value = options.serialize ? options.serialize(value) : value.join('|');
        $context.val(value);
      }
    })
    .insertAfter($context.hide())
    .append(value.filter(Boolean).map(function(data) {
      return render(data, options.template);
    }))
    .append('<br type="_moz">');
  };
});
