/**
 * @classdesc
 * The Base class is the abstract class that all objects that exist in the game instance must inherit from.
 * 
 * Holds attributes that are common to all game objects such as the game instance it belongs to, its unique ID in that game instance and other-such meta-data you may use when accessing existing objects or creating your own.
 * 
 * Objects that do not inherit from the Base class cannot be added to any part of the game instance (the global store or as a child of a Stage).
 * 
 * @class Base
 * @memberof Whirl
 * @abstract
 * 
 * @example
 * class MyObject extends Whirl.Base {
 * 	constructor(game) {
 * 		super(game);
 * 	}
 * }
 */
class Base {
	/**
	 * The game instance this object belongs to.
	 * 
	 * @memberof Whirl.Base#
	 * @type {Whirl.Game}
	 * @readonly
	 */
	_game;

	/**
	 * The unique ID assigned to this object that distinguishes it from all other items in the global store.
	 * 
	 * @memberof Whirl.Base#
	 * @type {number}
	 * @readonly
	 * 
	 * @see Whirl.Game.ObjectManager
	 */
	_id;

	/**
	 * Flag to indicate whether this object, though existing in the game instance, should actively participate in updates and rendering.
	 * 
	 * @memberof Whirl.Base#
	 * @type {boolean}
	 * @default true
	 */
	active = true;

	/**
	 * Object to store arbitrary data related to this object.
	 * 
	 * You can use this object to store any custom data about the object as you see fit whilst being assured to not experience any namespace conflicts and will be persisted when the object is saved or moved.
	 * 
	 * Values in this object *may* be updated by internal systems occasionally but these inserted keys are typically prefixed with an '`_`' so as to not conflict with any key you put in yourself. For this reason, you should never assign a new object to overwrite this object (`obj.data = {...}`), only set individual properties.
	 * 
	 * @memberof Whirl.Base#
	 * @type {object}
	 * 
	 * @example
	 * MyPlayer.data.health = 100;
	 * MyPlayer.data.speed = 5;
	 * 
	 * @example
	 * MyPlayer.data = {
	 * 	...MyPlayer.data,
	 * 
	 * 	health: 100,
	 * 	speed: 5
	 * };
	 */
	data = {};

	constructor(game) {
		if (!(game instanceof Whirl.Game._class)) {
			throw new Error("Whirl | Game objects must be instantiated into an instance of a Game.");
		}

		this._game = game;

		game.object.add(this);
	}

	/**
	 * Method to be overridden that is called internally by the [update manager](@link Whirl.Game.UpdateManager).
	 * 
	 * Use this method to execute logic that you want executed each time a game update tick occurs.
	 * 
	 * @ignore
	 * @abstract
	 * @method Whirl.Base#_update
	 * 
	 * @example
	 * class MyObject extends Whirl.Base {
	 * 	health = 5;
	 * 
	 * 	...
	 * 
	 * 	_update() {
	 * 		this.health += 5;
	 * 	}
	 * }
	 */
	_update() {}

	/**
	 * Method to be overriden that is called internally by the render manager.
	 * 
	 * Use this method to perform rendering-related logic that you want executed each a game render tick occurs.
	 * 
	 * @ignore
	 * @abstract
	 * @method Whirl.Base#_render
	 */
	_render() {}
}

module.exports = Base;
