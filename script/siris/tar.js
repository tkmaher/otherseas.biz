const canvas = document.getElementById('canv');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 20;

coords = [];

for (i = 0; i < Math.floor(Math.random() * 100); i++) {
    coords.push([Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), Math.floor(Math.random() * -500) - 200]);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

async function drawTar() {
    while(true) {
        for (i = 0; i < coords.length; i++) {
            coords[i][2] += 1;
            if (coords[i][2] > 0) {
                context.beginPath();
                context.arc(coords[i][0], coords[i][1], coords[i][2], 0, 2 * Math.PI, false);
                context.fillStyle = 'black';
                context.fill();
            }
        }
        await(delay(20));
    }
}

drawTar();
