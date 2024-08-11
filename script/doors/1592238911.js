var tick = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('pwd') == false) {
  while(true) {
    alert("Nice try loser");
  }
} else {
  hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
  if (hashCode(urlParams.get('pwd')) != -694358646) {
    while(true) {
      alert("Nice try loser");
    }
  }
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