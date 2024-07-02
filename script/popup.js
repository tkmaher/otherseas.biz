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
