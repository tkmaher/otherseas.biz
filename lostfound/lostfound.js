

function itemize(lost, found, desc) {
    var lostParent = document.getElementById("lostParent");
    var foundParent = document.getElementById("foundParent");

    var txt, img;
    var index = 0;
	const outLost = lost.split('\n').filter(x => x.length);
    const outFound = found.split('\n').filter(x => x.length);
    const outDesc = desc.split('\n').filter(x => x.length);
    for (let i = 0; i < 5; i++) {
        img = document.createElement("img");
        index = Math.floor(Math.random() * outLost.length);
        img.src = outLost[index];
        img.className = "lostFoundImg";
        lostParent.appendChild(img);
        outLost.splice(index, 1);

        txt = document.createElement("div");
        txt.style= "text-align: center";
        index = Math.floor(Math.random() * outDesc.length);
        txt.innerHTML = outDesc[index] + "<br><br>";
        outDesc.splice(index, 1);
        lostParent.appendChild(txt);

        img = document.createElement("img");
        index = Math.floor(Math.random() * outFound.length);
        img.src = outFound[index];
        img.className = "lostFoundImg";
        foundParent.appendChild(img);
        outFound.splice(index, 1);

        txt = document.createElement("div");
        txt.style= "text-align: center";
        index = Math.floor(Math.random() * outDesc.length);
        txt.innerHTML = outDesc[index] + "<br><br>";
        outDesc.splice(index, 1);
        foundParent.appendChild(txt);
    }
}