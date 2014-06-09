/*
    Copyright 2013 Jaycliff Arcilla
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        
        http://www.apache.org/licenses/LICENSE-2.0
        
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

(function (global) {
    "use strict";
    // Start performance.now shim
    var last_time = 0,
        callbacks = [],
        noop = function noop() { return; },
        set = false;
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
    function callbackCaller() {
        var i, length = callbacks.length;
        for (i = 0; i < length; i += 1) {
            callbacks[i]();
        }
        callbacks.length = 0;
        set = false;
    }
    global.setGameLoop = function setGameLoop(callback) {
        var current_time, time_to_call;
        if (!set) {
            current_time = global.performance.now();
            time_to_call = Math.max(0, 16 - (current_time - last_time));
            last_time = current_time + time_to_call;
            setTimeout(callbackCaller, time_to_call);
            set = true;
        }
        return callbacks.push(callback);
    };
    global.clearGameLoop = function clearGameLoop(id) {
        if (id > callbacks.length - 1) {
            return;
        }
        callbacks[id] = noop;
    };
}(window));
