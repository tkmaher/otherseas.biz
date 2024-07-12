function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var tick = 0;
var arena = document.getElementById("arena");
var ig = document.getElementById("ig");
var vimeo = document.getElementById("vimeo");
var twitter = document.getElementById("twitter");

async function spin() {
    var seed0 = Math.random() * 360, seed1 = Math.random() * 360, seed2 = Math.random() * 360, seed3 = Math.random() * 360;
    while(true) {
        await sleep(10);
        arena.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*-0.09) + seed0) + 'deg)'
        ig.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*0.1) + seed1) + 'deg)'
        vimeo.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*-0.2) + seed2) + 'deg)'
        twitter.style.transform = ' translate(-50%, -50%) rotate(' + ((tick*0.25) + seed3) + 'deg)'
        tick++;
    }
}

spin();