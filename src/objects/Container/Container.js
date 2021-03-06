import Entity from "~/objects/Entity";
import {apply as mixin} from "~/mixins/Mixin";
import Child from "~/mixins/ChildMixin";
import Point from "~/geometry/Point";
import getValue from "~/lib/getValue";

/**
 * @classdesc
 * Containers are entities that contain other entities. They allow for multiple entities to be grouped tgoether and have effects and offsets applied to them all at once.
 *
 * Containers can contain other containers, creating a tree that each apply their own effects to the lower levels.
 *
 * @class Container
 * @memberof Whirl
 * @extends Whirl.Entity
 * @mixes Whirl.mixins.Child
 *
 * @param {Whirl.Game} game Game instance this container belongs to and should be managed by.
 * @param {object} [options] Optional presets when initialising this object.
 * @param {Entity[]} [children] Array of children to initialise into this container.
 *
 * @example
 * game.Container({}, [child1, child2]);
 * // or
 * Whirl.Container(game, {}, [child1, child2]);
 */
class Container extends Entity {
	mixins = [Child];

	/**
	 * Position of this container.
	 *
	 * When an object is added as a child of a container its position is made relative to the container position, instead of the base game world position.
	 *
	 * @memberof Whirl.Container#
	 * @type {Whirl.geometry.Point}
	 * @default (0, 0)
	 */
	position;

	constructor(game, options = {}, children = []) {
		super(game, options);

		mixin(this);

		this.position = Point(getValue(options, "x", 0), getValue(options, "y", 0));

		this.child.onAdd = (object) => {
			if (object instanceof Entity) {
				if (object.parent) {
					object.parent.child.remove(object);
				}

				object.parent = this;
			} else {
				this.game.debug.warn(
					`Objects added to a Container must inherit from the Entity class. Rejecting attempt to add object as child.`,
					`Whirl.Container`
				);

				return false;
			}
		};

		this.child.add(children);
	}

	calculateDerived() {
		this.derived.x = this.position.x;
		this.derived.y = this.position.y;
		this.derived.alpha = this.alpha;
		this.derived.scale = this.scale;

		if (this.parent instanceof Entity) {
			this.derived.x += this.parent.derived.x;
			this.derived.y += this.parent.derived.y;
			this.derived.alpha *= this.parent.derived.alpha;
			this.derived.scale *= this.parent.derived.scale;
		}

		return this;
	}
}

export default Container;
