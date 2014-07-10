'use strict';

(function (root, factory) {
	'use strict';
	if (typeof define == 'function' && define.amd) {
		define(['underscore'], factory);
		define(['jquery'], factory);
	}
	else {
		root.ExportToCsv = factory(root._, root.$);
	}
}(this, function (_, $) {
	var options = {};

	if (!_ || !$) {
		throw new Error('Must have _ and $.');
	}

	var buildHeaderRow = function ($theads, csv) {
		var headers = _.map($theads.toArray(), function (el) {
							return el.innerHTML;
						});

		headers.push(options.rowDelim);

		csv.push(headers.join(options.colDelim));
	};

	var buildBody = function ($trs, csv) {
		var rows = _.map($trs.toArray(), function($tr) {
			var thing = _.map($tr.children, function ($td) {
				return $td.innerHTML;
			});

			thing.push(options.rowDelim);

			return thing;
		});

		return csv.concat(rows);
	};

	var exportToCsv = function (selector, userOpts) {
		var defaultOptions = {
			colDelim: ',',
			rowDelim: '\r\n',
			headerRow: true,
			fileName: 'data.csv'
		};

		var csv = [];
		var a = document.createElement('a');
		var blob, url;

		var $table = $(selector);
		var $theads = $(selector + ' thead th');
		var $bodyRows = $(selector + ' tbody tr');

		if ($table.length === 0) {
			throw new Error('Table not found with the selector "' + selector + '"');
		}

		options = _.defaults(userOpts || {}, defaultOptions);

		if (options.headerRow) {
			buildHeaderRow($theads, csv);
		}

		csv = buildBody($bodyRows, csv);

		// Hide it
		a.style = 'display: none';

		this.download = function () {
			// Append it
			document.body.appendChild(a);

			// Blob
			blob = new Blob(csv, {type: 'octet/stream'});
			url = window.URL.createObjectURL(blob);

			a.href = url;
			a.download = options.fileName;
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		};
	}

	return exportToCsv;
}));
