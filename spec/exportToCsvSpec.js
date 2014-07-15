describe('Options tests', function () {
	var csv;

	beforeEach(function () {
		csv = new exportToCsv('table', {autoDownload: false});
	});

	it('should be defined', function () {
		expect(csv).toBeDefined();
	});
});

// QUnit.test('Options tests', function(assert) {
// 	var csv = new exportToCsv('table', {autoDownload: false});

// 	assert.notEqual(csv, undefined);

// 	assert.equal(typeof csv.download, "function");
// });

// QUnit.test('Error condition tests', function(assert) {
// 	// Should throw an error bc the table wasnt found
// 	assert.throws(function () {
// 		var csv = new exportToCsv('.xzy', {autoDownload: false});
// 	});
// });

// QUnit.test('Should accept plain array', function (assert) {
// 	var csv = new exportToCsv([6,7,8,9, "Things", "Other things"], {autoDownload: false});

// 	assert.notEqual(csv, undefined);
// });