define(['util/xhr', 'nbd/Promise'], function(xhr, Promise) {
	'use strict';

	describe('util/xhr', function() {
		var type = 'POST',
		url = 'foo/bar',
		data = { foo: 'bar'}

		beforeEach(function() {
			jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('makes correct AJAX call', function(){
			
			xhr({
				type: type,
				url: url,
				data: data
			});

			var request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('foo/bar');
			expect(request.method).toBe('POST');
			expect(request.data()).toEqual({foo: ['bar']});
		});

		it('resolves promise', function(done){

			var success = jasmine.createSpy('ajaxSuccess'),
			error = jasmine.createSpy('ajaxFailure'),
			response = xhr({
				type: type,
				url: url,
				data: data,
				success: success,
				error: error
			}),
			request = jasmine.Ajax.requests.mostRecent(),
			successfulResponse = request.response({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'you are awesome'
			});

			response.then(success, error).then(function(){
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
			}).finally(done)
		});

		it('does not resolve promise', function(done){

			var success = jasmine.createSpy('ajaxSuccess'),
			error = jasmine.createSpy('ajaxFailure'),
			response = xhr({
				type: type,
				url: url,
				data: data,
				success: success,
				error: error
			}),
			request = jasmine.Ajax.requests.mostRecent(),
			errorResponse = request.response({
				'status': 400,
				'contentType': 'text/plain',
				'responseText': 'you are not awesome'
			});

			response.then(success, error).then(function(){
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
			}).finally(done)

		});

		describe('.abort', function(){

			it('is a function', function(){
				var response = xhr({
					type: type,
					url: url,
					data: data
				});
				expect(response.abort).toEqual(jasmine.any(Function));
			});

			it('will not resolve promise after abort',function(done){
				var success = jasmine.createSpy('ajaxSuccess'),
				error = jasmine.createSpy('ajaxFailure'),
				response = xhr({
					type: type,
					url: url,
					data: data
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
