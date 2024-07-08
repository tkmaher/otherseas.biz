
function collapse(target) {
    let next = target.nextSibling;
    for (var timeout = 0; timeout < 1000; timeout++) {
        if (next.className != "collapseDiv") {
            next = next.nextSibling;
        } else {
            break;
        }
    }
    if (target.innerHTML == "[+]") {
        next.style.display = "block";
        target.innerHTML = "[-]";
    } else {
        next.style.display = "none";
        target.innerHTML = "[+]";
    }
}

function collapseHandler(e) {
    let target = e.target;
    collapse(target);
    if (target.id != current) {
        let other = document.getElementById(current);
        if (other.innerHTML == "[-]") {
            collapse(other);
        }
        current = target.id;
    }
}

//requires: collapse buttons have unique ID numbers, first ID must be "1", and be of class "collapse"
//Every collapse button must have a corresponding div after it with classname "collapseDiv" 

var current = "1";
var collapses = document.getElementsByClassName("collapse");
for (let i = 0; i < collapses.length; i++) {
    collapses[i].addEventListener("click", collapseHandler);
}