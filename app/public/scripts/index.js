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
	
	document.getElementById("change-theme").addEventListener("click", () => {
		toggleWebTheme();
	});

	setWebLanguage(true);
    toggleWebTheme(true);

	Array.from(document.getElementsByClassName("change-language")).forEach(
		(button) => {
			try {
				button.addEventListener("click", (ev) => {
					const id = ev.target.id;
					const language = id === "language-es" 
                        ? "es" 
                        : id === "language-en" 
                            ? "en" 
                            : "en";

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

    function toggleWebTheme(initial) {
        try {
            const light = document.body.classList.contains("light");
            const dark = document.body.classList.contains("dark");

            const theme = light 
                ? "light"
                : dark 
                    ? "dark"
                    : localStorage.getItem("fav-theme") ?? "dark";
                    
            const newTheme = theme === "dark" 
                ? "light" 
                : theme === "light"
                    ? "dark"
                    : "dark";

            
            document.body.classList.remove("light");
            document.body.classList.remove("dark");
            if (initial) {
                document.body.classList.add(localStorage.getItem("fav-theme") ?? "dark");
            } else {
                document.body.classList.add(newTheme);
    
                localStorage.setItem("fav-theme", newTheme) ?? "dark";
                
                document.querySelector('link[rel="shortcut icon"]').href = `./public/assets/favicon-${newTheme}.ico`;
            }
            
        } catch (error) {}
    }

	function setWebLanguage(initial) {
		try {
			const spanish = document.body.classList.contains("es");
			const english = document.body.classList.contains("en");

			const language = initial ? (localStorage.getItem("fav-language") ?? "es") : spanish
				? "es"
				: english
					? "en"
					: localStorage.getItem("fav-language") ?? "en";

            console.log(initial, language);

            if (initial) {
                document.body.classList.remove("es");
                document.body.classList.remove("en");
                document.body.classList.add(language);
            }

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
            try {
                document
				.getElementById("cv-download-text")
				.setAttribute(
					"href",
					`../public/assets/pdf/cv_daniel_otero_rivera_frontend_dev_${language}.pdf`,
				);
            } catch (error) {
                // To prevent browsers that load the iframe from crashing the app.
            }

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

	// setTimeout(() => {
	// 	document
	// 		.getElementById("profile-pic-loader")
	// 		.classList.remove("loading-border");
	// }, 750);

    // Not used. Image loader working with picsum.
    // Was quite slow on production so it was changed to the brand logo. 

    // let loadingImageTimeout = null;
	// let imageSourceCount = 0;
	// document.getElementById("profile-pic").addEventListener("click", (ev) => {
	// 	try {
	// 		imageSourceCount++;
            
    //         document
    //             .getElementById("profile-pic-loader")
    //             .classList.remove("loading-border");
    //         if (loadingImageTimeout) {
    //             clearTimeout(loadingImageTimeout);
    //         }
    //         // 1 milisecond needed to remove the css class 
    //         // before setting it so the animation resets properly.
    //         setTimeout(() => {
    //             document
	// 			.getElementById("profile-pic-loader")
	// 			.classList.add("loading-border");
    //         }, 1);
			
	// 		loadingImageTimeout= setTimeout(() => {
	// 			document
	// 				.getElementById("profile-pic-loader")
	// 				.classList.remove("loading-border");
    //                 loadingImageTimeout = null;
	// 		}, 750);

	// 		ev.target.setAttribute(
	// 			"src",
	// 			"https://picsum.photos/" + (500 + imageSourceCount),
	// 		);
	// 	} catch (error) {}
	// });
});
