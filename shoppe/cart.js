var parent = document.getElementById("parent");

function update() {
  parent.innerHTML = "";
  let curr = 0;
  var total = 0;
  while (localStorage.getItem(JSON.stringify(curr)) != null) {
    let str = localStorage.getItem(JSON.stringify(curr)).split('\n').filter(x => x.length);
    parent.innerHTML += "<tr><td><a class='button' href=" + str[3] + ">" + str[0] + "</a></td><td>" + str[2] + "</td><td>$" + str[1] + "</td><td class='remove' id=" + curr + ">[X]</td></tr>";
    total += parseFloat(str[1]);
    curr++;
  }
  if (curr == 0) {
    parent.innerHTML += "<tr><td>There's</td><td>nobody</td><td>here</td><td>:'(</td></tr>";
  }
  document.getElementById("total").innerHTML = "$" + total;
  localStorage.setItem("cartcount", curr);

  for (elt of parent.getElementsByClassName("remove")) {
    elt.addEventListener("click", remove);
  }
}
update();

document.getElementById("clear").addEventListener("click", function() {
  let curr = 0;
  while (localStorage.getItem(JSON.stringify(curr)) != null) {
    localStorage.removeItem(JSON.stringify(curr));
    curr++;
  }
  update();
})

function remove(e) {
  let curr = parseFloat(e.target.id) + 1;
  if (localStorage.getItem(JSON.stringify(curr)) != null) {
    while (localStorage.getItem(JSON.stringify(curr)) != null) {
      localStorage.setItem(JSON.stringify((curr - 1)), localStorage.getItem(JSON.stringify(curr)));
      curr++;
    }
    localStorage.removeItem(JSON.stringify(curr-1));
  } else {
    localStorage.removeItem(e.target.id);
  }
  update();
}

