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
		this.cellSize = 30;
		this.length = 15;
		this.padding = 6;
		this.highlight = [0,0];
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
			//space stuff
			["star", new Tile(["⭐", "🌟"], true, "A twinkling star.", star)],
			["spark", new Tile(["🎇", "❤️‍🔥"], true, "Burning plasma.", atom)],
			["flame", new Tile(["🔥"], true, "Burning plasma.", atom)],
			["galaxy", new Tile(["🌌"], true, "A distant galaxy.", galaxy)],
			["comet", new Tile(["☄️"], false, "A flaming comet.")],
			["saturn", new Tile(["🪐"], true, "A gaseous planet.", saturn)],
			["smoke", new Tile(["🌫️", "☁️"], true, "A dense layer of clouds.", gasplanet)],
			["storm", new Tile(["🌀"], true, "A swirling storm.", atom)],
			["lightning", new Tile(["🌀", "⚡"], true, "An electromagnetic burst.", atom)],
			["clouds", new Tile(["🌫️", "☁️"], true, "Clouds.", atom)],
			["ring", new Tile(["💎", "✨"], false, "A ring of fine dust.")],
			["void", new Tile(["⬛"], false, "An empty void.")],
			["voidwall", new Tile(["⬛"], false, "An empty void.", {}, 1)],
			["world", new Tile(["🌏", "🌎", "🌍"], true, "An empty planet.", world)],

			//ocean biome
			["ocean", new Tile(["🌊"], true, "A section of ocean.", ocean)],
			["oceanwave", new Tile(["🌊"], true, "A great wave.", underwater)],
			["oceanwater", new Tile(["🟦"], true, "Salt water.", underwater)],
			["sand", new Tile(["🏷️"], true, "Fine sand.", atom)],
			["bubbles", new Tile(["🫧", "🏷️"], false, "Underwater bubbles.")],
			["island", new Tile(["🏝️"], true, "A tiny tropical island.", island, 1)],
			["palm", new Tile(["🌴"], true, "A palm tree.", plantbody, 1)],
			["mango", new Tile(["🥭"], true, "A fallen mango.", plantbody, 1)],
			["coconut", new Tile(["🥥"], false, "A fallen coconut.", plantbody, 1)],
			["shell", new Tile(["🐚"], false, "A washed-up shell.", animalbody, 1)],
			["rockisland", new Tile(["🪨"], true, "A rocky, barren island.", rockisland, 1)],

			//deciduous biome
			["land", new Tile(["🥬"], true, "A fertile continent.", land)],
			["forest", new Tile(["🌳"], true, "A deciduous forest.", forest)],
			["tree", new Tile(["🌳"], true, "A deciduous tree.", plantbody, 1)],
			["plain", new Tile(["🟩"], true, "A grassy plain.", plain)],
			["river", new Tile(["🟦"], true, "A river.", river)],
			["freshlake", new Tile(["🟦"], true, "A large freshwater lake.", lake)],
			["city", new Tile(["🏙️"], true, "An empty city.", city)],
			["road", new Tile(["⬛"], false, "A road.")],
			["park", new Tile(["🌳"], true, "A park.", park)],
			["graveyard", new Tile(["🪦"], true, "A cemetary.", park)],
			["gravestone", new Tile(["🪦"], false, "A headstone.")],
			["leaves", new Tile(["🍂"], true, "Fallen leaves.", plantbody)],
			["bouquet", new Tile(["💐"], true, "A bouquet of flowers.", plantbody)],
			["ghost", new Tile(["👻"], false, "A phantasm.")],

			["house", new Tile(["🏚️"], true, "An empty house.", building)],
			["laboratory", new Tile(["🏫"], true, "A strange laboratory.", building)],
			["note", new Tile(["📃"], false, "A note. Some kind of grave apology is written here.")],
			["note2", new Tile(["📃"], false, "Hieroglyphs. They speak loftily of some kind of higher symbolic world.")],
			["alembic", new Tile(["⚗️"], true, "An alembic.", microbe)],
			["petri", new Tile(["🧫"], true, "A petri dish.", microbe)],
			["beaker", new Tile(["🧪"], true, "A test tube.", atom)],
			["skyscraper", new Tile(["🏢"], true, "A skyscraper.", building)],
			["stairs", new Tile(["📶"], true, "Stairs leading up and down.", building)],
			["rooftop", new Tile(["⬛"], false, "A skyscraper roof.")],
			["antenna", new Tile(["📡"], false, "A satellite antenna.")],
			["cubicle", new Tile(["📦"], false, "A cubicle.")],
			["school", new Tile(["🏫"], true, "A school.", building)],
			["bank", new Tile(["🏦"], true, "A bank.", building)],
			["lock", new Tile(["🔒"], false, "A locked vault door.")],
			["moneybag", new Tile(["💰"], false, "A bag of money.")],
			["coin", new Tile(["🪙"], false, "A coin.")],
			["creditcard", new Tile(["💳"], false, "A credit cart.")],
			["diamond", new Tile(["💎", "✨"], true, "A shining gem.", atom)],
			["euro", new Tile(["💶"], false, "A banknote.")],
			["factory", new Tile(["🏭"], true, "A factory.", building)],
			["machine", new Tile(["📠"], false, "A strange machine.")],
			["wrench", new Tile(["🔧"], false, "A wrench.")],
			["toolbox", new Tile(["🧰"], false, "A toolbox.")],
			["gear", new Tile(["⚙️"], false, "Metal scraps.")],
			["oilbarrel", new Tile(["🛢️"], true, "A drum of oil.", oil)],
			["oil", new Tile(["⬛", "👁️"], true, "Dark oil.", atom)],
			["robot", new Tile(["🤖"], false, "A roaming machine.")],
			["conveyorbelt", new Tile(["🟰"], false, "A conveyor belt.")],
			["church", new Tile(["⛪"], true, "A place of worship.", building)],
			["candle", new Tile(["🕯️"], false, "A candle.")],
			["cross", new Tile(["✝️", "✡️", "☪️", "⛩️", "🕋", "☦️", "☸️", "🕎", "☯️", "🕉️", "🪯"], true, "A symbol of worship.", reset)],
			["hotel", new Tile(["🏩"], true, "A hotel.", building)],
			["castle", new Tile(["🏰"], true, "An ancient castle.", plain)],
			["courtyard", new Tile(["🌹"], true, "The castle courtyard.", plantbody)],
			["crown", new Tile(["👑"], false, "An ancient crown.")],
			["museum", new Tile(["🏛️"], true, "A museum.", building)],
			["statue1", new Tile(["🗽"], false, "A statue.")],
			["statue2", new Tile(["🗿"], false, "An ancient statue.")],
			["painting", new Tile(["🖼️"], true, "A painting.", plain)],

			["construction", new Tile(["🏗️"], false, "A building under construction.")],
			["apple", new Tile(["🍎"], true, "An apple.", plantbody)],
			["scarecrow", new Tile(["👨🏻‍🌾"], false, "A scarecrow.")],
			["sky", new Tile(["🟦"], false, "Open sky.")],
			["cloud", new Tile(["☁️"], true, "A cloud.", atom)],

			["wheatfield", new Tile(["🌾"], true, "A field of grain.", wheatfield)],
			["scarecrow", new Tile(["👨🏻‍🌾"], false, "A scarecrow.")],
			["wheat", new Tile(["🌾"], true, "A stalk of wheat.", plantbody)],
			["meadowgrass", new Tile(["🌿"], true, "Dry meadow grass.", plantbody)],
			["forestfloor", new Tile(["🍂"], true, "The forest floor.", plantbody)],
			["sapling", new Tile(["🌱"], true, "A burgeoning sapling.", plantbody)],
			["flower1", new Tile(["🥀"], true, "A wilting flowerbud.", plantbody)],
			["flower2", new Tile(["🌼"], true, "A blooming blossom.", plantbody)],
			["flower3", new Tile(["🌹"], true, "A rosebush.", plantbody)],
			["flower4", new Tile(["🌺"], true, "A hibuscus.", plantbody)],
			["hyacinth", new Tile(["🪻"], true, "A hyacinth.", plantbody)],
			["sunflower", new Tile(["🌻"], true, "A sunflower.", plantbody)],
			["tulip", new Tile(["🌷"], true, "A tulip.", plantbody)],
			["lotus", new Tile(["🪷"], true, "A lotus on a lily pad.", plantbody)],
			["lakewater", new Tile(["🟦"], true, "Fresh lake water.", underlake)],
			["riverwater", new Tile(["🟦"], true, "Fresh river water.", underground)],
			["driftwood", new Tile(["🪵"], true, "Some driftwood.", plantbody)],
			["algae", new Tile(["🌿"], true, "Green algae.", plantbody)],
			["leaf", new Tile(["🍃"], true, "A floating leaf.", plantbody)],
			["tunnel", new Tile(["⬛"], false, "A tunnel in the soil.")],
			["pipe", new Tile(["⬛"], false, "An underground pipe.")],
			["excrement", new Tile(["💩"], false, "Some kind of waste.")],
			["drain", new Tile(["🕳"], true, "A drain.", sewer)],
			["dam", new Tile(["🪵"], true, "A beaver dam.", plantbody)],

			//desert biome
			["desert", new Tile(["🌵"], true, "An arid continent.", desert)],
			["mountain", new Tile(["⛰️"], true, "A mountain range.", mountain, 1)],
			["volcano", new Tile(["🌋"], true, "An active volcano.", volcano, 1)],
			["stream", new Tile(["🟦", "🌊"], false, "A small stream.", {}, 2)],
			["lake", new Tile(["🟦"], true, "A clear lake.", underground, 2)],
			["dirt", new Tile(["🟫"], true, "Soil.", underground, 1)],
			["magma", new Tile(["🔥","🟥"], true, "Intensely hot magma.", magma, 1)],
			["demon", new Tile(["👺"], true, "Some kind of stange red creature.", animalbody, 1)],
			["devil", new Tile(["👿"], true, "Some kind of stange evil creature.", animalbody, 1)],
			["bones", new Tile(["🦴"], true, "Dried bones.", animalbody, 1)],
			["skull", new Tile(["☠️"], true, "Dried bones.", animalbody, 1)],
			["shrub", new Tile(["🌱"], true, "A small shrub.", plantbody)],
			["snowymountain", new Tile(["🏔️"], true, "A snowy peak.", snowymountain)],
			["pine", new Tile(["🌲"], true, "An evergreen.", plantbody, 1)],
			["snow", new Tile(["❄️"], true, "A snowdrift.", atom)],
			["snowman", new Tile(["⛄"], false, "A snowman. Its builder is unknown.")],
			["desertsand", new Tile(["🏷️"], true, "A dune in the desert.", desertzoom)],
			["oasis", new Tile(["🌴"], true, "A desert oasis.", desertzoom)],
			["savannah", new Tile(["🍂"], true, "A desert savannah.", savannah)],
			["desertgrass1", new Tile(["🍂"], true, "A dry plain.", plantbody)],
			["desertgrass2", new Tile(["🌿"], true, "A dry plain.", plantbody)],
			["deserttree", new Tile(["🌳"], true, "A sparse savannah tree.", plantbody, 1)],
			["oasiswater", new Tile(["🟦"], true, "A desert oasis.", desertzoom)],
			["oasiswater2", new Tile(["🟦"], true, "Water in an oasis.", underground)],
			["freshwater", new Tile(["🟦"], true, "Fresh water.", atom)],
			["mirage", new Tile(["🌫️"], false, "Shimmering air. A mirage.")],
			["papyrus", new Tile(["🌾"], true, "A papyrus plant.", plantbody)],
			["cactus", new Tile(["🌵"], true, "A cactus.", plantbody, 1)],
			["hut", new Tile(["🛖"], true, "An abandoned hut.", hut, 1)],
			["floor", new Tile(["⬜"], false, "Nondescript floor.")],
			["door", new Tile(["🚪"], false, "A wooden door.", {}, 1)],
			["chair", new Tile(["🪑"], false, "A wooden chair.")],
			["table", new Tile(["🟰"], false, "A table.")],
			["toilet", new Tile(["🚽"], true, "A toilet.", sewer)],
			["faucet", new Tile(["🚰"], true, "A sink.", sewer)],
			["desk", new Tile(["🟰"], false, "A schooldesk.")],
			["bed", new Tile(["🛏️"], false, "A bed.")],
			["fire", new Tile(["🔥", "❤️‍🔥"], true, "A small fire.", atom)],
			["wood", new Tile(["🪵"], true, "Some logs.", plantbody)],
			["amphora", new Tile(["🏺"], false, "An urn, used for storage.")],
			["temple", new Tile(["🛕"], true, "An ancient temple made of stone.", desertzoom, 1)],
			["temple1", new Tile(["🪨"], false, "An ancient temple made of stone.", {}, 1)],
			["temple2", new Tile(["🛕"], false, "An ancient temple made of stone.", {}, 1)],
			["templedoor", new Tile(["🕳️"], true, "The entrance to the temple.", temple, 1)],
			["anthill", new Tile(["🕳️"], true, "The entrance to an anthill.", anthill, 1)],

			//radiactive biome
			["falloutzone", new Tile(["⬛"], true, "An irradiated area.", falloutzone)],
			["falloutwall", new Tile(["🧱"], false, "A wall. The wall serves no apparent purpose.", {}, 1)],
			["wall", new Tile(["🧱"], false, "A wall.", {}, 1)],
			["window", new Tile(["🪟"], false, "A glass window.")],
			["radioactive", new Tile(["☢️"], true, "A radioactive ion.", atom)],
			["fallout", new Tile(["⬛"], true, "Irradiated earth.", underground)],
			["radiation", new Tile(["☢️"], true, "Irradiated air particles.", atom)],

			//arctic biome
			["arctic", new Tile(["🧊"], true, "An arctic continent.", arctic)],
			["iceberg", new Tile(["🧊"], false, "The underside of an iceberg.")],
			["ice", new Tile(["🧊"], true, "An ice shelf.", ice)],
			["arcticwater", new Tile(["🟦"], true, "Freezing water.", underwater)],
			["tundra", new Tile(["🟫"], true, "Arctic tundra.", tundra)],
			["moss", new Tile(["🥗"], true, "Tundra moss.", plantbody)],
			["tundraflower", new Tile(["🪻"], true, "A tundra flower.", plantbody)],
			
			//3 rock types
			["igneous", new Tile(["🪨"], true, "Igneous rock.", atom, 1)],
			["sedimentary", new Tile(["🪨"], true, "Sedimentary rock.", atom, 1)],
			["metamorphic", new Tile(["🪨"], true, "Metamorphic rock.", atom, 1)],

			//animals
			["leopard", new Tile(["🐆"], true, "A leopard.", animalbody)],
			["elephant", new Tile(["🐘"], true, "An elephant.", animalbody)],
			["rhino", new Tile(["🦏"], true, "A rhinoceros.", animalbody)],
			["giraffe", new Tile(["🦒"], true, "A tall giraffe.", animalbody)],
			["gazelle", new Tile(["🦌"], true, "A gazelle.", animalbody)],
			["camel", new Tile(["🐪"], true, "A camel, or maybe a dromedary.", animalbody)],
			["scorpion", new Tile(["🦂"], true, "A stinging scorpion.", animalbody)],
			["hippo", new Tile(["🦛"], true, "A hippopotamus.", animalbody)],
			["beetle", new Tile(["🪲"], true, "A tiny beetle.", animalbody)],
			["ant", new Tile(["🐜"], true, "An ant.", animalbody)],
			["queenant", new Tile(["👸"], true, "A queen ant.", animalbody)],
			["worm", new Tile(["🪱"], true, "An earthworm.", animalbody, 1)],
			["lizard", new Tile(["🦎"], true, "A cold-blooded lizard.", animalbody)],
			["snake", new Tile(["🐍"], true, "A slithering snake.", animalbody)],
			["crocodile", new Tile(["🐊"], true, "A crocodile.", animalbody)],
			["fish", new Tile(["🐟"], true, "A regular fish.", animalbody)],
			["salmon", new Tile(["🐟", "🟦"], true, "A salmon, swimming upstream.", animalbody)],
			["tropicalfish", new Tile(["🐠"], true, "An angelfish.", animalbody)],
			["blowfish", new Tile(["🐡"], true, "A spiny blowfish.", animalbody)],
			["shark", new Tile(["🦈"], true, "A shark.", animalbody)],
			["octopus", new Tile(["🐙"], true, "An 8-legged octopus.", animalbody)],
			["lobster", new Tile(["🦞"], true, "A lobster.", animalbody)],
			["shrimp", new Tile(["🦐"], true, "A shrimp.", animalbody)],
			["mouse", new Tile(["🐀"], true, "A small rodent.", animalbody, 1)],
			["rat", new Tile(["🐀"], true, "A large rat.", animalbody, 0)],
			["cockroach", new Tile(["🪳"], true, "A cockroach.", animalbody, 0)],
			["ibex", new Tile(["🦌"], true, "An ibex.", animalbody, 1)],
			["eagle", new Tile(["🦅"], true, "An eagle.", animalbody, 2)],
			["squid", new Tile(["🦑"], true, "A squid.", animalbody)],
			["oyster", new Tile(["🦪"], true, "An oyster.", animalbody)],
			["crab", new Tile(["🦀"], true, "A crab, a small crustacean.", animalbody, 1)],
			["dolphin", new Tile(["🐬"], true, "A dolphin, an aquatic mammal.", animalbody)],
			["whale", new Tile(["🐋"], true, "A blue whale, the largest mammal.", animalbody)],
			["coral", new Tile(["🪸"], true, "Coral. Part of a coral reef.", animalbody)],
			["whalefall", new Tile(["🐋"], true, "The corpse of a whale.", animalbody)],
			["deer", new Tile(["🦌"], true, "A white-tailed deer.", animalbody)],
			["rabbit", new Tile(["🐇"], true, "A rabbit.", animalbody)],
			["bison", new Tile(["🦬"], true, "A large bison.", animalbody)],
			["fox", new Tile(["🦊"], true, "A quick fox.", animalbody)],
			["wolf", new Tile(["🐺"], true, "A wolf.", animalbody)],
			["turkey", new Tile(["🦃"], true, "A wild turkey.", animalbody)],
			["turtle", new Tile(["🐢"], true, "A land tortoise.", animalbody)],
			["duck", new Tile(["🦆"], true, "A duck.", animalbody)],
			["goose", new Tile(["🪿"], true, "A white goose.", animalbody)],
			["beaver", new Tile(["🦫"], true, "A beaver.", animalbody)],
			["cormorant", new Tile(["🐦‍⬛"], true, "A cormorant.", animalbody)],
			["penguin", new Tile(["🐧"], true, "A penguin.", animalbody)],
			["polarbear", new Tile(["🐻‍❄️"], true, "A polar bear.", animalbody)],
			["pigeon", new Tile(["🕊️"], true, "A pigeon.", animalbody)],
			["chipmunk", new Tile(["🐿️"], true, "A scampering chipmunk.", animalbody)],

			//sub-visible things
			["interstitialFluid", new Tile(["🌀"], false, "Interstitial fluid, the fluid between cells.")],
			["cell", new Tile(["🧬"], true, "A microscopic cell.", cell)],
			["bacteria", new Tile(["🦠"], true, "A microscopic bacterium.", cell)],
			["virus", new Tile(["🤖"], false, "A microscopic virus.")],
			["dna", new Tile(["🧬"], true, "A clump of DNA.", atom)],

			["mitochondria", new Tile(["🦠"], true, "A mitochondrium.", atom)],
			["string", new Tile(["〰️"], true, "A one-dimensional string.", reset)],
			["atom", new Tile(["⚛️"], true, "An atom.", subatomic)],
			["atominside", new Tile(["🤍"], true, "The inside of an atom.", strings)],
			["radioactiveatom", new Tile(["☢️"], true, "A radioactive particle.", subatomic)],
			["proton", new Tile(["🍎"], true, "A cluster of protons and neutrons.", strings)],
			["electron", new Tile(["🎾"], true, "An electron.", strings)],
			["symbol", new Tile(["🤍", "✨", "🚡", "🕕", "🇷🇸", "🉑", "📂","🌧️", "👽", "🍋", "🤒", "🤡", "🍫", "🦋", "💐", "🤸", "🕳️", "🗯", "💭", "💣", "💥", "💫", "🤣", "😇", "😵‍💫", "❤️", "👩‍🚀", "🌕", "🎭", "👾", "🍳", "🏵️", "🍧", "🔗", "🕋"], true, "A pure symbol.", multiverse)],
			["universe", new Tile(["🌌"], true, "A universe.", init)],
			["nothing", new Tile(["💟"], false, "The space between universes.")],
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
		let offset = (this.cellSize + this.padding);

		this.matrix = matrix;
		this.ctx.canvas.width = this.w;
		this.ctx.canvas.height = this.h;
		var anim, frame, level;
		for (let row = 0; row < this.length; row ++) {
			for (let col = 0; col < this.length; col ++) {
				level = matrix.length - 1;
				this.ctx.font = this.cellSize + "px serif";

				while (matrix[level][row][col] == "" && level > 0) {
					level--;
				}

				anim = this.dictionary.get(matrix[level][row][col]).icon;
				frame = anim[(tick + ((row ^ 3) * (col ^ 3))) % anim.length];
				
                this.ctx.fillText(frame, 
				col * offset, row * offset + (this.cellSize - this.padding + 2), //why these magic numbers are required i have no idea ':(((
				offset);
			}
		}
		this.ctx.strokeStyle = "white";
		this.ctx.strokeRect(this.highlight[0] * offset, this.highlight[1] * offset, this.cellSize, this.cellSize);
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

function updateHighlight(e) {
	gridSystem.highlight[0] = getClickX(e);
	gridSystem.highlight[1] = getClickY(e);
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
	infoPane.style.top = e.clientY + 20 + "px";
	infoPane.style.left = e.clientX + 20 + "px";
	if (e.clientY + infoPane.getBoundingClientRect().height + 20 > window.innerHeight) {
		infoPane.style.transform = "translate(0%,-100%)";
	} else if (e.clientX + infoPane.getBoundingClientRect().width + 20 > window.innerWidth) {
		infoPane.style.transform = "translate(-100%,0%)";
	} else {
		infoPane.style.transform = "translate(0%,0%)";
	}
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

	updateHighlight(e);
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
		hover(e);
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

function spiral(frame, tile, width, centerX, centerY, mask) {
	for (var i = 0; i < width; i++) {
		if (i == width - 1) {
			temp = i - 2;
		} else {
			temp = i;
		}
		if (i % 4 == 0) {
			line(frame, tile, centerX, centerY, centerX+temp, centerY, mask);
			centerX += i;
		} else if (i % 4 == 1) {
			line(frame, tile, centerX, centerY, centerX, centerY+temp, mask);
			centerY += i;
		} else if (i % 4 == 2) {
			line(frame, tile, centerX, centerY, centerX-temp, centerY, mask);
			centerX -= i;
		} else {
			line(frame, tile, centerX, centerY, centerX, centerY-temp, mask);
			centerY -= i;
		}
				
	}
}

//Draws a grid of items with the size between items variated by spacing.
function drawGrid(frame, tile, spacing, mask, connected) {
	for (let i = 0; i < frame.length; i++) {
		for (let j = 0; j < frame[0].length; j++) {
			if (connected) {
				if (j % spacing == 0 || i % spacing == 0) {
					if (frame[i][j] == mask || mask < 0) {
						frame[i][j] = tile;
					}
				}
			} else {
				if (j % spacing == 0 && i % spacing == 0) {
					if (frame[i][j] == mask || mask < 0) {
						frame[i][j] = tile;
					}
				}
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

function gasplanet(frame, tile) {
	fill(frame, "clouds", 1, -1);
	randPoint(frame, "storm", Math.random() * 6 + 3, -1);
	fuzz(frame, "storm", "storm", 0.8, 2, -1);
	randPoint(frame, "lightning", Math.random() * 10, "storm");
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
	if (tile == "arcticwater") {
		randPoint(frame, "iceberg", Math.random() * 4, -1);
		fuzz(frame, "iceberg", "iceberg", 0.6, 2, -1);
	} else {
		randPoint(frame, "oyster", Math.floor(Math.random() * 5), -1);
		if (Math.random() > 0.5) {
			randLine(frame, "coral", 0, Math.floor(gridSystem.length * Math.random()), gridSystem.length, Math.floor(gridSystem.length * Math.random()), 2, 3, -1);
			fuzz(frame, "coral", "coral", 0.5, 1, -1);
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
	if (Math.random() > 0.5) {
		randPoint(empty[1], "fish", 1, -1);
		fuzz(empty[1], "fish", "fish", 0.5, Math.ceil(Math.random() * 2), -1);
		NPCify(empty[1], "fish", "wander", 0.25, 0, Math.floor((Math.random() - 0.5) * 2));
	}
	if (Math.random() > 0.8) {
		randPoint(empty[1], "shrimp", 1, -1);
		fuzz(empty[1], "shrimp", "shrimp", 0.75, Math.ceil(Math.random() * 2), -1);
		NPCify(empty[1], "shrimp", "wander", 1, 0, Math.floor((Math.random() - 0.5) * 2));
	}
	if (Math.random() > 0.8) {
		var x1 = Math.floor(Math.random() * frame.length);
		var x2 = Math.floor(Math.random() * frame.length);
		randLine(frame, "magma", x1, 0, x2, frame.length, 2, 3, -1);
		fuzz(frame, "igneous", "magma", 0.75, 1, -1);
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
		if (Math.random() > 0.5) {
			randPoint(frame, "volcano", Math.random() * 3, "mountain");
		}
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

function temple(frame, tile) {
	fill(frame, "voidwall", 1.0, -1);
	spiral(frame, "sand", 10, 7, 7, -1);
	frame[7][7] = "statue2";
	randPoint(empty[1], "scorpion", 50, -1);
	NPCifyAndMask(empty[1], frame, "sand", "scorpion", "wander", 2);
	randPoint(frame, "note2", 1, "sand");
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
	if (tile == "lake" || tile =="oasiswater2") {
		var center = Math.floor(frame.length / 2);
		circle(frame, "freshwater", Math.random() * 7, center, center, -1);
		randPoint(empty[1], "fish", Math.random() * 8, -1);
		NPCifyAndMask(empty[1], frame, "freshwater", "fish", "wander", 0.5);
	}
	if (tile == "riverwater") {
		box(frame, "freshwater", frame.length, 5, 7, 7, -1);
		fuzz(frame, "freshwater", "freshwater", 0.4, 2, -1);
		randPoint(empty[1], "fish", Math.random() * 8, -1);
		NPCifyAndMask(empty[1], frame, "freshwater", "fish", "wander", 0.5);
		fill(frame, "algae", 0.3, "freshwater");
	}
	
	if (tile == "dirt") {
		if (Math.random() > 0.4) {
			randPoint(empty[1], "worm", Math.random() * 5, -1);
			NPCifyAndMask(empty[1], frame, "dirt", "worm", "wander", 0.25);
		} else {
			fill(frame, "magma", 1.0, -1);
			if (Math.random() > 0.5) {
				randPoint(empty[1], "demon", Math.random() * 5, -1);
				NPCify(empty[1], "demon", "paceXY", 2, 1, 0);
				randPoint(empty[1], "devil", Math.random() * 2, -1);
				NPCify(empty[1], "devil", "paceXY", 2, 1, 0);
			}
		}
	}
	if (Math.random() > 0.4) {
		randPoint(frame, "skull", Math.random() * 3, -1);
		fuzz(frame, "bones", "skull", 0.6, 1, -1);
	}
}

function magma(frame, tile) {
	fill(frame, "magma", 1.0, -1);
	if (Math.random() > 0.5) {
		randPoint(empty[1], "demon", Math.random() * 5, -1);
		NPCify(empty[1], "demon", "paceXY", 2, 1, 0);
		randPoint(empty[1], "devil", Math.random() * 2, -1);
		NPCify(empty[1], "devil", "paceXY", 2, 1, 0, 5);
	}
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
	if (Math.random() > 0.5) {
		fill(frame, "ice", 1, -1);
		if (Math.random() > 0.2) {
			randPoint(frame, "tundra", 1, -1);
			fuzz(frame, "tundra", "tundra", 1.0, Math.floor(Math.random() * 4), -1);
			fuzz(frame, "tundra", "tundra", 0.1, 1, -1);
		}
	} else {
		fill(frame, "arcticwater", 1, -1)
		randPoint(frame, "ice", 1, -1);
		fuzz(frame, "ice", "ice", 1.0, Math.floor(Math.random() * 4), -1);
		fuzz(frame, "ice", "ice", 0.1, 1, -1);
	}
}

function ice(frame, tile) {
	fill(frame, "snow", 1.0, -1);
	if (Math.random() > 0.5) {
		randPoint(empty[1], "polarbear", 1, -1);
		NPCify(empty[1], "polarbear", "wander", 0.5);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "cormorant", 1, -1);
		fuzz(empty[1], "cormorant", "cormorant", 0.8, 1, -1);
		NPCify(empty[1], "cormorant", "paceXY", 1, -1, 1, 20);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "penguin", 1, -1);
		fuzz(empty[1], "penguin", "penguin", 0.8, 1, -1);
		NPCify(empty[1], "penguin", "chaseXY", 1, -5, 7, 1);
	}
}

function tundra(frame, tile) {
	fill(frame, "moss", 1, -1);
	fill(frame, "tundraflower", 0.3, -1);
	fill(frame, "shrub", 0.1, -1);
	fill(frame, "sedimentary", 0.1, -1);
	if (Math.random() > 0.7) {
		randPoint(empty[1], "mouse", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "mouse", "wander", 0.25);
	}
}

function microbe(frame, tile) {
	fill(frame, "void", 1, -1);
	fill(empty[1], "bacteria", 0.5, -1);
	NPCify(empty[1], "bacteria", "wander", 0.25);
}

function animalbody(frame, tile) {
	fill(frame, "interstitialFluid", 1, -1);
	fill(frame, "cell", 0.8, -1);
	randPoint(empty[1], "bacteria", 10, -1);
	NPCify(empty[1], "bacteria", "wander", 0.25);
}

function plantbody(frame, tile) {
	fill(frame, "interstitialFluid", 1, -1);
	drawGrid(frame, "cell", 2, -1, false);
	randPoint(empty[1], "bacteria", 10, -1);
	NPCify(empty[1], "bacteria", "wander", 0.25);
}

function cell(frame, tile) {
	fill(frame, "void", 1, -1);
	var center = Math.floor(frame.length / 2);
	circle(frame, "interstitialFluid", 2, center, center, -1);
	frame[center][center] = "dna";
	fuzz(frame, "dna", "dna", 0.5, 1, -1);
	randPoint(frame, "mitochondria", 1, "interstitialFluid");
	randPoint(empty[1], "virus", Math.random() * 5, -1);
	NPCify(empty[1], "virus", "wander", 0.25);
}

function land(frame, tile) {
	fill(frame, "plain", 1, -1);
	if (Math.random() > 0.5) {
		randPoint(frame, "freshlake", 1, -1);
		fuzz(frame, "freshlake", "freshlake", 0.5, 2, -1);
	}
	if (Math.random() > 0.5) {
		var x1 = Math.floor(Math.random() * frame.length);
		var x2 = Math.floor(Math.random() * frame.length);
		randLine(frame, "snowymountain", x1, 0, x2, frame.length, 2, 3, -1);
		fuzz(frame, "mountain", "snowymountain", 0.75, 1, -1);
		if (Math.random() > 0.5) {
			randPoint(frame, "volcano", Math.random() * 3, "mountain");
		}
	}
	if (Math.random() > 0.5) {
		var x1 = Math.floor(Math.random() * frame.length);
		var x2 = Math.floor(Math.random() * frame.length);
		randLine(frame, "river", 0, x1, frame.length, x2, 2, 3, -1);
	}
	for (let i = 0; i < Math.random() * 4; i++) {
		let y = Math.floor(Math.random() * frame.length);
		let x = Math.floor(Math.random() * frame.length);
		circle(frame, "forest", Math.random() * 3, x, y, -1);
	}
	fuzz(frame,"forest", "forest", 0.2, 1, -1);
	if (Math.random() > 0.5) {
		let y = Math.floor(Math.random() * frame.length);
		let x = Math.floor(Math.random() * frame.length);
		circle(frame, "city", Math.random() * 1, x, y, -1);
		fuzz(frame, "city", "city", 0.5, 1, -1);
		if (Math.random() > 0.4) {
			fuzz(frame, "wheatfield", "city", 1, 1, -1);
		}
	}
	if (Math.random() > 0.8) {
		randPoint(frame, "castle", 1, -1);
	}
}

function city(frame, tile) {
	if (Math.random() > 0.5) {
		fill(frame, "house", 1.0, -1);
		drawGrid(frame, "road", 3, -1, true);
		randPoint(frame, "park", Math.random() * 2, "house");
		fuzz(frame, "park", "park", 1.0, 1, "house");
		if (Math.random() > 0.5) {
			randPoint(frame, "graveyard", 1, "house");
			fuzz(frame, "graveyard", "graveyard", 1.0, 1, "house");
		}
		randPoint(frame, "school", 1, "house");
		randPoint(frame, "church", Math.random() * 3, "house");
	} else {
		if (Math.random() > 0.7) {
			fill(frame, "factory", 1.0, -1);
			drawGrid(frame, "road", 3, -1, true);
		} else {
			fill(frame, "skyscraper", 1.0, -1);
			drawGrid(frame, "road", 3, -1, true);
			randPoint(frame, "school", 1, "skyscraper");
			randPoint(frame, "church", Math.random() * 3, "skyscraper");
			randPoint(frame, "bank", 1, "skyscraper");
			randPoint(frame, "hotel", 1, "skyscraper");
			randPoint(frame, "museum", 1, "skyscraper");
			randPoint(frame, "construction", Math.random() * 5, "skyscraper");
		}
	}
}

function park(frame, tile) {
	fill(frame, "void", 1, -1);
	box(frame, "leaves", 11, 11, 7, 7, -1);
	fuzz(frame, "wall", "leaves", 1.0, 1, -1);
	fill(frame, "tree", 0.1, "leaves");
	if (tile == "graveyard") {
		drawGrid(frame, "gravestone", 2, "leaves");
		randPoint(frame, "bouquet", Math.random() * 10, "leaves");
		randPoint(frame, "gravestone", Math.random() * 20, "gravestone");
		randPoint(empty[1], "ghost", Math.random() * 5, -1);
		NPCify(empty[1], "ghost", "wander", 1);
	}
	if (Math.random() > 0.4) {
		randPoint(empty[1], "chipmunk", Math.random() * 5, -1);
		NPCify(empty[1], "chipmunk", "wander", 1);
	}
}

function oil(frame, tile) {
	fill(frame, "oil", 1.0, -1);
}

function building(frame, tile) {
	fill(frame, "void", 1.0, -1);
	box(frame, "floor", 9, 9, 7, 7, -1);
	fuzz(frame, "wall", "floor", 1.0, 1, -1);
	randPoint(frame, "door", 1, "wall");
	switch (tile) {
		default:
			break;
		case "school":
			for (let i = 5; i < 11; i++) {
				if (i % 2 == 1) {
					line(frame, "desk", 4, i, 10, i, -1);
				} else {
					line(frame, "chair", 4, i, 10, i, -1);
				}
			}
			randPoint(frame, "apple", 1, "floor");
			drawGrid(frame, "window", 2, "wall");
			break;
		case "skyscraper":
			fill(frame, "sky", 1.0, "void");
			fill(frame, "cloud", 0.1, "sky");
			fuzz(frame, "cloud", "cloud", 0.7, 1, "sky");
			fill(frame, "window", 1.0, "wall");
			fill(frame, "window", 1.0, "door");
			drawGrid(frame, "cubicle", 2, "floor");
			frame[3][3] = "stairs";
			break;
		case "stairs":
			fill(frame, "sky", 1.0, "void");
			fill(frame, "cloud", 0.1, "sky");
			fuzz(frame, "cloud", "cloud", 0.7, 1, "sky");
			fill(frame, "rooftop", 1.0, "wall");
			fill(frame, "rooftop", 1.0, "door");
			fill(frame, "rooftop", 1.0, "floor");
			randPoint(frame, "antenna", Math.random() * 5, "rooftop");
			randPoint(empty[1], "pigeon", 2, -1);
			fuzz(empty[1], "pigeon", "pigeon", 0.2, 2, -1);
			NPCifyAndMask(empty[1], frame, "rooftop", "pigeon", "wander", 0.25);
			break;
		case "museum":
			drawGrid(frame, "window", 2, "wall");
			drawGrid(frame, "painting", 2, "floor");
			randPoint(frame, "statue1", 5, "painting");
			randPoint(frame, "statue2", 5, "painting");
			randPoint(frame, "amphora", 5, "painting");
			break;
		case "bank":
			box(frame, "amphora", 5, 5, 7, 7, -1);
			fuzz(frame, "wall", "amphora", 1.0, 1, -1);
			randPoint(frame, "euro", 6, "amphora");
			randPoint(frame, "diamond", 6, "amphora");
			randPoint(frame, "moneybag", 6, "amphora");
			randPoint(frame, "coin", 6, "amphora");
			randPoint(frame, "creditcard", 6, "amphora");
			frame[7][10] = "lock";
			break;
		case "hotel":
			frame[7][6] = "bed";
			frame[7][8] = "bed";
			break;
		case "church":
			drawGrid(frame, "window", 2, "wall");
			frame[4][7] = "cross";
			for (let i = 5; i < 11; i++) {
				if (i % 2 == 0) {
					line(frame, "chair", 4, i, 10, i, -1);
				}
			}
			randPoint(frame, "candle", Math.random() * 10, "floor");
			break;
		case "house":
			drawGrid(frame, "window", 2, "wall");
			randPoint(frame, "chair", 1, "floor");
			randPoint(frame, "bed", 1, "floor");
			randPoint(frame, "table", 1, "floor");
			randPoint(frame, "toilet", 1, "floor");
			randPoint(frame, "faucet", 1, "floor");
			break;
		case "factory":
			fill(frame, "gear", 0.1, "floor");
			fill(frame, "oilbarrel", 0.1, "floor");
			fill(frame, "machine", 0.1, "floor");
			fill(frame, "wrench", 0.05, "floor");
			for (let i = 3; i < 11; i++) {
				if (i % 2 == 0) {
					line(frame, "conveyorbelt", 4, i, 10, i, -1);
				}
			}
			randPoint(empty[1], "robot", Math.random() * 20, -1);
			NPCifyAndMask(empty[1], frame, "floor", "robot", "wander", 0.5);
			break;
		case "laboratory":
			for (let i = 3; i < 11; i++) {
				if (i % 2 == 0) {
					line(frame, "alembic", 4, i, 10, i, -1);
				}
			}
			fill(frame, "beaker", 0.5, "alembic");
			fill(frame, "petri", 0.5, "alembic");
			randPoint(empty[1], "robot", Math.random() * 20, -1);
			NPCifyAndMask(empty[1], frame, "floor", "robot", "wander", 0.5);
			randPoint(frame, "note", 1, "floor");
			break;
	}
}

function sewer(frame, tile) {
	fill(frame, "dirt", 1, -1);
	for (let i = 0; i < Math.random() * 10 + 5; i++) {
		let rand = Math.floor(frame.length * Math.random());
		let rand1 = Math.floor(frame.length * Math.random());
		let rand2 = Math.floor(frame.length * Math.random());
		if (i % 2 == 0) {
			line(frame, "pipe", rand, rand1, rand, rand2, -1)
		} else {
			line(frame, "pipe", rand1, rand, rand2, rand, -1)
		}
	}
	randPoint(frame, "drain", Math.random() * 10, "pipe");
	randPoint(frame, "excrement", Math.random() * 5, "pipe");
	randPoint(empty[1], "rat", Math.random() * 50, -1);
	randPoint(empty[1], "cockroach", Math.random() * 50, -1);
	NPCifyAndMask(empty[1], frame, "pipe", "rat", "wander", 0.25);
	NPCifyAndMask(empty[1], frame, "pipe", "cockroach", "wander", 0.25);
}

function plain(frame, tile) {
	fill(frame, "meadowgrass", 1, -1);
	fill(frame, "shrub", 0.2, -1);
	fill(frame, "sapling", 0.1, -1);
	if (Math.random() > 0.3) {
		if (Math.random() > 0.3) {
			fill(frame, "flower1", 0.1, -1);
			fill(frame, "flower2", 0.1, -1);
			fill(frame, "flower3", 0.1, -1);
			fill(frame, "flower4", 0.1, -1);
		} else if (Math.random() > 0.5) {
			fill(frame, "sunflower", 0.5, -1);
		} else {
			if (Math.random() > 0.5) {
				fill(frame, "tulip", 0.5, -1);
			} else {
				fill(frame, "hyacinth", 0.5, -1);
			}
		}
	}
	if (Math.random() > 0.5) {
		fill(frame, "sedimentary", 0.05, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "fox", 1, -1);
		NPCify(empty[1], "fox", "wander", 0.25);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "deer", 1, -1);
		fuzz(empty[1], "deer", "deer", 1, 1, -1);
		if (Math.random() > 0.5) {
			randPoint(empty[1], "wolf", 1, -1);
			fuzz(empty[1], "wolf", "wolf", 1, 1, -1);
			NPCify(empty[1], "wolf", "chaseXY", 1, frame.length + 5, 0, 1);
		}
		NPCify(empty[1], "deer", "wander", 1, 1);
	}
	if (Math.random() > 0.9) {
		randPoint(empty[1], "turkey", 1, -1);
		fuzz(empty[1], "turkey", "turkey", 0.75, 1, -1)
		NPCify(empty[1], "turkey", "wander", 0.5, 0, 1);
	}
	if (Math.random() > 0.9) {
		randPoint(empty[1], "bison", 3, -1);
		NPCify(empty[1], "bison", "wander", 0.5, 1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "mouse", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "mouse", "wander", 0.25);
	}
	if (Math.random() > 0.9) {
		randPoint(empty[1], "turtle", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "turtle", "wander", 0.25);
	}
	if (Math.random() > 0.8) {
		randPoint(frame, "anthill", 1, -1);
		fuzz(frame, "ant", "anthill", 0.5, 1, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "rabbit", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "rabbit", "wander", 0.5);
	}
	if (tile == "castle") {
		box(frame, "courtyard", 4, 4, Math.floor(Math.random() * 15),  Math.floor(Math.random() * 15), -1);
		fuzz(frame, "wall", "courtyard", 1, 1, -1);
		randPoint(frame, "crown", 1, "courtyard");
	}
}

function lake(frame, tile) {
	fill(frame, "lakewater", 1, -1);
	if (Math.random() > 0.6) {
		fill(frame, "lotus", 0.3, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "duck", 1, -1);
		fuzz(empty[1], "duck", "duck", 0.75, 1, -1)
		NPCify(empty[1], "duck", "wander", 0.5, 0, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "goose", 1, -1);
		NPCify(empty[1], "goose", "wander", 1);
	}
	randPoint(empty[1], "driftwood", Math.random() * 5, -1);
	NPCify(empty[1], "driftwood", "wander", 0.25);
}

function underlake(frame, tile) {
	fill(frame, "sand", 1, -1);
	fill(frame, "sedimentary", 0.3, -1);
	fill(frame, "algae", 0.3, -1);
	randPoint(frame, "driftwood", Math.random() * 5, -1);
	if (Math.random() > 0.0) {
		randPoint(empty[1], "fish", 1, -1);
		fuzz(empty[1], "fish", "fish", 0.5, Math.ceil(Math.random() * 2), -1);
		NPCify(empty[1], "fish", "wander", 0.25, 0, Math.floor((Math.random() - 0.5) * 2));
	}
}

function river(frame, tile) {
	fill(frame, "meadowgrass", 1, -1);
	fill(frame, "shrub", 0.2, -1);
	fill(frame, "sapling", 0.1, -1);
	box(frame, "riverwater", frame.length, 5, 7, 7, -1);
	fuzz(frame, "riverwater", "riverwater", 0.7, 2, -1);
	if (Math.random() > 0.6) {
		randPoint(empty[1], "salmon", Math.random() * 5, -1);
		NPCifyAndMask(empty[1], frame, "riverwater", "salmon", "down", 0.5);
	}
	if (Math.random() > 0.6) {
		randPoint(empty[1], "leaf", Math.random() * 10, -1);
		NPCifyAndMask(empty[1], frame, "riverwater", "leaf", "down", 0.5);
	}
	if (Math.random() > 0.7) {
		line(frame, "dam", 3, 7, 12, 7, -1);
		fuzz(frame, "dam", "dam", 0.7, 1, -1);
		randPoint(frame, "beaver", Math.random() * 7, "dam");
	}
}

function forest(frame, tile) {
	fill(frame, "forestfloor", 1, -1);
	fill(frame, "shrub", 0.2, -1);
	fill(frame, "sapling", 0.1, -1);
	fill(frame, "tree", 0.3, -1);
	if (Math.random() > 0.3) {
		fill(frame, "pine", 0.2, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "fox", 1, -1);
		NPCify(empty[1], "fox", "wander", 0.25);
	}
	if (Math.random() > 0.5) {
		randPoint(empty[1], "deer", 1, -1);
		fuzz(empty[1], "deer", "deer", 1, 1, -1);
		if (Math.random() > 0.5) {
			randPoint(empty[1], "wolf", 1, -1);
			fuzz(empty[1], "wolf", "wolf", 1, 1, -1);
			NPCify(empty[1], "wolf", "chaseXY", 1, frame.length + 5, 0, 1);
		}
		NPCify(empty[1], "deer", "wander", 1, 1);
	}
	if (Math.random() > 0.8) {
		randPoint(frame, "anthill", 1, -1);
		fuzz(frame, "ant", "anthill", 0.5, 1, -1);
	}
	if (Math.random() > 0.7) {
		randPoint(empty[1], "rabbit", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "rabbit", "wander", 0.5);
	}
}

function anthill(frame, tile) {
	fill(frame, "dirt", 1, -1);
	fill(frame, "sedimentary", 0.1, -1);
	for (let i = 0; i < Math.random() * 10 + 5; i++) {
		let rand = Math.floor(frame.length * Math.random());
		let rand1 = Math.floor(frame.length * Math.random());
		let rand2 = Math.floor(frame.length * Math.random());
		if (i % 2 == 0) {
			line(frame, "tunnel", rand, rand1, rand, rand2, -1)
		} else {
			line(frame, "tunnel", rand1, rand, rand2, rand, -1)
		}
	}
	randPoint(frame, "queenant", 1, "tunnel");
	randPoint(empty[1], "ant", Math.random() * 50, -1);
	NPCifyAndMask(empty[1], frame, "tunnel", "ant", "wander", 0.25);
}

function atom(frame, tile) {
	fill(frame, "void", 1, -1);
	fill(frame, "atom", Math.random(), -1);
	fill(empty[1], "radioactiveatom", 0.05, -1);
	NPCify(empty[1], "radioactiveatom", "wander", 2);
}

function subatomic(frame, tile) {
	fill(frame, "void", 1, -1);
	var center = Math.floor(frame.length / 2);
	circle(frame, "atominside", 2, center, center, -1);
	frame[center][center] = "proton";
	fuzz(frame, "proton", "proton", 0.5, 1, -1);
	empty[1][7][7] = "electron";
	NPCify(empty[1], "electron", "paceXY", 1, 1, 1, 3);
}

function strings(frame, tile) {
	fill(frame, "string", 1, -1);
}

function reset(frame,tile) {
	fill(frame, "void", 1, -1);
	frame[7][7] = "symbol";
}

function multiverse(frame,tile) {
	fill(frame, "nothing", 1, -1);
	fill(frame, "universe", 0.1, -1);
}

function volcano(frame,tile) {
	fill(frame, "igneous", 1.0, -1);
	circle(frame, "magma", 4, 7, 7, -1);
}

function wheatfield(frame, tile) {
	fill(frame, "wheat", 1.0, -1);
	fill(frame, "meadowgrass", 0.1, -1);
	if (Math.random() > 0.7) {
		randPoint(empty[1], "mouse", Math.floor(Math.random() * 3), -1);
		NPCify(empty[1], "mouse", "wander", 0.25);
	}
	randPoint(frame, "scarecrow", 1, -1);
	if (Math.random() > 0.3) {
		randPoint(frame, "laboratory", 1, -1);
	}
}

/*end generation functions*/

//EventListeners

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
		p.innerHTML = "Play";
	} 	else {
		paused = false
		p.innerHTML = "Pause";
	}
} 

document.getElementById("pause").addEventListener("click", pause);

$(document).keyup(function(e) {
	if (e.key === " ") { 
		pause();
    } else if (e.key === "ArrowLeft") {
		historyBack();
	} else if (e.key === "ArrowRight") {
		historyFwd();
	} else if (e.key === "Enter") {
		gridSystem.canvas.click();
	}
});

//Main game script
const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));

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
//replace with init()
init(empty[0]);
var tick = 0;
var paused = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
	var elt;
	var loadingTick = 0;
	paused = false;

	gridSystem.render(empty, 0);
	gridSystem.history.push(JSON.parse(JSON.stringify(gridSystem.matrix)));
	gridSystem.NPChistory.push([]);
	while(true) {
		await sleep(300);
		if (!paused) {
			tick++;
			gridSystem.updateNPCS();
			gridSystem.render(gridSystem.matrix, tick);
		}
	}
}

if (!isMobile)
	loop();
else
	document.getElementById("warning").innerHTML = "<em>Unavailable on mobile devices :(</em>"