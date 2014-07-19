/**
 * Should be compatible with AMD and CommonJS
 *
 * Author: Mike Fielden, @Mike_Fielden, fielden.mike@gmail.com
 */
(function (root, factory) {
	if(typeof module === "object" && module.exports) {
		module.exports = factory();
	} else if(typeof define === "function" && define.amd) {
		define([], factory);
	} else {
		root.exportToCsv = factory();
	}
}(this, function () {
	var options = {};

	var helpers = {
		getValues: function (object) {
			var index = -1,
				props = Object.keys(object),
				length = props.length,
				result = Array(length);

			while (++index < length) {
				result[index] = object[props[index]];
			}
			return result;
		},
		isString: function (value) {
			return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == '[object String]' || false;
		},
		defaults: function(obj) {
			Array.prototype.forEach.call(Array.prototype.slice.call(arguments, 1), function(source) {
				if (source) {
					for (var prop in source) {
						if (obj[prop] === void 0) obj[prop] = source[prop];
					}
				}
			});

			return obj;
		}
	};


	/**
	 * buildDOMHeaderRow()
	 * Builds the header of the csv
	 * Alters the main csv array
	 *
	 * @param <NodeList> $theads
	 * @param <Array> csv
	 * @return nothing
	 */
	var buildDOMHeaderRow = function ($theads, csv) {
		var headers = [].map.call($theads, function (el) {
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
	 * @param <NodeList> $trs
	 * @param <Array> csv
	 * @return <Array> newly concated csv
	 */
	var buildDOMBody = function ($trs, csv) {
		var rows = [].map.call($trs, function($tr) {
			var thing = [].map.call($tr.children, function ($td) {
				return $td.innerHTML;
			});

			thing.push(options.rowDelim);

			return thing.join(options.colDelim);
		});

		return csv.concat(rows);
	};

	/**
	 * buildArrayHeaderRow()
	 * Builds the header of the csv
	 * Alters the main csv array
	 *
	 * @param <Array> input
	 * @param <Array> csv
	 * @return nothing
	 */
	var buildArrayHeaderRow = function (input, csv) {
		var header;

		if (typeof input[0] !== 'object') {
			header = [];
		} else {
			header = Object.keys(input[0]);
		}

		header.push(options.rowDelim);

		csv.push(header.join(options.colDelim));
	};

	/**
	 * [{itemName: "Milk", price: 1.25},
	 *	{itemName: "Ice cream", price: 99.00} ..... ]
	 *
	 *
	 * @param <Array> input
	 * @param <Array> csv
	 * @return newly concated csv
	 */
	var buildArrayBody = function (input, csv) {
		var output = [].map.call(input, function (item) {
			var valArr;

			if (typeof item !== 'object') {
				valArr = [item];
			} else {
				valArr = helpers.getValues(item);
			}

			valArr.push(options.rowDelim);
			return valArr.join(options.colDelim);
		});

		return csv.concat(output);
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

		// Auto-initialization
		if (!(this instanceof exportToCsv)) {
			return new exportToCsv(selector, userOpts);
		}

		options = helpers.defaults(userOpts || {}, defaultOptions);

		if (Array.isArray.call(this, selector) && selector.length > 0) {
			if (options.headerRow) {
				buildArrayHeaderRow(selector, csv);
			}

			csv = buildArrayBody(selector, csv);

		} else if(helpers.isString(selector)) {
			$table = document.querySelectorAll(selector);
			$theads = document.querySelectorAll(selector + ' thead th');
			$bodyRows = document.querySelectorAll(selector + ' tbody tr');

			if ($table.length === 0) {
				throw new Error('Table not found with the selector "' + selector + '"');
			}

			if (options.headerRow) {
				buildDOMHeaderRow($theads, csv);
			}

			csv = buildDOMBody($bodyRows, csv);
		} else {
			throw new Error('argument[0] must be either a string or an array');
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

		this._buildArrayHeaderRow = buildArrayHeaderRow;
		this._buildArrayBody = buildArrayBody;

		this._buildDOMHeaderRow = buildDOMHeaderRow;
		this._buildDOMBody = buildDOMBody;

		if (options.autoDownload) {
			this.download();
		}
	}

	return exportToCsv;
}));
