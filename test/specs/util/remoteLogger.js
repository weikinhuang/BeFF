define([
  '@behance/nbd/util/deparam',
  'util/window',
  'util/remoteLogger'
], function(deparam, win, logger) {
  'use strict';

  describe('util/remoteLogger', function() {
    var message = 'My message',
        channel = 'mychannel';

    function getLogs() {
      var last = jasmine.Ajax.requests.mostRecent();

      return deparam(last.params).logs;
    }

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    describe('#getQueue', function() {
      it('should return queued items', function() {
        logger.info(channel, message);

        expect(logger.getQueue()).toEqual([{
          level: 'INFO',
          channel: 'mychannel',
          messages: [{ message: 'My message' }],
          context: {}
        }]);
      });
    });

    describe('#info', function() {
      it('should send the right level', function() {
        logger.info(channel, message).send();

        expect(JSON.parse(getLogs()[0]).level).toEqual('INFO');
      });
    });

    describe('#log', function() {
      it('should send the right level', function() {
        logger.log('INFO', channel, message).send();

        expect(JSON.parse(getLogs()[0]).level).toEqual('INFO');
      });

      it('should error on unknown level', function() {
        var func = function() {
          logger.log('FAKERY', channel, message);
        };

        expect(func).toThrow();
      });
    });

    describe('#error', function() {
      it('should send the right level', function() {
        logger.error(channel, message).send();

        expect(JSON.parse(getLogs()[0]).level).toEqual('ERROR');
      });
    });

    describe('#send', function() {
      it('should send correct number of requests', function() {
        logger.info(channel, message)
        .send();

        expect(getLogs().length).toEqual(1);

        logger.info(channel, message)
        .info(channel, 'My second message')
        .send();

        expect(getLogs().length).toEqual(2);
      });

      it('should send the right channel', function() {
        logger.info(channel, message).send();

        expect(JSON.parse(getLogs()[0]).channel).toEqual(channel);
      });

      it('should send the right message', function() {
        logger.info(channel, message).send();

        expect(JSON.parse(getLogs()[0]).messages[0].message).toEqual(message);
      });
    });

    describe('#getSafeSearch', function() {
      it('should return data from query string', function() {
        var mockdata, params;

        mockdata = {
          pathname: '/path',
          search: '?a=b'
        };

        spyOn(win, 'getLocation').and.callFake(function(key) {
          return mockdata[key];
        });

        params = logger.getSafeSearch();

        expect(params).toEqual(deparam(mockdata.search.substr(1)));
      });

      it('should truncate super long query string data', function() {
        var expectedParams = {},
            longString = '',
            longerString, mockdata, params;

        while (longString.length < 200) {
          // Randomize so fails are somewhat more readable
          longString += parseInt(Math.random(1, 9) * 10, 10);
        }

        longerString = longString + 'def';

        mockdata = {
          pathname: '/path',
          search: '?a=' + longerString + '&b[]=boop&b[]=' + longerString
        };

        expectedParams = {
          a: longString,
          b: ['boop', longString]
        };

        spyOn(win, 'getLocation').and.callFake(function(key) {
          return mockdata[key];
        });

        params = logger.getSafeSearch();

        expect(params).toEqual(expectedParams);
      });
    });
  });
});
