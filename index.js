const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));
var sidebar = document.getElementById("sidebar");
var openButton = document.getElementById("openButton");
var items = document.getElementById("items");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function open(e) {
    if (sidebar.style.left == "-100%") {
      openButton.innerHTML = "[𖣯]";
      sidebar.style.left = "-10vh";
    } else {
      openButton.innerHTML = "[🗺️]";
      sidebar.style.left = "-100%";
    }
}

openButton.addEventListener("click", open);


$(document).ready(function() {

  if(isMobile) {
    items.style.marginLeft = "1vh";
    sidebar.hidden = "true";
  }

});

/* async function draw() {

  var c1 = document.getElementById("canvas1");
  var c2 = document.getElementById("canvas2");
  var ctx1 = c1.getContext("2d");
  var ctx2 = c2.getContext("2d");


  if (isMobile){
    c1.style.left = '0%';
    c2.style.left = '0%';
  }

  ctx1.strokeStyle = 'gray';
  ctx2.strokeStyle = 'white';
  ctx2.lineWidth = '15';
  ctx2.textAlign = 'center';
  ctx2.textAlign = 'center';
  ctx2.fillStyle = "gray";
  var x1,y1,x2,y2;
  var w = c1.width;
  var h = c1.height;
  //while (true) {
    x1 = 100;
    y1 = Math.random() * (h - 80) + 80;
    ctx1.beginPath();
    var arr=['o','t','h','e','r','s','e','a','s', '1','.','c','o','m'];
    ctx2.font = ((Math.random() * 100) + 50) + "px 'Courier New', monospace";
    ctx2.fillText(arr[0], x1, y1);
    for (i = 1; i < arr.length; i++) {
      await sleep(30);
      x2 = x1 + (w/(arr.length + 1));
      y2 =Math.random() * (h - 80) + 80;
      ctx2.font = ((Math.random() * 100) + 50) + "px 'Courier New', monospace";
      ctx1.moveTo(x2, y2);
      ctx1.lineTo(x1, y1);
      ctx2.fillText(arr[i], x2, y2);
      x1 = x2;
      y1 = y2;
      ctx1.stroke();
    }

    //await sleep(500);

    //ctx1.clearRect(0, 0, w, h);
    //ctx2.clearRect(0, 0, w, h);
  //}
}

draw();
*/