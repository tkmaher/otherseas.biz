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

var num = 0;
var zoomed = false;
var current;
var top_z = 1;

function zoomimg(e) {
	zoomed = true;
	display(e.target);
}

function display(target) {
	current = target.id;
	var imgzoom = document.getElementById("imgzoom");
	imgzoom.style.opacity = 1;
	var url = target.style.getPropertyValue("--url").toString();
	url = url.slice(4).slice(0,-1);
	document.getElementById("enlarged").src = url;
	imgzoom.style.pointerEvents = "auto";
	console.log(target.style)
	document.getElementById("title").innerHTML = target.style.getPropertyValue("--title").toString();
	document.getElementById("link").href = target.style.getPropertyValue("--link").toString();
}

function close() {
	zoomed = false;
	var imgzoom = document.getElementById("imgzoom");
	imgzoom.style.pointerEvents = "none";
	imgzoom.style.opacity = 0;
}

function right() {
	current = ((parseInt(current) + 1) % num);
	display(document.getElementById(current.toString()));
}

function left() {
	current = (((parseInt(current) - 1) % num));
	if (current < 0)
		current = num + current;
	display(document.getElementById(current.toString()));
}

document.addEventListener('keydown', function(event) {
	if (zoomed) {
		if (event.key === 'Escape') {
			close();
		} else if (event.key == 'ArrowRight') {
			right();
		} else if (event.key == 'ArrowLeft') {
			left();
		}
	}
	
});

async function load(url, iter, info, title, link) {
	let parent = document.getElementById('parent');
	var img = new Image();
	img.src = url;
	await img.decode();
	if (img.height > img.width) {
		w = '30vw';
		h = 'auto';
		zoom = '50vw auto';
	} else {
		w = 'auto';
		h = '30vw';
		zoom = 'auto 50vw';
	}

	card = document.createElement("div");
	card.className = "card";
	card.id = iter;
	card.style = "--h:" + h + "; --w:" + w + "; --zoom:" + zoom + ';';

	parent.appendChild(card);

	card.style.setProperty("--url", "url(" + url + ")");
	card.id = iter.toString();
	if (info) {
		card.style.setProperty("--title", title);
		card.style.setProperty("--link", link);
	}

	card.addEventListener("click", zoomimg);
}

async function squarize(arr, number, info, channel) {
	var url, title, link;
	
    if (channel != undefined) {
        arr = await arenaFetch(channel);
    }
	
	const out = arr.split('\n').filter(x => x.length);
	if (info != undefined) {
		description = info.split('\n').filter(x => x.length > 0);
	}
	//while (document.readyState != "complete") {}

	document.getElementById("closeimg").addEventListener("click", (e) =>{close()})
	document.getElementById("left").addEventListener("click", (e) =>{left()})
	document.getElementById("right").addEventListener("click", (e) =>{right()})

	for (let i = 0; i < out.length; i++) {
		num++;
		url = out[i];
		console.log(out.length)
		if (info) {
			title = description[i * 2];
			link = description[(i * 2) + 1];
		}
		await load(url, i, info, title, link);
	}
}