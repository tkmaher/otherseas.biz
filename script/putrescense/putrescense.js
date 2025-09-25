var img = document.getElementById("src");
var parent = document.getElementById("parent");
var parentbook = document.getElementById("parentbook");

var current = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function spark() {
  var spark = document.createElement("div");
  spark.className = "spark";
  spark.innerHTML = "☆";
  parent.appendChild(spark);
  await sleep(1);
  spark.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
  spark.style.fontSize = ((Math.random() * 3) + 1) + "vh";
  spark.style.left = (Math.random() * 100) + '%';
  spark.style.top = (Math.random() * 100) + '%';
}

function pageturn(e) {
  if (e.offsetX > (parentbook.clientWidth / 2)) {
    var src = "../images/putrescense/" + (current + 1) + ".png";
    if (current < 11) {
      img.src = src;
      current += 1;
      spark();
    }
  } else {
    var src = "../images/putrescense/" + (current - 1) + ".png";
    if (current > 0) {
      img.src = src;
      current -= 1;
      spark();
    }
  }
}

img.addEventListener("click", pageturn);