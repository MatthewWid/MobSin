import Manager from "../Manager";
import Base from "~/objects/Base";
import Viewport from "~/objects/Viewport";
import Stage from "~/objects/Stage";

/**
 * @classdesc
 * The object manager handles the storage and meta-data related to all objects that exist in the game instance such as all objects' uniquely given `_id` property.
 *
 * For the vast majority of use cases you will never need to interact with the ObjectManager directly, but for more advanced uses such as plugin development and debugging you may need to modify certain details about how the game stores objects and how object receive data from the game instance.
 *
 * @class ObjectManager
 * @memberof Whirl.Game
 */
class ObjectManager extends Manager {
	/**
	 * Incrementing index used to generate unique object IDs.
	 *
	 * @ignore
	 * @memberof Whirl.Game.ObjectManager#
	 * @type {number}
	 * @readonly
	 */
	_index = 0;

	/**
	 * Array of all objects that currently exist in the game instance including viewports and stages.
	 *
	 * @memberof Whirl.Game.ObjectManager#
	 * @type {object[]}
	 * @readonly
	 */
	_store = [];

	/**
	 * Array of all viewports that currently exist in the game instance.
	 *
	 * @memberof Whirl.Game.ObjectManager#
	 * @type {object[]}
	 * @readonly
	 */
	_viewports = [];

	/**
	 * Array of all stages that currently exist in the game instance.
	 *
	 * @memberof Whirl.Game.ObjectManager#
	 * @type {object[]}
	 * @readonly
	 */
	_stages = [];

	/**
	 * Fires when an object has been marked for destruction and after it has been removed from the global store (but not necessarily any other objects such as from a {@link Whirl.Stage|Stage's child list}).
	 *
	 * @event Whirl.Game#didDestroy
	 * @type {object}
	 *
	 * @property {object} object The object to be destroyed.
	 */

	constructor(game) {
		super(game);
	}

	/**
	 * Add an object to the object manager list. This will make the engine aware of this objects existence, but will not have any noticable effect.
	 *
	 * Will abort and log a warning if the object does not extend from the `Base` class or already exists in the object store.
	 *
	 * If the object is an instance of a `Stage` or `Viewport` it will additionally be put into the `_stages` or `_viewports` store, respectively.
	 *
	 * @method Whirl.Game.ObjectManager#add
	 *
	 * @param {Base} object Object to be added to the object manager.
	 */
	add(object) {
		if (!(object instanceof Base)) {
			return this.game.debug.warn(
				"Objects under a game instance must inherit from the Base object class.",
				"Whirl.Game#ObjectManager"
			);
		}
		if (this._store.includes(object)) {
			return this.game.debug.warn(
				"Object already exists in the global store. Rejecting attempt to add.",
				"Whirl.Game#ObjectManager"
			);
		}

		object._id = this._index++;
		this._store.push(object);

		if (object instanceof Viewport) {
			this._viewports.push(object);
		}
		if (object instanceof Stage) {
			this._stages.push(object);
		}
	}

	/**
	 * Filter objects during the process of retrieving the list of objects in the global store. Each time the function is called an indivdual item is passed to it.
	 *
	 * @callback Whirl.Game.ObjectManager~getFilter
	 * @param {object} object Individual object to check if it should be included.
	 * @return {boolean} `true` implies the object should be included, `false` will remove it from the list of returned objects.
	 */

	/**
	 * Get all objects in the global object store, optionally filtering the result.
	 *
	 * @method Whirl.Game.ObjectManager#get
	 *
	 * @param {getFilter} [filter] Runs on each object and determines if the given object should remain in the returned list.
	 * @returns {object[]} Array representing the (optionally filtered) items in the store.
	 */
	get(filter) {
		if (filter) {
			return [...this._store.filter(filter)];
		}

		return [...this._store];
	}

	/**
	 * Destroy a given object and all references to it from the game instance.
	 *
	 * @ignore
	 * @method Whirl.Game.ObjectManager#destroy
	 *
	 * @emits Whirl.Game#didDestroy
	 *
	 * @param {any} object Object to destroy.
	 * @returns {any} The object that was destroyed.
	 */
	_destroy(object) {
		this._store = this._store.filter((item) => object._id !== item._id);

		if (object instanceof Viewport) {
			this._viewports = this._viewports.filter((item) => object._id !== item._id);

			if (this.game.setup.viewport === object) {
				this.game.setup.viewport = null;
			}
		}

		if (object instanceof Stage) {
			this._stages = this._stages.filter((item) => object._id !== item._id);

			this._viewports.forEach((viewport) => {
				if (viewport.stage === object) {
					viewport.setStage(null);
				}
			});

			if (this.game.setup.stage === object) {
				this.game.setup.stage = null;
			}
		}
		this.game.event.emit("didDestroy", {
			object,
		});

		return object;
	}
}

export default ObjectManager;
