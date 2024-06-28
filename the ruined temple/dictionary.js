class tile {
    constructor(icon, zoomable, info, generation) {
        this.icon = icon;
        this.zoomable = zoomable;
        this.info = info;
        this.generation = generation;
    }

}

const dictionary = [
    //0
    tile("⬛", false, "An empty void.", ""),
    //1
    tile("🌏", true, "An empty planet.", ""),
]

//special grids

const init = [
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "🌏", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
	["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
];