'use strict';
// Tailwind started using CSS variables for color opacity since v1.4.0,
// this helper adds a primitive support for these
const useVariables = object => {
	const newObject = {};

	for (const [key, value] of Object.entries(object)) {
		if (!key.startsWith('--')) {
			if (typeof value === 'string') {
				newObject[key] = value.replace(/var\(([a-zA-Z-]+)\)/, (_, name) => {
					return object[name];
				});
			} else {
				newObject[key] = value;
			}
		}
	}

	return newObject;
};

const create = styles => {
	// Pass a list of class names separated by a space, for example:
	// "bg-green-100 text-green-800 font-semibold")
	// and receive a styles object for use in React Native views
	const tailwind = (classNames, windowWidth = null) => {
		const object = {};

		if (!classNames) {
			return object;
		}

		// TODO: Should not hard-coded, should make them configurable
		const maxWidthKeys = ['sm:', 'md:', 'lg:', 'xl:'];
		const maxWidthValues = [640, 768, 1024, 1280];

		const haveMaxWidthKeys = maxWidthKeys.some(k => classNames.includes(k));
		if (haveMaxWidthKeys && !windowWidth) {
			throw new Error(`Found media queries usage without windowWidth: ${windowWidth}`);
		}

		classNames = classNames.replace(/\s+/g, ' ').trim().split(' ');
		if (haveMaxWidthKeys) {
			// Sort by sm:, md:, lg:, and xl:
			classNames.sort((first, second) => {
				const firstWeight = maxWidthKeys.indexOf(first.slice(0, 3));
				const secondWeight = maxWidthKeys.indexOf(second.slice(0, 3));
				return firstWeight - secondWeight;
			});

			// Filter out class names based on windowWidth
			const i = maxWidthValues.map(maxWidth => windowWidth >= maxWidth ? 1 : 0).reduce((a, b) => a + b, 0);
			classNames = classNames.filter(className => {
				const pre = className.slice(0, 3);
				return !maxWidthKeys.includes(pre) || maxWidthKeys.slice(0, i).includes(pre);
			});

			// Remove maxWidthKeys
			classNames = classNames.map(className => {
				const pre = className.slice(0, 3);
				return maxWidthKeys.includes(pre) ? className.slice(3) : className;
			});
		}

		for (const className of classNames) {
			if (styles[className]) {
				Object.assign(object, styles[className]);
			} else {
				console.warn(`Unsupported Tailwind class: "${className}"`);
			}
		}

		return useVariables(object);
	};

	// Pass the name of a color (e.g. "blue-500") and receive a color value (e.g. "#4399e1")
	const getColor = name => {
		const object = tailwind(`bg-${name}`);
		return object.backgroundColor;
	};

	return {tailwind, getColor};
};

const {tailwind, getColor} = create(require('./styles.json'));

module.exports = tailwind;
module.exports.default = tailwind;
module.exports.getColor = getColor;
module.exports.create = create;
