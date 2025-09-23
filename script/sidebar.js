document.getElementById("sidebar").innerHTML = `
            <div id="9items">
                <span class="collapse">Info</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/about/index.html">about</a> <br> 
                    <a class="button" href="/cv/index.html">CV</a> <br> 
                    <a class="button" href="/halloffame/index.html">Links</a> <br> 
                    <a class="button" href="/poetics/index.html">Poetic's</a> <br> 
                    <a class="button" href="/putrescense/index.html">putrescense</a> <br> 
                    <a class="button" href="/lostfound/index.html">lost && found</a> <br> 
                    <a class="button" href="/diary/index.html">Diaries</a> <br> 
                </div>
                <span class="collapse">Projects</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/siris/index.html">Siris</a> <br> 
                    <a class="button" href="/proj/everything/index.html">everything</a> <br> 
                    <a class="button" href="/proj/blenderDJ/index.html">BlenderDJ</a> <br> 
                    <a class="button" href="/proj/the ruined temple/index.html">the ruined temple</a> <br> 
                    <a class="button" href="/proj/tree-notation/index.html">Tree-notation I</a> <br> 
                    <a class="button" href="/proj/doors/index.html">doors</a> <br> 
                </div>
                <span class="collapse">Art</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/art+music/2d.html">Drawings</a> <br> 
                    <a class="button" href="/art+music/3d.html">Renders</a> <br> 
                    <a class="button" href="/art+music/other.html">other/real life</a> <br> 
                    <a class="button" href="/art+music/games.html">games</a> <br> 
                    <a class="button" href="/art+music/Music.html">Music</a> <br> 
                </div>
                <span class="collapse">Contacts</span> <br> 
                <div class="collapseDiv" style="display:none">
                    <a class="button" href="/mailto:os@otherseas1.com" target="_blank">Email</a><br> 
                    <a class="button" href="/https://github.com/tkmaher?tab=repositories" target="_blank">GitHub</a><br> 
                    <a class="button" href="/social/index.html">Social</a> <br>
                </div>
                <a class="button" href="/shoppe/index.html">Shoppe</a><br><br>
            </div>
            ` + document.getElementById("sidebar").innerHTML;


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