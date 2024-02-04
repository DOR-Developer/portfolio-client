import dorKanban from "./dor_kanban.js";

const cardData = [
	{
		id: "",
		title: "Black and White Card",
		text: "This is a black and white card",
		play: true,
		saved: false,
		update: true,
		delete: true,
		date: "2024-01-01",
		column: "active",
		section: "no_color",
	},
	{
		id: "",
		title: "Colored Card",
		text: "This is a colored card",
		image: {
			src: "https://picsum.photos/1920/1080",
			alt: "Otter Ash",
		},
		play: false,
		//saved: false,
		update: true,
		delete: true,
		date: "2024-01-02",
		column: "active",
		section: "colored",
	},
];
const columnData = [
	{
		id: "active",
		//color: "#29ffb8",
		name: "Active",
		position: 0,
		hidden: false,
	},
	{
		id: "unactive",
		//color: "#ff4668",
		name: "Unactive",
		position: 1,
		hidden: true,
	},
];
const sectionData = [
	{
		id: "no_color",
		name: "No color",
		hidden: false,
	},
	{
		id: "colored",
		name: "Colored",
		hidden: false,
	},
];

dorKanban({
	domElement: "#dor-kanban-container",
	cardData: cardData,
	columnData: columnData,
	sectionData: sectionData,
	filterable: true,
	sortable: true,
	filters: {},
	onCreate: function () {
		console.log("Created");
	},
	onUpdate: function () {
		console.log("Updated");
	},
	onDelete: function () {
		console.log("Deleted");
	},
});
