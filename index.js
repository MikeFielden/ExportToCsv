/**
 * Should be compatible with AMD, CommonJS, Nodejs and browsers (cross-browser)
 *
 * Author: Mike Fielden, @Mike_Fielden, fielden.mike@gmail.com
 */
(function (name, definition, context, dependencies) {
  if (typeof context['module'] !== 'undefined' && context['module']['exports']) { if (dependencies && context['require']) { for (var i = 0; i < dependencies.length; i++) context[dependencies[i]] = context['require'](dependencies[i]); } context['module']['exports'] = definition.apply(context); }
  else if (typeof context['define'] !== 'undefined' && context['define'] === 'function' && context['define']['amd']) { define(name, (dependencies || []), definition); }
  else { context[name] = definition(); }
})('exportToCsv', function () {
	var options = {};

	/**
	 * buildHeaderRow()
	 * Builds the header of the csv
	 * Alters the main csv array
	 *
	 * @param <jqObj> $theads
	 * @param <Array> csv
	 * @return nothing
	 */
	var buildHeaderRow = function ($theads, csv) {
		var headers = _.map($theads.toArray(), function (el) {
							return el.innerHTML;
						});

		headers.push(options.rowDelim);

		csv.push(headers.join(options.colDelim));
	};

	/**
	 * buildBody()
	 * Builds the body of the csv
	 * Alters the main csv array
	 *
	 * @param <jqObj> $trs
	 * @param <Array> csv
	 * @return <Array> newly concated csv
	 */
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

	/**
	 * exportToCsv()
	 * Main function, does all the lifting
	 *
	 * @param <String> selector
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
		var $table = $(selector);
		var $theads = $(selector + ' thead th');
		var $bodyRows = $(selector + ' tbody tr');

		var blob, url;

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

		if (options.autoDownload) {
			this.download();
		}
	}

	return exportToCsv;
}, this, ['jquery', '_']);