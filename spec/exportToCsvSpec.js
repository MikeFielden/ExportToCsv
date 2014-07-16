function setUpHtmlFixture() {
	jasmine.getFixtures().set('<table></table>');
}

describe('Options tests', function () {
	var csv;

	beforeEach(function () {
		setUpHtmlFixture();

		csv = new exportToCsv('table', {autoDownload: false});
	});

	it('should be defined', function () {
		expect(csv).toBeDefined();
	});

	it('should not autoDownload', function () {
		spyOn(csv, "download");

		csv.download();

		expect(csv.download).toHaveBeenCalled();
	});
});

// QUnit.test('Should accept plain array', function (assert) {
// 	var csv = new exportToCsv([6,7,8,9, "Things", "Other things"], {autoDownload: false});

// 	assert.notEqual(csv, undefined);
// });