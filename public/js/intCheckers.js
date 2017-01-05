(function (global) {
    "use strict";
    var intCheckers = {
        isInt: function isInt(value) {
            var intRegex = /^[\-+]?[0-9]+$/;
            return intRegex.test(value);
        },
        isNumeric: function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        convertInt: function convertInt(string) {
            if (intCheckers.isInt(string)) {
                return Number(string);
            }
            if (intCheckers.isNumeric(string)) {
                return Math.floor(parseFloat(string)).toFixed(0);
            }
            string = String(string).replace(/[\D]/g, '');
            string = parseInt(string, 10);

            if (intCheckers.isNumeric(string)) {
                return string;
            }
            return 0;
        }
    };
    global.intCheckers = intCheckers;
}(this));
