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
var current;
var games = false;
var description;

function zoomimg(e) {
	display(e.target);
}

function display(target) {
	if (!games) {
		var url = target.style.getPropertyValue("--url").toString();
		window.open(url, '_blank').focus();
	} else {
		var url = description[target.id];
		window.open(url,"_self");
	}
	
}

async function populateGrid(url, i) {
	var img = new Image();
	img.src = url;
	
	let parent = document.getElementById('parent');
	var n = document.createElement("div")
	parent.append(n);
	n.style.backgroundImage = 'url(' + url + ')';
	n.className = "blogBlock";
	n.id = i;
	n.style.setProperty("--url", url);
	n.addEventListener("click", zoomimg);
}

async function squarize(arr, info, channel) {
	var url;
	
    if (channel != undefined)
        arr = await arenaFetch(channel);
	
	const out = arr.split('\n').filter(x => x.length);
	if (info != "") {
		games = true;
		description = info.split('\n').filter(x => x.length > 0);
	}

	for (let i = 0; i < out.length; i++) {
		num++;
		url = out[i];
		populateGrid(url, i);
	}

	$( ".blogBlock" ).on( "mouseover", function(e) {
		e.target.style.scale = "105%"
	  } )
	  .on( "mouseout", function(e) {
		e.target.style.scale = "100%"
	} );
	
}
