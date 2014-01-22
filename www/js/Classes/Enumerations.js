/**
 * Represent the direction of a Thing
 * @returns {DIRECTION}
 */
var DIRECTION = function(){};
DIRECTION.RIGHT = 0;
DIRECTION.UP = 1;
DIRECTION.DOWN = 2;
DIRECTION.LEFT = 3;

/**
 * Represent the action of a Thing
 * @returns {ACTION}
 */
var ACTION = function(){};
ACTION.WALK   = 0;
ACTION.ATTACK = 1;
ACTION.STAND  = 2;
ACTION.ACT    = 3;