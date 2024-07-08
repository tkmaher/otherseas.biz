const isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent));
var sidebar = document.getElementById("sidebar");
var openButton = document.getElementById("openButton");

function open(e) {
    if (sidebar.style.left == "-100%") {
      openButton.innerHTML = "𖣯";
      sidebar.style.left = "-10vh";
    } else {
      openButton.innerHTML = "🗺️";
      sidebar.style.left = "-100%";
    }
}

if(isMobile) {
  sidebar.hidden = "true";
}

openButton.addEventListener("click", open);