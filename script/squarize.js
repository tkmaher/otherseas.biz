function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var dragging = false;
var current;
var top_z = 1;


function drag(e) {
	if (dragging && current == e.target.id) {
		e.target.style.top = (e.clientY) + "px";
		e.target.style.left = (e.clientX ) + "px";
	}
}

function zoomimg(e) {
	var imgzoom = document.getElementById("imgzoom");
	imgzoom.style.opacity = 1;
	document.getElementById("enlarged").src = e.target.style.getPropertyValue("--url");
	imgzoom.style.pointerEvents = "auto";
	document.getElementById("title").innerHTML = e.target.style.getPropertyValue("--title");
	document.getElementById("link").innerHTML = e.target.style.getPropertyValue("--link");
	document.getElementById("link").href = e.target.style.getPropertyValue("--link");
}

async function squarize(arr, num, info) {
	var index, card, w, h, zoom;
	const out = arr.split('\n').filter(x => x.length);
	if (info) {
		description = info.split('\n').filter(x => x.length);
	}
	var parent = document.getElementById('parent');
	for (let i = 0; i < num; i++) {
		index = Math.floor(Math.random() * out.length);
		var img = new Image();
		img.src = out[index];
		await img.decode();
		if (img.height > img.width) {
			w = '300px';
			h = 'auto';
			zoom = '400px auto';
		} else {
			w = 'auto';
			h = '300px';
			zoom = 'auto 400px';
		}

		card = document.createElement("div");
		card.className = "card";
		card.id = i;
		card.style = "--url:url(" + out[index] + "); --h:" + h + "; --w:" + w + "; --zoom:" + zoom + ';';
		card.style.top = (50 + (-(num/2 - 0.5) + i) * 5) + '%';
		card.style.left = (50 + (-(num/2 - 0.5) + i) * 5) + '%';

		parent.appendChild(card);

		zoom = document.createElement("div");
		zoom.className = "zoom";
		zoom.innerHTML = '🔍';
		zoom.style.setProperty("--url", out[index]);
		if (info) {
			zoom.style.setProperty("--title", description[index * 2]);
			zoom.style.setProperty("--link", description[(index * 2)+1]);
			description.splice(index*2, 2);
		}
		card.appendChild(zoom);

		out.splice(index, 1);
		card.addEventListener("mousedown", (e) => {
			if (dragging == false) {
				dragging = true;
				current = e.target.id;
				e.target.style.zIndex = top_z;
				top_z++;
				drag(e);
				imgzoom.style.zIndex = top_z;
			}
		})
		card.addEventListener("mousemove", drag);
		card.addEventListener("mouseup", (e) => {dragging = false;})

		zoom.addEventListener("click", zoomimg);
	}

	document.getElementById("closeimg").addEventListener("click", (e) =>
	{
		imgzoom.style.pointerEvents = "none";
		imgzoom.style.opacity = 0;
	}
	)

	document.getElementById("fade").style.opacity = '0';
	await sleep(1000);
	document.getElementById("fade").remove();
}