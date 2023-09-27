'use strict';

var vitest = require('vitest');
var matchers = require('./matchers-d012a0f1.js');
require('redent');
require('lodash/isEqual.js');
require('@adobe/css-tools');
require('dom-accessibility-api');
require('chalk');
require('lodash/isEqualWith.js');
require('lodash/uniq.js');
require('css.escape');
require('aria-query');

/* istanbul ignore file */


vitest.expect.extend(matchers.extensions);
