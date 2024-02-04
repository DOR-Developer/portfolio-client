import dorTable from "./dor_table.js";

try {
	// TODO : Restructure rowData so it can store
	// whether it's selected, archived, deleted...
	// Do I really need to change the structure?
	// TODO : Add selected : bool.
	// TODO : Add deleted : bool.
	const rowData = Array.from({ length: 100 }, () => 1).map((row, i) => {
		return {
			_uid: i + 1,
			1: "C1 value R" + (i + 1),
			2: i + 1,
			3: i + 1,
			4: new Date((i + 1) * 100000000000),
			5: i + 1,
		};
	});

	const columnData = [
		{
			id: 1,
			label: "Item",
			type: "string",
			required: true,
		},
		{
			id: 3,
			label: "Cantidad",
			shown: false,
			type: "number",
			required: true,
		},
		{
			id: 5,
			label: "Precio",
			type: "currency",
			required: true,
		},
		{
			id: 2,
			label: "Descuento",
			type: "percentage",
		},
		{
			id: 4,
			label: "Fecha venta",
			type: "date",
		},
	];

	const myTable = dorTable({
		domElement: "dor-table-container",
		rowData: rowData,
		columnData: columnData,
		pageSize: 10,
		onCreate: (data) => {
			return new Promise((resolve, reject) => {
				console.log("Created!", data);
				resolve(true);
			});
		},
		onUpdate: (data) => {
			return new Promise((resolve, reject) => {
				if (data === null) {
					reject("Data is null");
				} else {
					console.log("Updated!", data);
					resolve(true);
				}
			});
		},
		onDelete: (data) => {
			return new Promise((resolve, reject) => {
				console.log("Deleted!", data);
				resolve(true);
			});
		},
		onPlay: (data) => {
			console.log("Play row:", data);
		},
		onSave: (data) => {
			return new Promise((resolve, reject) => {
				console.log("Saved!", data);
				resolve(true);
			});
		},
	});

	console.log(myTable.getTableRows());
} catch (error) {
	console.warn("Error on dor-table demo:", error);
}
