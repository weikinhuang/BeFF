define(['util/xhr', 'nbd/Promise'], function(xhr, Promise) {
	'use strict';

	describe('util/xhr', function() {

		beforeEach(function() {
			jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('makes correct AJAX call', function(){
			
			xhr({
				type: 'POST',
				url: 'foo/bar',
				data: { foo: 'bar'}
			});

			var request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('foo/bar');
			expect(request.method).toBe('POST');
			expect(request.data()).toEqual({foo: ['bar']});
		});

		it('resolves promise', function(){

			var success = jasmine.createSpy('ajaxSuccess'),
			error = jasmine.createSpy('ajaxFailure');

			xhr({
				type: 'POST',
				url: 'foo/bar',
				data: { foo: 'bar'},
				success: success,
				error: error
			});

			
			var request = jasmine.Ajax.requests.mostRecent();
			request.response({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'you are awesome'
			});

			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();

		});

		it('does not resolve promise', function(){

			var success = jasmine.createSpy('ajaxSuccess'),
			error = jasmine.createSpy('ajaxFailure');

			xhr({
				type: 'POST',
				url: 'foo/bar',
				data: { foo: 'bar'},
				success: success,
				error: error
			});

			
			var request = jasmine.Ajax.requests.mostRecent();
			request.response({
				'status': 400,
				'contentType': 'text/plain',
				'responseText': 'you are not awesome'
			});

			expect(success).not.toHaveBeenCalled();
			expect(error).toHaveBeenCalled();

		});

		describe('.abort', function(){

			it('is a function', function(){
				var response = xhr({
					type: 'POST',
					url: 'foo/bar',
					data: { foo: 'bar'}
				});
				expect(response.abort).toEqual(jasmine.any(Function));
			});

			it('promise does not resolve after abort',function(done){
				var success = jasmine.createSpy('ajaxSuccess'),
				error = jasmine.createSpy('ajaxFailure'),
				response = xhr({
					type: 'POST',
					url: 'foo/bar',
					data: { foo: 'bar'}
				});

				response.abort();
				response.then(success, error).then(function(){
					expect(success).not.toHaveBeenCalled();
					expect(error).toHaveBeenCalled();
				}).finally(done)
			});

		});
	});

});
