define(function() {
  'use strict';

  /**
   * Truncates a TextNode to a number of lines
   * @param textNode {TextNode} The DOM TextNode
   * @param limit {number} Number of lines at which to truncate
   */
  return function truncate(textNode, limit) {
    if (!textNode.length ||
        !document.createRange) { return; }

    var sel = document.createRange(),
    first;

    if (!sel.getBoundingClientRect) { return; }

    first = /[^\s]/.exec(textNode.textContent);
    if (!first) { return; }

    sel.setStartBefore(textNode);
    sel.setEnd(textNode, first.index + 1);

    var height = sel.getBoundingClientRect().height,
    maxHeight = height * (limit + 0.5),
    length = textNode.length,
    delta = length,
    dir = -1;

    // Bail out if current size is within bounds
    sel.setEndAfter(textNode);
    height = sel.getBoundingClientRect().height;
    if (height < maxHeight) {
      sel.detach();
      return;
    }

    // Binary search for the last character within bounds
    while (delta) {
      delta = ~~(delta / 2);
      length = length + dir * delta;
      sel.setEnd(textNode, length);
      height = sel.getBoundingClientRect().height;
      if (dir * (height - maxHeight) > 0) { dir = -dir; }
    }

    var content = textNode.textContent.substr(0, length);
    content = content.replace(/\s+$/, '');

    // Make sure the ellipsis does not wrap
    do {
      textNode.textContent = content + '…';
      sel.setEndAfter(textNode);
      height = sel.getBoundingClientRect().height;
      content = content.substr(0, --length);
    }
    while (height > maxHeight);

    sel.detach();
  };
});
