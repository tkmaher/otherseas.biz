var piece1 = document.getElementById("1");
var piece2 = document.getElementById("2");
var piece3 = document.getElementById("3");
var piece4 = document.getElementById("4");

var cloud = document.getElementById("cloud")

var count = 0;

function spawner() {
    if (count == 0) {
        piece1.style.top = '30%';
        piece1.style.left = '30%';
        piece1.style.scale = 1;
    } else if (count == 1) {
        piece2.style.top = '50%';
        piece2.style.left = '70%';
        piece2.style.scale = 1;
    } else if (count == 2) {
        piece3.style.top = '60%';
        piece3.style.left = '40%';
        piece3.style.scale = 1;
    } else if (count == 3) {
        piece4.style.top = '55%';
        piece4.style.left = '50%';
        piece4.style.scale = 1;
    } else if (count == 4) {
        piece1.style.top = '50%';
        piece1.style.left = '50%';
        piece2.style.top = '50%';
        piece2.style.left = '50%';
        piece3.style.top = '50%';
        piece3.style.left = '50%';
        piece4.style.top = '50%';
        piece4.style.left = '50%';
        cloud.style.opacity = 0.5;
        document.body.style.background = 'white';
        piece1.style.filter = 'none';
        piece2.style.filter = 'none';
        piece3.style.filter = 'none';
        piece4.style.filter = 'none';
        cloud.style.animation = 'none';
    }
    count++;
}

cloud.addEventListener("click", spawner);