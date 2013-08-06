require.config({
    baseUrl: "/src",
});


deps = ["util/viewport", "util/keyboard", "util/view", "control/keyboard",
        "viking", "view/viking"]
require(deps, function() {
'use strict';

var imports = {};
for (var i=0; i<deps.length; i++) {
    imports[deps[i]] = arguments[i];
}

var Viking = imports["viking"].Viking,
    VikingView = imports["view/viking"].VikingView,
    KeyboardTracker = imports["util/keyboard"].KeyboardTracker,
    KeyboardController = imports["control/keyboard"].KeyboardController;


var main = function()
{
    console.log("running");
    var space = new cp.Space();
    var scene = new THREE.Scene();

    var viewManager = new imports["util/view"].ViewManager(scene);

    //space.iterations = 30;
    space.gravity = cp.v(0, 0);
    space.damping = 0.1;
    space.sleepTimeThreshold = 0.5;
    space.collisionSlop = 0.5;

    var viking = new Viking(space, cp.v(0,0));
    var vikingView = new VikingView(scene, viking);
    viewManager.addView(vikingView);

    var vikingController = new KeyboardController(viking, new KeyboardTracker());

	scene.add( new THREE.AmbientLight(0x000000));

    var sun = new THREE.PointLight( 0xaaaa99, 2, 1000 );
    sun.position.x = 100;
    sun.position.y = 200;
    sun.position.z = 300;
    scene.add(sun);

    var camera = new THREE.PerspectiveCamera(40, window.innerWidth /
                                                 window.innerHeight, 0.1, 1000);
    scene.add(camera);

    camera.position.x = 0;
    camera.position.y = -10;
    camera.position.z = 10;

//    camera.rotation.x = Math.PI;
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    var renderer = new THREE.WebGLRenderer({"antialias": true});

    document.body.appendChild( renderer.domElement );

    var resizer = new imports["util/viewport"].ViewportResizer(camera, renderer);


    var update = function() {
        vikingController.update(1/60);
        viking.update(1/60);
        space.step(1/60);
        viewManager.update();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    };
    update();
}

main();
});

