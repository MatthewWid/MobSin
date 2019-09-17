// Whirl.shapes.Circle

const isPointInside = require("./isPointInside.js");

function Circle(x, y, r) {
	this._shape = "circle";
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 0;

	this.set = (changes) => {
		this.x = changes.x || this.x;
		this.y = changes.y || this.y;
		this.r = changes.r || this.r;

		return this;
	};
	
	this.isPointInside = isPointInside.bind(this);
}

module.exports = (...args) => new Circle(...args);