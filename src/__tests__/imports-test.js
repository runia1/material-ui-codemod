"use strict";

jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;

defineTest(__dirname, "imports", null, "imports-multiline");
defineTest(__dirname, "imports", null, "imports-oneline");
defineTest(__dirname, "imports", null, "imports-specialCases");
