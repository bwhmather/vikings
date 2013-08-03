define("view/viking", ["util/view"], function(util_view){
"use strict"

var exports = {};

var View = util_view.View,
    BodyView = util_view.BodyView;

var VikingView = exports.VikingView = function(scene, viking)
{
    View.prototype.constructor.call(this, scene);

    var loader = new THREE.JSONLoader();

    loader.load('data/body.js', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.fuselage = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));

    loader.load('data/beard.js', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        this.beard = new THREE.Mesh(geometry, material);
        scene.add(this.beard);
    }.bind(this));

    loader.load('data/hatchet.js', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        this.hatchet = new THREE.Mesh(geometry, material);
        scene.add(this.hatchet);
    }.bind(this));

    loader.load('data/helmet.js', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        this.helmet = new THREE.Mesh(geometry, material);
        scene.add(this.helmet);
    }.bind(this));

    loader.load('data/shield.js', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        this.shield = new THREE.Mesh(geometry, material);
        scene.add(this.shield);
    }.bind(this));
}

VikingView.prototype = Object.create(View.prototype);

VikingView.prototype.update = function()
{
}


return exports;
});
