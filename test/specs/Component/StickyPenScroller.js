define(['jquery', 'Component/StickyPenScroller'], function($, StickyPenScroller) {
  beforeEach(function() {
    this.$context = affix('.js-context .js-editable .js-pen+.js-dropdown');
    this.$context.find('.js-pen').css({
      position: 'absolute',
      left: 0,
    });
    this.$context.find('.js-dropdown').css({
      position: 'absolute',
      left: 0,
    });
    this.pen = new StickyPenScroller({
      $context: this.$context,
      moduleClass: '.js-editable',
      leftBoundaryWidth: 70,
    });
  });

  afterEach(function() {
    this.pen.unbind();
  });

  describe('on hover over module', function() {
    it('pen is repositioned to left boundary', function() {
      expect(this.$context.find('.js-pen').offset().left).toBe(0);
      this.$context.find('.js-editable').mouseenter();
      expect(this.$context.find('.js-pen').offset().left).toBe(70);
    });
  });

  describe('on click on pen', function() {
    it('dropdown is repositioned to left boundary', function() {
      expect(this.$context.find('.js-dropdown').offset().left).toBe(0);
      this.$context.find('.js-editable').mouseenter();
      this.$context.find('.js-pen').mouseup();
      expect(this.$context.find('.js-dropdown').offset().left).toBe(71);
    });
  });

  describe('on setup', function() {
    it('does not error when there are no .js-pen classes within the modules', function() {
      var $noPenContext = affix('.js-context .js-editable .js-dropdown');
      var pen = new StickyPenScroller({
        $context: $noPenContext,
        moduleClass: '.js-editable',
        leftBoundaryWidth: 70,
      });
      expect(function() { $noPenContext.find('.js-editable').mouseenter(); }).not.toThrow();
      pen.unbind();
    });
  });
});
