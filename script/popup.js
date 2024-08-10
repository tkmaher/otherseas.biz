var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

function popup() {
	elt = document.getElementById('thesis');
	if (elt.style.opacity != '1') {
	  elt.style.opacity = '1';
      elt.style.pointerEvents = 'auto';
	} else {
	  elt.style.opacity = '0';
      elt.style.pointerEvents = 'none';
	}
}

document.getElementById("openInfo").addEventListener("click", popup);
document.getElementById("closeInfo").addEventListener("click", popup);

$(document).keyup(function(e) {
	if (e.key === "Escape") { 
		popup();
   }
});