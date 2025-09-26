var img = document.getElementById("src");
var parentbook = document.getElementById("parentbook");

var current = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function pageturn(e) {
  if (e.offsetX > (parentbook.clientWidth / 2)) {
    var src = "../images/putrescense/" + (current + 1) + ".png";
    if (current < 11) {
      img.src = src;
      current += 1;
    }
  } else {
    var src = "../images/putrescense/" + (current - 1) + ".png";
    if (current > 0) {
      img.src = src;
      current -= 1;
    }
  }
}

img.addEventListener("click", pageturn);