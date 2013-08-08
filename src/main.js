require.config({
    baseUrl: "/src",
});


deps = ["util/viewport", "util/keyboard", "util/view", "util/camera",
        "viking/keyboard", "viking", "viking/view"];
require(deps, function() {
'use strict';

var imports = {};
for (var i=0; i<deps.length; i++) {
    imports[deps[i]] = arguments[i];
}

var Viking = imports["viking"].Viking,
    VikingView = imports["viking/view"].VikingView,
    KeyboardTracker = imports["util/keyboard"].KeyboardTracker,
    KeyboardController = imports["viking/keyboard"].KeyboardController,
    CameraPointTracker = imports["util/camera"].CameraPointTracker;


var viking_info = {
    1: {
        "name": "Olaf",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    2: {
        "name": "Bjørn",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    3: {
        "name": "Børge",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    4: {
        "name": "Diðrik",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    5: {
        "name": "Dufþakur",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    6: {
        "name": "Eðvald",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    7: {
        "name": "Ege",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    8: {
        "name": "Erik",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    9: {
        "name": "Hågen",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    10: {
        "name": "Høder",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    11: {
        "name": "Iørgen",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    },
    12: {
        "name": "Jønis",
        "helmet": "helmet",
        "weapon": "hatchet",
        "shield": "kite-shield",
        "body": "body"
    }
};
var player_id = 2;


var main = function()
{
    var space = new cp.Space();
    var scene = new THREE.Scene();

    var viewManager = new imports["util/view"].ViewManager(scene);

    //space.iterations = 30;
    space.gravity = cp.v(0, 0);
    space.damping = 0.1;
    space.sleepTimeThreshold = 0.5;
    space.collisionSlop = 0.5;

    var vikings = {};
    var x = 0;
    var id;
    for (id in viking_info) {
        vikings[id] = new Viking(space, viking_info[id], cp.v(x, 0));
        x += 4;
    }

    var player = vikings[player_id];

    var playerController = new KeyboardController(player, new KeyboardTracker());

    for (id in vikings) {
        viewManager.addView(new VikingView(scene, vikings[id]));
    }

	scene.add( new THREE.AmbientLight(0x000000));

    var sun = new THREE.PointLight( 0xaaaa99, 2, 1000 );
    sun.position.x = 100;
    sun.position.y = -200;
    sun.position.z = 100;
    scene.add(sun);

    var ground_geometry = new THREE.PlaneGeometry(100, 100, 2, 2);

    var ground_texture = THREE.ImageUtils.loadTexture("grassdirt-small.png");
    ground_texture.wrapS = THREE.RepeatWrapping;
    ground_texture.wrapT = THREE.RepeatWrapping;
    ground_texture.repeat.set( 1, 1 );

    var ground_material = new THREE.MeshBasicMaterial({"map": ground_texture});

    var ground = new THREE.Mesh(ground_geometry, ground_material);
    scene.add(ground);

    var camera = new THREE.PerspectiveCamera(40, window.innerWidth /
                                                 window.innerHeight, 0.1, 1000);
    scene.add(camera);
    camera.up = new THREE.Vector3(0, 0, 1);

    var pos_mat = new THREE.Matrix4()
    pos_mat.compose(new THREE.Vector3(0,-30,20),
                    new THREE.Quaternion(1,0,0,0),
                    new THREE.Vector3(0.9, -0.5, 1));

    var cameraController = new CameraPointTracker(camera, pos_mat,
            (player.body.getPos).bind(player.body));

    var renderer = new THREE.WebGLRenderer({"antialias": true});

    document.body.appendChild( renderer.domElement );

    var resizer = new imports["util/viewport"].ViewportResizer(camera, renderer);


    var update = function() {
        playerController.update(1/60);
        for (id in vikings) {
            vikings[id].update(1/60);
        }
        cameraController.update(1/60);
        space.step(1/60);
        viewManager.update();
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    };
    update();
}

main();
});
