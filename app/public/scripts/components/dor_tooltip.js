/**
 * @param {Object} arguments
 * @param {Number} [arguments.status]
 *  (100) Status the message has to convey:
 *  100 - Info |
 *  200 - Success |
 *  400 - Error
 * @param {Number} [arguments.duration]
 *  (5) Duration in miliseconds of the message until it fades.
 * @param {String} [arguments.html]
 *  Html code to display on the container.
 * @param {bool} [arguments.initHelper]
 *  Creates a helper mascot if there isn't one.
 *
 * @returns {jQuery|null}
 *  jQuery object or null if there is an error.
 */
export default function dorTooltip({
	status = 100,
	duration = 5000,
	html,
	initHelper = false,
}) {
	try {
		let helperColorTimeout;

		const dateString = "2023/11/16";
		const date = new Date("2023/11/16");

		const helperIntroductions = [
			"Name's O-R!</br>I'm here to help.",
			"Pleased to meet you!",
			"Welcome back!",
			"Did you know?</br>My dialogs close on click!",
			`I'm ${getSecondsOld()} seconds old!`,
			`I was made on ${dateString}`,
			"I was born on a Thursday!",
		];

		html = initHelper
			? helperIntroductions[
				Math.floor(Math.random() * helperIntroductions.length)
			]
			: html ??
        (status >= 100 && status < 200
        	? "Properly working."
        	: status >= 200 && status < 300
        		? "Success!"
        		: status >= 400 && status < 600
        			? "Oops... it seems there has been an unexpected error."
        			: null);

		if (initHelper) {
			status = 200;
		}

		console.log(status, "\n", html);

		if (!html) {
			console.warn(
				"There is no message to display",
				"\n",
				"Make sure you have declared a valid html syntax for your message",
			);
			return null;
		}

		let $helperContainer;
		let $helper;
		let $tooltipContainer;
		const $body = $("body");

		const $currentHelperContainer = $(".dor-helper-container");
		if ($currentHelperContainer.length !== 1) {
			$helperContainer = $("<div>", {
				class: "dor-helper-container",
			}).prependTo($body);
		} else {
			$helperContainer = $currentHelperContainer;
		}

		if ($helperContainer.children(".dor-helper").length === 0) {
			if (initHelper) {
				$helper = $("<div>", {
					class: "dor-helper",
					title: "0-R HELPER",
				})
					.html(
						`
                    <div class="left-eye"></div>
                    <div class="right-eye"></div>
                    <div class="mouth"></div>
                `,
					)
					.on("click", function () {
						dorTooltip({
							html: helperIntroductions[
								Math.floor(Math.random() * helperIntroductions.length)
							],
							status: 200,
						});
					})
					.appendTo($helperContainer);
			}
		} else {
			$helper = $(".dor-helper");
		}

		const $currentTooltipContainer = $(".dor-tooltips-container");
		if ($currentTooltipContainer.length !== 1) {
			$tooltipContainer = $("<div>", {
				class: "dor-tooltips-container",
			}).prependTo($helperContainer);
		} else {
			$tooltipContainer = $currentTooltipContainer;
		}

		const $tooltip = $("<div>", {
			class: "dor-tooltip",
		})
			.html(html)
			.on("click", function () {
				const $that = $(this);
				try {
					$that.remove();
					if ($(".dor-tooltip").length === 0) {
						clearTimeout(helperColorTimeout);
						setTimeout(() => {
							try {
								$helper.removeClass();
								$helper.addClass("dor-helper");
							} catch (error) {
								console.warn("Error reseting helper color:", error);
							}
						}, 250);
					}
				} catch (error) {
					console.warn("Error removing component:", error, $that);
				}
			})
			.appendTo($tooltipContainer);

		const statusClass =
      status >= 100 && status < 200
      	? "info"
      	: status >= 200 && status < 300
      		? "success"
      		: status >= 400 && status < 600
      			? "error"
      			: "";
		$tooltip.addClass("dor-tooltip-" + statusClass);

		if ($helper) {
			$helper.find(".mouth").addClass("mouth-open");
			$helper.removeClass();
			$helper.addClass("dor-helper");
			$helper.addClass("dor-helper-" + statusClass);
			setTimeout(() => {
				try {
					$helper.find(".mouth").removeClass("mouth-open");
				} catch (error) {
					console.warn("Error toggling helper mouth:", error);
				}
			}, 125);

			if (helperColorTimeout) {
				clearTimeout(helperColorTimeout);
			}
			helperColorTimeout = setTimeout(() => {
				try {
					$helper.removeClass();
					$helper.addClass("dor-helper");
				} catch (error) {
					console.warn("Error reseting helper color:", error);
				}
			}, duration + 1250);
			setTimeout(() => {
				fadeOutComponent($tooltip);
			}, duration);
		}

		return $tooltipContainer;

		function getSecondsOld() {
			return new Date() - date;
		}
	} catch (error) {
		console.warn("Unexpected error on dor tooltip:", error);
		return null;
	}
}
