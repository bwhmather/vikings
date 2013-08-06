define("viking", [], function(){
'use strict';

var exports = {};


var Viking = exports.Viking = function(space, pos)
{
    // Physics stuff
    this.bodies = {};
    this.shapes = {};
    this.constraints = {};

    var body = this.bodies["body"] = new cp.Body(1, 1); //cp.momentForCircle(1, 1, 1, 0));
    body.setPos(pos);

    var body_shape = this.shapes["body"] = new cp.CircleShape(body, 1, cp.v(0,0));


    var shield = this.bodies["shield"] = new cp.Body(0.1, 0.1);
    shield.setPos(pos);

    this.constraints["shield_pin"] = new cp.PivotJoint(body, shield, pos);
    this.constraints["shield_spring"] = new cp.DampedRotarySpring(body, shield, -0.4, 3, 0.1);
    this.constraints["shield_limit"] = new cp.RotaryLimitJoint(body, shield, 0.3, 1.5);

    this.shapes["shield"] = new cp.PolyShape(shield, [
            1.1225, 1.1225,
            1.37478, 0.793727,
            1.53337, 0.410863,
            1.58746, 0,
            1.53337, -0.410865,
            1.37478, -0.793729,
            1.1225, -1.1225
            ], cp.v(0,0))

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

    var difference = (this.direction - body.a) % (2*Math.PI);
    difference = difference > Math.PI ? difference - 2*Math.PI :
                 difference < -Math.PI ? difference + 2*Math.PI :
                 difference;


    body.t = 4*difference - 0.2* body.w; // TODO proper controller
}

return exports;
});
