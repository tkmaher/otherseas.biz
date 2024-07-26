var pics = document.getElementsByClassName("archaicPic");

function showdesc(e) {
    alert(e.target.style.getPropertyValue("--desc"));
}

for (let i = 0; i < pics.length; i++) {
    pics[i].addEventListener("click", showdesc);
}