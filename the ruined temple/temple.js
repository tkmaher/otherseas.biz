class Tile {
    constructor(icon, zoomable, info, generation, layer) {
        this.icon = icon;
        this.zoomable = zoomable;
        this.info = info;
        this.generation = generation;
		if (layer == undefined) {
			this.layer = 0;
		} else {
			this.layer = layer;
		}
    }

}

class NPC {
    constructor(ID, behavior, x, y, speed, paramX, paramY, paramZ) {
        this.ID = ID;
		this.behavior = behavior;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.paramX = paramX;
		this.paramY = paramY;
		this.paramZ = paramZ;
    }
		
	update(matrix0) {
		var oldX = this.x;
		var oldY = this.y;
		switch (this.behavior) {
			default:
				break;
			case "left": 
				this.x--;
				break;
			case "right":
				this.x++;
				break;
			case "up":
				this.y--;
				break;
			case "down":
				this.y++;
				break;
			case "moveXY":
				this.y += this.paramY;
				this.x += this.paramX;
				break;
			case "chaseXY":
				this.#chaseXY();
				break;
			case "wander":
				this.#wander();
				break;
			case "paceXY" :
				if (this.paramZ % 2 != 0) {
					this.paramZ += 1;
				}
				if ((tick) % (this.paramZ) < (this.paramZ / 2)) {
					this.y += this.paramY;
					this.x += this.paramX;
				} else {
					this.y -= this.paramY;
					this.x -= this.paramX;
				}
				break;
		}
		var newX = this.x;
		var newY = this.y
		if (isInBounds(newX, newY)) {
			var newLayer = gridSystem.dictionary.get(matrix0[newY][newX]).layer;
			if (gridSystem.dictionary.get(this.ID).layer < newLayer) {
				this.x = oldX;
				this.y = oldY;
			}
		}
	}

	#chaseXY() {
		if (this.y < this.paramY) {
			this.y++;
		} else if (this.y > this.paramY) {
			this.y--;
		}
		if (this.x < this.paramX) {
			this.x++;
		} else if (this.x > this.paramX) {
			this.x--;
		}
		if (this.paramZ == 1) {
			if (Math.random() < 0.33) {
				this.x++;
			} else if (Math.random() > 0.66) {
				this.x--;
			}
			if (Math.random() < 0.33) {
				this.y++;
			} else if (Math.random() > 0.66) {
				this.y--;
			}
		}
	}

	#wander() {
		if (Math.random() < 0.33) {
			this.x++;
		} else if (Math.random() > 0.66) {
			this.x--;
		}
		if (Math.random() < 0.33) {
			this.y++;
		} else if (Math.random() > 0.66) {
			this.y--;
		}
		//for directional wandering, define paramX and paramY
		this.x += this.paramX;
		this.y += this.paramY;
	}
}

//NPC behaviors

function clone(NPCin) {
	return new NPC(NPCin.ID, 
		NPCin.behavior, 
		NPCin.x, 
		NPCin.y, 
		NPCin.speed, 
		NPCin.paramX, 
		NPCin.paramY, 
		NPCin.paramZ);
}

//End NPC behaviors

class GridSystem {
	constructor(matrix) {
		this.ctx = this.#getContext();
		this.ctx.textAlign = "center";
		this.cellSize = 40;
		this.length = 15;
		this.padding = 6;
		this.heatmap = [
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
			[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
		];
		this.npcLayer = [];
		this.history = [];
		this.NPChistory = [];
		this.matrix = [];
		this.historyPosition = 0;

		this.w = (this.cellSize + this.padding) * this.length - this.padding;
		this.h = this.w + this.padding;
		this.#setCenter(this.w, this.h);

		/*Dictionary entry syntax:
			1. Tile ID
			2. Tile object
				a. Tile icon(s) (multiple icons if animated)
				b. Tile zoomability
				c. Tile description
				d. Tile function on zoom
				e. Tile layer (default = 0)
		*/

		this.dictionary = new Map([
			["star", new Tile(["⭐", "🌟"], true, "A twinkling star.", star)],
			["spark", new Tile(["🎇", "❤️‍🔥"], true, "Burning plasma.")],
			["flame", new Tile(["🔥"], true, "Burning plasma.")],
			["galaxy", new Tile(["🌌"], true, "A distant galaxy.", galaxy)],
			["comet", new Tile(["☄️"], false, "A flaming comet.")],

			["saturn", new Tile(["🪐"], true, "A gaseous planet.", saturn)],
			["smoke", new Tile(["🌫️", "☁️"], true, "A dense layer of clouds.")],
			["ring", new Tile(["💎", "✨"], false, "A ring of fine dust.")],

			["void", new Tile(["⬛"], false, "An empty void.")],
			["world", new Tile(["🌏", "🌎", "🌍"], true, "An empty planet.", world)],
			["ocean", new Tile(["🌊"], true, "A section of ocean.", ocean)],
			["oceanwave", new Tile(["🌊"], true, "A great wave.", underwater)],
			["oceanwater", new Tile(["🟦"], true, "Salt water.", underwater)],
			["freshwater", new Tile(["🟦"], true, "Fresh water.")],
			["sand", new Tile(["🏷️"], true, "Fine sand.")],
			["bubbles", new Tile(["🫧", "🏷️"], true, "Underwater bubbles.")],
			["coral", new Tile(["🪸"], true, "Coral. Part of a coral reef.")],
			["whalefall", new Tile(["🐋"], true, "The corpse of a whale.")],

			["island", new Tile(["🏝️"], true, "A tiny tropical island.", island, 1)],
			["palm", new Tile(["🌴"], true, "A palm tree.", {}, 1)],
			["mango", new Tile(["🥭"], true, "A fallen mango.", {}, 1)],
			["coconut", new Tile(["🥥"], false, "A fallen coconut.", {}, 1)],
			["shell", new Tile(["🐚"], false, "A washed-up shell.", {}, 1)],
			["rockisland", new Tile(["🪨"], true, "A rocky, barren island.", rockisland, 1)],

			["land", new Tile(["🥬"], true, "A fertile continent.")],

			["desert", new Tile(["🌵"], true, "An arid continent.", desert)],
			["mountain", new Tile(["⛰️"], true, "A mountain range.", mountain, 1)],
			["stream", new Tile(["🟦", "🌊"], false, "A small stream.", {}, 2)],
			["lake", new Tile(["🟦"], true, "A clear lake.", underground, 2)],
			["dirt", new Tile(["🟫"], true, "Soil.", {}, 1)],
			["shrub", new Tile(["🌱"], true, "A small shrub.")],
			["snowymountain", new Tile(["🏔️"], true, "A snowy peak.", snowymountain)],
			["pine", new Tile(["🌲"], true, "An evergreen.")],
			["snow", new Tile(["❄️"], true, "A snowdrift.")],
			["snowman", new Tile(["⛄"], true, "A snowman. Its builder is unknown.")],
			["desertsand", new Tile(["🏷️"], true, "A dune in the desert.", desertzoom)],
			["oasis", new Tile(["🌴"], true, "A desert oasis.", desertzoom)],
			["savannah", new Tile(["🍂"], true, "A desert savannah.", savannah)],
			
			["desertgrass1", new Tile(["🍂"], true, "A dry plain.")],
			["desertgrass2", new Tile(["🌿"], true, "A dry plain.")],
			["deserttree", new Tile(["🌳"], true, "A sparse savannah tree.", {}, 1)],

			["oasiswater", new Tile(["🟦"], true, "A desert oasis.", desertzoom)],
			["oasiswater2", new Tile(["🟦"], true, "Water in an oasis.")],
			["mirage", new Tile(["🌫️"], false, "Shimmering air. A mirage.")],
			["papyrus", new Tile(["🌾"], true, "A papyrus plant.")],
			["cactus", new Tile(["🌵"], true, "A cactus.", {}, 1)],
			["hut", new Tile(["🛖"], true, "An abandoned hut.", hut, 1)],
			["floor", new Tile(["🏷️"], false, "Nondescript floor.")],
			["door", new Tile(["🚪"], false, "A wooden door.")],
			["chair", new Tile(["🪑"], false, "A simple wooden chair.")],
			["fire", new Tile(["🔥", "❤️‍🔥"], true, "A small fire.")],
			["wood", new Tile(["🪵"], true, "Some logs.")],
			["amphora", new Tile(["🏺"], true, "An urn, used for storage.")],
			["temple", new Tile(["🛕"], true, "An ancient temple made of stone.", desertzoom, 1)],
			["temple1", new Tile(["🪨"], false, "An ancient temple made of stone.", {}, 1)],
			["temple2", new Tile(["🛕"], false, "An ancient temple made of stone.", {}, 1)],
			["templedoor", new Tile(["🕳️"], true, "The entrance to the temple.", {}, 1)],
			["anthill", new Tile(["🕳️"], true, "The entrance to an anthill.", {}, 1)],

			["falloutzone", new Tile(["⬛"], true, "An irradiated area.", falloutzone)],
			["falloutwall", new Tile(["🧱"], false, "A wall. The wall serves no apparent purpose.", {}, 1)],
			["wall", new Tile(["🧱"], false, "A wall.", {}, 1)],
			["radioactive", new Tile(["☢️"], true, "A radioactive ion.")],
			["fallout", new Tile(["⬛"], true, "Irradiated earth.")],
			["radiation", new Tile(["☢️"], true, "Irradiated air particles.")],

			["arctic", new Tile(["🧊"], true, "An arctic continent.", arctic)],
			["ice", new Tile(["🧊"], true, "An ice shelf.")],
			["tundra", new Tile(["🟫"], true, "Arctic tundra.")],

			["igneous", new Tile(["🪨"], true, "Igneous rock.", {}, 1)],
			["sedimentary", new Tile(["🪨"], true, "Sedimentary rock.", {}, 1)],
			["metamorphic", new Tile(["🪨"], true, "Metamorphic rock.", {}, 1)],

			["leopard", new Tile(["🐆"], true, "A leopard.")],
			["elephant", new Tile(["🐘"], true, "An elephant.")],
			["rhino", new Tile(["🦏"], true, "A rhinoceros.")],
			["giraffe", new Tile(["🦒"], true, "A tall giraffe.")],
			["gazelle", new Tile(["🦌"], true, "A gazelle.")],
			["camel", new Tile(["🐪"], true, "A camel, or maybe a dromedary.")],
			["scorpion", new Tile(["🦂"], true, "A stinging scorpion.")],
			["hippo", new Tile(["🦛"], true, "A hippopotamus.")],
			["beetle", new Tile(["🪲"], true, "A tiny beetle.")],
			["ant", new Tile(["🐜"], true, "An ant.")],
			["worm", new Tile(["🪱"], true, "An earthworm.", {}, 1)],
			["lizard", new Tile(["🦎"], true, "A cold-blooded lizard.")],
			["snake", new Tile(["🐍"], true, "A slithering snake.")],
			["crocodile", new Tile(["🐊"], true, "A crocodile.")],
			["fish", new Tile(["🐟"], true, "A regular fish.")],
			["tropicalfish", new Tile(["🐠"], true, "An angelfish.")],
			["blowfish", new Tile(["🐡"], true, "A spiny blowfish.")],
			["shark", new Tile(["🦈"], true, "A shark.")],
			["octopus", new Tile(["🐙"], true, "An 8-legged octopus.")],
			["lobster", new Tile(["🦞"], true, "A lobster.")],
			["shrimp", new Tile(["🦐"], true, "A shrimp.")],
			["mouse", new Tile(["🐀"], true, "A small rodent.", {}, 1)],
			["ibex", new Tile(["🦌"], true, "An ibex.", {}, 1)],
			["eagle", new Tile(["🦅"], true, "An eagle.", {}, 2)],
			["squid", new Tile(["🦑"], true, "A squid.")],
			["oyster", new Tile(["🦪"], true, "An oyster.")],
			["crab", new Tile(["🦀"], true, "A crab, a small crustacean.", {}, 1)],
			["dolphin", new Tile(["🐬"], true, "A dolphin, an aquatic mammal.")],
			["whale", new Tile(["🐋"], true, "A blue whale, the largest mammal.")],
		]);
	}

	#getContext() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.canvas.addEventListener("mousemove", hover);
		this.canvas.addEventListener("mouseover", showInfo);
		this.canvas.addEventListener("mouseout", hideInfo);
        this.canvas.addEventListener("click", zoom);
		addEventListener("resize", (event) => {this.#setCenter(this.w, this.h)});
		return this.canvas.getContext("2d");
	}

	#setCenter(w, h) {
		this.margX = window.innerWidth / 2 - w / 2;
		this.margY = window.innerHeight / 2 - h / 2;
		this.ctx.canvas.style.marginLeft = this.margX + "px";
		this.ctx.canvas.style.marginTop = this.margY + "px";
	}

	render(matrix, tick) {
		this.matrix = matrix;
		this.ctx.canvas.width = this.w;
		this.ctx.canvas.height = this.h;
		var anim, frame, level;
		for (let row = 0; row < this.length; row ++) {
			for (let col = 0; col < this.length; col ++) {
				level = matrix.length - 1;
				this.ctx.font = this.heatmap[row][col] + 10 + "px serif";

				while (matrix[level][row][col] == "" && level > 0) {
					level--;
				}

				anim = this.dictionary.get(matrix[level][row][col]).icon;
				frame = anim[(tick + ((row ^ 3) * (col ^ 3))) % anim.length];
				
                this.ctx.fillText(frame, 
				col * (this.cellSize + this.padding),
                row * (this.cellSize + this.padding) + (this.cellSize - this.padding),
				(this.padding + this.cellSize));
			}
		}
	}

	updateNPCS() {
		for (var i = 0; i < this.npcLayer.length; i++) {
			if (isInBounds(this.npcLayer[i].x, this.npcLayer[i].y)) {
				this.matrix[1][this.npcLayer[i].y][this.npcLayer[i].x] = "";
			}
			if (((tick * this.npcLayer[i].speed) % 1) == 0) {
				for (var k = 0; k < Math.ceil(this.npcLayer[i].speed); k++) {
					this.npcLayer[i].update(this.matrix[0]);
				}
			}
		}
		for (var i = 0; i < this.npcLayer.length; i++) {
			if (isInBounds(this.npcLayer[i].x, this.npcLayer[i].y)) {
				this.matrix[1][this.npcLayer[i].y][this.npcLayer[i].x] = this.npcLayer[i].ID;
			}
		}
	}

	logHistory() {
		while (this.historyPosition != this.history.length - 1) {
			this.history.pop();
			this.NPChistory.pop();
		}
		this.history.push(JSON.parse(JSON.stringify(this.matrix)));
		this.NPChistory.push([]);
		this.NPChistory[this.historyPosition + 1] = this.npcLayer;
		this.historyPosition++;
		document.getElementById("fwd").style.opacity = "50%";
		document.getElementById("back").style.opacity = "100%";
	}
}

function updateHeatmap(e) {
	var proximityX, proximityY, proximity;
	var size = gridSystem.cellSize;
	for (let row = 0; row < gridSystem.heatmap.length; row ++) {
		for (let col = 0; col < gridSystem.heatmap[row].length; col ++) {
			proximityX = Math.abs((e.clientX - gridSystem.margX) - (col * (size + gridSystem.padding) + size - gridSystem.padding));
			proximityY = Math.abs((e.clientY - gridSystem.margY) - (row * (size + gridSystem.padding) + size - gridSystem.padding));
			proximity = Math.sqrt(proximityX * proximityX + proximityY * proximityY) / 8;
			gridSystem.heatmap[row][col] = Math.max(size / 3, size - proximity);
		}
	}
	gridSystem.render(gridSystem.matrix, tick);
}

function hideInfo() {
	document.getElementById('info').hidden = true;
}

function showInfo() {
	document.getElementById('info').hidden = false;
}

function hover(e) {
	var tile = gridSystem.dictionary.get(getClickPosition(e));
	var infoPane = document.getElementById('info');
	var info = document.getElementById('infoTxt');
	infoPane.style.top = e.clientY + "px";
	infoPane.style.left = e.clientX + "px";
	if (tile.info != info.innerHTML) {
		var clickable = document.getElementById('clickable');
		var icon = document.getElementById('icon');
		if (tile.zoomable) {
			clickable.innerHTML = "Yes";
		} else {
			clickable.innerHTML = "No";
		}
		icon.innerHTML = "'" + tile.icon[0] + "'";
		info.innerHTML = tile.info;
	}

	updateHeatmap(e);
}

/*generation functions*/

function isInBounds(x, y) {
	if (x < gridSystem.length && x >= 0 && y < gridSystem.length && y >= 0) {
		return true;
	} else {
		return false;
	}
}

function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function getClickX(e) {
	var num = e.clientX - gridSystem.margX;
	num = Math.floor((num) / (gridSystem.cellSize + gridSystem.padding));
	return clamp(num, 0, gridSystem.length - 1);
}

function getClickY(e) {
	var num = e.clientY - gridSystem.margY;
	num = Math.floor((num) / (gridSystem.cellSize + gridSystem.padding));
	return clamp(num, 0, gridSystem.length - 1);
}

function getClickPosition(e) {
	xPosition = getClickX(e);
	yPosition = getClickY(e);
	var level = gridSystem.matrix.length - 1;
	while (gridSystem.matrix[level][yPosition][xPosition] == "" && level != 0) {
		level--;
	}	
	var name = gridSystem.matrix[level][yPosition][xPosition];
	return name;
}

function zoom(e) {
	var name = getClickPosition(e);
	var tile = gridSystem.dictionary.get(name)
	if (tile.zoomable) {
		tick = 0;
		gridSystem.npcLayer = [];
		var frame = JSON.parse(JSON.stringify(empty));
		tile.generation(frame[0], name);
		gridSystem.render(frame, tick);
		gridSystem.logHistory();
	}
}

//Counts the number of tiles adjacent (x-wise and +-wise) to frame[yIn][xIn] with value target
function count_adjacent(frame, xIn, yIn, target) {
	var x, y;
	var count = 0;
	for (y = yIn - 1; y < yIn + 2; y++) {
		for (x = xIn - 1; x < xIn + 2; x++) {
			if (isInBounds(x, y)) {
				if (frame[y][x] == target) {
					count++;
				}
			}
		}
	}
	return count;
}

function NPCify(frame, tile, behavior, speed, paramX, paramY, paramZ) {
	if (paramX == undefined) {
		paramX = 0;
	}
	if (paramY == undefined) {
		paramY = 0;
	}
	if (paramZ == undefined) {
		paramZ = 0;
	}
	for (var row = 0; row < frame.length; row ++) {
		for (var col = 0; col < frame[row].length; col ++) {
			if (frame[row][col] == tile) {
				frame[row][col] = "";
				gridSystem.npcLayer.push(new NPC(tile, behavior, col, row, speed, paramX, paramY, paramZ));
			}
		}
	} 
}

function NPCifyAndMask(frame, bgFrame, mask, tile, behavior, speed, paramX, paramY, paramZ) {
	if (paramX == undefined) {
		paramX = 0;
	}
	if (paramY == undefined) {
		paramY = 0;
	}
	if (paramZ == undefined) {
		paramZ = 0;
	}
	for (var row = 0; row < frame.length; row ++) {
		for (var col = 0; col < frame[row].length; col ++) {
			if (frame[row][col] == tile) {
				frame[row][col] = "";
				if (bgFrame[row][col] == mask || mask < 0) {
					gridSystem.npcLayer.push(new NPC(tile, behavior, col, row, speed, paramX, paramY, paramZ));
				}
			}
		}
	} 
}

//Fills a frame with a selected tile. Can be random or uniform if density = 1.0
function fill(frame, tile, density, mask) {
	for (var row = 0; row < frame.length; row ++) {
		for (var col = 0; col < frame[row].length; col ++) {
			if ((frame[col][row] == mask || mask < 0) && Math.random() <= density) {
				frame[col][row] = tile;
			}
		}
	} 
}

//The fuzz function fills tiles with at least two adjacent tiles that match the "target" with a tile
//of choice. The density specifies the chance of filling a tile, and the iterations specifies the number
//of "fuzzes" performed. A density of 1.0 and an iteration of 1 draws a stroke of "tile" around 
//target tiles. When density is low, it creates a semi-random "fuzz" around the target.
function fuzz(frame, tile, target, density, iterations, mask) {
	var x, y;
	var newFrame = frame;
	for (var i = 0; i < iterations; i++) {
		for (y = 0; y < frame.length; y ++) {
			for (x = 0; x < frame[0].length; x ++) {
				if (count_adjacent(frame, x, y, target, false) > 0 
					&& (Math.random() <= density)
					&& (frame[y][x] == mask || mask < 0)
					&& frame[y][x] != target) {
					newFrame[y][x] = -1;
				}
			}
		}
		for (y = 0; y < frame.length; y ++) {
			for (x = 0; x < frame[0].length; x ++) {
				if (newFrame[y][x] == -1) {
					frame[y][x] = tile;
				}
			}
		}
	}
}

//Creates a line between coordinates (xStart, yStart) and (xEnd, yEnd).
function line(frame, tile, xStart, yStart, xEnd, yEnd, mask) {
	var slope, start, end, accumulator, temp;
	var yDiff = Math.abs(yEnd - yStart);
	var xDiff = Math.abs(xEnd - xStart);
	if (xDiff > yDiff) {
		slope = (yEnd - yStart) / (xEnd - xStart);
		if (xStart < xEnd) {
			start = xStart;
			accumulator = yStart;
			end = xEnd;
		} else {
			start = xEnd;
			accumulator = yEnd;
			end = xStart;
		}
	} else {
		slope = (xEnd - xStart) / (yEnd - yStart);
		if (yStart < yEnd) {
			start = yStart;
			accumulator = xStart;
			end = yEnd;
		} else {
			start = yEnd;
			accumulator = xEnd;
			end = yStart;
		}
	}
	if (start > end) {
		temp = start;
		start = end;
		end = start;
	}
	for (var i = start; i <= end; i ++)
	{
		temp = Math.round(accumulator);
		if (isInBounds(temp, i)) {
			if (xDiff > yDiff && (frame[temp][i] == mask || mask < 0)) {
				frame[temp][i] = tile;
			} else if (frame[i][temp] == mask || mask < 0) {
				frame[i][temp] = tile;
			}
		}
		accumulator += slope;
	}
}

//A recursive function that creates a line of sub-lines, with each slice going a random direction 
//based on "deviation" factor.
function randLine(frame, tile, xStart, yStart, xEnd, yEnd, splits, deviation, mask) {
	if (splits < 1) {
		line(frame, tile, xStart, yStart, xEnd, yEnd, mask);
	} else {
		var midY = Math.round((Math.abs(yEnd - yStart) / 2) + yStart + ((Math.random() - 0.5) * deviation));
		var midX = Math.round((Math.abs(xEnd - xStart) / 2) + xStart + ((Math.random() - 0.5) * deviation));
		randLine(frame, tile, xStart, yStart, midX, midY, splits - 1, deviation, mask);
		randLine(frame, tile, midX, midY, xEnd, yEnd, splits - 1, deviation, mask);
	}
}

//Creates a tile at a random point on the grid.
function randPoint(frame, tile, iter, mask) {
	var arr = [];
	var y, x;
	if (mask < 0) {
		for (var i = 0; i < iter; i++) {
			y = Math.floor(Math.random() * frame.length);
			x = Math.floor(Math.random() * frame.length);
			frame[y][x] = tile;
		}
	} else {
		for (let y = 0; y < frame.length; y ++)
		{
			for(let x = 0; x < frame.length; x++)
			{
				if (frame[y][x] == mask) {
					arr.push([y, x]);
				}
			}
		}
		if (arr.length > 0) {
			for (var i = 0; i < iter; i++) {
				var candidate = Math.floor(Math.random() * arr.length);
				y = arr[candidate][0];
				x = arr[candidate][1];
				frame[y][x] = tile;
			}
		}
	}
}

//Draws a circle of tiles with a specified size at (centerX, centerY) on the grid.
function circle(frame, tile, radius, centerX, centerY, mask) {
	var x, y, d, yDiff, threshold, radiusSq;
	radius = (radius * 2) + 1;
	radiusSq = (radius * radius) / 4;
	for (y = 0; y < frame.length; y ++)
	{
		yDiff = y - centerY;
		threshold = radiusSq - (yDiff * yDiff);
		for(x = 0; x < frame.length; x++)
		{
			d = x - centerX;
			if (frame[y][x] == mask || mask < 0) {
				frame[y][x] = ((d * d) > threshold) ? frame[y][x] : tile;
			}
		}
	}
}

//Draws a box with specified position, length, and width on the grid.
function box(frame, tile, height, width, centerX, centerY, mask) {
	var x, y;
	for (y = (centerY - Math.floor(height/2)); y < Math.min(centerY + Math.ceil(height/2), frame.length); y ++)
	{
		for (x = (centerX - Math.floor(width/2)); x < Math.min(centerX + Math.ceil(width/2), frame.length); x ++)
		{
			if (frame[y][x] == mask || mask < 0) {
				frame[y][x] = tile;
			}
		}
	}
}

function init(frame, tile) {
	fill(frame, "void", 1.0, -1);
	fill(frame, "star", 0.03, -1);
	fill(frame, "galaxy", 0.01, -1);
	frame[Math.floor(frame.length/2)][Math.floor(frame.length/2)] = "world";
}

function world(frame, tile) {
	var center = Math.floor(frame.length/2);
	fill(frame, "void", 1.0, -1);
	fill(frame, "star", 0.05, -1);
	circle(frame, "ocean", 3, center, center, -1);
	line(frame, "arctic", center - 3, center - 3, center + 3, center - 3, "ocean");
	line(frame, "arctic", center - 3, center + 3, center + 3, center + 3, "ocean");
	fuzz(frame, "arctic", "arctic", 0.1, 1, "ocean");
	fill(frame, "land", 0.2, "ocean");
	fuzz(frame, "land", "land", 0.3, 2, "ocean");
	line(frame, "desert", center - 3, center, center + 3, center, "land");
	if (Math.random() > 0.4) {
		randPoint(empty[1], "comet", 1, -1);
		NPCify(empty[1], "comet", "left", 1, -2, -1);
	}
}

function galaxy(frame, tile) {
	fill(frame, "void", 1.0, -1);
	line(frame, "star", 0, Math.floor(Math.random() * 8 + 4), 
	(frame.length - 1), Math.floor(Math.random() * 8 + 4), -1);
	fuzz(frame, "star", "star", 0.9, 2, -1);
	fill(frame, "world", 0.05, "star");
	fill(frame, "saturn", 0.05, "star");
	fill(frame, "star", 0.05, -1);
	randPoint(empty[1], "comet", Math.random() * 10, -1);
	NPCify(empty[1], "comet", "moveXY", 1, -2, -1);
}

function star(frame, tile) {
	fill(frame, "void", 1.0, -1);
	var center = Math.floor(frame.length/2);
	circle(frame, "flame", 5, center, center, -1);
	fill(frame, "spark", 0.5, "flame");
	fuzz(frame, "flame", "flame", 0.05, 2, -1);
}

function saturn(frame, tile) {
	var center = Math.floor(frame.length/2);
	fill(frame, "void", 1.0, -1);
	circle(frame, "smoke", 4, center, center, -1);
	fuzz(frame, "ring", "smoke", 1.0, 1, "void");
	fuzz(frame, "ring", "ring", 1.0, 1, "void");
	fuzz(frame, "void", "smoke", 1.0, 1, -1);
	fill(frame, "star", 0.05, "void");
}

function ocean(frame, tile) {
	fill(frame, "oceanwater", 1.0, -1);
	var y1 = Math.floor((Math.random() - 0.5) * frame.length);
	var y2 = Math.floor((Math.random() - 0.5) * frame.length);
	var frequency = Math.ceil(Math.random() * 5);
	for (var i = 0; i < Math.random() * 5; i++) {
		if (Math.random() > 0.5) {
			randPoint(frame, "island", 1, -1);
		}
		fuzz(frame, "island", "island", 0.25, 1, -1);
	}
	for (var i = 0; i < Math.floor(Math.random() * 3); i++) {
		if (Math.random() > 0.5) {
			randPoint(frame, "rockisland", 1, -1);
		}
		fuzz(frame, "rockisland", "rockisland", 0.2, 1, -1);
	}
	for (var i = 0; i < 5; i++) {
		randLine(empty[1], "oceanwave", 0, y1 + (i * frequency), frame.length, y2 + (i * frequency), 1, 1, -1, "oceanwater");
		NPCifyAndMask(empty[1], frame, "oceanwater", "oceanwave", "paceXY", 0.25, 1, 0, 10);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "dolphin", 1, "oceanwater");
		NPCify(empty[1], "dolphin", "wander", 0.5);
	}
	if (Math.random() > 0.95) {
		randPoint(empty[1], "whale", 1, "oceanwater");
		NPCify(empty[1], "whale", "wander", 0.25);
	}
}

function underwater(frame, tile) {
	fill(frame, "sand", 1.0, -1);
	randPoint(frame, "bubbles", Math.random() * 20, -1);
	randPoint(frame, "igneous", Math.random() * 5, -1);
	if (Math.random() > 0.5) {
		fuzz(frame, "igneous", "igneous", 0.5, 1);
	}
	randPoint(frame, "igneous", Math.random() * 5, -1);
	randPoint(frame, "oyster", Math.floor(Math.random() * 5), -1);
	if (Math.random() > 0.5) {
		randLine(frame, "coral", 0, Math.floor(gridSystem.length * Math.random()), gridSystem.length, Math.floor(gridSystem.length * Math.random()), 2, 3, -1);
		fuzz(frame, "coral", "coral", 0.5, 1, -1);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "fish", -1);
		fuzz(empty[1], "fish", "fish", 0.5, Math.ceil(Math.random() * 2), -1);
		NPCify(empty[1], "fish", "wander", 0.25, 0, Math.floor((Math.random() - 0.5) * 2));
	}
	if (Math.random() > 0.8) {
		randPoint(empty[1], "shrimp", 1, -1);
		fuzz(empty[1], "shrimp", "shrimp", 0.75, Math.ceil(Math.random() * 2), -1);
		NPCify(empty[1], "shrimp", "wander", 1, 0, Math.floor((Math.random() - 0.5) * 2));
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "shark", 1, -1);
		NPCify(empty[1], "shark", "wander", 2);
	}
	if (Math.random() > 0.8) {
		randPoint(empty[1], "squid", 1, -1);
		NPCify(empty[1], "squid", "wander", 1);
	}
	if (Math.random() > 0.6) {
		randPoint(empty[1], "octopus", 1, -1);
		NPCify(empty[1], "octopus", "right", 0.25);
	}
	if (Math.random() > 0.95) {
		randPoint(empty[1], "blowfish", 1, -1);
		NPCify(empty[1], "blowfish", "paceXY", 1, -1, 2, 4);
	}
	if (Math.random() > 0.9) {
		randPoint(frame, "whalefall", 1, -1);
		fuzz(frame, "crab", "whalefall", 0.25, 1, -1);
		fuzz(frame, "lobster", "whalefall", 0.25, 1, -1);
	}
}

function rockisland(frame, tile) {
	fill(frame, "oceanwater", 1.0, -1);
	var center = Math.floor(frame.length / 2);
	for (let i = 0; i < (Math.random() * 5) + 1; i++) {
		if (Math.random() > 0.5) {
			var x = Math.floor(center + (Math.random() - 0.5) * 10);
			var y = Math.floor(center + (Math.random() - 0.5) * 10);
			var rad = Math.floor((Math.random() * 6) + 1);
			circle(frame, "igneous", rad, x, y, -1);
		}
	}
	fuzz(frame, "igneous", "igneous", 0.25, 1, -1);
	fuzz(frame, "sand", "igneous", 1.0, 1, -1);
	randPoint(frame, "oceanwave", (Math.random() * 25), "oceanwater");
	randPoint(empty[1], "crab", (Math.random() * 25), -1);
	NPCifyAndMask(empty[1], frame, "igneous", "crab", "wander", 0.5);
}

function island(frame, tile) {
	fill(frame, "oceanwater", 1.0, -1);
	var center = Math.floor(frame.length / 2);
	for (let i = 0; i < (Math.random() * 5) + 1; i++) {
		if (Math.random() > 0.5) {
			var x = Math.floor(center + (Math.random() - 0.5) * 10);
			var y = Math.floor(center + (Math.random() - 0.5) * 10);
			var rad = Math.floor((Math.random() * 4) + 1);
			circle(frame, "palm", rad, x, y, -1);
		}
	}
	fuzz(frame, "palm", "palm", 0.25, 1, -1);
	fuzz(frame, "sand", "palm", 1.0, 3, -1);
	randPoint(frame, "mango", (Math.random() * 10), "palm");
	randPoint(frame, "coconut", (Math.random() * 15), "sand");
	randPoint(frame, "shell", Math.floor((Math.random() * 5)), "sand");
	randPoint(frame, "oceanwave", (Math.random() * 25), "oceanwater");
	randPoint(empty[1], "tropicalfish", (Math.random() * 25), -1);
	NPCifyAndMask(empty[1], frame, "oceanwater", "tropicalfish", "wander", 0.5);
	//frame[0][0] = "sun";
}

function desert(frame, tile) {
	fill(frame, "desertsand", 1.0, -1);
	if (Math.random() > 0.7) {
		randPoint(frame, "falloutzone", Math.floor(Math.random() * 3), -1);
		fuzz(frame, "falloutzone", "falloutzone", 1.0, Math.floor(Math.random() * 3), -1);
		fuzz(frame, "falloutzone", "falloutzone", 0.1, 1, -1);
	}
	if (Math.random() > 0.4) {
		randPoint(frame, "savannah", 1, -1);
		fuzz(frame, "savannah", "savannah", 1.0, Math.floor(Math.random() * 4), -1);
		fuzz(frame, "savannah", "savannah", 0.1, 1, -1);
	}
	if (Math.random() > 0.0) {
		randPoint(frame, "temple", 1, -1);
	}
	if (Math.random() > 0.5) {
		var x1 = Math.floor(Math.random() * frame.length);
		var x2 = Math.floor(Math.random() * frame.length);
		randLine(frame, "snowymountain", x1, 0, x2, frame.length, 2, 3, -1);
		fuzz(frame, "mountain", "snowymountain", 0.75, 1, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(frame, "oasiswater", 1, "desertsand")
		fuzz(frame, "oasiswater", "oasiswater", 0.25, 1, -1);
		fuzz(frame, "oasis", "oasiswater", 0.75, 1, -1);
	}
}

function desertzoom(frame, tile) {
	fill(frame, "sand", 1.0, -1);
	if (Math.random() > 0.5) {
		randPoint(empty[1], "snake", 1, -1);
		NPCifyAndMask(empty[1], frame, "sand", "snake", "wander", 0.25, 1);
	}
	if (Math.random() > 0.9) {
		randPoint(empty[1], "beetle", 1, -1);
		NPCify(empty[1], "beetle", "paceXY", 0.25, 0, 1, 5);
	}
	if (Math.random() > 0.8) {
		randPoint(empty[1], "lizard", 1, -1);
		NPCify(empty[1], "lizard", "wander", 0.25, 1, 0, 5);
	}
	if (Math.random() > 0.2) {
		randPoint(empty[1], "camel", 1, -1);
		fuzz(empty[1], "camel", "camel", 0.5, 1, -1);
		NPCifyAndMask(empty[1], frame, "sand", "camel", "wander", 0.5, 1);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "scorpion", 1, -1);
		NPCifyAndMask(empty[1], frame, "sand", "scorpion", "wander", 2);
	}
	if (tile == "temple") {
		randPoint(frame, "temple2", 1, -1);
		for (var i = 0; i < Math.random() * 4; i += 2) {
			fuzz(frame, "temple1", "temple2", 1.0, 1, "sand");
			fuzz(frame, "temple2", "temple1", 1.0, 1, "sand");
		}
		randPoint(frame, "templedoor", 1, "temple1");
	}
	if (tile == "oasiswater" || tile == "oasis") {
		if (Math.random() > 0.5) {
			oasis(frame, tile);
		} else {
			var center = Math.floor(gridSystem.length / 2);
			frame[center][center] = "mirage";
		}
	} else {
		randPoint(frame, "cactus", Math.random() * 10, "sand");
	}
	if (Math.random() > 0.8) {
		randPoint(frame, "hut", 1, "sand")
	}
	if (Math.random() > 0.8) {
		randPoint(frame, "anthill", 1, "sand");
		fuzz(frame, "ant", "anthill", 0.5, 1, "sand");
	}
}

function savannah(frame, tile) {
	fill(frame, "desertgrass1", 1.0, -1);
	fill(frame, "desertgrass2", 0.5, -1);
	randPoint(frame, "deserttree", Math.random() * 10, -1);
	if (Math.random() > 0.7) {
		randPoint(empty[1], "elephant", 1, -1);
		NPCify(empty[1], "elephant", "wander", 0.25);
	}
	if (Math.random() > 0.6) {
		randPoint(empty[1], "giraffe", 1, -1);
		NPCify(empty[1], "giraffe", "wander", 0.25);
	}
	if (Math.random() > 0.8) {
		randPoint(empty[1], "rhino", 1, -1);
		NPCify(empty[1], "rhino", "wander", 0.25);
	}
	if (Math.random() > 0.5) {
		var x = Math.floor(Math.random() * frame.length);
		var y = Math.floor(Math.random() * frame.length);
		empty[1][y][x] = "gazelle";
		fuzz(empty[1], "gazelle", "gazelle", 1.0, -1);
		NPCify(empty[1], "gazelle", "wander", 2, -1);
		randPoint(empty[1], "leopard", 1, -1);
		NPCify(empty[1], "leopard", "chaseXY", 2, x - 5, y, 1);
	}
}

function oasis(frame, tile) {
	fill(frame, "sand", 1, -1);
	var center = Math.floor(frame.length / 2);
	for (let i = 0; i < 2; i++) {
		var x = Math.floor(center + (Math.random() - 0.5) * 6);
		var y = Math.floor(center + (Math.random() - 0.5) * 6);
		var rad = Math.floor((Math.random() * 4) + 1);
		circle(frame, "oasiswater2", rad, x, y, -1);
	}
	fuzz(frame, "oasiswater2", "oasiswater2", 0.75, 2, -1);
	fuzz(frame, "palm", "oasiswater2", 0.75, 1, -1);
	fuzz(frame, "papyrus", "palm", 0.25, 1, -1);
	if (Math.random() > 0.5) {
		randPoint(frame, "hippo", 1, "oasiswater2");
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "crocodile", Math.floor(Math.random() * 6), -1);
		NPCifyAndMask(empty[1], frame, "oasiswater2", "crocodile", "wander", 0.25);
	}
}

function falloutzone(frame, tile) {
	fill(frame, "fallout", 1.0, -1);
	fill(frame, "metamorphic", 0.2, -1);
	fill(empty[1], "radiation", 0.1, -1);
	NPCify(empty[1], "radiation", "wander", 3);
	var x = Math.ceil(Math.random() * 7 + 5);
	var variation = Math.ceil((Math.random() - 0.5) * 10) + x; 
	line(frame, "falloutwall", x, 0, variation, gridSystem.length, -1);
	NPCify(empty[1], "scorpion", "left", 1);
}

function mountain(frame, tile) {
	fill(frame, "igneous", 1.0, -1);
	fill(frame, "sedimentary", 0.33, -1);
	fill(frame, "metamorphic", 0.33, -1);
	fill(frame, "shrub", 0.05, -1);
	var len = frame.length;
	if (Math.random() > 0.5) {
		var start = Math.floor(Math.random() * len);
		var end = Math.floor(Math.random() * len);
		randLine(frame, "stream", 0, start, len, end, 2, 3, -1);
	} else {
		if (Math.random() > 0.5) {
			var startx = Math.floor(Math.random() * len);
			var starty = Math.floor(Math.random() * len);
			randLine(frame, "stream", startx, starty, len, starty + Math.floor((Math.random() - 0.5) * 5), 2, 3, -1);
			circle(frame, "lake", Math.random() * 5, startx, starty, -1);
		}
	}
	randPoint(empty[1], "mouse", Math.floor(Math.random() * 3), -1);
	NPCify(empty[1], "mouse", "wander", 0.25);
	if (Math.random() > 0.5) {
		randPoint(empty[1], "eagle", 1, -1);
		NPCify(empty[1], "eagle", "paceXY", 2, -1, 1, 5);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "ibex", 1, -1);
		fuzz(empty[1], "ibex", "ibex", 0.5, 1, -1);
		NPCify(empty[1], "ibex", "wander", 0.5);
	}
}

function underground(frame, tile) {
	fill(frame, "dirt", 1.0, -1);
	fill(frame, "sedimentary", 0.2, -1);
	randPoint(empty[1], "worm", Math.random() * 5, -1);
	if (tile == "lake") {
		var center = Math.floor(frame.length / 2);
		circle(frame, "freshwater", Math.random() * 7, center, center, -1);
		randPoint(empty[1], "fish", Math.random() * 8, -1);
		NPCifyAndMask(empty[1], frame, "freshwater", "fish", "wander", 0.5);
	}
	NPCifyAndMask(empty[1], frame, "dirt", "worm", "wander", 0.25);
}

function snowymountain(frame, tile) {
	fill(frame, "snow", 1.0, -1);
	fill(frame, "sedimentary", 0.2, -1);
	fill(frame, "pine", 0.1, -1);
	randPoint(frame, "snowman", Math.random() * 8, "snow");
	if (Math.random() > 0.5) {
		randPoint(frame, "hut", 1, -1);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "eagle", 1, -1);
		NPCify(empty[1], "eagle", "paceXY", 2, -1, 1, 5);
	}
}

function hut(frame, tile) {
	fill(frame, "void", 1, -1);
	var center = Math.floor(frame.length / 2);
	circle(frame, "floor", 4, center, center, -1);
	circle(frame, "wood", 1, center, center, -1);
	circle(frame, "fire", 0, center, center, -1);
	circle(frame, "door", 0, center, center + 5, -1);
	randPoint(frame, "chair", 1, "floor");
	fill(frame, "amphora", 0.05, "floor");
	fuzz(frame, "wall", "floor", 1.0, 1, "void");
}

function arctic(frame, tile) {
	fill(frame, "ice", 1, -1);
	if (Math.random() > 0.5) {
		randPoint(frame, "tundra", 1, -1);
		fuzz(frame, "tundra", "tundra", 1.0, Math.floor(Math.random() * 4), -1);
		fuzz(frame, "tundra", "tundra", 0.1, 1, -1);
	}
}
/*end generation functions*/

//EventListeners

//Begins the simulation
function beginGame(e) {
	document.getElementById('title').remove();
	paused = false;
	hover(e);
}

document.getElementById("Go").addEventListener("click", beginGame);

function historyBack(e) {
	if (gridSystem.historyPosition != 0) {
		gridSystem.NPChistory[gridSystem.historyPosition] = gridSystem.npcLayer;
		gridSystem.historyPosition--;
		gridSystem.npcLayer = gridSystem.NPChistory[gridSystem.historyPosition];
		gridSystem.render(gridSystem.history[gridSystem.historyPosition], tick);
		if (gridSystem.historyPosition == 0) {
			document.getElementById("back").style.opacity = "50%";
		}
		document.getElementById("fwd").style.opacity = "100%";
	}
}

function historyFwd(e) {
	if (gridSystem.historyPosition != (gridSystem.history.length - 1)) {
		gridSystem.historyPosition++;
		gridSystem.npcLayer = gridSystem.NPChistory[gridSystem.historyPosition];
		gridSystem.render(gridSystem.history[gridSystem.historyPosition], tick);
		if (gridSystem.historyPosition == gridSystem.history.length - 1) {
			document.getElementById("fwd").style.opacity = "50%";
		}
		document.getElementById("back").style.opacity = "100%";
	}
}

document.getElementById("back").addEventListener("click", historyBack);
document.getElementById("fwd").addEventListener("click", historyFwd);

function pause(e) {
	var p = document.getElementById("pause");
	if (paused == false) {
		paused = true
		p.innerHTML = "[Play]";
	} 	else {
		paused = false
		p.innerHTML = "[Pause]";
	}
}

document.getElementById("pause").addEventListener("click", pause);
//document.getElementById("pause").addEventListener("keyup", pause); ???????

//Main game script
const empty = [[
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
],
[
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
]];
const gridSystem = new GridSystem();
init(empty[0]);
var tick = 0;
var paused = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
	var elt;
	var icons = ["🚡", "🕕", "🇷🇸", "🉑", "📂","🌧️", "👽", "🍋", "🤒", "🤡", "🍫", "🦋", "💐", "🤸", "🕳️", "🗯", "💭", "💣", "💥", "💫", "🤣", "😇", "😵‍💫", "❤️", "👩‍🚀", "🌕", "🎭", "👾", "🍳", "🏵️", "🍧", "🔗", "🕋",]
	var loadingTick = 0;
	var parent = document.getElementsByClassName("titlepage")[0];

	gridSystem.render(empty, 0);
	gridSystem.history.push(JSON.parse(JSON.stringify(gridSystem.matrix)));
	gridSystem.NPChistory.push([]);
	while(true) {
		if(parent) {
			c = document.createElement("canvas");
			c.id = "emoji" + loadingTick % 40;
			c.className += "emojiParticle";
			var speed = Math.random() * 5 + 2;
			c.style.transition = "top " + speed + "s linear, opacity " + speed + "s";
			c.style.top = window.innerHeight + "px"
			c.style.left = (Math.random() * window.innerWidth) + "px";
			parent.appendChild(c);    
			var ctx = c.getContext("2d");
			ctx.font = (Math.random() * 50 + 50 - (speed * 4)) + "px serif";
			ctx.fillText(icons[Math.floor(Math.random() * icons.length)], 0, 100);
			c.style.top = "-20%";
			c.style.opacity = "0";
			loadingTick++;
			elt = document.getElementById("emoji" + (loadingTick % 40));
			if (elt) {
				elt.remove();
			}
		}
		await sleep(300);
		if (!paused) {
			tick++;
			gridSystem.updateNPCS();
			gridSystem.render(gridSystem.matrix, tick);
		}
	}
}

loop();