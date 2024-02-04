import dorTooltip from "./dor_tooltip.js";

/**
 * Checks if the input element is a valid jQuery object.
 *
 * If not or if it doesn't exist on the DOM, it returns null.
 *
 * @param {jQuery | string} element
 * @returns {jQuery | null}
 */
export function parsejQueryElement(element) {
	try {
		if (!(element instanceof jQuery) && typeof element !== "string") {
			console.warn(
				"The element can't be parsed as a jQuery object",
				typeof element,
			);
			return null;
		}

		const $element =
      element instanceof jQuery
      	? element
      	: element.startsWith("#")
      		? $(element)
      		: $("#" + element);

		return $element.length !== 0 ? $element : null;
	} catch (error) {
		console.warn("Error validating jQuery element:", error);
		return null;
	}
}
/**
 * Prepares input text so it can be used as a file name.
 * @param {String} text
 * @returns {String | null}
 */
export function cleanInput(text) {
	try {
		return (
			text
				.toLowerCase()
			// Decomposes accented characters into normal form.
				.normalize("NFD")
			// Removes all characters that are not letters, numbers, whitespaces
			// or any of this [/_:].
				.replace(/[^a-zA-Z0-9_\/: ]/g, "")
			// Replaces the [/:] characters and whitespaces for underscores.
				.replace(/[\s\/:]/g, "_")
			// Replaces multiple underscores to just one.
				.replace(/_+/g, "_")
		);
	} catch (error) {
		console.warn("Error cleaning input:", error);
		return null;
	}
}
// TODO : Add docs.
/**
 *
 * @param {*} component
 * @param {*} callback
 * @returns
 */
export function fadeOutComponent(component, callback) {
	try {
		if (!(component instanceof jQuery) && !(component instanceof String)) {
			console.warn("The component isn't a jQuery element:", component);
			return;
		}

		component =
      component instanceof jQuery
      	? component
      	: component.startsWith("#")
      		? $(component)
      		: $("#" + component);

		if (component.length !== 1) {
			console.warn(
				"The jQuery element doesn't store a single element:",
				component,
			);
			return;
		}

		component.fadeOut(1000, function () {
			try {
				component.remove();
				if (callback) callback();
			} catch (error) {
				console.warn("Error removing component:", error, component);
			}
		});
	} catch (error) {
		console.warn("Error fading component:", error, component);
	}
}
