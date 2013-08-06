define("viking/keyboard", [], function(){
'use strict';

var exports = {};


var KeyboardController = exports.KeyboardController = function(viking, tracker)
{
    this._viking = viking;
    this._tracker = tracker;
};

KeyboardController.prototype.update = function(dt)
{
    var forwards = cp.v(0, 0);
    if (this._tracker.pressed("W")) forwards.add(cp.v(0, 1));
    if (this._tracker.pressed("A")) forwards.add(cp.v(-1, 0));
    if (this._tracker.pressed("S")) forwards.add(cp.v(0, -1));
    if (this._tracker.pressed("D")) forwards.add(cp.v(1, 0));

    if (cp.v.len(forwards)) {
        this._viking.setMoving(true);
        this._viking.setDesiredHeading(cp.v.toangle(forwards));
    } else {
        this._viking.setMoving(false);
    }
};

return exports;
});
