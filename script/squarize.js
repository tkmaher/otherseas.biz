async function fetchA(channel) {
	var returnal = "";
	var recur = [];
	await fetch('https://api.are.na/v2/channels/' + channel + '/contents?per=500', {
		signal: AbortSignal.timeout(10000)
	})
    .then(response => response.json())
    .then(data => {
        // reverse so the latest ones first
        const posts = data.contents.reverse()        
        
        posts.forEach(post => {   
			if (post.class == "Channel") {
				recur.push(post.slug);
			} else if (post.class == "Image") {
				returnal += post.image.original.url + "\n";

			}
        })
    })
	for (let i = 0; i < recur.length; i++) {
		returnal += (await fetchA(recur[i]));
	}
	return returnal;
}

async function arenaFetch(channel) {
    return(await fetchA(channel));
}

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
	document.getElementById("link").href = e.target.style.getPropertyValue("--link");
}

async function load(url, iter, num, info, title, link) {
	let parent = document.getElementById('parent');
	var img = new Image();
	img.src = url;
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
	card.id = iter;
	card.style = "--url:url(" + url + "); --h:" + h + "; --w:" + w + "; --zoom:" + zoom + ';';
	card.style.top = (50 + (-(num/2 - 0.5) + iter) * 5) + 'vh';
	card.style.left = (50 + (-(num/2 - 0.5) + iter) * 5) + 'vw';
	card.style.zIndex = -1 * (num - iter);

	parent.appendChild(card);

	zoom = document.createElement("div");
	zoom.className = "zoom";
	zoom.innerHTML = '🔍';
	zoom.style.setProperty("--url", url);
	if (info) {
		zoom.style.setProperty("--title", title);
		zoom.style.setProperty("--link", link);
	}
	card.appendChild(zoom);

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

async function squarize(arr, num, info, channel) {
	var index, url, title, link;
    if (channel != undefined) {
        arr = await arenaFetch(channel);
    }

	const out = arr.split('\n').filter(x => x.length);
	if (info != undefined) {
		description = info.split('\n').filter(x => x.length);
	}
	for (let i = 0; i < num; i++) {
		index = Math.floor(Math.random() * out.length);
		url = out[index];
		out.splice(index, 1);
		if (info) {
			title = description[index * 2];
			link = description[(index * 2) + 1];
			description.splice(index*2, 2);
		}
		load(url, i, num, info, title, link);
	}
	await sleep(1000);

	document.getElementById("closeimg").addEventListener("click", (e) =>
		{
			imgzoom.style.pointerEvents = "none";
			imgzoom.style.opacity = 0;
		}
	)

	//document.getElementById("fade").style.opacity = '0';
	//await sleep(1000);
	//document.getElementById("fade").remove();
}