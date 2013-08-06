define("util/camera", [], function(){
'use strict';

var exports = {};

var BodyTracker = exports["BodyTracker"] = function(camera, body)
{
    this._body = body;
    this._camera = camera;

    this.update(0);
}

BodyTracker.prototype.update = function(dt)
{
    this._camera.lookAt(new THREE.Vector3(this._body.getPos().x, this._body.getPos().y, 0));
}


return exports;

});
