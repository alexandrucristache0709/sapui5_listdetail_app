/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"acristachecomsaptrainingux402listdetail/ux402_listdetail/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});