
const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));

function changeImg1(e) {
  e.target.src = e.target.style.getPropertyValue('--img2');
}
function changeImg2(e) {
  e.target.src = e.target.style.getPropertyValue('--img1');
}

function itemize(text) {
  var parent = document.getElementById("itemsParent");

  var items = text.split('\n').filter(x => x.length);
  for (let i = 0; i < items.length; i++) {
    var elt = document.createElement("div");
    elt.style = items[i];
    elt.className = "shopTxt";
    var img = new Image();
    img.style.setProperty('--img1', elt.style.getPropertyValue('--img1'));
    img.style.setProperty('--img2', elt.style.getPropertyValue('--img2'));
    img.className = 'shopImg';
    img.src = img.style.getPropertyValue('--img1');
    img.addEventListener("mouseenter", changeImg1);
    img.addEventListener("mouseleave", changeImg2);
    var a = document.createElement("a");
    a.href =  elt.style.getPropertyValue('--link');
    a.appendChild(img);
    elt.appendChild(a);

    elt.innerHTML += elt.style.getPropertyValue('--name') + '<br><br>$' + elt.style.getPropertyValue('--price') + '<br><br><br><br>';

    parent.appendChild(elt);

  }

  if (isMobile) {
    parent.style.right = "auto";
    document.getElementById("headpic").hidden = true;
  }
}