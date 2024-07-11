

function itemize(lost, found, desc) {
    var lostParent = document.getElementById("lostParent");
    var foundParent = document.getElementById("foundParent");

    var txt, img;
    var index = 0;
	const outLost = lost.split('\n').filter(x => x.length);
    const outFound = found.split('\n').filter(x => x.length);
    const outDesc = desc.split('\n').filter(x => x.length);
    populate(lostParent, Math.random() * 6, outLost, outDesc);
    populate(foundParent, Math.random() * 6, outFound, outDesc);
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