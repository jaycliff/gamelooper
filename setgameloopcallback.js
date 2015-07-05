/*
    Copyright 2015 Jaycliff Arcilla of Eversun Software Philippines Corporation
    
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
/*global window, setTimeout*/
// window.performance.now() shim: https://gist.github.com/paulirish/5438650
if (typeof window.performance !== "object") {
    // prepare the base performance object
    window.performance = {};
}
if (typeof window.performance.now !== "function") {
    (function (performance) {
        "use strict";
        var nowOffset;
        // thanks IE8
        if (typeof Date.now !== "function") {
            Date.now = function () {
                return new Date().getTime();
            };
        }
        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart;
        } else {
            nowOffset = Date.now();
        }
        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }(window.performance));
}
(function setGameLoopCallbackSetup(global) {
    "use strict";
    var last_time = 0,
        // We'll be using two lists to avoid any conflicts when setting up new callbacks while the current list is being processed
        callbacks = [
            [],
            []
        ],
        current_index = 0,
        noop = function noop() { return; },
        set = false;
    function callbackCaller() {
        var i, list = callbacks[current_index], length = list.length;
        current_index = (current_index === 1) ? 0 : 1;
        set = false;
        for (i = 0; i < length; i += 1) {
            list[i]();
        }
        list.length = 0;
    }
    global.setGameLoopCallback = function setGameLoopCallback(callback) {
        var current_time, time_to_call;
        if (typeof callback !== "function") {
            throw new TypeError('callback must be a function.');
        }
        if (!set) {
            current_time = global.performance.now();
            time_to_call = Math.max(0, 16 - (current_time - last_time));
            last_time = current_time + time_to_call;
            setTimeout(callbackCaller, time_to_call);
            set = true;
        }
        return (callbacks[current_index].push(callback)) - 1;
    };
    global.cancelGameLoopCallback = function cancelGameLoopCallback(id) {
        var list = callbacks[current_index];
        // ToInteger: http://www.ecma-international.org/ecma-262/5.1/#sec-9.4
        id = Number(id);
        id = (id !== id) ? 0 : (id === 0 || id === Infinity || id === -Infinity) ? id : (id > 0) ? Math.floor(id) : Math.ceil(id);
        if (id < 0 || id > list.length - 1) {
            throw new TypeError('Invalid id.');
        }
        list[id] = noop;
    };
}(window));
