import translations from "./translations.js";

document.addEventListener("DOMContentLoaded", () => {
	Array.from(document.getElementsByTagName("a")).forEach((route) => {
		const href = route.getAttribute("href");
		if (href && href.startsWith("#")) {
			route.addEventListener("click", (ev) => {
				ev.preventDefault();
				let id = href.replace("#", "");
				if (id.length === 0) {
					window.scrollTo({
						top: 0,
						behavior: "smooth",
					});
				} else {
					document.getElementById(id).scrollIntoView({
						behavior: "smooth",
					});
				}
			});
		}
	});

	console.log(
		"Welcome to my website, 100% created using plenty of CSS3, HTML5 and Vanilla JavaScript!",
	);

	document.getElementById("go-to-top").addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});

	document.body.classList.add(localStorage.getItem("fav-theme") ?? "dark");

	document.getElementById("change-theme").addEventListener("click", () => {
		const body = document.body;
		const darkTheme = body.classList.contains("dark");
		if (darkTheme) {
			body.classList.remove("dark");
			body.classList.add("light");
			localStorage.setItem("fav-theme", "light");
		} else {
			body.classList.remove("light");
			body.classList.add("dark");
			localStorage.setItem("fav-theme", "dark");
		}
	});

	setWebLanguage();

	Array.from(document.getElementsByClassName("change-language")).forEach(
		(button) => {
			try {
				button.addEventListener("click", (ev) => {
					const id = ev.target.id;
					const language =
            id === "language-es" ? "es" : id === "language-en" ? "en" : "en";

					if (document.body.classList.contains(language)) {
						return;
					}

					document.body.classList.remove("es");
					document.body.classList.remove("en");
					document.body.classList.add(language);

					setWebLanguage();
				});
			} catch (error) {}
		},
	);

	function setWebLanguage() {
		try {
			const spanish = document.body.classList.contains("es");
			const english = document.body.classList.contains("en");

			const language = spanish
				? "es"
				: english
					? "en"
					: localStorage.getItem("fav-language") ?? "en";

			Array.from(document.getElementsByClassName("change-language")).forEach(
				(btn) => {
					btn.classList.remove("selected");
				},
			);
			document.getElementById("language-" + language).classList.add("selected");

			localStorage.setItem("fav-language", language);

			document.body.classList.add(language);

			document.getElementById("about-text").innerHTML =
        translations[language]["about"];
			document.getElementById("title-text").innerHTML =
        translations[language]["title"];
			document.getElementById("components-text").innerHTML =
        translations[language]["components"]["info"];
			document.getElementById("gallery-component-text").innerHTML =
        translations[language]["components"]["gallery"];
			document.getElementById("table-component-text").innerHTML =
        translations[language]["components"]["table"];
			document.getElementById("kanban-component-text").innerHTML =
        translations[language]["components"]["kanban"];

			//document.getElementById("full-cv-text").innerHTML =
        //translations[language]["cv"]["full"];
			document.getElementById("simplified-cv-text").innerHTML =
        translations[language]["cv"]["simple"];
			try {
				document.getElementById("cv-preview-text").innerHTML =
          translations[language]["cv"]["preview"];
				document.getElementById("cv-download-text").innerHTML =
          translations[language]["cv"]["download"];
			} catch (error) {
				// To prevent browsers that load the iframe from crashing the app.
			}

			document.getElementById("credits-images-by").innerHTML =
        translations[language]["credits"]["images"];
			document.getElementById("credits-icons-by").innerHTML =
        translations[language]["credits"]["icons"];
            document.getElementById("credits-contact-text").innerHTML =
        translations[language]["credits"]["contact"];

			document.title = translations[language]["html-title"];
			document
				.getElementById("cv-preview")
				.setAttribute(
					"data",
					`../public/assets/pdf/cv_daniel_otero_rivera_frontend_dev_${language}.pdf`,
				);

			const routes = Array.from(document.getElementsByTagName("a"));
			routes.forEach((route) => {
				try {
					const href = route.getAttribute("href");
					if (!route.classList.contains("no-route-small")) {
						if (href === "#") {
							route.innerHTML = translations[language]["nav"]["home"];
						}
						if (href === "#components") {
							route.innerHTML = translations[language]["nav"]["components"];
						}
						if (href === "#gallery") {
							route.innerHTML = translations[language]["nav"]["gallery"];
						}
						if (href === "#table") {
							route.innerHTML = translations[language]["nav"]["table"];
						}
						if (href === "#kanban") {
							route.innerHTML = translations[language]["nav"]["kanban"];
						}
						if (href === "#about") {
							route.innerHTML = translations[language]["nav"]["about"];
						}
						if (href === "#cv") {
							route.innerHTML = translations[language]["nav"]["cv"];
						}
					}
				} catch (error) {}
			});
		} catch (error) {}
	}

	setTimeout(() => {
		document
			.getElementById("profile-pic-loader")
			.classList.remove("loading-border");
	}, 750);

    let loadingImageTimeout = null;
	let imageSourceCount = 0;
	document.getElementById("profile-pic").addEventListener("click", (ev) => {
		try {
			imageSourceCount++;
            
            document
                .getElementById("profile-pic-loader")
                .classList.remove("loading-border");
            if (loadingImageTimeout) {
                clearTimeout(loadingImageTimeout);
            }
            // 1 milisecond needed to remove the css class 
            // before setting it so the animation resets properly.
            setTimeout(() => {
                document
				.getElementById("profile-pic-loader")
				.classList.add("loading-border");
            }, 1);
			
			loadingImageTimeout= setTimeout(() => {
				document
					.getElementById("profile-pic-loader")
					.classList.remove("loading-border");
                    loadingImageTimeout = null;
			}, 750);

			ev.target.setAttribute(
				"src",
				"https://picsum.photos/" + (500 + imageSourceCount),
			);
		} catch (error) {}
	});
});
