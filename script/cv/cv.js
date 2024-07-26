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