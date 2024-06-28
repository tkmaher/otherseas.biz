class Tile {
    constructor(icon, zoomable, info, generation) {
        this.icon = icon;
        this.zoomable = zoomable;
        this.info = info;
        this.generation = generation;
    }

}

class GridSystem {
	constructor(matrix) {
		this.matrix = matrix;
		this.ctx = this.#getContext(0, 0);
		this.cellSize = 20;
		this.padding = 6;
		this.dictionary = [
			//0
			new Tile("⬛", false, "An empty void.", [[0, "fill"]]),
			//1
			new Tile("🌏", true, "An empty planet.", [[0, "fill"]]),
			//2
			new Tile("🌊", true, "A patch of ocean.", [[1, "fill"]]),
		];
	}

	#getCenter(w, h) {
		this.margX = window.innerWidth / 2 - w / 2;
		this.margY = window.innerHeight / 2 - h / 2;
		return {
			x: this.margX + "px",
			y: this.margY + "px"
		};
	}

	#getContext(w, h) {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		return this.context;
	}

	render(matrix) {
		//clear canvas between renders?
		this.matrix = matrix;

		const w = (this.cellSize + this.padding) * matrix.length;
		const h = (this.cellSize + this.padding) * matrix[0].length;

		this.ctx.canvas.width = w;
		this.ctx.canvas.height = h;

		const center = this.#getCenter(w, h);
		this.ctx.canvas.style.marginLeft = center.x;
		this.ctx.canvas.style.marginTop = center.y;
		this.ctx.font = this.cellSize + "px serif";
		for (let row = 0; row < matrix.length; row ++) {
			for (let col = 0; col < matrix[row].length; col ++) {
                this.ctx.fillText(this.dictionary[matrix[row][col]].icon, 
				col * (this.cellSize + this.padding),
                row * (this.cellSize + this.padding) + this.cellSize,
				(this.padding + this.cellSize));
			}
		}
		this.canvas.onmousemove = bulge;
        this.canvas.onclick = dropdown;
	}
}

function clamp(num, a, b) {
	num = Math.floor((num) / (gridSystem.cellSize + gridSystem.padding));
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function getClickPosition(e) {
	xPosition = clamp(e.clientX - gridSystem.margX, 0, gridSystem.matrix.length - 1);
	yPosition = clamp(e.clientY - gridSystem.margY, 0, gridSystem.matrix.length - 1);
	return gridSystem.dictionary[gridSystem.matrix[xPosition][yPosition]]
}

function bulge(e) {
	const x = e.clientX - gridSystem.margX;
	const y = e.clientY - gridSystem.margY;
	gridSystem.canvas.bulgePinch(x, y, 10, 10);
	gridSystem.canvas.update();
}



function dropdown(e) {
	var tile = getClickPosition(e);
	dropdown = document.getElementById("clickDropdown");
    dropdown.style.left = e.clientX + "px";
    dropdown.style.top = e.clientY + "px";
	gridSystem.render(generate(tile.generation));
}

function fill(frame, tile) {
	for (let row = 0; row < frame.length; row ++) {
		for (let col = 0; col < frame[row].length; col ++) {

			frame[col][row] = tile;
		}
		
	} 
	return frame;
}

function generate(parameters) {
	frame = init;
	for (let iter = 0; iter < parameters.length; iter ++) {
		switch (parameters[iter][1]) {
			case "fill":
				frame = fill(frame, parameters[iter][0]);
				
				break;
		
			default:
				break;
		}
	}
	return frame;
}

const init = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const gridSystem = new GridSystem();
gridSystem.render(init);