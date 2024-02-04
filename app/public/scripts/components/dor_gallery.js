import { parsejQueryElement } from "./dor_components.js";

export function dorCard({
	domElement,
	data,
	galleryData,
	options = {},
	onUpdate,
	onDelete,
	onPlay,
	onSave,
}) {
	try {
		const cardMinWidth = options.width;
		const cardHeight = options.height;

		console.log(
			"Card arguments:",
			"\n",
			"- DOM element:",
			domElement,
			"\n",
			"- Card data:",
			data,
			"\n",
			"- Options:",
			options,
		);

		if (!data) {
			console.warn(
				"Card data couldn't be processed.",
				"\n",
				"Please, make sure the data has the expected format.",
			);
			return null;
		}

		const $container = parsejQueryElement(domElement);
		if (!$container) {
			console.warn("The card container is not a jQuery element");
			return null;
		}

		$container.addClass("dor-card-container").css({
			height: cardHeight ?? "auto",
			width: cardMinWidth ?? (data.image ? data.image.width : "280px"),
		});

		const _uid = $container.attr("id");

		const jQueryHtml = `
            <h3 class="dor-card-title">${data.title.replaceAll("\n", "<br>")}</h3>
            <textarea class="dor-card-title dor-card-title-edit dor-hidden"
            >${data.title.replaceAll("<br>", "\n")}</textarea>
            ${
	data.description
		? `
                <p class="dor-card-description">${data.description.replaceAll("\n", "<br>")}</p>
                <textarea class="dor-card-description dor-card-description-edit dor-hidden"
                >${data.description.replaceAll("<br>", "\n")}</textarea>
            `
		: ""
}
            ${
	data.image
		? `
                <div class="dor-card-image-container">
                    <img class="dor-card-image" 
                        src="${data.image.src ?? "#"}"
                        height="${data.image.height ?? "250px"}" 
                        width="${data.image.width ?? "250px"}"
                        alt="${data.image.alt ?? "Card image"}"
                        ${data.image.alt ? `title="${data.image.alt}"` : ""}
                        loading="lazy"/>
                    <div class="dor-card-image-placeholder">
                        <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <img class="dor-card-image-preview dor-hidden" 
                        src="#"
                        height="${data.image.height ?? "250px"}" 
                        width="${data.image.width ?? "250px"}"
                        alt="New selected image"
                        title="New selected image"
                        loading="lazy"/>
                    <div class="dor-card-image-edit dor-hidden">
                        <label for="${_uid}-image">
                            <span>UPLOAD PICTURE</span>
                            <input 
                            class="dor-hidden" 
                            name="file" 
                            id="${_uid}-image" 
                            type="file"
                            accept=".jpg, .jpeg, .png, .webp"/>
                        </label>
                        <button type="button" class="dor-card-image-remove">REMOVE PICTURE</button>
                    </div>
                </div>
            `
		: ""
}
            <div class="dor-card-image-empty dor-hidden">
                <div class="dor-card-separator"></div>
                <label class="dor-hidden" for="${_uid}-image-empty">
                    <span>UPLOAD PICTURE</span>
                    <input 
                    class="dor-hidden" 
                    name="file" 
                    id="${_uid}-image-empty" 
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"/>
                </label>
            </div>
            
            ${
	data.text
		? `
                <p class="dor-card-text">${data.text.replaceAll("\n", "<br>")}</p>
                <textarea class="dor-card-text dor-card-text-edit dor-hidden"
                >${data.text.replaceAll("<br>", "\n")}</textarea>
            `
		: ""
}
            <div class="dor-card-footer">
                ${
	onPlay
		? `
                    <button class="dor-card-footer-play">
                        <i class="material-symbols-outlined">chat</i>
                    </button>
                `
		: ""
}
                ${
	onSave
		? `
                    <button class="dor-card-footer-save">
                        <i class="material-symbols-outlined">favorite</i>
                    </button>
                `
		: ""
}
                ${
	onUpdate
		? `
                    <button class="dor-card-footer-edit">
                        <i class="material-symbols-outlined">edit</i>
                    </button>
                    <button class="dor-card-footer-done dor-hidden">
                        <i class="material-symbols-outlined">done</i>
                    </button>
                    <button class="dor-card-footer-cancel dor-hidden">
                        <i class="material-symbols-outlined">close</i>
                    </button>
                `
		: ""
}
                ${
	onDelete
		? `
                    <button class="dor-card-footer-delete">
                        <i class="material-symbols-outlined">delete</i>
                    </button>
                `
		: ""
}
                ${
	data.date
		? `
                    <span class="dor-card-date">${data.date}</span>
                `
		: ""
}
            </div>
        `;

		$container.html(jQueryHtml);

		$container
			.find(".dor-card-image")
			.on("load", function () {
				try {
					$container.find(".dor-card-image-placeholder").remove();
				} catch (error) {
					console.warn("Error removing image placeholder:", error);
				}
			})
			.on("click", function () {
				try {
					const $that = $(this);
					let $imageModal = $(".dor-card-image-modal");
					if ($imageModal.length === 0) {
						$imageModal = $("<section>", {
							class: "dor-card-image-modal",
						});
						$("body").prepend($imageModal);
					}

					$imageModal.off("click").on("click", function (ev) {
						if (ev.target.tagName !== "IMG") {
							$(this).remove();
						}
					});

					const source = $that.attr("src");
					$imageModal.html(`
                    <img src="${source}"/>
                `);
				} catch (error) {
					console.warn("Error showing fullscreen image");
				}
			});

		$container
			.find(".dor-card-image-edit input, .dor-card-image-empty input")
			.on("change", function (ev) {
				try {
					const file = ev.target.files[0];
					const reader = new FileReader();

					reader.onload = function (e) {
						$container
							.find(".dor-card-image-preview")
							.attr("src", e.target.result)
							.removeClass("dor-hidden");
						// Keep it displayed since the preview image has position absolute.
						//$container.find(".dor-card-image").addClass("dor-invisible");
					};

					reader.readAsDataURL(file);

					$container
						.find(".dor-card-image-container")
						.removeClass("dor-hidden");
					$container.find(".dor-card-image-empty").addClass("dor-hidden");
				} catch (error) {
					console.warn("Error displaying picture preview:", error);
				}
			});
		$container.find(".dor-card-image-remove").on("click", function () {
			try {
				$container.find(".dor-card-image-container").addClass("dor-hidden");
				$container.find(".dor-card-image-empty input").val("");
				$container.find(".dor-card-image-edit input").val("");
				$container.find(".dor-card-image").addClass("dor-hidden");
				$container
					.find(".dor-card-image-preview")
					.attr("src", "#")
					.addClass("dor-hidden");
				$container.find(".dor-card-image-empty").removeClass("dor-hidden");
			} catch (error) {
				console.warn("Error removing image:", error);
			}
		});

		// ON DELETE.
		if (onDelete) {
			$container.find(".dor-card-footer-delete").on("click", function () {
				try {
					const $that = $(this);
					const $item = $that.parents("article.dor-gallery-item");

					if ($item.length === 0) {
						dorTooltip({
							html: "Couldn't delete item. Please, try again.",
						});
						return;
					}

					const id = $item.data("id");

					Promise.resolve(onDelete(id))
						.then((result) => {
							if (galleryData) {
								const itemIdex = galleryData.findIndex(
									(el) => String(el.id) === id,
								);
								if (itemIdex != -1) {
									galleryData.splice(itemIdex, 1);
								}
							}
							$(this).parents(".dor-card-container").remove();
						})
						.catch((error) => {
							dorTooltip({
								html: "Couldn't delete item. Please, try again.",
							});
							console.warn("Error deleting gallery item:", error);
						});
				} catch (error) {
					console.warn("Error deleting gallery item:", error);
				}
			});
		}

		// ON UPDATE.
		if (onUpdate) {
			$container.find(".dor-card-footer-edit").on("click", function () {
				$container
					.find(
						".dor-card-title, .dor-card-description, .dor-card-text, .dor-card-image-empty > .dor-card-separator",
					)
					.addClass("dor-hidden");
				$container
					.find(
						".dor-card-title-edit, .dor-card-description-edit, .dor-card-text-edit, .dor-card-image-edit, .dor-card-image-empty > label, .dor-card-footer-done, .dor-card-footer-cancel",
					)
					.removeClass("dor-hidden");
			});
			$container.find(".dor-card-footer-done").on("click", function () {
				try {
					const $item = $(this).parents("article.dor-gallery-item");

					if ($item.length === 0) {
						dorTooltip({
							html: "Couldn't update item. Please, try again.",
						});
						return;
					}

					const id = $item.data("id");

					const newImage = $container.find(".dor-card-image-preview");
					const title = $container
						.find(".dor-card-title-edit")
						.val()
						.replaceAll("\n", "<br>");
					const desc = $container
						.find(".dor-card-description-edit")
						.val()
						.replaceAll("\n", "<br>");
					const text = $container
						.find(".dor-card-text-edit")
						.val()
						.replaceAll("\n", "<br>");

					const updateDate = new Date();

					const newItemData = {
						id: id,
						title: title,
						description: desc,
						text: text,
						date: `${String(updateDate.getUTCDate()).padStart(2, "0")}-${String(
							updateDate.getUTCMonth() + 1,
						).padStart(2, "0")}-${String(updateDate.getUTCFullYear()).slice(
							-2,
						)}`,
					};

					if (
						newImage.attr("src") != "#" ||
            $container.find(".dor-card-image").hasClass("dor-hidden")
					) {
						newItemData.image = {
							width: newImage.width(),
							height: newImage.height(),
							src: newImage.attr("src"),
							alt: newImage.attr("alt"),
						};
					}

					console.log(newItemData);

					Promise.resolve(onUpdate(newItemData))
						.then((result) => {
							if (galleryData) {
								const galleryItem = galleryData.find((el) => el.id === id);
								console.log(galleryItem, id);
								Object.assign(galleryItem, newItemData);
							}

							if (newItemData.image) {
								$container
									.find(".dor-card-image")
									.attr("src", newImage.attr("src"));
								if (newImage.attr("src") === "#") {
									$container.find(".dor-card-image").addClass("dor-hidden");
								} else {
									$container.find(".dor-card-image").removeClass("dor-hidden");
								}
							}

							$container
								.find(".dor-card-title:not(.dor-card-title-edit)")
								.html(title);
							$container
								.find(".dor-card-description:not(.dor-card-description-edit)")
								.html(desc);
							$container
								.find(".dor-card-text:not(.dor-card-text-edit)")
								.html(text);

							$container
								.find(
									".dor-card-title, .dor-card-description, .dor-card-text, .dor-card-image-edit, .dor-card-image-empty > *, .dor-card-footer-done, .dor-card-footer-cancel",
								)
								.toggleClass("dor-hidden");

							$container
								.find(".dor-card-image-preview")
								.attr("src", "#")
								.addClass("dor-hidden");
						})
						.catch((error) => {
							dorTooltip({
								html: "Couldn't update item. Please, try again.",
							});
							console.warn("Error updating gallery item:", error);

							$container
								.find(".dor-card-image-preview")
								.attr("src", "#")
								.addClass("dor-hidden");
						});
				} catch (error) {
					console.warn("Error updating gallery item:", error);
				}
			});
			$container.find(".dor-card-footer-cancel").on("click", function () {
				$container
					.find(".dor-card-image-preview")
					.attr("src", "#")
					.addClass("dor-hidden");

				$container.find(".dor-card-image-empty input").val("");
				$container.find(".dor-card-image-edit input").val("");
				const source = $container.find(".dor-card-image").attr("src");
				if (source === "#") {
					$container.find(".dor-card-image-container").addClass("dor-hidden");
					$container.find(".dor-card-image").addClass("dor-hidden");
					$container.find(".dor-card-image-empty").removeClass("dor-hidden");
				} else {
					$container
						.find(".dor-card-image-container")
						.removeClass("dor-hidden");
					$container.find(".dor-card-image").removeClass("dor-hidden");
					$container.find(".dor-card-image-empty").addClass("dor-hidden");
				}
				// TODO : Reset values.
				// TODO : Check if working.
				const title = $container
					.find(".dor-card-title:not(.dor-card-title-edit)")
					.val();
				const desc = $container
					.find(".dor-card-description:not(.dor-card-description-edit)")
					.val();
				const text = $container
					.find(".dor-card-text:not(.dor-card-text-edit)")
					.val();

				$container.find(".dor-card-title-edit").text(title);
				$container.find(".dor-card-description-edit").text(desc);
				$container.find(".dor-card-text-edit").text(text);

				$container
					.find(
						".dor-card-title, .dor-card-description, .dor-card-text, .dor-card-image-edit, .dor-card-image-empty > *, .dor-card-footer-done, .dor-card-footer-cancel",
					)
					.toggleClass("dor-hidden");
			});
		}

		return $container;
	} catch (error) {
		console.warn("Error on card:", error);
	}
}

export function dorGallery({
	domElement,
	data,
	filters,
	options = {},
	onCreate,
	onUpdate,
	onDelete,
	onPlay,
	onSave,
}) {
	const _pureData = [...data];
	const pageSize = options.pageSize ?? 15;
	const cardWidth = options.cardWidth;
	const rowCards = options.rowCards;
	const galleryTitle = options.galleryTitle;
	let loadedCards = 0;

	console.log(
		"GALLERY ARGUMENTS:",
		"\n",
		"- DOM element:",
		domElement,
		"\n",
		"- Data:",
		data,
		"\n",
		"- Options:",
		options,
	);

	if (!data || data.length === 0 || !(data instanceof Array)) {
		console.warn(
			"Gallery data couldn't be processed.",
			"\n",
			"Please, make sure the data has the expected format.",
		);
	}

	const $container = parsejQueryElement(domElement);
	if (!$container) {
		console.warn("The gallery container is not a jQuery element.");
		return null;
	}

	$container.addClass("dor-gallery-container");
	const _uid = $container.attr("id");

	const galleryHtml = `
        <div class="dor-gallery-menu">
            ${
	onCreate
		? `
                <button class="dor-gallery-add">
                    <i class="material-symbols-outlined">add</i>
                </button>
            `
		: ""
}
            <h2 class="dor-gallery-menu-title">${galleryTitle ?? "Gallery"}</h2>
            <label for="${_uid}-menu-row-items">
                Items / row
            </label>
            <select id="${_uid}-menu-row-items" class="dor-gallery-menu-row-items">
                ${[1, 2, 3, 4, 5]
		.map((number) => {
			return `
                        <option ${number === Number(rowCards) ? "selected" : ""}>${number}</option>
                    `;
		})
		.join("")}
            </select>
            <button><i class="material-symbols-outlined">filter_alt</i></button>
            <input type="text" placeholder="Export name..."/>
            <button><i class="material-symbols-outlined">file_save</i></button>
        </div>
        <section class="dor-gallery-items"></section>
    `;

	$container.html(galleryHtml);

	generateCards();

	// ON CREATE.
	$container.find(".dor-gallery-add").on("click", function () {
		try {
			const $createModal = $("<div>", {
				class: "dor-gallery-create-modal",
			});

			const createHtml = `
                <form class="dor-gallery-create-form">
                    <div class="dor-gallery-create-form-row">
                        <label for="dor-gallery-create-form-title">Title</label>
                        <input 
                            type="text" 
                            id="dor-gallery-create-form-title" 
                            name="title" 
                            placeholder="Card title..."
                            required/>
                    </div>
                    <div class="dor-gallery-create-form-row">
                        <label for="dor-gallery-create-form-description">Description</label>
                        <textarea 
                            rows="5"
                            name="description" 
                            id="dor-gallery-create-form-description" 
                            placeholder="Card description..."></textarea>
                    </div>
                    <div class="dor-gallery-create-form-image-container">
                        <img class="dor-gallery-create-form-image-preview dor-hidden" 
                            src="#"
                            alt="New selected image"
                            title="New selected image"
                            loading="lazy"/>
                        <div class="dor-gallery-create-form-image">
                            <label for="dor-gallery-create-form-image-select">
                                <span>UPLOAD PICTURE</span>
                                <input 
                                class="dor-hidden" 
                                name="image" 
                                id="dor-gallery-create-form-image-select" 
                                type="file"
                                accept=".jpg, .jpeg, .png, .webp"/>
                            </label>
                            <button type="button" class="dor-gallery-create-form-image-remove">REMOVE PICTURE</button>
                        </div>
                    </div>
                    <div class="dor-gallery-create-form-row">
                        <label for="dor-gallery-create-form-content">Content</label>
                        <textarea 
                            required
                            rows="8"
                            name="content" 
                            id="dor-gallery-create-form-content" 
                            placeholder="Card content..."></textarea>
                    </div>
                    <button type="submit" class="dor-gallery-create-form-submit">Add to gallery</button>
                </form>
            `;
			$createModal.append(createHtml);
			$("body").prepend($createModal);

			$createModal.on("mousedown", function (ev) {
				if (ev.target.className === "dor-gallery-create-modal") {
					$createModal.remove();
				}
			});

			let newImage;

			$createModal
				.find("#dor-gallery-create-form-image-select")
				.on("change", function (ev) {
					try {
						const file = ev.target.files[0];
						const reader = new FileReader();

						reader.onload = function (e) {
							$createModal
								.find(".dor-gallery-create-form-image-preview")
								.attr("src", e.target.result)
								.removeClass("dor-hidden");

							const img = new Image();
							img.onload = function () {
								newImage = {
									alt: ev.target.name,
									width: img.width,
									height: img.height,
									src: e.target.result,
								};
							};
							img.src = e.target.result;
						};

						reader.readAsDataURL(file);
					} catch (error) {
						console.warn("Error displaying picture preview:", error);
					}
				});

			$createModal
				.find(".dor-gallery-create-form-image-remove")
				.on("click", function () {
					try {
						$createModal
							.find(".dor-gallery-create-form-image-preview")
							.attr("src", "#")
							.addClass("dor-hidden");

						newImage = null;
					} catch (error) {
						console.warn("Error removing picture preview:", error);
					}
				});

			$createModal.find(".dor-gallery-create-form").on("submit", function (ev) {
				try {
					ev.preventDefault();

					const formData = new FormData(this);

					const newTitle = formData.get("title");
					const newDesc = formData.get("description");
					const newContent = formData.get("content");

					const createDate = new Date();

					const newItem = {
						id: generateRandomId(),
						title: newTitle.length > 0 ? newTitle : null,
						description: newDesc.length > 0 ? newDesc : null,
						image: newImage ?? null,
						text: newContent.length > 0 ? newContent : null,
						date: `${String(createDate.getUTCDate()).padStart(2, "0")}-${String(
							createDate.getUTCMonth() + 1,
						).padStart(2, "0")}-${String(createDate.getUTCFullYear()).slice(
							-2,
						)}`,
					};

					Promise.resolve(onCreate(newItem))
						.then((result) => {
							const $newCardContainer = $("<article>", {
								class: "dor-gallery-item",
								id: `${_uid}-item-${newItem.id}`,
							}).data("id", newItem.id);

							const $newCard = dorCard({
								domElement: $newCardContainer,
								data: newItem,
								galleryData: data,
								options: {
									width: rowCards
										? `${100 / rowCards - 1}%`
										: itemData.image
											? (itemData.image.width - 500) / 3
											: null,
								},
								onUpdate: onUpdate,
								onDelete: onDelete,
								onPlay: onPlay,
								onSave: onSave,
							});

							data.unshift(newItem);
							$container.find(".dor-gallery-items").prepend($newCard);

							loadedCards += 1;

							console.log($newCard, newItem, data);
							$createModal.remove();
						})
						.catch((error) => {
							dorTooltip({
								html: "Couldn't add card. Please, try again.",
							});
							console.warn("Error updating gallery item:", error);
						});
				} catch (error) {
					console.warn("Error submiting card to gallery:", error);
				}
			});
		} catch (error) {
			console.warn("Error adding card to the gallery:", error);
		}
	});

	$container.find(".dor-gallery-menu-row-items").on("change", function () {
		try {
			const selected = $(this).find("option:selected").val();
			if (selected) {
				$(".dor-gallery-item").css("width", `${100 / selected - 1}%`);
			}
		} catch (error) {
			console.warn("Error selecting number of items on each row:", error);
		}
	});

	$container.find(".dor-gallery-items").on("scroll", function () {
		try {
			if ($(this).scrollTop() >= 1080 * (loadedCards / pageSize)) {
				generateCards();
			}
		} catch (error) {
			console.warn("Error generating cards on scroll:", error);
		}
	});

	function generateRandomId() {
		try {
			const max = 999999;
			const min = 100000;
			const letters = ["A", "B", "C", "D", "E"];
			let id;

			do {
				id =
          String(Math.floor(Math.random() * (max - min + 1)) + min) +
          letters[Math.floor(Math.random() * 5)];
			} while (data.some((el) => el.id === id));

			return id;
		} catch (error) {
			console.warn("Error generating random id:", error);
			return null;
		}
	}

	function generateCards() {
		try {
			if (loadedCards >= data.length) {
				return;
			}
			const pageHtml = `
                ${data
		.slice(loadedCards, loadedCards + pageSize)
		.map((item) => {
			return `
                        <article class="dor-gallery-item" 
                        id="${_uid}-item-${item.id}" 
                        data-id="${item.id}"></article>
                    `;
		})
		.join("")}
            `;

			$container.find(".dor-gallery-items").append(pageHtml);

			$container
				.find(".dor-gallery-item")
				.filter(function (i) {
					return i >= loadedCards;
				})
				.each(function () {
					const id = $(this).data("id");

					const itemData = data.find((item) => item.id === id);
					dorCard({
						domElement: `${_uid}-item-${id}`,
						data: data.find((item) => item.id === id),
						galleryData: data,
						options: {
							width:
                cardWidth ?? rowCards
                	? `${100 / rowCards - 1}%`
                	: itemData.image
                		? (itemData.image.width - 500) / 3
                		: null,
						},
						onUpdate: onUpdate,
						onDelete: onDelete,
						onPlay: onPlay,
						onSave: onSave,
					});
				});

			loadedCards = $container.find(".dor-gallery-item").length;
		} catch (error) {
			console.warn("Error generating cards:", error);
		}
	}
}
