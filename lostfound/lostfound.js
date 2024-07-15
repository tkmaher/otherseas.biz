async function fetchA(channel) {
	var returnal = "";
	await fetch('https://api.are.na/v2/channels/' + channel + '/contents?per=500', {
		signal: AbortSignal.timeout(10000)
	})
    .then(response => response.json())
    .then(data => {
        // reverse so the latest ones first
        const posts = data.contents.reverse()        
        
        posts.forEach(post => {        
            returnal += post.image.original.url + "\n";
        })
    })
	return returnal;
}

async function arenaFetch(channel) {
    return(await fetchA(channel));
}

async function itemize(returnal, desc, channel) {
    if (channel != undefined) {
        returnal = await arenaFetch(channel);
    }

    var lostParent = document.getElementById("lostParent");
    var foundParent = document.getElementById("foundParent");

    var txt, img;
    var index = 0;
	const out = returnal.split('\n').filter(x => x.length);
    const outDesc = desc.split('\n').filter(x => x.length);
    populate(lostParent, Math.random() * 6, out, outDesc);
    populate(foundParent, Math.random() * 6, out, outDesc);
}

function populate(parent, iter, arr, desc) {
    for (let i = 0; i < iter; i++) {
        img = document.createElement("img");
        index = Math.floor(Math.random() * arr.length);
        img.src = arr[index];
        img.className = "lostFoundImg";
        parent.appendChild(img);
        arr.splice(index, 1);
    
        txt = document.createElement("div");
        txt.style= "text-align: center";
        index = Math.floor(Math.random() * desc.length);
        txt.innerHTML = desc[index] + "<br><br>";
        desc.splice(index, 1);
        parent.appendChild(txt);
    }
}