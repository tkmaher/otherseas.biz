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
'“How many more times will you remember a certain afternoon of your childhood, some afternoon that\'s so deeply a part of your being that you can\'t even conceive of your life without it? Perhaps four or five times more. Perhaps not even that. How many more times will you watch the full moon rise? Perhaps twenty. And yet it all seems limitless.\” - Paul Bowles',
'An fruit that grows underground that sees neither night nor day and knows not suffering; a future of mediocre gray skies and boring nothings; a child born without eyes into a hostile world of Mario-style spike gauntlets.',
'The progress of “Technology“ necessitates the progress of “Machine“. It has nothing to do with the progress of “Peoples“.',
'“Faith is what allows us to believe in a happy ending, even in our moments of greatest sorrow. It is what allows us the hope of rescue even in the most suffocating darkness.“ - Fallout, Equestria',
'“Certain mystes aver that the real world has been constructed by the human mind, since our ways are governed by the artificial categories into which we place essentially undifferentiated things, things weaker than our words for them.\” - Gene Wolfe',
'“Facts are but the Play-things of lawyers,-- Tops and Hoops, forever a-spin... Alas, the Historian may indulge no such idle Rotating. History is not Chronology, for that is left to Lawyers,-- nor is it Remembrance, for Remembrance belongs to the People. History can as little pretend to the Veracity of the one, as claim the Power of the other,-- her Practitioners, to survive, must soon learn the arts of the quidnunc, spy, and Taproom Wit,-- that there may ever continue more than one life-line back into a Past we risk, each day, losing our forebears in forever,-- not a Chain of single Links, for one broken Link could lose us All,-- rather, a great disorderly Tangle of Lines, long and short, weak and strong, vanishing into the Mnemonick Deep, with only their Destination in common.” - Thomas Pynchon',
'“But it is not possible...that evil should be destroyed--for there must always be something opposed to the good; nor is it possible that it should have its seat in heaven. But it must inevitably haunt human life, and prowl about this earth. That is why a man should make all haste to escape from earth to heaven; and escape means becoming as like God as possible; and a man becomes like God when he becomes just and pious, with understanding.” - Plato',
'There is a Light burning that is leering and Snarling, it is intense, not-lovely, and insane. The Light glows in places where no other light would glow, it flickers without any wind, and refuses to go out even under the most-torrential-down-pour. It is insane; it eliminates thought and mind.',
'View from upstairs room (Matt\'s room) -- 2xred car, 1x beige van, 1x white car, 1x blue car, three trees, two flowers, a tree that is almost a bush (but I think it is actually a tree), one person walking, one bike, 8x steps, 2x porches, 2x houses, 10000s of blades of grass, 1x sky, and that\'s it.',
'“The world is indeed bound with secret knots.“ -Athanasius Kircher',
'Imagine a Diesel power robot anime girl being bullied by the solar power anime robot girls because she\'s different and ugly',
'“I held your moss-covered stone\nand the sun disappeared\nas I watched you return\nFrom the rising water\'s edge“',
'~Otherseas1.com~',
'The twicefold noise tone indicates the end of the loop. This allows the user to know when the sounds end and where they begin again.',
'“Fearsome... heart of... His... healing hand. Road ofhealing... Not a long... Take sword... A man... but dew. Heal, O... water-grass! ... O winter... ...falls... snow. That... heal... snow. Take... in hand... heal.“',
'Sleep and this raining morning',
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