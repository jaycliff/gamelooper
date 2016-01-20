setGameLoopCallback 2.0
==========

Set a callback to be run inside the gamelooper (clocked at an average of 60 steps per second and kind of works like requestAnimationFrame)

NOTE: This library utilizes a web worker for precise looping. The compact version is using an inlined worker, saving you the hassle of setting the path/url of the separate worker file.