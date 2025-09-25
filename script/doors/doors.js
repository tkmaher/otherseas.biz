var desc = ["innocent", "boring", "crazy", "amazing", "supine", "old", "good", "real"];
var label = document.getElementById("desc");
var tick = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
    while (true) {
      label.innerHTML = desc[tick % desc.length];
      await sleep(100);
      tick++;
    }
}

loop();