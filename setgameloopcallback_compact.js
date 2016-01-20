/*
    Copyright 2016 Jaycliff Arcilla of Eversun Software Philippines Corporation
    
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

/*jshint unused:true*/
/*global window*/

(function setGameLoopCallbackSetup(global, undef) {
    "use strict";
    var looper,
        // We'll be using two lists to avoid any conflicts when setting up new callbacks while the current list is being processed
        callbacks = [
            [],
            []
        ],
        id = 0,
        id_to_index_map = {},
        index_to_id_map = [
            [],
            []
        ],
        current_callbacks_list_index = 0,
        noop = function noop() { return; };
    if (typeof Object.freeze === "function") {
        Object.freeze(noop);
    }
    looper = (typeof Blob === "function" && typeof URL === "function" && typeof Worker === "function") ? new Worker(URL.createObjectURL(new Blob([
        [
            '"use strict";',
            'var interval_id, is_looping = false;',
            'function loopStepper() {',
            '    self.postMessage("loop step");',
            '}',
            'self.onmessage = function (event) {',
            '    var data = event.data;',
            '    switch (data) {',
            '    case "start":',
            '        if (!is_looping) {',
            '            interval_id = setInterval(loopStepper, 1000 / 60);',
            '            is_looping = true;',
            '        }',
            '        break;',
            '    case "stop":',
            '        if (is_looping) {',
            '            clearInterval(interval_id);',
            '            is_looping = false;',
            '        }',
            '        break;',
            '    }',
            '};'
        ].join('\n')
    ], { type: "application/javascript" }))) : (function PunyWorkerSetup() {
        var instance = {}, interval_id, is_looping = false;
        function loopStepper() {
            if (typeof instance.onmessage === "function") {
                instance.onmessage();
            }
        }
        instance.postMessage = function postMessage(message) {
            switch (message) {
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
        return instance;
    }());
    looper.onmessage = function messageHandler() {
        var i,
            item,
            list_1 = callbacks[current_callbacks_list_index],
            list_2 = index_to_id_map[current_callbacks_list_index],
            length = list_1.length;
        current_callbacks_list_index = (current_callbacks_list_index === 1) ? 0 : 1;
        for (i = 0; i < length; i += 1) {
            delete id_to_index_map[list_2[i]];
            item = list_1[i];
            item();
        }
        list_1.length = 0;
        list_2.length = 0;
    };
    looper.postMessage('start');
    global.setGameLoopCallback = function setGameLoopCallback(callback) {
        var current_id;
        if (arguments.length > 0) {
            if (typeof callback === "function") {
                current_id = id;
                id_to_index_map[current_id] = (callbacks[current_callbacks_list_index].push(callback)) - 1;
                index_to_id_map[current_callbacks_list_index].push(current_id);
                id += 1;
                return current_id;
            }
            throw new TypeError('Failed to execute setGameLoopCallback: The callback provided as parameter 1 is not a function.');
        }
        throw new TypeError('Failed to execute setGameLoopCallback: 1 argument required, but only 0 present.');
    };
    global.cancelGameLoopCallback = function cancelGameLoopCallback(request_id) {
        if (request_id !== undef || typeof request_id === "number") {
            if (id_to_index_map.hasOwnProperty(request_id)) {
                callbacks[current_callbacks_list_index][id_to_index_map[request_id]] = noop;
            }
        }
    };
}(window));