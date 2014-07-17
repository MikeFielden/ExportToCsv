/**
 * Should be compatible with AMD and CommonJS
 *
 * Author: Mike Fielden, @Mike_Fielden, fielden.mike@gmail.com
 */
(function (root, factory) {
	if(typeof module === "object" && module.exports) {
		module.exports = factory(require("jquery"), require('lodash'));
	} else if(typeof define === "function" && define.amd) {
		define(["jquery", "lodash"], factory);
	} else {
		root.exportToCsv = factory(root.$, root._);
	}
}(this, function ($, _) {
	var options = {};

	/**
	 * buildDOMHeaderRow()
	 * Builds the header of the csv
	 * Alters the main csv array
	 *
	 * @param <jqObj> $theads
	 * @param <Array> csv
	 * @return nothing
	 */
	var buildDOMHeaderRow = function ($theads, csv) {
		var headers = _.map($theads.toArray(), function (el) {
							return el.innerHTML;
						});

		headers.push(options.rowDelim);

		csv.push(headers.join(options.colDelim));
	};

	/**
	 * buildDOMBody()
	 * Builds the body of the csv
	 * Alters the main csv array
	 *
	 * @param <jqObj> $trs
	 * @param <Array> csv
	 * @return <Array> newly concated csv
	 */
	var buildDOMBody = function ($trs, csv) {
		var rows = _.map($trs.toArray(), function($tr) {
			var thing = _.map($tr.children, function ($td) {
				return $td.innerHTML;
			});

			thing.push(options.rowDelim);

			return thing;
		});

		return csv.concat(rows);
	};

	var buildArrayHeaderRow = function (input, csv) {

	};

	var buildArrayBody = function (input, csv) {

	};



	/**
	 * exportToCsv()
	 * Main function, does all the lifting
	 *
	 * @param <String> selector || <Array>
	 * @param <Object> userOpts
	 * @return nothing
	 */
	var exportToCsv = function (selector, userOpts) {
		var defaultOptions = {
			colDelim: ',',
			rowDelim: '\r\n',
			headerRow: true,
			fileName: 'data.csv',
			autoDownload: true
		};

		var csv = [];
		var a = document.createElement('a');
		var $table, $theads, $bodyRows;
		var blob, url;

		if (!_ || !$) {
			throw new Error('Must have _ and $.');
		}

		options = _.defaults(userOpts || {}, defaultOptions);

		if (_.isArray(selector) && selector.length > 0) {
			if (options.headerRow) {
				buildArrayHeaderRow(selector, csv);
			}

			csv = buildArrayBody(selector, csv);

		} else {
			$table = $(selector);
			$theads = $(selector + ' thead th');
			$bodyRows = $(selector + ' tbody tr');

			if ($table.length === 0) {
				throw new Error('Table not found with the selector "' + selector + '"');
			}

			if (options.headerRow) {
				buildDOMHeaderRow($theads, csv);
			}

			csv = buildDOMBody($bodyRows, csv);
		}

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

		if (options.autoDownload) {
			this.download();
		}
	}

	return exportToCsv;
}));