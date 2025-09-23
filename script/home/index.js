const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));
var sidebar = document.getElementById("sidebar");
var openButton = document.getElementById("openButton");
var items = document.getElementById("items");



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
    items.style.marginLeft = "2vh";
    sidebar.hidden = "true";
  }

  $("#diary").load("../../diary/index.html");
});
