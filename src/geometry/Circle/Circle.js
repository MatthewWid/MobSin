import Geometry from "~/geometry/Geometry";
import Point from "~/geometry/Point";
import getValue from "~/lib/getValue";

/**
 * @classdesc
 * Represents a circle defined by a center coordinate and a radius.
 *
 * Can be used for things such as physics with circular objects, radius bound checking, distance calculation, etc.
 *
 * Circles are constructed using the `Whirl.geometry.Circle` factory method, but the underlying class can be accessed with `Whirl.geometry.Circle.class`.
 *
 * @class Circle
 * @memberof Whirl.geometry
 * @extends Whirl.geometry.Geometry
 *
 * @param {number|Whirl.geometry.Point} [x=0] X-coordinate of the center-point. If giving an instance of a Point then the first argument should be the Point instance, and the second argument should be the radius, instead.
 * @param {number} [y=0] Y-coordinate of the center-point. If the first argument is a Point instance then this argument represents the radius, instead.
 * @param {number} [r=0] Radius of the circle.
 *
 * @example
 * Whirl.geometry.Circle(25, 25, 50); // Circle {x: 25, y: 25, r: 50}
 *
 * @example
 * Whirl.geometry.Circle(
 * 	Whirl.geometry.Point(25, 25),
 * 	50,
 * ); // Circle {x: 25, y: 25, r: 50}
 */
class Circle extends Geometry {
	/**
	 * X-coordinate of the center-point.
	 *
	 * @memberof Whirl.geometry.Circle#
	 * @type {number}
	 */
	x;

	/**
	 * Y-coordinate of the center-point.
	 *
	 * @memberof Whirl.geometry.Circle#
	 * @type {number}
	 */
	y;

	/**
	 * Radius of the circle.
	 *
	 * @memberof Whirl.geometry.Circle#
	 * @type {number}
	 */
	r;

	constructor(x, y, r) {
		super();

		if (x instanceof Point.class) {
			this.x = x.x;
			this.y = x.y;
			this.r = y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
			this.r = r || 0;
		}
	}

	set(properties = {}) {
		this.x = getValue(properties, "x", this.x);
		this.y = getValue(properties, "y", this.y);
		this.r = getValue(properties, "r", this.r);

		return this;
	}

	/**
	 * Returns an instance of a Point representing the center-point of this circle.
	 *
	 * @alias Whirl.geometry.Circle#midpoint
	 * @type {Whirl.geometry.Point}
	 * @readonly
	 *
	 * @example
	 * Whirl.geometry.Circle(25, 25, 50).midpoint; // Point {x: 25, y: 25}
	 */
	get midpoint() {
		return Point(this.x, this.y);
	}

	/**
	 * Determine if a point is inside this circle.
	 *
	 * @method Whirl.geometry.Circle#isPointInside
	 *
	 * @param {number|Whirl.geometry.Point} px X-coordinate of the point. An instance of a Point can also be given instead as the only argument to determine if it is inside this circle.
	 * @param {number} [py] Y-coordinate of the point.
	 * @returns {boolean}
	 *
	 * @example
	 * Whirl.geometry.Circle(25, 25, 50).isPointInside(30, 20); // true
	 *
	 * @example
	 * const circ = Whirl.geometry.Circle(25, 25, 50);
	 * const point = Whirl.geometry.Point(30, 20);
	 *
	 * circ.isPointInside(point); // true
	 */
	isPointInside(px, py) {
		let x = px;
		let y = py;

		if (px instanceof Point.class) {
			x = px.x;
			y = px.y;
		}

		return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.r * this.r;
	}

	duplicate() {
		return new Circle(this.x, this.y, this.r);
	}
}

const createCircle = (...args) => new Circle(...args);

createCircle.class = Circle;

export default createCircle;
