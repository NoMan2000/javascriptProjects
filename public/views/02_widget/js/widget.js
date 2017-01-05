(function (global, doc) {
    "use strict";
    var widget = doc.querySelector('#widget'),
        spokes = widget.querySelector('.b'),
        innerWheel = widget.querySelectorAll('.a')[1],
        start = doc.querySelector('#startWidget'),
        stop = doc.querySelector('#stopWidget'),
        smoothStart = doc.querySelector('#smoothWidget'),
        rotations = 0,
        smoothDegrees = 0,
        intervalID = null,
        rotateSpokes = function rotateSpokes() {
            var date = new Date(),
                currentSeconds = date.getSeconds(),
                offset,
                convertToDegrees = Math.floor(((currentSeconds / 60) * 360));
            if (convertToDegrees % 360 === 0) {
                rotations += 1;
            }
            offset = rotations * 360;
            convertToDegrees += offset;
            innerWheel.style.transform = spokes.style.transform = 'rotate(' + convertToDegrees + 'deg)';
        },
        rotateSmooth = function rotateSmooth() {
            var smoothRotation = Math.floor((smoothDegrees / 60) * 360);
            smoothDegrees += 1;
            innerWheel.style.transform = spokes.style.transform = 'rotate(' + smoothRotation + 'deg)';
        },
        startSmooth = function startSmooth() {
            if (null === intervalID) {
                intervalID = setInterval(rotateSmooth, 1000);
            }
        },
        startRotation = function startRotation() {
            if (null === intervalID) {
                // Prevent repeated intervals
                intervalID = setInterval(rotateSpokes, 1000);
            }
        },
        stopRotation = function stopRotation() {
            if (null !== intervalID) {
                clearInterval(intervalID);
                intervalID = null;
            }
        };
    innerWheel.style.transition = spokes.style.transition = 'transform 0.2s ease-in-out';
    innerWheel.style.transformOrigin = spokes.style.transformOrigin = 'center';
    start.removeEventListener('click', startRotation, false);
    start.addEventListener('click', startRotation, false);
    smoothStart.removeEventListener('click', startSmooth, false);
    smoothStart.addEventListener('click', startSmooth, false);
    stop.removeEventListener('click', stopRotation, false);
    stop.addEventListener('click', stopRotation, false);
}(this, document));
