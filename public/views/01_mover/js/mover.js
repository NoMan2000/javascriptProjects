(function (global, doc, $) {
    "use strict";
    var move = document.getElementById('move'),
        applyTransition = (function applyTransition(element) {
            element.style.transitionDuration = "0.3s";
            element.style.transitionTimingFunction = "ease-out";
        }(move)),
        keycode = global.KeyCode,
        intCheckers = {
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
        },
        keyupEvent = function keyupEvent(e) {
            var pressedKey = e.keyCode,
                target = move,
                marginLeft = intCheckers.convertInt(target.style.marginLeft),
                marginTop = intCheckers.convertInt(target.style.marginTop);
            if (keycode.KEY_LEFT === pressedKey) {
                // Check that the value is greater than 0
                if (marginLeft) {
                    marginLeft -= 1;
                }
                target.style.marginLeft = marginLeft + 'rem';
            }
            if (keycode.KEY_RIGHT === pressedKey) {
                marginLeft += 1;
                target.style.marginLeft = marginLeft + 'rem';
            }
            if (keycode.KEY_DOWN === pressedKey) {
                marginTop += 1;
                target.style.marginTop = marginTop + 'rem';
            }
            if (keycode.KEY_UP === pressedKey) {
                if (marginTop) {
                    marginTop -= 1;
                }
                target.style.marginTop = marginTop + 'rem';
            }
        };
    document.removeEventListener('keydown', keyupEvent, false);
    document.addEventListener('keydown', keyupEvent, false);
    global.intCheckers = intCheckers;
}(this, document, jQuery));
