import { dorGallery } from "./dor_gallery.js";

$(function () {
	try {
		const data = [
			{
				title: "Whispers in the Woods\n( Part II )",
				description:
          "In the heart of an ancient forest, where the sunlight filters through the dense canopy, time whispers through rustling leaves and shadows dance in the twilight. \n\nHere, amidst the age-old trees and moss-covered stones, lies a tale shrouded in mystery. Echoes of forgotten whispers weave through the trees, guiding wanderers to unearth secrets hidden in the roots and branches. The air hums with an otherworldly energy, a mysterious aura that veils the woodland, inviting those brave enough to delve into its depths, promising revelations from the past.",
				text: "Amidst the towering trees, a secret unfolds, whispering secrets of the past. The forest, a tapestry of stories untold, conceals ancient wisdom within its emerald embrace. Each step unravels mysteries, as the rustling leaves echo tales of forgotten ages.",
				date: "12-05-23",
			},
			{
				title: "Echoes of Eternity",
				description:
          "In the annals of time, legends as old as existence itself echo through the passages of history. These stories of heroes and villains, of love and betrayal, resonate across the ages, leaving indelible imprints on the tapestry of existence. Each echo, a testament to the enduring power of tales carried through generations. They stand as beacons, illuminating the paths of those who seek wisdom from the past, offering guidance in the forging of their destinies.",
				text: "The past echoes into the present, shaping destinies unforeseen. Across the sands of time, stories intertwine, weaving the fabric of reality. From ancient epics to forgotten chronicles, echoes resonate through the corridors of eternity.",
				date: "28-09-23",
			},
			{
				title: "Serenade of Stardust",
				description:
          "Beneath the celestial canvas adorned with shimmering stars and cosmic symphonies, lies a melody woven from the very fabric of the universe. Stardust whispers ancient melodies, its ethereal serenade casting a spell upon the cosmos. A celestial dance of light and sound, painting the vast expanse with a mesmerizing allure. Those who gaze upon this celestial ballet find themselves ensnared by its beauty, lost in contemplation of the grandeur that spans beyond mortal comprehension.",
				text: "Stars sing their song, painting the night sky in celestial hues. The cosmic orchestra plays an eternal symphony, as stardust weaves its tale across the heavens. Lost in the serenade, souls find solace in the boundless expanse.",
				date: "05-11-23",
			},
			{
				title: "Chronicles of Infinity",
				description:
          "In the boundless expanse of the cosmos, where stars are born and galaxies collide, lies an infinite tapestry of stories waiting to be unveiled. These chronicles transcend the limits of time and space, weaving tales of cosmic wonders and celestial beings. Each chapter etched in the fabric of infinity, narrating the untold sagas that echo through the cosmic symphony.",
				text: "Across the infinite void, the chronicles unfold, revealing the secrets of the cosmos. Galaxies converge, birthing new stories in the cosmic dance.",
				date: "08-04-25",
			},
			{
				title: "Eternal Embrace",
				description:
          "Love, a force that transcends the ages, binds souls in an eternal embrace. Through trials and tribulations, across lifetimes and dimensions, this enduring bond stands unwavering. It weaves tales of passion and sacrifice, a timeless narrative etched in the heart of existence.",
				text: "Two souls entwined in an eternal embrace, transcending the boundaries of time. Love's enduring flame illuminates the darkest of realms.",
				date: "15-09-25",
			},
			{
				title: "Ripples of Destiny",
				description:
          "The tapestry of fate is woven with the gentlest touch, creating ripples that traverse the sands of time. Each choice, a stone cast upon the tranquil surface, sends reverberations through the vast expanse of destiny. The echoes of these ripples shape the course of lives, intertwining threads in an intricate web of cosmic design.",
				text: "Fate's gentle touch creates ripples, shaping destinies unforeseen. Threads of destiny entwine, echoing across the ages.",
				date: "23-12-25",
			},
			{
				title: "Mystic Reverie",
				description:
          "In the depths of consciousness, where dreams meld with reality, lies a realm veiled in mystic enchantment. Visions and fantasies entwine, blurring the lines between the known and the unknown. Within this reverie, truths concealed by the waking world emerge, whispering secrets that transcend ordinary perception.",
				text: "Dreams merge with reality in the mystic reverie, unveiling hidden truths. The boundary between fantasy and truth dissolves in the depths of consciousness.",
				date: "01-03-26",
			},
			{
				title: "Harmony's Quest",
				description:
          "Amidst discordant melodies, the quest for harmony resonates through the ebb and flow of existence. Seeking balance amidst chaos, this quest traverses realms, uniting disparate forces in a symphony of cosmic equilibrium. The pursuit of harmony becomes a guiding light through tumultuous seas.",
				text: "The pursuit of harmony amidst chaos becomes a cosmic quest. Forces unite in the symphony of equilibrium.",
				date: "11-08-26",
			},
			{
				title: "Whispers of Tomorrow",
				description:
          "In the hushed whispers of the unknown, tomorrow's secrets lie concealed. Murmurs carried on the winds of fate foretell stories yet to unfold. Within these elusive whispers, lies the essence of what is to come, a tapestry of futures waiting to be unraveled.",
				text: "Whispers echo the tales of tomorrows untold, shrouded in the enigma of the unknown. The winds carry prophecies, painting visions of what's yet to be.",
				date: "09-11-26",
			},
			{
				title: "Tales of Tranquility",
				description:
          "From serene landscapes to the depths of calm waters, tales of tranquility weave narratives of peaceful respite amidst life's storms. These stories, often found in the quieter moments, offer solace and wisdom, carrying the essence of quiet strength and inner peace.",
				text: "Tranquility's tales paint serene landscapes, offering solace in life's chaos. Quiet moments reveal the resilience found in peace.",
				date: "17-02-27",
			},
			{
				title: "Arcane Echoes",
				description:
          "In the corridors of ancient knowledge and forgotten lore, echoes of arcane wisdom resonate. Whispers of spells and incantations long-lost permeate the air, carrying the essence of mystical secrets waiting to be unveiled.",
				text: "Arcane whispers reverberate ancient wisdom, shrouded in mystical secrecy. Lost incantations linger, carrying the essence of forgotten spells.",
				date: "24-06-27",
			},
			{
				title: "Ethereal Whirlpool",
				description:
          "Amidst the cosmic currents and celestial tides, an ethereal whirlpool spins, drawing wanderers into its enigmatic embrace. Its mysterious depths hold the allure of undiscovered mysteries, calling forth those daring enough to plunge into the unknown.",
				text: "The ethereal whirlpool beckons, swirling with cosmic allure. Its depths hide uncharted mysteries, tempting the bold to explore the unknown.",
				date: "02-10-27",
			},
			{
				title: "Melody of the Unknown",
				description:
          "In the symphony of existence, amidst known harmonies, echoes a melody born from the uncharted realms. Its tune, woven from the threads of the undiscovered, calls forth seekers to explore the mysteries beyond the familiar.",
				text: "A melody resonates from uncharted realms, beckoning seekers to the unknown. Harmonies intertwine with the undiscovered, guiding explorers beyond the known.",
				date: "13-12-27",
			},
			{
				title: "Echoes in the Void",
				description:
          "In the boundless expanse of emptiness, where darkness reigns supreme, faint echoes linger, lost in the vast void. Whispers of forgotten tales resonate in the nothingness, haunting the endless expanse with fragments of long-forgotten stories.",
				text: "Faint echoes resound in the void's boundless emptiness, whispering tales of the forgotten. Lost stories linger, painting the darkness with echoes of the past.",
				date: "21-03-28",
			},
			{
				title: "Specters of Serendipity",
				description:
          "Amidst chance encounters and unforeseen moments, specters of serendipity weave intricate patterns through the fabric of happenstance. Fortuitous apparitions carry hidden messages, guiding the fortunate towards unanticipated destinies.",
				text: "Fortune hides in unexpected encounters, guiding the fortunate towards unexpected destinies. Serendipitous specters whisper hidden truths, shaping destinies unforeseen.",
				date: "30-07-28",
			},
			{
				title: "Chronicles of Stardust",
				description:
          "Etched upon cosmic particles and celestial remnants, the chronicles of stardust narrate tales of cosmic birth and destruction. Each particle, a fragment of cosmic history, carries within it stories of celestial wonders and cosmic dramas.",
				text: "Cosmic particles carry stories of birth and destruction, narrating cosmic history. Stardust chronicles weave celestial tales amidst the cosmic symphony.",
				date: "09-11-28",
			},
			{
				title: "Mystic Lullaby",
				description:
          "In the ethereal realm where dreams meet reality, a soothing lullaby resonates, carrying within its melody the essence of mystic enchantment. Its harmonies, whispered by unseen forces, lull souls into realms beyond ordinary perception.",
				text: "A mystic lullaby weaves enchantment, soothing souls into ethereal realms. Harmonies resonate, guiding wanderers into the unseen.",
				date: "17-02-29",
			},
			{
				title: "Waltz of the Unknown",
				description:
          "In the dance of existence, amidst familiar rhythms, unfolds a waltz born from uncharted territories. Its steps, guided by the allure of the undiscovered, lead dancers into the enigmatic realms waiting to be explored.",
				text: "A waltz unfolds from uncharted territories, guiding dancers into the unknown. Steps intertwine with the allure of undiscovered horizons.",
				date: "25-06-29",
			},
			{
				title: "Eclipse of Destiny",
				description:
          "In the shadow's embrace, destiny conceals its revelations, waiting for the eclipse to unveil the obscured truths. The convergence of paths, obscured by darkness, hints at the unforeseen destinies awaiting revelation.",
				text: "Destiny hides within the shadow's embrace, waiting for the eclipse to reveal its truths. Paths converge in the darkness, hinting at unseen destinies.",
				date: "04-10-29",
			},
			{
				title: "Whispers in the Ether",
				description:
          "Carried by cosmic winds through the expanse, whispers in the ether speak of ethereal truths and cosmic revelations. Inscrutable messages from the celestial realm echo through the vastness, revealing secrets veiled from mortal understanding.",
				text: "Ethereal whispers carry cosmic revelations, echoing truths from the celestial realm. Messages linger in the vast expanse, shrouded in cosmic mystery.",
				date: "12-12-29",
			},
			{
				title: "Arcane Enigma",
				description:
          "Amidst the enigmatic puzzles woven with threads of ancient wisdom, lies a cryptic enigma waiting to be unraveled. Secrets veiled within arcane symbols and mystical patterns whisper of forgotten knowledge waiting to be discovered.",
				text: "Ancient puzzles conceal cryptic enigmas, holding forgotten knowledge within arcane symbols. Mystical patterns hint at secrets waiting to be unveiled.",
				date: "21-03-30",
			},
			{
				title: "Harmony's Resonance",
				description:
          "Within the symphony of existence, the resonance of harmony shapes the cosmic tapestry, aligning disparate forces in a grand orchestration. A harmonic resonance emanates, binding cosmic elements into a unified cosmic symphony.",
				text: "Harmony's resonance shapes the cosmic tapestry, uniting disparate forces in a grand symphony. Cosmic elements align in the harmonic resonance.",
				date: "29-07-30",
			},
			{
				title: "Sands of Eternity",
				description:
          "In the hourglass of time, the sands of eternity flow endlessly, carrying within them the stories of epochs long past and futures yet to unfold. Each grain, a fragment of cosmic history, marks the passage of ages.",
				text: "Eternal sands flow through the hourglass of time, marking epochs past and futures yet to come. Each grain carries the weight of cosmic history.",
				date: "06-11-30",
			},
			{
				title: "Nebula's Whisper",
				description:
          "From the depths of cosmic clouds, where stars are born and galaxies bloom, emanates the ethereal whisper of nebulae. These whispers carry cosmic secrets within their shimmering expanse, revealing the mysteries of celestial birth and cosmic evolution.",
				text: "Nebulae whisper cosmic secrets, born amidst the depths of cosmic clouds. Shimmering whispers unveil the mysteries of celestial birth.",
				date: "15-03-31",
			},
			{
				title: "Symphony of Echoes",
				description:
          "In the caverns of time, echoes reverberate, telling stories long forgotten and futures yet to be written. A symphony of echoes fills the corridors, resonating with the essence of past, present, and future.",
				text: "Echoes resound through time's caverns, weaving tales of forgotten stories and unwritten futures. A symphony fills the corridors, echoing past, present, and future.",
				date: "23-08-31",
			},
		];

		const minWidth = 920;
		const maxWidth = 1920;
		const minHeight = 580;
		const maxHeight = 1080;
		data.forEach((el, i) => {
			const randomWidth =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
			const randomHeight =
        Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
			el.image = {
				width: randomWidth,
				height: randomHeight,
				src: `https://picsum.photos/${randomWidth}/${randomHeight}`,
				alt: "Random picsum generated image",
			};
			el.id = i;
		});

		dorGallery({
			domElement: "dor-gallery-container",
			data: data,
			options: {
				rowCards: 3,
				galleryTitle: "List of Postals",
			},
			onCreate: function () {
				return new Promise((resolve, reject) => {
					console.log("Created!", data);
					resolve(true);
				});
			},
			onUpdate: function () {
				return new Promise((resolve, reject) => {
					console.log("Updated!", data);
					resolve(true);
				});
			},
			onDelete: function () {
				return new Promise((resolve, reject) => {
					console.log("Deleted!", data);
					resolve(true);
				});
			},
			onPlay: true,
			onSave: true,
		});
	} catch (error) {
		console.warn("Error con card demo:", error);
	}
});
