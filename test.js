var assert = require('assert');
var tocsv = require('./index');

describe('ExportToCsv', function () {
	describe('export', function () {
		it('should handle no options', function () {
			console.log()
			var c = new tocsv('table');

			assert.isDefined(c);
		});

	});
});
