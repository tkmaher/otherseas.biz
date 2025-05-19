function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loading(arr, channel) {
  var high = new Audio('../../sounds/doors/collection/high.mp3');
  high.load()
  var low = new Audio('../../sounds/doors/collection/low.mp3');
  low.load()

  index = 0
  bg = document.getElementById('bg')
  txt = document.getElementById('parent')
  str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890±!@#$%^&*()_+-=§£™¡¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙˚¬…æ«`~Ω≈ç√∫˜µ≤≥÷₩ÈÀÆÃŠŸÛÎÔŒŌŁŽÇÑ"
  while (true) {
    txt.innerHTML = str[index % (str.length - 1)]
    await sleep(50)
    index++
    if (Math.random() < 0.05) {
      txt.innerHTML = '' 
      await sleep(500)
    }
    if (Math.random() < 0.01)
      txt.style.fontSize = "3000px"
    if (Math.random() < 0.01)
      txt.style.fontSize = "6000px"
    if (Math.random() < 0.01)
      txt.style.fontSize = "5000px"
    if (Math.random() < 0.01) {
      if (bg.hidden) {
        high.load()
        high.play()
        bg.hidden = false
      } else {
        low.load()
        low.play()
        bg.hidden = true
      }
    }
  }
  
}