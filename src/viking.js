define("viking", [], function(){
'use strict';

var exports = {};
var shape_group = 1;

var Viking = exports.Viking = function(space, spec, pos)
{
    // Physics stuff
    this._space = space;
    this.bodies = {};
    this.shapes = {};
    this.constraints = {};

    // TODO 
    this._moving = false;
    this._heading = 0;

    this.dead = false;


    var body = this.bodies["body"] = new cp.Body(1, 0.4); //cp.momentForCircle(1, 1, 1, 0));
    body.setPos(cp.v(pos.x, pos.y));

    this.shapes["body"] = new cp.CircleShape(body, 1, cp.v(0,0));
    this.shapes["body"].friction = 1;


    var shield = this.bodies["shield"] = new cp.Body(0.1, 0.1);
    shield.setPos(cp.v(pos.x, pos.y));

    this.constraints["shield_pin"] = new cp.PivotJoint(body, shield,
                                                       cp.v(0,0), cp.v(0,0));
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
            ], cp.v(0,0));
    this.shapes["shield"].friction = 1;


    var weapon = this.bodies["weapon"] = new cp.Body(0.1, 0.1);
    weapon.setPos(cp.v(pos.x, pos.y));

    this.constraints["weapon_pin"] = new cp.GrooveJoint(body, weapon,
                                                        cp.v(-0.2, 0), cp.v(1.5, 0),
                                                        cp.v(0,0));

    this.constraints["weapon_pointer"] = new cp.RotaryLimitJoint(body, weapon, -0.05, 0.05);
    this.constraints["weapon_spring"] = new cp.DampedSpring(body, weapon,
                                                            cp.v(-0.3,0), cp.v(0,0),
                                                            0, 2, 0.1);

    this.shapes["weapon"] = new cp.PolyShape(weapon, [
            0, -1.3,
            2.5, -1.3,
            2.5, -1.4,
            0, -1.4
            ], cp.v(0,0));
    this.shapes["weapon"].friction = 1;

    for (name in this.bodies) {
        this._space.addBody(this.bodies[name]);
    }

    for (name in this.shapes) {
        this.shapes[name].group = shape_group;
        this._space.addShape(this.shapes[name]);
    }
    shape_group++;

    for (name in this.constraints) {
        this._space.addConstraint(this.constraints[name]);
    }
};

Viking.prototype.setDesiredHeading = function(heading) {
    this._heading = heading;
};
Viking.prototype.getDesiredHeading = function() {
    return this._heading;
};

Viking.prototype.setMoving = function(moving) {
    this._moving = moving;
}

Viking.prototype.getHeading = function() {
    return this.bodies["body"].a % (2*Math.PI);
};


Viking.prototype.setAttacking = function() {
    this._attacking = true;
}
Viking.prototype.setDefending = function() {
    this._attacking = false;
}

Viking.prototype.isAttacking = function() {
    return this._attacking;
}

Viking.prototype.isDefending = function() {
    return this._defending;
}


Viking.prototype.setStateFromSnapshot = function(state)
{
    // for multiplayer
    // TODO
};

Viking.prototype.setStateFromDelta = function(state_change)
{
    // for multiplayer
    // TODO
};

Viking.prototype.update = function(dt)
{
    var body = this.bodies["body"];

    var forwards_advantage = 10;
    var base_strength = 15;

    if (this._moving) {
        body.activate();
        body.f = cp.v(
            base_strength*Math.cos(this._heading),
            base_strength*Math.sin(this._heading)
        );
    } else {
        body.f = cp.v(0,0);
    }

    var difference = (this._heading - body.a) % (2*Math.PI);
    difference = difference > Math.PI ? difference - 2*Math.PI :
                 difference < -Math.PI ? difference + 2*Math.PI :
                 difference;


    body.t = 4*difference - 0.2* body.w; // TODO proper controller


    this.constraints["shield_spring"].restAngle = this._attacking ? -1.4 : -0.4;
    this.constraints["weapon_spring"].restLength = this._attacking ? 2 : 0;
};

Viking.prototype.destroy = function()
{
    for (name in this.bodies) {
        this._space.removeBody(this.bodies[name]);
    }

    for (name in this.shapes) {
        this._space.removeShape(this.shapes[name]);
    }

    for (name in this.constraints) {
        this._space.removeConstraint(this.constraints[name]);
    }
};


return exports;
});
