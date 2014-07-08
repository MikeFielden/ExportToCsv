'use strict';

var _ = require('lodash');

var defaultOptions = {
	colDelim: '","',
	rowDelim: '"\r\n"',
	headerRow: true

};

var exportToCsv = function (options) {
	this.options = _.defaults(options, defaultOptions);
};

module.exports = exportToCsv;
