// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

module.exports = require('../dist/cjs/loader.cjs.js');
module.exports.applyPolyfills = function() { return Promise.resolve() };
