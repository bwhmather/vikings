define("viking", [], function(){
'use strict';

var exports = {};

var Weapon = exports.Weapon = function(space, viking)
{
    this._space = space;
    this._viking = viking;

    var viking_body = this._viking.body;
    var pos = viking_body.getPos(); // TODO TODO

    this.body = new cp.Body(0.1, 0.1);
    this.body.setPos(cp.v(pos.x, pos.y));
    this._space.addBody(this.body);

    this.pin_constraint = new cp.GrooveJoint(viking_body, this.body,
                                             cp.v(-0.2, 0), cp.v(1.5, 0),
                                             cp.v(0,0));

    this.pointer_constraint = new cp.RotaryLimitJoint(
            viking_body, this.body, -0.05, 0.05);

    this.spring_constraint = new cp.DampedSpring(viking_body, this.body,
                                                 cp.v(-0.3,0), cp.v(0,0),
                                                 0, 4, 0.1);

    this._space.addConstraint(this.pin_constraint);
    this._space.addConstraint(this.pointer_constraint);
    this._space.addConstraint(this.spring_constraint);

    this.shape = new cp.PolyShape(this.body, [
            0, -1.3,
            2.5, -1.3,
            2.5, -1.4,
            0, -1.4
            ], cp.v(0,0));
    this.shape.friction = 1;
    this._space.addShape(this.shape);
};

Weapon.prototype.update = function(dt)
{
    this.spring_constraint.restLength = this._viking.isAttacking() ? 2 : 0;
};


var Shield = exports.Shield = function(space, viking)
{
    this._space = space;
    this._viking = viking;

    var viking_body = this._viking.body;
    var pos = viking_body.getPos(); // TODO TODO

    this.body = new cp.Body(0.1, 0.1);
    this.body.setPos(cp.v(pos.x, pos.y));
    this._space.addBody(this.body);

    this.pin_constraint = new cp.PivotJoint(viking_body, this.body,
                                            cp.v(0,0), cp.v(0,0));

    this.spring_constraint = new cp.DampedRotarySpring(
            viking_body, this.body, -0.4, 3, 0.1);

    this.limit_constraint = new cp.RotaryLimitJoint(
            viking_body, this.body, 0.3, 1.5);

    this._space.addConstraint(this.pin_constraint);
    this._space.addConstraint(this.spring_constraint);
    this._space.addConstraint(this.limit_constraint);

    this.shape = new cp.PolyShape(this.body, [
            1.1225, 1.1225,
            1.37478, 0.793727,
            1.53337, 0.410863,
            1.58746, 0,
            1.53337, -0.410865,
            1.37478, -0.793729,
            1.1225, -1.1225
        ], cp.v(0,0));
    this.shape.friction = 1;

    this._space.addShape(this.shape);
};

Shield.prototype.update = function(dt)
{
    this.spring_constraint.restAngle = this._viking.isAttacking() ? -1.4 : -0.4;
}


var Viking = exports.Viking = function(space, spec, pos)
{
    // Physics stuff
    this._space = space;

    // TODO
    this._moving = false;
    this._heading = -Math.PI/2;

    this._attacking = false;
    this.dead = false;

    this.body = new cp.Body(1, 0.4);
    this.body.setPos(cp.v(pos.x, pos.y));
    this._space.addBody(this.body);

    this.shape = new cp.CircleShape(this.body, 1, cp.v(0,0));
    this.shape.friction = 1;
    this._space.addShape(this.shape);

    // TODO factories
    this.weapon = new Weapon(this._space, this);
    this.shield = new Shield(this._space, this);
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
    var body = this.body;

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

    this.weapon.update(dt);
    this.shield.update(dt)
};

Viking.prototype.destroy = function()
{
};


return exports;
});
