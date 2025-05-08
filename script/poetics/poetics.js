var bg = new Audio('../sounds/music/blindpoet.mp3');
bg.loop = true;
bg.load();
bg.muted = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mute() {
  var elt = document.getElementById("mute");
  if (elt.innerHTML == "[Unmute]") {
    elt.innerHTML = "[Mute]";
    bg.muted = false;
    bg.play();
  } else {
    elt.innerHTML = "[Unmute]";
    bg.muted = true;
  }
}

document.getElementById("mute").addEventListener("click", mute)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var clouds = document.getElementById("clouds");
var parent = document.getElementById("parent");
var quotes = ['“I have drawn things since I was six. All that I made before the age of sixty-five is not worth counting. At seventy-three I began to understand the true construction of animals, plants, trees, birds, fishes, and insects. At ninety I will enter into the secret of things. At a hundred and ten, everything--every dot, every dash--will live\” ― Hokusai Katsushika',
'An fruit that grows underground that sees neither night nor day and knows not suffering; a future of mediocre gray skies and boring nothings; a child born without eyes into a hostile world of Mario-style spike gauntlets.',
'There is a Light burning that is leering and Snarling, it is intense, not-lovely, and insane. The Light glows in places where no other light would glow, it flickers without any wind, and refuses to go out even under the most-torrential-down-pour. It is insane; it eliminates thought and mind.',
'~Otherseas1.com~',
'The clockwork hours',
'Blow through',
'The amazing fighters',
'Ontil',
'Hero\'s village',
'The rain song',
'Wounded pylon',
'The lingering echoes of sleep and this raining morning',
'The fallen raindrops are the diary of the sky',
]
var colors = ['#94c2e5','#808684', '#615756', '#000011', '#539cd8'];

async function loop() {
  var multiplier = 0;
  var tick = 0;
  while (true) {
    await sleep(10);
    clouds.style.backgroundPositionX = (tick * 0.1) + "%";
    if (tick % 500 == 0) {
      multiplier = Math.random() - 0.5;
      var marq = document.createElement("div");
      marq.className = "marquee";

      if (multiplier < 0) {
        marq.style.zIndex = -1;
      }
      if (Math.random() > 0.7) {
        marq.style.fontFamily = "'Helvetica Neue'"
      } else if (Math.random() > 0.7) {
        marq.style.fontFamily = "'Garamond'"
      }
      marq.style.top = Math.random() * 100 + '%';
      marq.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      marq.style.transform = "translateX(" + window.innerWidth + "px)";
      marq.style.animation = "my-animation " + ((multiplier * 50) + 40) + "s linear";
      marq.style.fontSize = (3 + (3 * multiplier)) + "vh";

      marq.innerText = quotes[Math.floor(Math.random() * quotes.length)];
      parent.appendChild(marq);
    }
    tick++;
  }
}

loop();