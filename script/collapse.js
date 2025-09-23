
function collapse(target) {
    let next = target.nextSibling;
    for (var timeout = 0; timeout < 1000; timeout++) {
        if (next.className != "collapseDiv") {
            next = next.nextSibling;
        } else {
            break;
        }
    }
    if (next.style.display == "none") {
        next.style.display = "block";
    } else {
        next.style.display = "none";
    }
}

function collapseHandler(e) {
    let target = e.target;
    collapse(target);
}



var collapses = document.getElementsByClassName("collapse");
var lst = new Array(collapses.length).fill(false);
for (let i = 0; i < collapses.length; i++) {
    collapses[i].addEventListener("click", collapseHandler);
}