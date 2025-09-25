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