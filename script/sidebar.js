document.getElementById("sidebar").innerHTML = `
            <div id="9items">
                <a class="button" href="/index.html">otherseas1.com</a> <br><br>
                <span class="collapse">Info</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/about/index.html">about</a> <br> 
                    <a class="button" href="/cv/index.html">CV</a> <br> 
                    <a class="button" href="/diary/index.html">Diaries</a> <br> 
                    <a class="button" href="/halloffame/index.html">Links</a> <br> 
                </div>
                <span class="collapse">Work</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/tech/index.html">Coding</a> <br> 
                    <a class="button" href="/music/index.html">Music</a> <br> 
                    <a class="button" href="/drawings/index.html">Drawings</a> <br> 
                    <a class="button" href="/other/index.html">Real life</a> <br> 
                    <a class="button" href="/games/index.html">Games</a> <br> 
                    <a class="button" href="/siris/index.html">Film</a> <br> 
                </div>
                <span class="collapse">Play</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/poetics/index.html">Poetic's</a> <br> 
                    <a class="button" href="/putrescense/index.html">putrescense</a> <br> 
                    <a class="button" href="/lostfound/index.html">lost && found</a> <br> 
                    <a class="button" href="/theruinedtemple/index.html">the ruined temple</a> <br> 
                    <a class="button" href="/doors/index.html">doors</a> <br> 
                </div>
                <span class="collapse">Contacts</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="mailto:os@otherseas1.com" target="_blank">Email</a><br> 
                    <a class="button" href="https://github.com/tkmaher?tab=repositories" target="_blank">GitHub</a><br> 
                    <a class="button" href="/social/index.html">Social</a> <br>
                </div>
                <a class="button" href="/shoppe/index.html">Shoppe</a><br><br>
            </div>
            ` + document.getElementById("sidebar").innerHTML;

            //<a class="button" href="/renders/index.html">Renders</a> <br> 

let buttons = document.querySelectorAll('a[href*="' + window.location.pathname + '"');
if (buttons.length == 0 && localStorage.getItem("currRoute")) {
    buttons = document.querySelectorAll('a[href*="' + localStorage.getItem("currRoute") + '"');
} else {
    localStorage.clear();
}
if (buttons.length > 0) {
    let button = buttons[0]
    button.style.setProperty("font-weight", "bold");
    button.parentElement.style.setProperty("display", "block");
    localStorage.setItem("currRoute", window.location.pathname);
}


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