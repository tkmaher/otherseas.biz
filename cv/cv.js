const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));
var fish = document.getElementById("fish");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function detect(e) {
    fish.currentTime = fish.duration * (e.clientX /window.innerWidth);
}

async function loop() {
    while(true) {
        await sleep(500);
        fish.currentTime = fish.duration * Math.random();
    }
}

if (!isMobile) {
    document.addEventListener("mousemove", detect);
} else {
    loop();
}

function collapse(target) {
    let next = target.nextSibling;
    for (var timeout = 0; timeout < 1000; timeout++) {
        if (next.className != "collapseDiv") {
            next = next.nextSibling;
        } else {
            break;
        }
    }
    if (target.innerHTML == "[+]") {
        next.style.display = "block";
        target.innerHTML = "[-]";
    } else {
        next.style.display = "none";
        target.innerHTML = "[+]";
    }
}

function collapseHandler(e) {
    let target = e.target;
    collapse(target);
    if (target.id != current) {
        let other = document.getElementById(current);
        if (other.innerHTML == "[-]") {
            collapse(other);
        }
        current = target.id;
    }
}

var current = "1";
var collapses = document.getElementsByClassName("collapse");
for (let i = 0; i < collapses.length; i++) {
    collapses[i].addEventListener("click", collapseHandler);
}