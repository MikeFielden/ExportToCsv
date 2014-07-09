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

	var exportToCsv = function (selector, userOpts) {
		var defaultOptions = {
			colDelim: '","',
			rowDelim: '"\r\n"',
			headerRow: true
		};
		
		var csv = [];

		var $table = $(selector);
		var $theads = $(selector + ' thead th');

		options = _.defaults(userOpts || {}, defaultOptions);

		if (options.headerRow) {
			buildHeaderRow($theads, csv);
		}

		console.log(csv);
	}

	return exportToCsv;
}));
