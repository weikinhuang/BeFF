define([
  'jquery',
  'ux/CharCounter',
  'text!fixtures/ux/CharCounter.html'
], function($, CharCounter, fixture) {
  'use strict';

  describe('ux/CharCounter', function() {
    beforeEach(function() {
      $('#jasmine_content').append(fixture);
    });

    it('does not duplicate the counterbox for multiple divs with char-counters', function() {
      var $input1 = $('.max-length'),
          $input2 = $('.max-length2'),
          inst1 = CharCounter.init({ $context: $input1 }),
          inst2 = CharCounter.init({ $context: $input2 });

      expect($input1.find('.letters-remaining').length).toBe(1);
      expect($input2.find('.letters-remaining').length).toBe(1);

      inst1.destroy();
      inst2.destroy();
    });

    it('does not initialize when context has no validations', function() {
      var $inputs = $('.no-validations'),
          inst = CharCounter.init({ $context: $inputs }),
          $limiters;

      $limiters = $('.js-char-limiter');
      expect($limiters.length).toBe(0);
      inst.destroy();
    });

    describe('when context has validation', function() {
      describe('with only max', function() {
        it('initializes', function() {
          var $inputs = $('.max-length'),
              inst = CharCounter.init({ $context: $inputs }),
              $limiters;

          $limiters = $('.js-char-limiter');
          expect($limiters.length).not.toBe(0);
          inst.destroy();
        });
      });

      describe('with min and max', function() {
        it('initializes', function() {
          var $inputs = $('.min-max-length'),
              inst = CharCounter.init({ $context: $inputs }),
              $limiters;

          $limiters = $('.js-char-limiter');
          expect($limiters.length).not.toBe(0);
          inst.destroy();
        });

        it('puts a comment in checks for class warning on textarea', function() {
          var $inputs     = $('.min-max-length'),
              $textinput  = $inputs.find('textarea'),
              inst = CharCounter.init({ $context: $inputs });

          $textinput.val('One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in. ');
          $textinput.trigger('input');

          expect($('.js-char-limiter').hasClass('counter-warn')).toBe(true);
          inst.destroy();
        });

        it('puts a comment in checks for class warning on input', function() {
          var $inputs     = $('.min-max-length'),
              $textinput  = $inputs.find('input'),
              inst = CharCounter.init({ $context: $inputs });

          $textinput.val('One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in. ');
          $textinput.trigger('input');

          expect($('.js-char-limiter').hasClass('counter-warn')).toBe(true);
          inst.destroy();
        });

        it('puts a comment in that is too long and checks for class warning on textarea', function() {
          var $inputs     = $('.min-max-length'),
              $textinput  = $inputs.find('textarea'),
              inst = CharCounter.init({ $context: $inputs });

          $textinput.val('One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a.');
          $textinput.trigger('input');

          expect($('.js-char-limiter').hasClass('counter-max')).toBe(true);
          inst.destroy();
        });

        it('puts a comment in that is too long and checks for class warning on input', function() {
          var $inputs     = $('.min-max-length'),
              $textinput  = $inputs.find('input'),
              inst = CharCounter.init({ $context: $inputs });

          $textinput.val('One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a.');
          $textinput.trigger('input');

          expect($('.js-char-limiter').hasClass('counter-max')).toBe(true);
          inst.destroy();
        });
      });
    });
  });
});
