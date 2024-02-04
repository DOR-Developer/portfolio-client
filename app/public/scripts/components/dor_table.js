import { parsejQueryElement, cleanInput } from "./dor_components.js";
import dorDropdown from "./dor_dropdown.js";

/**
 * Creates a table component.
 *
 * By default, it will have filtering, sorting and excel exporting.
 *
 * @param {Object} arguments
 * @param {String|jQuery} arguments.domElement
 *  The DOM element that will become the table element.
 * @param {Array} arguments.rowData
 *  Table row data. Check the README for the accepted format.
 * @param {Array} arguments.columnData
 *  Table column data. Check the README for the accepted format.
 *
 * @param {Boolean} [arguments.sortable]
 *  Whether each table column will be sortable or not.
 * @param {Boolean} [arguments.filterable]
 *  Whether each table column will be filterable or not.
 * @param {Object} [arguments.filters]
 *  Object reference that will store our table filters.
 *
 * @param {Object} [arguments.pageSize]
 *  The default number of rows the table will show on each page.
 *
 * @param {Function} [arguments.onCreate]
 *  Enable row add and do something when any row is added.
 * @param {Function} [arguments.onUpdate]
 *  Enable row update and do something when any row is updated.
 * @param {Function} [arguments.onDelete]
 *  Enable row delete and do something when any row is deleted.
 * @param {Function} [arguments.onPlay]
 *  Enable row play and do something when any row is played.
 * @param {Function} [arguments.onSave]
 *  Enable row save and do something when any row is saved.
 * @returns {jQuery|null}
 *  jQuery object or null if there is an error.
 */
export default function dorTable({
	domElement,
	rowData,
	columnData,
	sortable = true,
	filterable = true,
	filters = {},
	pageSize = 10,
	onCreate,
	onUpdate,
	onDelete,
	onPlay,
	onSave,
}) {
	try {
		const _pureRowData = [...rowData];
		let currentTablePage = 1;

		console.log(
			"TABLE ARGUMENTS:",
			"\n",
			"- DOM element:",
			domElement,
			"\n",
			"- Row data:",
			rowData,
			"\n",
			"- Column data:",
			columnData,
		);

		if (!rowData || rowData.length === 0 || !(rowData instanceof Array)) {
			console.warn(
				"Row data couldn't be processed.",
				"\n",
				"Please, make sure the row data has the expected format.",
			);
			return null;
		}
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

		const $container = parsejQueryElement(domElement);
		if (!$container) {
			console.warn("The table container is not a jQuery element.");
			return null;
		}

		$container.addClass("dor-table-container");

		const _uid = $container.attr("id");

		const initialCellWidth =
      100 / columnData.filter((col) => col.shown ?? true).length;

		const jQueryHtml = `
            <div class="dor-table-menu">
                <span></span>
                <div class="dor-table-page-size"></div>
                <button class="dor-table-reset-filters" title="Reset filters">
                    <i class='material-symbols-outlined'>restart_alt</i>
                </button>
                <div style="display: flex; justify-content: end; gap: .5rem; flex: 1 1 auto;">
                    <form action="#" class="dor-table-export">
                        <input type="search" name="export-excel-name" placeholder="Enter a name..."/>
                        <button type="submit" title="Export as Excel (.xlsx)">
                            <i class='material-symbols-outlined'>file_save</i>
                        </button>
                    </form>
                    ${
	onCreate
		? `
                        <button class="dor-table-add-row" title="Add new row">
                            <i class='material-symbols-outlined'>add</i>
                        </button>
                    `
		: ""
}
                    ${
	onUpdate
		? `
                        <button class="dor-table-update-row-save dor-hidden" title="Update rows">
                            <i class='material-symbols-outlined'>done</i>
                        </button>
                        <button class="dor-table-update-row-cancel dor-hidden" title="Update rows">
                            <i class='material-symbols-outlined'>close</i>
                        </button>
                        <button class="dor-table-update-row" title="Update rows">
                            <i class='material-symbols-outlined'>edit</i>
                        </button>
                    `
		: ""
}
                    ${
	onDelete
		? `
                        <button class="dor-table-delete-row" title="Delete rows">
                            <i class='material-symbols-outlined'>delete</i>
                        </button>
                    `
		: ""
}
                </div>
            </div>
            ${
	onCreate
		? `
                <form action="#" class="dor-table-add-row-form dor-hidden">
                    <div class="dor-table-add-row-form-inputs">
                    <input type="reset" value="Reset"/>
                        ${columnData
		.map((column) => {
			const inputType =
                              column.type === "date"
                              	? "date"
                              	: [
                              		"number",
                              		"float",
                              		"currency",
                              		"percentage",
                              	].includes(column.type)
                              		? "number"
                              		: "text";
			return `
                                <input 
                                    type="${inputType}" 
                                    ${
	column.type === "percentage"
		? "min=\"0\" max=\"100\""
		: ""
}
                                    ${
	column.type === "percentage" ||
                                      column.type === "currency"
		? "step=\"0.01\""
		: ""
}
                                    name="add-${column.id}"
                                    id="form-add-${column.id}"
                                    placeholder="Input ${column.label}..."
                                    ${column.required ? "required" : ""}/>
                            `;
		})
		.join("")}
                    </div>
                    <input type="submit" value="Save"/>
                </form>
            `
		: ""
}
            <div class="dor-table-row dor-table-head">
                ${
	onPlay
		? `
                    <div class="dor-table-cell-icon dor-table-cell-icon-play"></div>
                `
		: ""
}
                ${
	onSave
		? `
                    <div class="dor-table-cell-icon dor-table-cell-icon-save"></div>
                `
		: ""
}
                ${columnData
		.map((column) => {
			const number =
                      column.type === "date" ||
                      column.type === "number" ||
                      column.type === "float" ||
                      column.type === "currency" ||
                      column.type === "percentage";
			return Object.keys(column).length > 0
				? `
                        <div title="Show ${column.label}" class="
                            ${column.shown ?? true ? "dor-hidden" : ""} 
                            dor-table-cell-hidden"
                            data-header-id="${_uid}-${column.id}">
                            <i class="material-symbols-outlined">chevron_right</i>
                        </div>
                        <div class="dor-table-head-cell-container">
                            <div title="${column.label}"
                                id="${_uid}-${column.id}" 
                                class="dor-table-cell 
                                dor-table-head-cell 
                                ${!(column.shown ?? true) ? "dor-hidden" : ""}"
                                data-id="${column.id}"
                                data-header-id="${_uid}-${column.id}">
                                <i title="Hide ${column.label}" class="material-symbols-outlined">chevron_left</i>
                                <span style="${number ? "margin-left: auto;" : ""}">${column.label}</span>
                                ${
	sortable && (column.sortable ?? true)
		? `
                                    <i title="Sort order" class="material-symbols-outlined"
                                        style="${number ? "" : "margin-left: auto;"}">
                                        equal
                                    </i>
                                `
		: ""
}
                                ${
	filterable && (column.filterable ?? true)
		? `
                                    <i title="Filter menu" class="material-symbols-outlined 
                                    dor-table-head-cell-filters-toggle">
                                        filter_alt
                                    </i>
                                `
		: ""
}
                            </div>
                            ${
	filterable && (column.filterable ?? true)
		? `
                                <form 
                                    action="#" 
                                    data-id="${column.id}" 
                                    class="dor-table-head-cell-filters 
                                    dor-hidden">
                                    <button title="Clear ${column.label} filters" class="dor-table-head-cell-filters-row 
                                        dor-table-head-cell-filters-button" 
                                        type="reset">Clear
                                    </button>
                                    ${
	column.type === "string"
		? [
			"contains",
			"equals",
			"starts-with",
			"ends-with",
		]
			.map((stringFilter) => {
				return `
                                                <label class="dor-table-head-cell-filters-row 
                                                    dor-filter-${stringFilter}" 
                                                    for="${_uid}-${column.id}-${stringFilter}">
                                                    <span>${(stringFilter[0].toUpperCase() + stringFilter.substring(1)).replace("-", " ")}</span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Input a filter..." 
                                                        id="${_uid}-${column.id}-${stringFilter}" 
                                                        name="${stringFilter}"
                                                    />
                                                </label>
                                            `;
			})
			.join("")
		: column.type === "number" ||
                                            column.type === "float" ||
                                            column.type === "currency" ||
                                            column.type === "percentage"
			? ["more-than", "less-than"]
				.map((numberFilter) => {
					return `
                                                <label class="dor-table-head-cell-filters-row 
                                                    dor-filter-${numberFilter}" 
                                                    for="${_uid}-${column.id}-${numberFilter}">
                                                    <span>${(numberFilter[0].toUpperCase() + numberFilter.substring(1)).replace("-", " ")}</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Input a filter..." 
                                                        id="${_uid}-${column.id}-${numberFilter}" 
                                                        name="${numberFilter}"
                                                    />
                                                </label>
                                            `;
				})
				.join("")
			: column.type === "date"
				? ["from", "to"]
					.map((dateFilter) => {
						return `
                                                <label class="dor-table-head-cell-filters-row 
                                                    dor-filter-${dateFilter}" 
                                                    for="${_uid}-${column.id}-${dateFilter}">
                                                    <span>${(dateFilter[0].toUpperCase() + dateFilter.substring(1)).replace("-", " ")}</span>
                                                    <input 
                                                        type="date" 
                                                        placeholder="Input a filter..." 
                                                        id="${_uid}-${column.id}-${dateFilter}" 
                                                        name="${dateFilter}"
                                                    />
                                                </label>
                                            `;
					})
					.join("")
				: ""
}
                                    <input title="Filter ${column.label}" class="dor-table-head-cell-filters-row 
                                        dor-table-head-cell-filters-button" 
                                        type="submit" value="Filter"
                                    />
                                </form>
                            `
		: ""
}
                        </div>
                    `
				: "";
		})
		.join("")}
            </div>
            <div class="dor-table-rows"></div>
            <div class="dor-table-navigation">
                <i title="First page" class="material-symbols-outlined">first_page</i>
                <i title="Previous page" class="material-symbols-outlined">chevron_left</i>
                <div class="dor-table-navigation-pages"></div>
                <i title="Next page" class="material-symbols-outlined">chevron_right</i>
                <i title="Last page" class="material-symbols-outlined">last_page</i>
            </div>
        `;

		$container.html(jQueryHtml);

		const pageSizeDropdown = dorDropdown({
			domElement: $container.find(".dor-table-page-size"),
			data: [
				{ label: 5, selected: 5 === pageSize },
				{ label: 10, selected: 10 === pageSize },
				{ label: 20, selected: 20 === pageSize },
				{ label: 50, selected: 50 === pageSize },
				{ label: 100, selected: 100 === pageSize },
			],
		});

		if (pageSizeDropdown) {
			pageSizeDropdown.dropdownItems.on("click", function () {
				const $that = $(this);
				try {
					const newPageSize = Number($that.text());
					if (!Number.isNaN(newPageSize) && pageSize != newPageSize) {
						pageSize = newPageSize;
						currentTablePage = 1;
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error updating page size:", error, $that);
				}
			});
		}

		let resizeTimer;

		$(window).resize(function () {
			if (!resizeTimer) {
				resizeTimer = setTimeout(function () {
					updateCellWidth();
					clearTimeout(resizeTimer);
					resizeTimer = null;
				}, 200);
			}
			// TODO : Add rendering only to
			// tables that are being visualized.
			// Remove the timeout ( ? )
		});
		$(document).on("mousedown", function (ev) {
			const $target = $(ev.target);
			const $filters = $(".dor-table-head-cell-filters");
			const $filtersToggle = $(".dor-table-head-cell-filters-toggle");

			const $currentFilter = $target
				.closest(".dor-table-head-cell-container")
				.find(".dor-table-head-cell-filters");

			const hadClass = $currentFilter.hasClass("dor-hidden");

			$filters.addClass("dor-hidden");

			if (
				$target.is($filtersToggle) ||
        $target.closest(".dor-table-head-cell-filters-toggle").length > 0
			) {
				if (hadClass) {
					$currentFilter.removeClass("dor-hidden");
				}
			} else if ($target.closest(".dor-table-head-cell-filters").length > 0) {
				$currentFilter.removeClass("dor-hidden");
			}
		});

		if (onCreate) {
			$container.find("button.dor-table-add-row").on("click", function () {
				try {
					$container.find(".dor-table-add-row-form").toggleClass("dor-hidden");
				} catch (error) {
					console.warn("Error adding a row:", error);
				}
			});

			$container
				.find("form.dor-table-add-row-form")
				.on("submit", async function (ev) {
					try {
						ev.preventDefault();

						const formData = new FormData(this);

						const newRowData = {
							_uid: rowData.length + 1,
						};
						columnData.forEach((field) => {
							newRowData[field.id] = formData.get("add-" + field.id) || null;
						});

						const state = await Promise.resolve(onCreate(newRowData));

						console.log("Add row:", newRowData, state);

						// TODO : Check when the update menu needs to be hidden.

						if (state) {
							console.log("Success on form submit! Adding new row");
							_pureRowData.push(newRowData);
							currentTablePage = Math.ceil(_pureRowData.length / pageSize);
							updateNavigationPages();
						} else {
							console.warn("Row couldn't be added");
						}
					} catch (error) {
						console.warn("Error submitting add row form:", error);
					}
				});
		}
		if (onUpdate) {
			$container
				.find("button.dor-table-update-row")
				.on("click", async function () {
					try {
						if (
							!$container
								.find("button.dor-table-update-row-cancel")
								.hasClass("dor-hidden")
						) {
							$container
								.find("button.dor-table-update-row-cancel")
								.trigger("click");
						} else {
							const $readOnlyInputs = $container.find(
								".dor-table-rows .dor-table-row input:read-only",
							);

							$readOnlyInputs.prop("readonly", false);

							$container
								.find("button.dor-table-update-row-save")
								.removeClass("dor-hidden");
							$container
								.find("button.dor-table-update-row-cancel")
								.removeClass("dor-hidden");
						}
					} catch (error) {
						console.warn("Error toggling row editing:", error);
					}
				});

			$container
				.find("button.dor-table-update-row-save")
				.on("click", function () {
					try {
						if (confirm("Would you like to save your changes?")) {
							$(this).addClass("dor-hidden");
							$container
								.find("button.dor-table-update-row-cancel")
								.addClass("dor-hidden");

							$container.find("form.dor-table-row").submit();
						}
					} catch (error) {
						console.warn("Error updating rows:", error);
					}
				});

			$container
				.find("button.dor-table-update-row-cancel")
				.on("click", function () {
					try {
						$(this).addClass("dor-hidden");
						$container
							.find("button.dor-table-update-row-save")
							.addClass("dor-hidden");
						updateNavigationPages();
					} catch (error) {
						console.warn("Error canceling rows update:", error);
					}
				});
		}
		if (onDelete) {
			$container
				.find("button.dor-table-delete-row")
				.on("click", async function () {
					try {
						const selectedRows = $container.find(
							".dor-table-rows .dor-table-row.dor-selected",
						);
						const selectedIds = selectedRows
							.map(function () {
								return $(this).data("id");
							})
							.get();

						if (selectedIds.length > 0) {
							const state = await Promise.resolve(onDelete(selectedIds));
							if (state) {
								const newRows = rowData.filter((row) =>
									selectedIds.every((id) => id != row._uid),
								);
								if (newRows) {
									_pureRowData.splice(0);
									_pureRowData.push(...newRows);
									updateNavigationPages();
								}
							} else {
								console.warn("Rows couldn't be deleted");
							}
						} else {
							dorTooltip({
								html: "Please, select rows to delete them!",
							});
						}
					} catch (error) {
						console.warn("Error deleting a row:", error);
					}
				});
		}

		const $columnHeaderCells = $container.find(".dor-table-head-cell");
		$columnHeaderCells.css({
			width:
        (($container.width() - 40 * getHiddenColumns()) / 100) *
          initialCellWidth +
        "px",
		});
		$columnHeaderCells.on("click", function (ev) {
			const $that = $(this);
			try {
				const headCellId = $that.data("id");

				if (!headCellId) return;

				const columnRef = columnData.find((column) => column.id == headCellId);

				const $target = $(ev.target);
				const $filterMenu = $that.parent().find(".dor-table-head-cell-filters");
				const $hideHeader = $that.find("i:first-of-type");
				const $toggleFilters = $that.find(
					".dor-table-head-cell-filters-toggle",
				);

				if (
					$target.is($filterMenu) ||
          $target.closest($filterMenu).length > 0
				) {
					return;
				}
				if (
					$target.is($hideHeader) ||
          $target.closest($hideHeader).length > 0
				) {
					$that.addClass("dor-hidden");
					const headerId = $that.data("header-id");
					toggleColumnShow(false, headerId);
					return;
				}
				if (
					$target.is($toggleFilters) ||
          $target.closest($toggleFilters).length > 0
				) {
					return;
				}

				if (sortable && (columnRef.sortable ?? true)) {
					const $sortLink = $that.find("i").eq(1);

					const currentText = $sortLink.text();
					const newText =
            currentText.trim() === "equal"
            	? "expand_more"
            	: currentText.trim() === "expand_more"
            		? "expand_less"
            		: "equal";

					$sortLink.text(newText);
					if (!filters.sorting) {
						filters.sorting = {};
					}
					filters.sorting.id = headCellId;
					filters.sorting.type = newText;

					updateNavigationPages();
				}
			} catch (error) {
				console.warn("Error sorting table:", error);
			}
		});

		$container.find(".dor-table-reset-filters").on("click", function () {
			try {
				if (filters.filtering) {
					delete filters.filtering;
					//currentTablePage = 1;
					updateNavigationPages();
				}
			} catch (error) {
				console.warn("Error removing all filters:", error);
			}
		});

		$container
			.find(".dor-table-head-cell-filters button[type='reset']")
			.on("click", function (ev) {
				try {
					const $form = $(this).closest("form");
					const formId = $form.data("id");
					if (filters.filtering && filters.filtering[formId]) {
						delete filters.filtering[formId];
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error clearing filters:", error);
				}
			});

		$container.find(".dor-table-head-cell-filters").on("submit", function (ev) {
			try {
				ev.preventDefault();

				const formData = new FormData(this);

				const contains = formData.get("contains") || null;
				const equals = formData.get("equals") || null;
				const startsWith = formData.get("starts-with") || null;
				const endsWith = formData.get("ends-with") || null;
				const moreThan = formData.get("more-than") || null;
				const lessThan = formData.get("less-than") || null;
				const from = formData.get("from") || null;
				const to = formData.get("to") || null;

				const formId = $(this).data("id");

				if (!filters.filtering) {
					filters.filtering = {};
				}

				filters.filtering[formId] = {
					contains: contains,
					equals: equals,
					startsWith: startsWith,
					endsWith: endsWith,
					moreThan: moreThan,
					lessThan: lessThan,
					from: from,
					to: to,
				};

				if (
					Object.values(filters.filtering[formId]).every(
						(filter) => filter === null,
					)
				) {
					delete filters.filtering[formId];
				}

				updateNavigationPages();
			} catch (error) {
				console.warn("Error filtering table:", error);
			}
		});

		$container.find(".dor-table-export").on("submit", function (ev) {
			try {
				ev.preventDefault();

				const formData = new FormData(this);

				const today = new Date();

				const fileName =
          formData.get("export-excel-name") ||
          today.toLocaleDateString("ES-es", {
          	year: "numeric",
          	month: "2-digit",
          	day: "2-digit",
          	hour: "2-digit",
          	minute: "2-digit",
          	second: "2-digit",
          });

				const processedFileName = cleanInput(fileName);

				console.log(
					"Original name:",
					fileName,
					"\nProcessed name:",
					processedFileName,
				);

				if (processedFileName) {
					exportToExcel(processedFileName);
				}
			} catch (error) {
				console.warn("Error on export form submit:", error);
			}
		});

		$container
			.find(".dor-table-head .dor-table-cell-hidden")
			.on("click", function () {
				const $that = $(this);
				try {
					$that.addClass("dor-hidden");
					const headerId = $that.data("header-id");
					toggleColumnShow(true, headerId);
				} catch (error) {
					console.warn("Error toggling column visibility:", error);
				}
			});

		const $navigationMenu = $container.find(".dor-table-navigation");
		$navigationMenu
			.children()
			.eq(0)
			.on("click", function () {
				try {
					if (currentTablePage > 1) {
						currentTablePage = 1;
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error jumping to first page:", error);
				}
			});
		$navigationMenu
			.children()
			.eq(1)
			.on("click", function () {
				try {
					if (currentTablePage > 1) {
						currentTablePage -= 1;
						if (currentTablePage === 1) {
						}
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error jumping to previous page:", error);
				}
			});
		$navigationMenu
			.children()
			.eq(3)
			.on("click", function () {
				try {
					const maxPage = Math.ceil(rowData.length / pageSize);
					if (currentTablePage < maxPage) {
						currentTablePage += 1;
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error jumping to next page:", error);
				}
			});
		$navigationMenu
			.children()
			.eq(4)
			.on("click", function () {
				try {
					const maxPage = Math.ceil(rowData.length / pageSize);
					if (currentTablePage < maxPage) {
						currentTablePage = maxPage;
						updateNavigationPages();
					}
				} catch (error) {
					console.warn("Error jumping to last page:", error);
				}
			});

		updateNavigationPages();

		const output = {
			table: $container,
			getTableRows: () => $container.find(".dor-table-rows .dor-table-row"),
		};

		console.log(output);

		return output;

		/**
     * Updates the width of every cell on the table using
     * the total width of the container, the number of hidden columns
     * and the number of visible columns.
     */
		function updateCellWidth() {
			try {
				const cellWidth =
          100 / $container.find(".dor-table-head-cell:not(.dor-hidden)").length;
				const newWidth =
          (($container.width() - 40 * getHiddenColumns()) / 100) * cellWidth;
				if (cellWidth != Infinity) {
					$container.find(".dor-table-cell:not(.dor-table-cell-hidden)").css({
						width: newWidth + "px",
					});
				}
			} catch (error) {
				console.warn("Error updating headers:", error);
			}
		}

		/**
     * Updates the table rows with the table data
     * by updating its html; then updates cell width.
     *
     * Sorts the row data based on the current filters.
     *
     * The table data may be affected by sorting, filtering,
     * page size and current page number.
     */
		function updateRows() {
			try {
				const $tableRows = $container.find(".dor-table-rows");

				console.log(filters, rowData);

				const filterId = filters?.sorting?.id;
				const filterType = filters?.sorting?.type;

				const rowHtml = `
                    ${rowData
		.sort((a, b) => {
			try {
				if (!filterId || !filterType) {
					return 0;
				}

				if (filterId && filterType) {
					const direction =
                              filterType === "expand_more"
                              	? 1
                              	: filterType === "expand_less"
                              		? -1
                              		: 0;
					if (a[filterId] < b[filterId]) return direction;
					if (a[filterId] > b[filterId]) return -direction;
					return 0;
				}
			} catch (error) {
				console.warn("Error sorting table:", error);
			}

			return 0;
		})
		.slice(
			0 + (currentTablePage - 1) * pageSize,
			currentTablePage * pageSize,
		)
		.map((row) => {
			return Object.keys(row).length > 0
				? `
                            <form 
                                action="#" 
                                class="dor-table-row"
                                data-id="${row._uid}">
                                ${
	onPlay
		? `
                                    <div title="Details" 
                                        class="dor-table-cell-icon dor-table-cell-icon-play">
                                        <i class="material-symbols-outlined 
                                        material-symbols-outlined-fill">
                                            play_arrow
                                        </i>
                                    </div>
                                `
		: ""
}
                                ${
	onSave
		? `
                                    <div title="Save" 
                                        class="dor-table-cell-icon dor-table-cell-icon-save">
                                        <i class="material-symbols-outlined 
                                        ${row.saved ? "material-symbols-outlined-fill" : ""}">
                                            star
                                        </i>
                                    </div>
                                `
		: ""
}
                                ${columnData
		.map((column, i) => {
			const value = row[column.id];
			let rowValue = value;
			if (rowValue) {
				if (column.type === "date") {
					const dateValue = new Date(value);
					if (!isNaN(dateValue)) {
						rowValue =
                                            rowValue = `${dateValue.getFullYear()}-${String(
                                            	dateValue.getMonth() + 1,
                                            ).padStart(2, "0")}-${String(
                                            	dateValue.getDate(),
                                            ).padStart(2, "0")}T${String(
                                            	dateValue.getHours(),
                                            ).padStart(
                                            	2,
                                            	"0",
                                            )}:${String(dateValue.getMinutes()).padStart(2, "0")}`;
					}
				}
				if (
					[
						"number",
						"float",
						"currency",
						"percentage",
					].includes(column.type)
				) {
					const numberValue = Number(value);
					if (!Number.isNaN(numberValue)) {
						if (column.type === "number") {
							rowValue = numberValue;
						} else {
							rowValue = numberValue.toFixed(2);
						}
					}
				}
			}
			return `
                                        <div id="${_uid}-${column.id}-${i}"
                                            title="${value || "No data"}" 
                                            class="dor-table-cell 
                                            ${$(`.dor-table-cell-hidden[data-header-id="${_uid}-${column.id}"]`).hasClass("dor-hidden") ? "" : "dor-hidden"}"
                                            data-header-id="${_uid}-${column.id}"
                                            ${
	column.type === "date" ||
                                              column.type === "number" ||
                                              column.type === "float" ||
                                              column.type === "currency" ||
                                              column.type === "percentage"
		? `
                                                style="justify-content: end;"
                                            `
		: ""
}>
                                            <input 
                                                type="${
	column.type === "date"
		? "datetime-local"
		: column.type ===
                                                          "number" ||
                                                        column.type ===
                                                          "float" ||
                                                        column.type ===
                                                          "currency" ||
                                                        column.type ===
                                                          "percentage"
			? "number"
			: "text"
}" 
                                                name="${column.id}" 
                                                value="${rowValue || (column.type === "string" ? "No data" : "")}"
                                                readonly
                                                ${column.required ? "required" : ""}
                                                ${
	column.type === "date" ||
                                                  column.type === "number" ||
                                                  column.type === "float" ||
                                                  column.type === "currency" ||
                                                  column.type === "percentage"
		? `
                                                    style="text-align: right;"
                                                `
		: ""
}
                                                ${
	column.type ===
                                                    "percentage" ||
                                                  column.type === "currency"
		? `    
                                                    step="0.01"
                                                    min="0"
                                                `
		: ""
}
                                                ${column.type === "percentage" ? "max=\"100\"" : ""}/>
                                                ${
	column.type === "currency"
		? "€"
		: column.type ===
                                                        "percentage"
			? "%"
			: ""
}
                                        </div>
                                        <div title="${value || "No data"}" 
                                            class="dor-table-cell-hidden 
                                            ${$(`.dor-table-cell-hidden[data-header-id="${_uid}-${column.id}"]`).hasClass("dor-hidden") ? "dor-hidden" : ""}"
                                            data-header-id="${_uid}-${column.id}">
                                            <i class="material-symbols-outlined">
                                                visibility_off
                                            </i>
                                        </div>
                                    `;
		})
		.join("")}
                            </form>
                        `
				: "";
		})
		.join("")}
                `;

				$tableRows.html(rowHtml);
				let selected;
				$tableRows
					.find(".dor-table-row:not(.dor-table-head)")
					.on("mousedown", function (ev) {
						const $that = $(this);
						$that.toggleClass("dor-selected");
						selected = $that.hasClass("dor-selected");
					});
				$tableRows.find(".dor-table-row").on("mouseenter", function (ev) {
					const $that = $(this);
					ev.preventDefault();
					ev.stopPropagation();
					if (ev.buttons === 1) {
						if (selected) {
							$that.addClass("dor-selected");
						} else {
							$that.removeClass("dor-selected");
						}
					}
				});
				$(document).on("mouseup", function () {
					selected = null;
				});

				if (onUpdate) {
					$tableRows
						.find("form.dor-table-row")
						.on("submit", async function (ev) {
							try {
								ev.preventDefault();

								const $that = $(this);
								const formData = new FormData(this);

								$that.find("input").prop("readonly", true);

								const _uid = $that.data("id");

								if (!_uid) {
									console.warn("There is no _uid on this row:", $that);
									return;
								}

								const rowPos = _pureRowData.findIndex(
									(row) => row._uid === _uid,
								);

								if (rowPos === -1) {
									console.warn(
										"Row with _uid",
										_uid,
										"could not be found on source data",
									);
									return;
								}

								const oldRowData = _pureRowData[rowPos];

								const newRowData = {
									_uid: _uid,
								};
								columnData.forEach((field) => {
									newRowData[field.id] = formData.get(field.id);
								});

								if (!oldRowData || !newRowData) {
									return;
								}

								const isEqual = sameKeysAndValues(oldRowData, newRowData);
								console.log(isEqual, oldRowData, newRowData);
								if (isEqual) {
									return;
								}

								const state = await Promise.resolve(onUpdate(newRowData));

								console.log("Add row:", oldRowData, newRowData, state);

								if (state) {
									_pureRowData[rowPos] = newRowData;
								} else {
									dorTooltip({
										html: "Rows couldn't be updated.",
									});
								}
							} catch (error) {
								console.warn("Error submiting row update form:", error);
							}
						});
				}

				if (onPlay) {
					// TODO : Prevent row from showing.
				}
				if (onSave) {
					$container
						.find(
							".dor-table-row:not(.dor-table-head) .dor-table-cell-icon-save",
						)
						.on("click", async function () {
							try {
								const $that = $(this);
								const selectedId = $that.parents(".dor-table-row").data("id");

								const row = rowData.find((row) => row._uid == selectedId);

								if (row) {
									const state = await Promise.resolve(onSave(row));
									if (state) {
										row.saved = !row.saved;
										$that
											.find(".material-symbols-outlined")
											.toggleClass("material-symbols-outlined-fill");
									} else {
										console.warn("Row couldn't be saved");
									}
								}
							} catch (error) {
								console.warn("Error saving a row:", error);
							}
						});
				}

				updateCellWidth();
			} catch (error) {
				console.warn("Error updating rows:", error);
			}
		}

		// TODO : Document code.
		/**
     *
     * @param {*} oldObject
     * @param {*} newObject
     * @returns
     */
		function sameKeysAndValues(oldObject, newObject) {
			const oldKeys = Object.keys(oldObject);
			const newKeys = Object.keys(newObject);

			console.log(oldKeys, newKeys, oldObject, newObject);

			if (oldKeys.length != newKeys.length) {
				return false;
			}
			for (let key of oldKeys) {
				const dateObj = new Date(oldObject[key]);
				if (dateObj instanceof Date && isNaN(dateObj)) {
					if (!(key in newObject) || oldObject[key] != newObject[key]) {
						console.log(key);
						return false;
					}
				} else {
					const newNumber = Number(newObject[key]);
					const newDate = new Date(newNumber || newObject[key]);
					if (!newNumber) {
						newDate.setSeconds(0);
						newDate.setMilliseconds(0);
					}
					const oldNumber = Number(oldObject[key]);
					const oldDate = new Date(oldNumber || oldObject[key]);
					if (!oldNumber) {
						oldDate.setSeconds(0);
						oldDate.setMilliseconds(0);
					}
					console.log(key, oldDate, newDate, oldObject[key], newObject[key]);
					if (!(key in newObject) || oldDate.getTime() != newDate.getTime()) {
						console.log(key, oldDate, newDate, oldObject[key]);
						return false;
					}
				}
			}

			for (let key of newKeys) {
				const dateObj = new Date(newObject[key]);
				if (dateObj instanceof Date && isNaN(dateObj)) {
					if (!(key in oldObject) || newObject[key] != oldObject[key]) {
						console.log(key);
						return false;
					}
				} else {
					const newNumber = Number(newObject[key]);
					const newDate = new Date(newNumber || newObject[key]);
					if (!newNumber) {
						newDate.setSeconds(0);
						newDate.setMilliseconds(0);
					}
					const oldNumber = Number(oldObject[key]);
					const oldDate = new Date(oldNumber || oldObject[key]);
					if (!oldNumber) {
						oldDate.setSeconds(0);
						oldDate.setMilliseconds(0);
					}
					console.log(key, oldDate, newDate, oldObject[key], newObject[key]);
					if (!(key in oldObject) || newDate.getTime() != oldDate.getTime()) {
						console.log(key, oldDate, newDate, newObject[key]);
						return false;
					}
				}
			}
			return true;
		}

		/**
     * Updates the table navigation pages based on the current page
     * and the row data ammount.
     *
     * Filters the row data based on the current filters.
     */
		function updateNavigationPages() {
			try {
				const $navigationPages = $container.find(".dor-table-navigation-pages");

				$container.find(".dor-table-update-row-save").addClass("dor-hidden");
				$container.find(".dor-table-update-row-cancel").addClass("dor-hidden");

				rowData = _pureRowData.filter((row) => {
					let compute = true;
					try {
						if (
							!filters.filtering ||
              Object.keys(filters.filtering).length === 0
						) {
							return true;
						}
						Object.entries(filters.filtering).every(([key, map]) => {
							if (compute === false) {
								return false;
							}
							Object.entries(map).every(([filter, value]) => {
								try {
									if (compute === false) {
										return false;
									}
									if (value != null) {
										// STRING
										if (filter === "contains") {
											compute = String(row[key]).includes(value);
											return compute;
										}
										if (filter === "equals") {
											compute = String(row[key]) == value;
											return compute;
										}
										if (filter === "startsWith") {
											compute = String(row[key]).startsWith(value);
											return compute;
										}
										if (filter === "endsWith") {
											compute = String(row[key]).endsWith(value);
											return compute;
										}
										// NUMBER
										if (filter === "moreThan") {
											compute = Number(row[key]) >= Number(value);
											return compute;
										}
										if (filter === "lessThan") {
											compute = Number(row[key]) <= Number(value);
											return compute;
										}
										// DATE
										if (filter === "from") {
											compute = new Date(row[key]) >= new Date(value);
											return compute;
										}
										if (filter === "to") {
											compute = new Date(row[key]) <= new Date(value);
											return compute;
										}
									}
									return true;
								} catch (error) {
									console.warn(
										"Error checking filters:",
										error,
										row[key],
										filter,
										value,
									);
								}
							});
							return true;
						});
					} catch (error) {
						console.warn("Error filtering table:", error);
					}
					return compute;
				});

				const maxPage = Math.ceil(rowData.length / pageSize);

				if (maxPage === Infinity || currentTablePage > maxPage) {
					currentTablePage = 1;
				}

				const navigationPagesHtml = `
                    ${[-2, -1, 0, 1, 2]
		.map((index) => {
			return currentTablePage + index > 0 &&
                          maxPage >= currentTablePage + index
				? `
                            <span ${
	index != 0 &&
                              `
                            title="Go to page ${currentTablePage + index}"
                            `
} ${
	index === 0 &&
                              `
                                class="dor-selected dor-no-pointer"
                            `
}>
                                ${currentTablePage + index}
                            </span>
                        `
				: "";
		})
		.join("")}
                `;

				console.log(maxPage);

				$navigationMenu.children().removeClass("dor-disabled");
				$navigationMenu.children().eq(0).attr("title", "First page");
				$navigationMenu.children().eq(1).attr("title", "Previous page");
				$navigationMenu.children().eq(3).attr("title", "Next page");
				$navigationMenu.children().eq(4).attr("title", "Last page");
				if (currentTablePage <= 1) {
					$navigationMenu.children().eq(0).addClass("dor-disabled");
					$navigationMenu.children().eq(1).addClass("dor-disabled");
				}
				if (maxPage === Infinity || currentTablePage >= maxPage) {
					$navigationMenu.children().eq(3).addClass("dor-disabled");
					$navigationMenu.children().eq(4).addClass("dor-disabled");
				}

				$navigationPages.html(navigationPagesHtml);

				$navigationPages.find("span").on("click", function () {
					const $that = $(this);
					try {
						const pageNumber = Number($that.text());
						console.info("Changing to page", pageNumber);

						if (!Number.isNaN(pageNumber)) {
							currentTablePage = pageNumber;
						}

						updateNavigationPages();
						updateRows();
					} catch (error) {
						console.warn("Error con page change:", error, $that);
					}
				});

				const firstPos = (currentTablePage - 1) * pageSize + 1;
				$(".dor-table-menu > span").html(
					`${firstPos >= 0 ? firstPos + " - " : ""}${currentTablePage * pageSize} / ${rowData.length}`,
				);

				updateRows();
			} catch (error) {
				console.warn("Error updating navigation pages:", error);
			}
		}

		/**
     * Returns the ammount of hidden columns.
     * @returns {Number}
     */
		function getHiddenColumns() {
			return $container.find(
				".dor-table-head .dor-table-cell-hidden:not(.dor-hidden), .dor-table-head .dor-table-cell-icon",
			).length;
		}

		/**
     * Hides and shows columns; and updates cell width.
     * @param {bool} show
     * @param {String} id
     */
		function toggleColumnShow(show, id) {
			if (show) {
				$(`.dor-table-cell-hidden[data-header-id="${id}"]`).addClass(
					"dor-hidden",
				);
				$(`.dor-table-cell[data-header-id="${id}"]`).removeClass("dor-hidden");
			} else {
				$(`.dor-table-cell-hidden[data-header-id="${id}"]`).removeClass(
					"dor-hidden",
				);
				$(`.dor-table-cell[data-header-id="${id}"]`).addClass("dor-hidden");
			}
			updateCellWidth();
		}

		/**
     * Exports current row data to .xls or .xlsx.
     * @param {String} name
     */
		function exportToExcel(name) {
			try {
				const wb = XLSX.utils.book_new();
				wb.props = {
					Title: name,
					Subject: "table data",
					Author: "Me",
					CreatedDate: new Date(),
				};

				wb.SheetNames.push("Data");

				const excelDataArray = [];

				excelDataArray.push(columnData.map((column) => column.label));
				rowData.forEach((row) => {
					excelDataArray.push(
						columnData.map((column) => {
							const fieldType = column.type;
							const value = row[column.id];
							try {
								if (!value) {
									return "";
								}
								if (fieldType === "string") {
									return value;
								}
								if (fieldType === "number") {
									return Number(value);
								}
								if (fieldType === "currency") {
									return Number(value).toLocaleString("ES-es", {
										style: "currency",
										currency: "EUR",
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									});
								}
								if (fieldType === "percentage") {
									return (Number(value) / 100).toLocaleString("ES-es", {
										style: "percent",
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									});
								}
								if (fieldType === "date") {
									const parseDate = new Date(value);
									return isNaN(parseDate)
										? value
										: parseDate.toLocaleDateString("ES-es", {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										});
								}
							} catch (error) {
								console.info(
									"Error parsing data to excel:",
									error,
									row,
									column,
								);
							}
							return value;
						}),
					);
				});

				console.log(excelDataArray);

				const ws = XLSX.utils.aoa_to_sheet(excelDataArray);

				wb.Sheets["Data"] = ws;

				const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

				saveAs(
					new Blob([s2ab(wbout), { type: "application/octet-stream" }]),
					`${name}.xlsx`,
				);

				function s2ab(s) {
					const buf = new ArrayBuffer(s.length);
					const view = new Uint8Array(buf);
					for (var i = 0; i < s.length; i++) {
						view[i] = s.charCodeAt(i) & 0xff;
					}
					return buf;
				}
			} catch (error) {
				console.warn("Error exporting excel:", error);
			}
		}
	} catch (error) {
		console.warn("Unexpected error on dor table:", error);
		return null;
	}
}
