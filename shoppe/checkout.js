var total = document.getElementById("total");
alert(total.innerHTML);

let curr = 0;
var total = 0;
while (localStorage.getItem(JSON.stringify(curr)) != null) {
  let str = localStorage.getItem(JSON.stringify(curr)).split('\n').filter(x => x.length); 
  total += parseFloat(str[1]);
  curr++;
}

total.innerHTML = JSON.stringify(total) + "USD";