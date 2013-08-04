define("view/viking", ["util/view"], function(util_view){
"use strict"

var exports = {};

var View = util_view.View,
    BodyView = util_view.BodyView;

var VikingView = exports.VikingView = function(scene, viking)
{
    View.prototype.constructor.call(this, scene);

    this.views = {};

    var loader = new THREE.JSONLoader();

    loader.load('data/body.js?bust='+(new Date()).getTime(), function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.views["body"] = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));

    loader.load('data/beard.js?bust='+(new Date()).getTime(), function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.views["beard"] = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));

    loader.load('data/hatchet.js?bust='+(new Date()).getTime(), function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.views["hatchet"] = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));

    loader.load('data/helmet.js?bust='+(new Date()).getTime(), function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.views["helmet"] = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));

    loader.load('data/shield.js?bust='+(new Date()).getTime(), function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        this.views["shield"] = new BodyView(scene, viking.bodies["body"], mesh);
    }.bind(this));
}

VikingView.prototype = Object.create(View.prototype);

VikingView.prototype.update = function()
{
    var view;
    for (view in this.views) {
        this.views[view].update();
    }
}


return exports;
});
