var spotlight = document.getElementById("spotlight");
var carousel = document.getElementsByClassName("carouselIMG");

const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));

function focus(e) {
  spotlight.src = e.target.style.backgroundImage.slice(4, -1).replace(/"/g, "");
}

for(const child of carousel) {
  child.addEventListener("click", focus);
}

if (isMobile) {
  document.getElementById("carousel").style.float = "none";
}

/*var price = document.getElementById("price");
var qty = document.getElementById("qty");

document.getElementById("+qty").addEventListener("click", function() {
  price.innerHTML = (parseFloat(price.innerHTML) / parseFloat(qty.innerHTML)) * (parseFloat(qty.innerHTML) + 1);
  qty.innerHTML = ' ' + (parseFloat(qty.innerHTML) + 1) + ' '; 
});

document.getElementById("-qty").addEventListener("click", function() {
  if (parseFloat(qty.innerHTML) > 1) {
    price.innerHTML = (parseFloat(price.innerHTML) / parseFloat(qty.innerHTML)) * (parseFloat(qty.innerHTML) - 1);
    qty.innerHTML = ' ' + (parseFloat(qty.innerHTML) - 1) + ' '; 
  }
});


function store(e) {
  let storageNum = 0;

  while(localStorage.getItem(JSON.stringify(storageNum)) != null) {
    storageNum++;
  }
  localStorage.setItem(JSON.stringify(storageNum), document.title + '\n' + price.innerHTML + '\n' + qty.innerHTML + '\n' + window.location.href);
  localStorage.setItem("cartcount", JSON.stringify(parseFloat(localStorage.getItem("cartcount")) + 1));
  document.getElementById("cartItems").innerHTML = localStorage.getItem("cartcount");
}
document.getElementById("addtocart").addEventListener("click", store);*/