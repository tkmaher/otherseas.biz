const main = document.getElementById("main");

const pref = new URLSearchParams(window.location.search).get("prefix") || "";
const url = new URL("https://pdf.tomaszkkmaher.workers.dev/");
if (pref && pref != "/")
    url.searchParams.append("prefix", pref);

function populateFiles(data) {
    data.forEach(f => {
        let file = document.createElement("a");
        file.className = "button";
        file.href = f["url"];
        file.innerText = "📄 " + f["name"];
        main.appendChild(file);
        main.appendChild(document.createElement("br"));
    });
}

function makeHeader(prefix) {
    let div = document.createElement("div");
    div.innerText = "📂 /" + prefix;
    main.appendChild(div);
    main.appendChild(document.createElement("br"));
    
    
}

function makeFooter(suffix) {
    let folder = document.createElement("a");
    folder.className = "button";
    folder.href = `/pdf/?prefix=` + suffix;
    folder.innerText = "📁 ../";
    main.appendChild(folder);
}

function populateFolders(folders) {
    folders.forEach(f => {
        let folder = document.createElement("a");
        folder.className = "button";
        folder.href = `/pdf/?prefix=` + f;
        folder.innerText = "📁 " + f.slice(0, -1).split("/").pop();
        main.appendChild(folder);
        main.appendChild(document.createElement("br"));
    });
}

function populate(data) {
    makeHeader( data["prefix"]);
    populateFiles(data["files"]);
    populateFolders(data["folders"]);
    makeFooter(data["suffix"]);
}

async function getFolder(path) {
    await fetch(path).then(
        res => res.text()
    ).then(
        data => { populate(JSON.parse(data)); }
    ).catch(
        err => { console.error(err); }
    );
}

getFolder(url);