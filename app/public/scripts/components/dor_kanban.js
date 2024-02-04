import { parsejQueryElement } from "./dor_components.js";
import dorDropdown from "./dor_dropdown.js";

/**
 * Creates a kanban component.
 *
 * @param {Object} arguments
 * @param {String|jQuery} arguments.domElement
 *  The DOM element that will become the kanban element.
 * @param {Array} arguments.cardData
 *  Properties for each card on the kanban.
 * @param {Array} arguments.columnData
 *  Properties for each column on the kanban.
 * @param {Array} arguments.sectionData
 *  Properties for each sectionn on the kanban.
 *
 * @param {Boolean} [arguments.sortable]
 *  Whether each kanban will be sortable or not.
 * @param {Boolean} [arguments.filterable]
 *  Whether each kanban will be filterable or not.
 * @param {Object} [arguments.filters]
 *  Object reference that will store our filters.
 *
 * @param {Function} [arguments.onCreate]
 *  Enable kanban add and do something when any kanban is added.
 * @param {Function} [arguments.onUpdate]
 *  Enable kanban update and do something when any kanban is updated.
 * @param {Function} [arguments.onDelete]
 *  Enable kanban delete and do something when any kanban is deleted.
 * @returns {jQuery|null}
 *  jQuery object or null if there is an error.
 */
export default function dorKanban({
	domElement,
	cardData,
	columnData,
	sectionData,
	onCreate,
	onUpdate,
	onDelete,
}) {
	try {
		const defaultColumnColors = ["#ff4668", "#c36dfc", "#24a0ff", "#29ffb8"];

		const _pureRowData = [...cardData];

		console.log(
			"KANBAN ARGUMENTS:",
			"\n",
			"- DOM element:",
			domElement,
			"\n",
			"- Card data:",
			cardData,
			"\n",
			"- Section data:",
			sectionData,
			"\n",
			"- Column data:",
			columnData,
		);

		if (
			!columnData ||
      columnData.length === 0 ||
      !(columnData instanceof Array)
		) {
			console.warn(
				"Column data couldn't be processed.",
				"\n",
				"Please make sure the column data has the expected format.",
			);
			return null;
		}

		if (
			!sectionData ||
      sectionData.length === 0 ||
      !(sectionData instanceof Array)
		) {
			console.warn(
				"Section data couldn't be processed.",
				"\n",
				"Please make sure the section data has the expected format.",
			);
			return null;
		}

		const $container = parsejQueryElement(domElement);
		if (!$container) {
			console.warn("The kanban container is not a jQuery element.");
			return null;
		}

		$container.addClass("dor-kanban-container");

		const _uid = $container.attr("id");

		const jQueryHtml = `
            <div class="dor-kanban-menu">
                <div class="dor-kanban-menu-header">
                    <button type="button">
                        <i class="material-symbols-outlined">publish</i>
                    </button>
                    <div class="dor-kanban-dropdown"></div>
                    ${
	onCreate
		? `
                        <button type="button" style="margin-left: auto;">
                            <i class="material-symbols-outlined">add</i>
                        </button>
                    `
		: ""
}
                    ${
	onUpdate
		? `
                        <button type="button">
                            <i class="material-symbols-outlined">edit</i>
                        </button>
                    `
		: ""
}
                    ${
	onDelete
		? `
                        <button type="button">
                            <i class="material-symbols-outlined">delete</i>
                        </button>
                    `
		: ""
}
                </div>
                <div class="dor-kanban-columns">
                    ${columnData
		.map(
			(column, i) => `
                        <div class="dor-kanban-column" style="--column-color: ${column.color ?? defaultColumnColors[i]}; 
                        flex: ${column.hidden ? "0 0 auto;" : `1 1 ${100 / columnData.length ?? 1}%`}" data-id="${column.id}">
                            <span ${column.hidden ? "class=\"dor-hidden\"" : ""}>${column.name}</span>
                            <i class="material-symbols-outlined">chevron_${column.hidden ? "right" : "left"}</i>
                        </div>
                    `,
		)
		.join("")}
                </div>
            </div>
            <div class="dor-kanban-sections">
                ${sectionData
		.map((section) => {
			const columnCounts = {};
			let maxCardsVertical = 0;

			const sectionCards = cardData.filter(
				(card) => card.section === section.id,
			);
			sectionCards.forEach((card) => {
				const column = card.column;
				columnCounts[column] = (columnCounts[column] || 0) + 1;
				if (columnCounts[column] > maxCardsVertical) {
					maxCardsVertical = columnCounts[column];
				}
			});

			return `
                        <div class="dor-kanban-section" data-id="${section.id}">
                            <div class="dor-kanban-section-title">
                                <span>${section.name}</span>
                                <i class="material-symbols-outlined">expand_${section.hidden ? "more" : "less"}</i>
                            </div>
                            <div class="dor-kanban-section-rows">
                                ${Array.from(
		{ length: maxCardsVertical + 1 },
		(_, index) => index,
	)
		.map(
			(row) => `
                                    <div class="dor-kanban-row">
                                        ${columnData
		.map((column, i) => {
			const columnCards =
                                              sectionCards.filter(
                                              	(card) =>
                                              		card.column === column.id,
                                              );
			const slotCard =
                                              columnCards.length > row
                                              	? columnCards[row]
                                              	: null;
			console.log(column, columnCards);
			return `
                                                <div class="dor-kanban-slot" style="--column-color: ${column.color ?? defaultColumnColors[i]}; 
                                                flex: ${column.hidden ? "0 0 auto;" : `1 1 ${100 / columnData.length ?? 1}%`}">
                                                    ${
	columnCards.length >
                                                        row && slotCard
		? `
                                                        <div class="dor-kanban-slot-content" data-id="${slotCard.id}">
                                                            <div class="dor-kanban-slot-content-header"></div>
                                                            <div class="dor-kanban-slot-content-body">
                                                                <h4 class="dor-kanban-slot-content-title"
                                                                >${slotCard.title}</h4>
                                                                ${
	slotCard.image
		? `
                                                                    <img src="${slotCard.image.src}"
                                                                        width="100%" 
                                                                        height="180px"
                                                                        alt=${slotCard.image.alt} 
                                                                        class="dor-kanban-slot-content-image"></img>
                                                                `
		: ""
}
                                                                <p class="dor-kanban-slot-content-text"
                                                                >${slotCard.text}</p>
                                                            </div>
                                                            <div class="dor-kanban-slot-content-footer">
                                                                <div class="dor-kanban-slot-content-footer-buttons">
                                                                    ${
	slotCard.play
		? `
                                                                        <button type="button">
                                                                            <i class="material-symbols-outlined 
                                                                            material-symbols-outlined-fill">play_arrow</i>
                                                                        </button>
                                                                    `
		: ""
}
                                                                    ${
	slotCard.saved !=
                                                                      null
		? `
                                                                        <button type="button">
                                                                            <i class="material-symbols-outlined 
                                                                            ${
	slotCard.saved ===
                                                                              true
		? "material-symbols-outlined-fill"
		: ""
}">star</i>
                                                                        </button>
                                                                    `
		: ""
}
                                                                    ${
	slotCard.update
		? `
                                                                        <button type="button">
                                                                            <i class="material-symbols-outlined">edit</i>
                                                                        </button>
                                                                    `
		: ""
}
                                                                    ${
	slotCard.delete
		? `
                                                                        <button type="button">
                                                                            <i class="material-symbols-outlined">delete</i>
                                                                        </button>
                                                                    `
		: ""
}
                                                                </div>
                                                                <span class="dor-kanban-slot-content-footer-date">${slotCard.date}</span>
                                                            </div>
                                                        </div>
                                                        <i class="material-symbols-outlined dor-hidden dor-kanban-slot-add">add</i>
                                                    `
		: `
                                                        <i class="material-symbols-outlined dor-kanban-slot-add">add</i>
                                                    `
}
                                                    
                                                    <i class="material-symbols-outlined ${column.hidden && columnCards.length != 0 ? "" : "dor-hidden"} dor-kanban-slot-hidden">wysiwyg</i>
                                                </div>
                                            `;
		})
		.join("")}
                                    </div>
                                `,
		)
		.join("")}
                            </div>
                        </div>
                    `;
		})
		.join("")}
            </div>
        `;

		$container.html(jQueryHtml);

		$container.find(".dor-kanban-section-title i").on("click", function () {
			const $that = $(this);

			const $section = $that
				.parents(".dor-kanban-section")
				.find(".dor-kanban-section-rows");

			const hidden = $section.hasClass("dor-hidden");

			if (hidden) {
				$section.removeClass("dor-hidden");
				$(this).text("expand_less");
			} else {
				$section.addClass("dor-hidden");
				$(this).text("expand_more");
			}
		});

		$container.find(".dor-kanban-column i").on("click", function () {
			const $that = $(this);

			const $section = $that.parents(".dor-kanban-column");
			const pos = $section.index();

			const col_uid = $section.data("id");

			const columnElement =
        col_uid && columnData.find((col) => col.id === col_uid);

			const hidden = $that.text() === "chevron_right";

			if (hidden) {
				columnElement.hidden = false;
				$section.css({
					flex: `1 1 ${100 / columnData.length}%`,
				});
				$section.find("span").removeClass("dor-hidden");

				$that.text("chevron_left");
				$(".dor-kanban-slot").each(function () {
					const $that = $(this);
					if (pos != null && $that.index() === pos) {
						const hasContent =
              $that.find(".dor-kanban-slot-content").length > 0;

						if (hasContent) {
							$that.find(".dor-kanban-slot-content").removeClass("dor-hidden");
							$that.find(".dor-kanban-slot-add").addClass("dor-hidden");
							$that.find(".dor-kanban-slot-hidden").addClass("dor-hidden");
						} else {
							$that.find(".dor-kanban-slot-add").removeClass("dor-hidden");
							$that.find(".dor-kanban-slot-hidden").addClass("dor-hidden");
						}

						$that.css({
							flex: `1 1 ${100 / columnData.length}%`,
						});
						$that.removeClass("dor-kanban-slot-minimized");
					}
				});
			} else {
				columnElement.hidden = true;
				$section.css({
					flex: "0 0 auto",
				});
				$section.find("span").addClass("dor-hidden");
				$that.text("chevron_right");
				$(".dor-kanban-slot").each(function () {
					const $that = $(this);
					if (pos != null && $that.index() === pos) {
						const hasContent =
              $that.find(".dor-kanban-slot-content").length > 0;

						if (hasContent) {
							$that.find(".dor-kanban-slot-content").addClass("dor-hidden");
							$that.find(".dor-kanban-slot-add").addClass("dor-hidden");
							$that.find(".dor-kanban-slot-hidden").removeClass("dor-hidden");
						} else {
							$that.find(".dor-kanban-slot-hidden").addClass("dor-hidden");
							$that.find(".dor-kanban-slot-add").removeClass("dor-hidden");
						}

						$that.css({
							flex: "0 0 auto",
						});
						$that.addClass("dor-kanban-slot-minimized");
					}
				});
			}
		});

		let isMouseDown = false;
		let offsetX;
		let offsetY;

		$container.find(".dor-kanban-slot-content").draggable({
			revert: "invalid",
			stack: ".dor-kanban-slot-content",
			cursor: "move",
			start: function (event, ui) {
				$(this).css({
					opacity: ".6",
				});
			},
			stop: function (event, ui) {
				$(this).css({
					opacity: "1",
				});
			},
		});

		setDroppable($(".dor-kanban-slot"));

		function setDroppable($queryItems) {
			$queryItems.droppable({
				accept: ".dor-kanban-slot-content",
				drop: function (event, ui) {
					const $that = $(this);

					const $targetContent = $that.find(".dor-kanban-slot-content");
					const $initialContainer = ui.draggable.parent();

					if ($targetContent.length === 0) {
						// TODO : Mirar como mover el elemento al primer hueco vacío.
						const $sectionRows = $that.parents(".dor-kanban-section-rows");

						$that.prepend(ui.draggable);
						if ($that.hasClass("dor-kanban-slot-minimized")) {
							ui.draggable.addClass("dor-hidden");
							$that.find(".dor-kanban-slot-hidden").removeClass("dor-hidden");
						}
						$that.find(".dor-kanban-slot-add").addClass("dor-hidden");
						$initialContainer
							.find(".dor-kanban-slot-add")
							.removeClass("dor-hidden");

						if (
							$sectionRows
								.find(".dor-kanban-row")
								.last()
								.find(".dor-kanban-slot-content").length > 0
						) {
							// TODO : Generar las filas en función de las
							// columnas que estén ocultas y visibles.
							$sectionRows.append(`
                                <div class="dor-kanban-row">
                                    ${columnData
		.map(
			(column, i) => `
                                        <div class="dor-kanban-slot" style="--column-color: ${column.color ?? defaultColumnColors[i]};
                                        flex: ${column.hidden ? "0 0 auto;" : `1 1 ${100 / columnData.length ?? 1}%;`}">
                                            <i class="material-symbols-outlined dor-kanban-slot-add">add</i>
                                            <i class="material-symbols-outlined dor-hidden dor-kanban-slot-hidden">wysiwyg</i>
                                        </div>
                                    `,
		)
		.join("")}
                                </div>
                            `);
						}

						const $initialRows = $initialContainer.parents(
							".dor-kanban-section-rows",
						);

						console.log($initialContainer, $initialRows);

						if ($initialRows.length > 0) {
							while (
								$initialRows.find(".dor-kanban-row").length > 1 &&
                $initialRows
                	.find(".dor-kanban-row")
                	.eq(-2)
                	.find(".dor-kanban-slot-content").length === 0
							) {
								$initialRows.find(".dor-kanban-row").last().remove();
							}
						}

						setDroppable($sectionRows.find(".dor-kanban-slot"));
					} else {
						console.info("That slot is already filled");
						$that.prepend(ui.draggable);
						$initialContainer.prepend($targetContent);
					}

					$(ui.draggable).css({
						position: "relative",
						top: "0",
						left: "0",
						"z-index": "0",
					});
				},
			});
		}

		const kanbanDropdown = dorDropdown({
			domElement: $container.find(".dor-kanban-dropdown"),
			data: [
				{
					label: "My Kanban",
					id: "0",
				},
				{
					label: "Kanban 1",
					id: "1",
				},
				{
					label: "Kanban 2",
					id: "2",
				},
				{
					label: "Kanban 3",
					id: "3",
				},
				{
					label: "Kanban 4",
					id: "4",
				},
			],
			checkbox: false,
			clickable: true,
		});

		kanbanDropdown.dropdownItems.on("click", function () {
			console.log($(this));
			$(".dor-kanban-menu-header h3").text($(this).text());
		});
	} catch (error) {
		console.warn("Unexpected error on dor kanban:", error);
		return null;
	}
}
