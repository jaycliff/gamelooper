"use strict";
var interval_id, is_looping = false;
function loopStepper() {
    self.postMessage('loop step');
}
self.onmessage = function (event) {
    var data = event.data;
    switch (data) {
    case 'start':
        if (!is_looping) {
            interval_id = setInterval(loopStepper, 1000 / 60);
            is_looping = true;
        }
        break;
    case 'stop':
        if (is_looping) {
            clearInterval(interval_id);
            is_looping = false;
        }
        break;
    }
};