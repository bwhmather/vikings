define("viking", [], function(){
'use strict';

var exports = {};


var Viking = exports.Viking = function(space, pos)
{
    // Physics stuff
    this.bodies = {};
    this.shapes = {};
    this.constraints = {};

    var body = this.bodies["body"] = new cp.Body(1, 1) //cp.momentForCircle(1, 1, 1, 0));
    body.setPos(pos);

    var body_shape = this.shapes["body"] = new cp.BoxShape(body, 4, 4);

    for (name in this.bodies) space.addBody(this.bodies[name]);
    for (name in this.shapes) space.addShape(this.shapes[name]);
    for (name in this.constraints) space.addConstraint(this.constraints[name]);

    // Non-Physics State
    this.controller = undefined;
    this.fuel = 100;
};

Viking.prototype.update = function(dt)
{
    if (this.controller) {
    }
}

return exports;
});
