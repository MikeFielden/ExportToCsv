function setUpHtmlFixture() {
	jasmine.getFixtures().set('<table></table>');
}

describe('Options tests', function () {
	var csv;

	beforeEach(function () {
		setUpHtmlFixture();

		csv = new exportToCsv('table', {autoDownload: false});
	});

	it('should throw an error if the selector isnt found', function () {
		expect(function () { new exportToCsv('adsfasdf', {autoDownload: false}); }).toThrow();
	});

	it('should throw an error if the arg[0] is not [] or string', function () {
		expect(function () { new exportToCsv({}, {autoDownload: false}); }).toThrow();
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

describe('Array tests', function () {
	var csv;

	beforeEach(function () {
		csv = new exportToCsv([6,7,8,9, "Things", "Other things"], {autoDownload: false});
	});

	it('should allow array to be passed as arg[0]', function () {
		expect(csv).toBeDefined();
	});


});
