import { parsejQueryElement } from "./dor_components.js";

/**
 * Creates a dropdown component.
 * @param {Object} arguments
 * @param {String|jQuery} arguments.domElement
 *  The DOM element that will become the dropdown element.
 * @param {Array} arguments.data
 *  Dropdown item data. Check the README to preview the accepted format.
 * @param {Boolean} [arguments.checkbox]
 *  Whether each dropdown item will have a checkbox or not.
 * @param {Boolean} [arguments.clickable]
 *  Whether each dropdown item will be able to be selected or not.
 *
 * @returns {jQuery|null} jQuery object or null if there is an error.
 */

export default function dorDropdown({
	domElement,
	data,
	checkbox = false,
	clickable = true,
}) {
	try {
		$(document).on("click", function (ev) {
			try {
				const $target = $(ev.target);
				const $dropdown = $(".dor-dropdown-container");

				if (!$target.is($dropdown) && !$dropdown.has($target).length) {
					$(".dor-dropdown-list").addClass("dor-hidden");
				}
			} catch (error) {
				console.warn("Couldn't add dropdown toggling to document:", error);
			}
		});

		console.log(
			"DROPDOWN ARGUMENTS:",
			"\n",
			"- DOM element:",
			domElement,
			"\n",
			"- Checkbox:",
			checkbox,
			"\n",
			"- Clickable:",
			clickable,
			"\n",
			"- Dropdown items:",
			data,
		);

		if (!data || data.length === 0 || !(data instanceof Array)) {
			console.warn(
				"Dropdown data couldn't be processed.",
				"\n",
				"Please make sure the data has the expected format.",
				data,
			);
			return null;
		}

		const $container = parsejQueryElement(domElement);
		if (!$container) {
			console.warn("The dropdown container is not a jQuery element.");
			return null;
		}

		$container.addClass("dor-dropdown-container");

		const jQueryHtml = `
            <div title="Select elements on the dropdown" class="dor-dropdown-item dor-dropdown-selected">
                <span>-- Select elements --</span>
                <i class="material-symbols-outlined">expand_more</i>
            </div>
            <ul class="dor-dropdown-list dor-hidden">
                ${data
		.map((item) => {
			try {
				return `
                            <li title="${item.id || item.label}" class="dor-dropdown-item">
                                <span>${item.label}</span>
                                ${
	checkbox
		? `
                                    <div class="dor-dropdown-checkbox">
                                        <input type="checkbox" ${item.checked && "checked"}/>
                                    </div>
                                `
		: ""
}
                            </li>    
                        `;
			} catch (error) {
				console.warn(
					"Couldn't generate dropdown item:",
					error,
					item,
				);
				return "";
			}
		})
		.join("")}
            </ul>
        `;

		$container.append(jQueryHtml);

		const $selectedItem = $container.find(".dor-dropdown-selected");
		const $dropdownList = $container.find(".dor-dropdown-list");
		const $dropdownListItems = $dropdownList.find(".dor-dropdown-item");
		const $dropdownListCheckboxes = $dropdownList.find(
			".dor-dropdown-checkbox input[type='checkbox']",
		);

		$selectedItem.on("click", function () {
			try {
				$dropdownList.toggleClass("dor-hidden");
			} catch (error) {
				console.warn("Couldn't show dropdown list:", error);
			}
		});

		if (clickable) {
			$selectedItem
				.find("span")
				.text(data.find((item) => item.selected)?.label || data[0].label);
			$selectedItem.attr(
				"title",
				data.find((item) => item.selected)?.label || data[0].label,
			);
			$dropdownListItems.each(function () {
				const $that = $(this);
				try {
					const disabled =
            $that.find("span").text() === $selectedItem.find("span").text();
					$that.addClass(disabled && "dor-disabled");
				} catch (error) {
					console.warn("Error checking disabled dropdown item:", error, $that);
				}
			});
			$dropdownListItems.on("click", function (ev) {
				const $that = $(this);
				try {
					if ($that.hasClass("dor-disabled")) {
						return;
					}

					const $target = $(ev.target);
					const $checkbox = $that.find(
						".dor-dropdown-checkbox input[type='checkbox']",
					);
					if ($target.is($checkbox) || $checkbox.has($target).length) {
						return;
					}

					const newSelectedText = $that.find("span").text();
					const newSelectedTitle = $that.attr("title");
					$selectedItem.find("span").text(newSelectedText);
					$selectedItem.attr("title", newSelectedTitle);

					$dropdownListItems.removeClass("dor-disabled");
					$that.addClass("dor-disabled");

					$dropdownList.addClass("dor-hidden");
				} catch (error) {
					console.warn("Error toggling selected dropdown item:", error, $that);
				}
			});
		} else {
			if (checkbox) {
				$dropdownListItems.on("click", function (ev) {
					const $that = $(this);
					try {
						if ($that.hasClass("dor-disabled")) {
							return;
						}

						const $target = $(ev.target);
						const $checkbox = $that.find(
							".dor-dropdown-checkbox input[type='checkbox']",
						);
						if ($target.is($checkbox) || $checkbox.has($target).length) {
							return;
						}

						$checkbox.prop("checked", !$checkbox.prop("checked"));
					} catch (error) {
						console.warn(
							"Error toggling selected dropdown item:",
							error,
							$that,
						);
					}
				});
			} else {
				$selectedItem.find("span").text("Preview elements");
				$selectedItem.attr("title", "Preview elements on the dropdown");
				$dropdownListItems.addClass("dor-no-pointer");
			}
		}

		return {
			dropdown: $container,
			dropdownItems: $dropdownListItems,
			dropdownCheckboxes: $dropdownListCheckboxes,
		};
	} catch (error) {
		console.warn("Unexpected error on dor dropdown:", error);
		return null;
	}
}
