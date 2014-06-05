(function (global) {
    "use strict";
    // Start performance.now shim
    var last_time = 0;
    if (!global.performance) {
        global.performance = {};
    }
    if (!global.performance.now) {
        global.performance.now = global.performance.mozNow ||
            global.performance.msNow ||
            global.performance.oNow ||
            global.performance.webkitNow ||
            function now() { return Date.now(); };
    }
    // End performance.now shim
    global.setGameLoop = function setGameLoop(callback) {
        var current_time = global.performance.now(), time_to_call = Math.max(0, 16 - (current_time - last_time));
        last_time = current_time + time_to_call;
        return setTimeout(callbackHel, time_to_call);
    };
    global.clearGameLoop = function clearGameLoop(id) {
        clearTimeout(id);
    };
}(window));
