// MobSin.js
// By MatthewWid

let MobSin = {
	game: require("./game"), // Game instance
	eventSystem: require("./eventSystem"), // Custom events
	childSystem: require("./childSystem"), // Tree of parent-children system
	math: require("./math"), // Math functions
	util: require("./util"), // Utility functions
	shapes: require("./shapes"), // Shapes and geometry
	text: require("./text"), // Advanced text
	container: require("./container"), // Generic game container object
};

module.exports = MobSin;
global.MobSin = MobSin;