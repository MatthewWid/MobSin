import {
	ConfigManager,
	ObjectManager,
	UpdateManager,
	RenderManager,
	SetupManager,
	DebugManager,
	InputManager,
} from "./managers";
import Colour from "~/objects/Colour";
import Container from "~/objects/Container";
import Gradient from "~/objects/Gradient";
import Sprite from "~/objects/Sprite";
import Stage from "~/objects/Stage";
import Viewport from "~/objects/Viewport";
import {apply as mixin} from "~/mixins/Mixin";
import Event from "~/mixins/EventMixin";

/**
 * @classdesc
 * Represents an instance of a Whirl game.
 *
 * The game object is the actual running game and is the workforce of the engine that handles all updates, rendering and object management. It contains various managers for game updates, rendering, mouse and keyboard input, object storage and manipulation, asset handling, physics and more.
 *
 * The game can be configured during its initialisation and will perform certain setup operations for you if you configure it do so (Eg, set or create a canvas, set physics and rendering, set scaling modes, etc.).
 *
 * The game object should be constructed using the `Whirl.Game` factory method, but the underlying class can be accessed with the `Whirl.Game.class` property.
 *
 * @class Game
 * @memberof Whirl
 * @mixes Whirl.mixins.Event
 *
 * @param {object} [options] Options passed during setup. All properties on this object will be forwarded to the {@link Whirl.Game.ConfigManager|ConfigManager} and set as properties of the configuration map by implicitely calling {@link Whirl.Game.ConfigManager#set|the set method}.
 *
 * @example
 * const game = Whirl.createGame({
 * 	"canvas": "#myCanvas",
 * 	"debug": true,
 * });
 *
 * game.start();
 */
class Game {
	mixins = [Event];

	/**
	 * The configuration manager that handles initial and continuing configuration of the game and its managers.
	 *
	 * @name config
	 * @memberof Whirl.Game#
	 * @type {Whirl.Game.ConfigManager}
	 */

	/**
	 * The object manager that handles all existing objects in the game and the initialisation of those objects.
	 *
	 * @name object
	 * @memberof Whirl.Game#
	 * @type {Whirl.Game.ObjectManager}
	 */

	/**
	 * The update manager that handles the game update loop including object management, game scaling, physics and more.
	 *
	 * @name update
	 * @memberof Whirl.Game#
	 * @type {Whirl.Game.UpdateManager}
	 */

	/**
	 * The render manager that handles the render loop including canvas and WebGL abstraction, render batching, and all visuals invoked by the update loop.
	 */

	/**
	 * The debug manager that handles debugging features such as logging, warnings and errors.
	 *
	 * @name debug
	 * @memberof Whirl.Game#
	 * @type {Whirl.Game.DebugManager}
	 */

	/**
	 * The setup manager that handles initial game setup and canvas creation.
	 *
	 * @name setup
	 * @memberof Whirl.Game#
	 * @type {Whirl.Game.SetupManager}
	 */

	constructor(options = {}) {
		mixin(this);

		// Managers
		this.config = new ConfigManager(this);
		this.config.set(options);
		this.debug = new DebugManager(this);
		this.object = new ObjectManager(this);
		this.update = new UpdateManager(this);
		this.render = new RenderManager(this);
		this.input = new InputManager(this);
		this.setup = new SetupManager(this);
	}

	// Game Object Factories
	Colour = (...args) => new Colour(this, ...args);
	Container = (...args) => new Container(this, ...args);
	Gradient = (...args) => new Gradient(this, ...args);
	Sprite = (...args) => new Sprite(this, ...args);
	Stage = (...args) => new Stage(this, ...args);
	Viewport = (...args) => new Viewport(this, ...args);

	/**
	 * Starts the game loop.
	 *
	 * {@link Whirl.Game.SetupManager#setup|Initiates game setup} beforehand if {@link Whirl.Game.ConfigManager#setup|setup is enabled in the ConfigManager}.
	 *
	 * @method Whirl.Game#start
	 *
	 * @returns {this}
	 */
	start() {
		this.setup.setup();

		this.update.start();

		return this;
	}

	/**
	 * {@link Whirl.Game.UpdateManager#stop|Stops the game loop}.
	 *
	 * @method Whirl.Game#stop
	 *
	 * @returns {this}
	 */
	stop() {
		this.update.stop();

		return this;
	}
}

export default Game;
