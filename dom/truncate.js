define(function() {
  'use strict';

  /**
   * Returns a new Range object if the environment supports
   * it, undefined otherwise.
   * @param  {Node} textNode
   * @return {?Range}
   */
  function createSelection(textNode) {
    if (!textNode.length ||
        !document.createRange) { return; }

    var sel = document.createRange(),
    first;

    if (!sel.getBoundingClientRect) { return; }

    first = /[^\s]/.exec(textNode.textContent);
    if (!first) { return; }

    sel.setStartBefore(textNode);
    sel.setEnd(textNode, first.index + 1);

    return sel;
  }

  /**
   * Gets the height of the selection after expanding the selection
   * to encompass the entire textNode.
   * @param  {Range} sel
   * @param  {Node} textNode
   * @return {Number}
   */
  function getHeightOfTextNode(sel, textNode) {
    sel.setEndAfter(textNode);
    return getHeightOfSelection(sel);
  }

  /**
   * Gets the height of the selection.
   * @param  {Range} sel
   * @return {Number}
   */
  function getHeightOfSelection(sel) {
    return sel.getBoundingClientRect().height;
  }

  /**
   * Truncates a TextNode to a number of lines
   * @param textNode {TextNode} The DOM TextNode
   * @param limit {number} Number of lines at which to truncate
   */
  return function truncate(textNode, limit) {
    var sel = createSelection(textNode);

    if (!sel) { return; }

    var height = getHeightOfSelection(sel),
    maxHeight = height * (limit + 0.5),
    length = textNode.length,
    delta = length,
    dir = -1,
    content;

    // Bail out if current size is within bounds
    if (getHeightOfTextNode(sel, textNode) < maxHeight) {
      sel.detach();
      return;
    }

    // Binary search for the last character within bounds
    while (delta) {
      delta = ~~(delta / 2);
      length = length + dir * delta;
      sel.setEnd(textNode, length);
      if (dir * (getHeightOfSelection(sel) - maxHeight) > 0) { dir = -dir; }
    }

    content = textNode.textContent.substr(0, length).replace(/\s+$/, '');

    // Make sure the ellipsis does not wrap
    do {
      textNode.textContent = content + '…';
      height = getHeightOfTextNode(sel, textNode);
      content = content.substr(0, --length);
    }
    while (height > maxHeight);

    sel.detach();
  };
});
