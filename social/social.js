function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var tick = 0;
var ig = document.getElementById("ig");
var vimeo = document.getElementById("vimeo");
var twitter = document.getElementById("twitter");

async function spin() {
    while(true) {
        await sleep(10);
        ig.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*0.1) % 360) + 'deg)'
        vimeo.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*-0.2) % 360) + 'deg)'
        twitter.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*0.25) % 360) + 'deg)'
        tick++;
    }
}

spin();