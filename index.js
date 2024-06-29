var dancers = document.getElementById("dancers");
var tick = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
    while (true) {
      dancers.style.backgroundPositionY = tick + "%";
      tick--;
      await sleep(20);
    }
}

loop();