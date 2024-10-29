parent = document.getElementById("parent");
entries = [
    ["<em>10/28/2024</em><p><b>Song</b><br><br> \
    When the statues have all crumbled<br> \
    And the world is full of nothing<br> \
    And the rain is always running<br> \
    Down a weirdly giant mirror<br><br> \
    When the stage has nothing on it<br> \
    And the puppets bow their faces<br> \
    And the insects fall to pieces<br> \
    Then my star will soon appear<br><br> \
    When the sky was dark and silent<br> \
    And the watchmen were all sleeping<br> \
    Just the haruspex was looking<br> \
    As I skulked across the floor<br><br> \
    Past a thousand doors I hurried<br> \
    And a hundred leagues I traveled<br> \
    And the moon rose up behind me<br> \
    Just to shine upon your door<br><br> \
    And your face was made of silver<br> \
    And I thought that you were sleeping<br> \
    And I ran up to your bedside <br> \
    While I left the door ajar<br><br> \
    Then a tremor split the heavens<br> \
    And a mirror fell from its mounting<br> \
    And within its broken pieces<br> \
    I could only see my star"],

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