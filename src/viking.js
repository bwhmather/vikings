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

    this.moving = false;
    this.direction = 0;
};

Viking.prototype.update = function(dt)
{
    var body = this.bodies["body"];

    var forwards_advantage = 10;
    var base_strength = 15;

    if (this.moving) {
        body.activate();
        body.f = cp.v(
            base_strength*Math.cos(this.direction),
            base_strength*Math.sin(this.direction)
        );
    } else {
        body.f = cp.v(0,0);
    }

    body.t = 2*(this.direction - body.a) - 0.1* body.w; // TODO proper controller
}

return exports;
});
