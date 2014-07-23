function setUpHtmlFixture() {
	var table = [
		'<table>',
			'<thead>',
				'<tr>',
					'<th><b>One</b></th>',
					'<th>Two</th>',
					'<th>Three</th>',
				'</tr>',
			'</thead>',
		  '<tbody>',
		  	'<tr>',
		  		'<td><b>item 1</b></td>',
		  		'<td>item 2</td>',
		  		'<td>item 3</td>',
		  	'</tr>',
		  	'<tr>',
		  		'<td>item 4</td>',
		  		'<td>item 5</td>',
		  		'<td>item 6</td>',
		  	'</tr>',
		  	'<tr>',
		  		'<td>item 7</td>',
		  		'<td>item 8</td>',
		  		'<td>item 9</td>',
		  	'</tr>',
		  	'<tr>',
		  		'<td>item 24</td>',
		  		'<td>item 25</td>',
		  		'<td>item 36</td>',
		  	'</tr>',
		  '</tbody>',
		'</table>'
	].join();

	jasmine.getFixtures().set(table);
}

function setUpNoDataTdFixture() {
	var table = [
		'<table>',
			'<thead>',
				'<tr>',
					'<th><b>One</b></th>',
					'<th>Two</th>',
					'<th>Three</th>',
				'</tr>',
			'</thead>',
		  '<tbody>',
		  	'<tr>',
		  		'<td></td>',
		  		'<td>One,Two,Three,Four</td>',
		  		'<td></td>',
		  	'</tr>',
		  '</tbody>',
		'</table>'
	].join();

	jasmine.getFixtures().set(table);
}


describe('auto-init constructor', function () {
	beforeEach(function () {
		setUpHtmlFixture();
	});

	it('should function properly with the "new" keyword', function () {
		expect(new exportToCsv('table', {autoDownload: false})).toBeDefined();
	});

	it('should function properly without the "new" keyword', function () {
		expect(exportToCsv('table', {autoDownload: false})).toBeDefined();
	});
});

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

describe('Handles html properly', function () {
	var rowDelim, e2csv;
	var fakeCsv = [];

	beforeEach(function () {
		setUpHtmlFixture();

		rowDelim = '\r\n';

		e2csv = new exportToCsv('table', {
			autoDownload: false,
			rowDelim: rowDelim
		});
	});

	it('should function properly with the "new" keyword for body', function () {
		var rtnCsv = e2csv._buildDOMBody($('tbody tr').toArray(), fakeCsv);

		expect(rtnCsv[0].contains('<b>')).toBe(false);
	});

	it('should function properly with the "new" keyword for header', function () {
		e2csv._buildDOMHeaderRow($('thead th').toArray(), fakeCsv);

		expect(fakeCsv[0].contains('<b>')).toBe(false);
	});
});

describe('Handle special cases in td', function () {
	var rowDelim, e2csv;
	var fakeCsv = [];

	beforeEach(function () {
		setUpNoDataTdFixture();

		rowDelim = '\r\n';

		e2csv = new exportToCsv('table', {
			autoDownload: false,
			rowDelim: rowDelim
		});
	});

	it('should handle <td></td> properly', function () {
		var rtnCsv = e2csv._buildDOMBody($('tbody tr').toArray(), fakeCsv);

		expect(rtnCsv.length).toBe(1);
	});
});

describe('Array tests', function () {
	beforeEach(function () {
	});

	it('should allow array to be passed as arg[0]', function () {
		var csv = new exportToCsv([9], {autoDownload: false});
		expect(csv).toBeDefined();
	});

	it('should NOT allow empty array to be passed as arg[0]', function () {
		expect(function () { new exportToCsv([], {autoDownload: false}); }).toThrow();
	});
});

/**
 * Array export header tests
 */
describe('Array header tests', function () {
	var rowDelim, e2csv;
	var fakeCsv = [];

	beforeEach(function () {
		rowDelim = '\r\n';

		e2csv = new exportToCsv([1], {
			autoDownload: false,
			rowDelim: rowDelim
		});
	});

	afterEach(function () {
		fakeCsv.length = 0;
	});

	it('should return empty if no obj found', function () {
		e2csv._buildArrayHeaderRow([9,9,9], fakeCsv);

		// 1 because of the rowDelim
		expect(fakeCsv.length).toBe(1);
		expect(fakeCsv.indexOf(rowDelim)).toBe(0);
	});

	it('should return the proper header', function () {
		var objToBeCsvd = [{itemName: "Milk", price: 1.25},
	 						{itemName: "Ice cream", price: 99.00}];

		e2csv._buildArrayHeaderRow(objToBeCsvd, fakeCsv);

		expect(fakeCsv.length).toBe(1);
		expect(fakeCsv[0]).toBe("itemName,price,\r\n");
	});
});

/**
 * Array export body tests
 */
describe('Array body tests', function () {
	it('should return the proper csv', function () {
		var objToBeCsvd = [{itemName: "Milk", price: 1.25},
	 						{itemName: "Ice cream", price: 99.00}];

		var e2csv = new exportToCsv([1], {
			autoDownload: false
		});

		var fakeCsv = [];

		var rtnCsv = e2csv._buildArrayBody(objToBeCsvd, fakeCsv);

		expect(rtnCsv.length).toBe(2);
		expect(rtnCsv[0]).toBe("Milk,1.25,\r\n");
	});
});

/**
 * DOM export header tests
 */
describe('DOM header tests', function () {
	var rowDelim, e2csv;
	var fakeCsv = [];

	beforeEach(function () {
		setUpHtmlFixture();

		rowDelim = '\r\n';

		e2csv = new exportToCsv('table', {
			autoDownload: false,
			rowDelim: rowDelim
		});
	});

	afterEach(function () {
		fakeCsv.length = 0;
	});

	it('should return the proper headers', function () {
		e2csv._buildDOMHeaderRow($('thead th').toArray(), fakeCsv);

		// Only header returned
		expect(fakeCsv.length).toBe(1);
		// minus 2 to account for the /r/n
		expect(fakeCsv[0].indexOf(rowDelim)).toBe(fakeCsv[0].length-2);
	});
});

/**
 * DOM export body tests
 */
describe('DOM body tests', function () {
	var rowDelim, e2csv;
	var fakeCsv = [];

	beforeEach(function () {
		setUpHtmlFixture();

		rowDelim = '\r\n';

		e2csv = new exportToCsv('table', {
			autoDownload: false,
			rowDelim: rowDelim
		});
	});

	afterEach(function () {
		fakeCsv.length = 0;
	});

	it('should return the proper body stuffs', function () {
		var rtnCsv = e2csv._buildDOMBody($('tbody tr').toArray(), fakeCsv);

		// Only header returned
		expect(rtnCsv.length).toBe(4);
	});
});
