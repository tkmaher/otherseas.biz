parent = document.getElementById("parent");
entries = [
    ["<em>10/7/2024</em><p><a class='button' href=https://www.youtube.com/watch?v=zU1MUqD2q04>Listening to</a>"],
    ["<em>10/7/2024</em><p><strong>Dear diary,</strong><p>Me testing my blog"],
]

page = 0;

function init() {
    parent.innerHTML = ''
    i = page*5;
    while (i < ((page+1) * 5) && i < entries.length) {
        var n = document.createElement("div")
        parent.append(n)
        n.innerHTML = entries[i]
        n.className = "blogPost"
        i++
    }
    if (page > 0) {
        document.getElementById("new").style.color = 'black';
    } else {
        document.getElementById("new").style.color = '#616161';
    }
    if ((page+1) * 5 < entries.length) {
        document.getElementById("old").style.color = 'black';
    } else {
        document.getElementById("old").style.color = '#616161';
    }
}

document.getElementById("new").addEventListener("click", function(){ if (page >0) {page--; init()} })
document.getElementById("old").addEventListener("click", function(){ if ((page+1)*5 < entries.length) {page++; init()} })

init(0)