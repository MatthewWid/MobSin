import Manager from "../Manager";
import getValue from "~/lib/getValue";

/**
 * @classdesc
 * Handles global game configuration and allows the storage and modification of arbitrary data.
 *
 * At its core, it is a simply a map of key-value pairs that stores data used to configure the behaviour of the various systems in the engine. You can also store your own additional data for your customisation needs.
 *
 * Never set properties of the ConfigManager directly. Instead, use the provided `set` and `get` methods.
 *
 * @class ConfigManager
 * @memberof Whirl.Game
 *
 * @example
 * const game = Whirl.createGame();
 *
 * game.config.get(); // {...}
 *
 * game.config.set("property", "value");
 *
 * game.config.get(); // {..., property: "value"}
 *
 * game.config.get("property"); // "value"
 */
class ConfigManager extends Manager {
	/**
	 * Toggles debug mode on and off. Debug mode enables warnings, performance tips, verbose logging, etc.
	 *
	 * @name debug
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {boolean}
	 * @default false
	 */

	/**
	 * Selector for the default canvas to render to. Viewports can be assigned different canvasses, but if not specified then they will default to the canvas specified here.
	 *
	 * @name canvas
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {string}
	 * @default null
	 */

	/**
	 * Selector for the root element that all game canvasses created by the {@link Whirl.Game.SetupManager|SetupManager} should be inserted in.
	 *
	 * It is recommended that the root game element be empty. Only being occupied by HTML elements created by the engine itself.
	 *
	 * Defaults to the document body element (`document.body`).
	 *
	 * @name root
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {string}
	 * @default "body"
	 */

	/**
	 * Run the {@link Whirl.Game.SetupManager|SetupManager} to create a default root element, canvas element and any other necessary game objects such as a {@link Whirl.Stage|Stage} and {@link Whirl.Viewport|Viewport} and start the game.
	 *
	 * Set this value to `false` if you would like to manually set up and configure the initial configuration and create the needed objects in your game.
	 *
	 * @name setup
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {boolean}
	 * @default true
	 */

	/**
	 * Set the system to use for rendering objects onto a canvas - uses 2D Canvas rendering by default.
	 *
	 * The game renderer may only be set during game initialisation and should never be changed following the setup process's completion.
	 *
	 * Whirl ships with a 2D Canvas renderer or a WebGL renderer, but you can provide your own custom renderer that wraps your own custom rendering logic or other third-party libraries such as PixiJS, Paper.js, p5, etc.
	 *
	 * @name renderer
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {Whirl.render.Renderer}
	 * @default {@link Whirl.render.Canvas}
	 */

	/**
	 * Automatically attach mouse event listeners to canvasses.
	 *
	 * @name input mouse
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {boolean}
	 * @default true
	 */

	/**
	 * Automatically attach keyboard event listeners to the document.
	 *
	 * @name input keyboard
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {boolean}
	 * @default true
	 */

	/**
	 * Prevent the default browser behaviour on mouse and keyboard input events.
	 *
	 * @name input preventDefault
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {boolean}
	 * @default true
	 */

	/**
	 * Default width of all newly created {@link Whirl.Stage|Stages} and {@link Whirl.Viewport|Viewports}.
	 *
	 * @name w
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {number}
	 * @default 640
	 */

	/**
	 * Default height of all newly created {@link Whirl.Stage|Stages} and {@link Whirl.Viewport|Viewports}.
	 *
	 * @name h
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {number}
	 * @default 480
	 */

	/**
	 * The object that actually stores the configuration data internally. You should **never access or modify this object directly**. Instead, make use of the `set` and `get` methods on the configuration manager.
	 *
	 * This object comes with certain preset values that the game uses internally, but you can also add your own additional values if need be.
	 *
	 * @ignore
	 * @memberof Whirl.Game.ConfigManager#
	 * @type {object}
	 * @readonly
	 */
	_data = {
		...ConfigManager.defaultConfig,
	};

	static defaultConfig = {
		debug: false,
		canvas: null,
		root: "body",
		setup: true,
		renderer: null,
		"input mouse": true,
		"input keyboard": true,
		"input preventDefault": true,
		w: 640,
		h: 480,
	};

	/**
	 * Fires after one or many values in the configuration are updated.
	 *
	 * @event Whirl.Game#didSet
	 * @type {object}
	 *
	 * @property {object} config Object of all values in the configuration, including the newly updated values.
	 * @property {string|object} type If the value was set using a single key/value pair, will be `key-value`.
	 *
	 * If many values were set using an object, will be `object`.
	 * @property {string|undefined} key If the value was set using a single key/value pair, will be the key. Else will not exist.
	 * @property {object|any} value The new value. Will either be the value of the single provided key/value pair, or the object given if setting multiple values at once.
	 *
	 * @see Whirl.Game.ConfigManager#set
	 */

	/**
	 * Set or add one or many key/value pairs.
	 *
	 * While you can assign any value to a key, keep in mind that value updates are made shallowly - if you provide an object or array it will not be deepmerged, but replaced when you set it.
	 *
	 * @method Whirl.Game.ConfigManager#set
	 *
	 * @emits Whirl.Game.ConfigManager#didSet
	 *
	 * @param {string|object} key Key that identifies a value in the config map. If the key already exists then the value is overwriten, otherwise a new key/value pair is made.
	 *
	 * If an object is given, will instead merge the object values with the config map object.
	 * @param {any} [value] The value related to the key in the config map.
	 * Optional if the first argument is an object.
	 * @returns {any|object} If given a key/value pair, returns the given value. If given an object, the object is returned.
	 *
	 * @example
	 * game.config.set("debug", true);
	 * game.config.set("canvas", "#myCanvas");
	 * game.config.set("input keyboard", true);
	 *
	 * @example
	 * game.config.set({
	 * 	"debug": true,
	 * 	"canvas": "#myCanvas",
	 * 	"input keyboard": true
	 * });
	 */
	set(key, value) {
		if (typeof key === "string") {
			this._data[key] = value;

			this.game.event.emit("didSet", {
				config: {...this._data},
				type: "key-value",
				key,
				value,
			});

			return value;
		} else if (typeof key === "object") {
			this._data = {
				...this._data,
				...key,
			};

			this.game.event.emit("didSet", {
				config: {...this._data},
				type: "object",
				value: {...key},
			});

			return key;
		}
	}

	/**
	 * Retrieve one or all values.
	 *
	 * Optionally, return a default value if the specified key is not found.
	 *
	 * @method Whirl.Game.ConfigManager#get
	 *
	 * @param {string} [key] Key of the key/value pair to retrieve the value from.
	 * @param {any} [default=null] Default value to return if no key is found.
	 * @returns {any|null|object} The value related to the key. If the key is not given, returns the entire configuration map object.
	 *
	 * @example
	 * game.config.get(); // {...}
	 *
	 * @example
	 * game.config.get("debug"); // false
	 *
	 * @example
	 * game.config.get("nonexistentkey", "my string"); // "my string"
	 */
	get(key, defaultValue) {
		if (!key) {
			return {...this._data};
		}

		return getValue(this._data, key, defaultValue);
	}

	/**
	 * Remove a value from the configuration map by setting it to `null`.
	 *
	 * This is generally safer than {@link Whirl.Game.ConfigManager#delete|the delete method} as the key will still exist in the map, but will simply have an empty value.
	 *
	 * @method Whirl.Game.ConfigManager#remove
	 *
	 * @param {string} key Key of the key/value pair to remove.
	 * @returns {any|null} The value that was removed.
	 *
	 * Returns `null` if the key did not exist in the configuration map.
	 */
	remove(key) {
		if (!Object.prototype.hasOwnProperty.call(this._data, key)) {
			return null;
		}

		const value = this._data[key];

		this._data[key] = null;

		return value;
	}

	/**
	 * Delete a value from the configuration map. This will delete the key/value pair outright from the object.
	 *
	 * You should only use this method to delete key/value pairs *you* have introduced into the configuration map. Deleting pre-existing key/value pairs from the engine may cause unexpected errors.
	 *
	 * @method Whirl.Game.ConfigManager#delete
	 *
	 * @param {string} key Key of the key/value pair to remove.
	 * @returns {any|null} The value that was removed.
	 *
	 * Returns `null` if the key did not exist in the configuration map.
	 */
	delete(key) {
		if (!Object.prototype.hasOwnProperty.call(this._data, key)) {
			return null;
		}

		const value = this._data[key];

		delete this._data[key];

		return value;
	}

	/**
	 * Retrieve all keys present in the configuration map.
	 *
	 * @method Whirl.Game.ConfigManager#keys
	 *
	 * @return {string[]}
	 *
	 * @example
	 * game.config.keys(); // ["debug", "input mouse", "input keyboard", ...]
	 */
	keys() {
		return Object.keys(this._data);
	}
}

export default ConfigManager;
