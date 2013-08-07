define("util/camera", [], function(){
'use strict';

var exports = {};

var CameraPointTracker = exports["CameraPointTracker"] = function(camera, position_matrix, get_point)
{
    this._camera = camera;
    this._get_point = get_point;
    this._position_matrix = position_matrix;

    this.update();
}

CameraPointTracker.prototype.update = function(dt)
{
    var point = this._get_point();
    point = new THREE.Vector3(point.x, point.y, point.z || 0)
    this._camera.lookAt(point);

    point.applyMatrix4(this._position_matrix);
    this._camera.position = point;
}


return exports;

});
