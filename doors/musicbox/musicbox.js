var masterVol = 0.0;
var bg = new Audio('../../sounds/doors/musicbox/heaven.mp3');
bg.loop = true;
bg.load();
var audio = new Audio;
var tick = 0;
audio.muted = true;
bg.muted = true;

function popup() {
	elt = document.getElementById('thesis');
	if (thesis.style.width != '0px') {
	  thesis.style.width = '0px';
	  thesis.style.height = '0px';
	  thesis.style.fontSize = '0%';
	  thesis.style.left = '100%';
	  thesis.style.top = '100%';
	} else {
	  thesis.style.width = '25%';
	  thesis.style.height = '25%';
	  thesis.style.fontSize = '100%';
	  thesis.style.left = '50%';
	  thesis.style.top = '50%';
	}
}

document.getElementById("openInfo").addEventListener("click", popup);
document.getElementById("closeInfo").addEventListener("click", popup);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mute() {
  var elt = document.getElementById("mute");
  if (elt.innerHTML == "[Unmute]") {
    elt.innerHTML = "[Mute]";
    bg.muted = false;
    bg.play();
    audio.muted = false;
  } else {
    elt.innerHTML = "[Unmute]";
    bg.muted = true;
    audio.muted = true;
  }
}

document.getElementById("mute").addEventListener("click", mute)

async function loop() {
    while (true) {

      var img = document.createElement("img");
      img.src = "../../images/doors/musicbox/ripple.gif";
      img.style.left = (Math.random() * 75) + "%";
      img.style.top = (Math.random() * 75) + "%";
      img.className = "lifeimage";
      document.getElementById("lifeimage").appendChild(img);
      document.getElementById("musicbox").src = "../../images/doors/musicbox/" + ((tick % 3) + 1) + ".png";
      img.style.scale = "20%"
      img.style.opacity = "1";
      await sleep(100);

      audio.src = ('../../sounds/doors/musicbox/' + Math.floor(Math.random() * 17) + ".mp3");
      audio.load();
      audio.play();

      img.style.scale = (Math.random() * 100 + 50) + "%";
      await sleep(Math.random() * 500 + 100);
      img.style.opacity = "0";
      await sleep(Math.random() * 200 + 100);
      tick++;
    }
}

loop();