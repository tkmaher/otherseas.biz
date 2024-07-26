var tick = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function loop() {
    while (true) {
      var img = document.createElement("img");
      img.src = "../../images/doors/password/flower.png"
      img.style.left = (Math.random() * 90) + "%";
      img.style.top = (Math.random() * 90) + "%";
      img.className = "lifeimage";
      document.getElementById("lifeimage").appendChild(img);
      img.style.scale = "5%"
      img.style.transform = "rotate(" + (Math.random() * 360) + 'deg)';
      img.style.opacity = "0";
      await sleep(100);
      img.style.opacity = "1";
      img.style.scale = (Math.random() * 50 + 10) + "%";
      await sleep(Math.random() * 500 + 100);
      await sleep(Math.random() * 200 + 100);
      tick++;
    }
}

loop();