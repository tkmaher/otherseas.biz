parent = document.getElementById("parent");
gridparent = document.getElementById("gridparent");
scroller = document.getElementById("scroller");

isgrid = false;

class entry {
    constructor(title, date, txt, img) {
        this.title = title;
        this.date = date;
        this.txt = txt;
        this.img = img;
    }
}

const entries = [
    new entry("Law", "5/25/2025",
    `Even then I could feel it<br>
    Whispered in the flickering of the fluorescent lamp<br>
    In the hesitation of the scalpel<br>
    In the nervous darting of my patients’ eyes<br><br>
    In my Eden, in my garden of first things<br>
    Even there, I could feel the teeth of the law<br><br>
    Shambling like a fucked-out parade<br>
    The hooked beak of the judge<br>
    His talons stroking the gavel<br>
    The movement of restless wings under his darkening robe<br><br>
    Sinking further in, rising up to efface my light, moreover:<br>
    The jury, like so many rats<br>
    Raping the air with their barbed words<br>
    And the sentence —<br>
    My face pressed up against cold glass <br>
    Shaved heads and telephone wire-marks on our wrists<br>
    Mountains of gravel ground down between our teeth <br>
    And finally hoisted<br>
    Skin stretched for leagues across a red lattice, linked together by strands of saliva<br>
    Bodies piling up to challenge the sun<br><br>
    Even then, the rushing noise of the deluge would build up in my ear<br>
    Sometimes it would get so loud I couldn’t even think<br>
    I’d force myself to ignore it, and call in the next patient`),
    
    new entry("Green Poem", "5/21/2025",
    `On my way home I saw something green on the ground, it was your spine<br> \
    I was surprised to see it on the ground<br> \
    Ants and flies weaved vestigial buta on its surface<br><br> \
    I picked up your spine very carefully, so that it wouldn’t crumble to dust, and looked everywhere for you<br> \
    But you weren’t anywhere<br><br> \
    When I got home I walked a careful path around clean piles of dirt<br> \
    I carelessly tossed your fingers into a plastic bag and put it under the stairs<br> \
    I figured that if you weren’t anywhere, you wouldn’t need them anyway<br> \
    So it didn’t really matter where I put them<br><br> \
    Ten years earlier you were sleeping. I was awake<br> \
    I extended my arms upward, and slowly lifted myself out of the bed<br> \
    I was basically hanging by the tips of my fingernails<br> \
    But when it was time to move my feet, I went too hastily<br> \
    With a loud sound of shattering concrete, I tripped over your eyelashes<br> \
    You were mad but I knew we would end up laughing about it<br><br> \
    The green moon draws facsimile legatos on the sky<br> \
    Seven years have passed and it has yet to complete one stanza`),

    new entry("radio show", "4/30/2025",
    "Listen to my radio show with faulkner on <a href=https://reduxrad.io/shows/loisirs>reduxrad.io</a>",
    "https://s3.us-east-005.backblazeb2.com/redux-test-bucket/hostimages/Loisirs.png"),

    new entry("Happy 2025!", "1/17/2025", 
    "Édouard Manet. <i>The Execution of Emperor Maximilian</i>. 1868<br><br> \
    I updated this blog to have an archive/index feature. Click \"Grid View\" at the top.", 
    "https://d2w9rnfcy7mm78.cloudfront.net/33771627/original_f5e0d2dd6f956cc81092e57d537c68de.jpg?1737170219?bc=0"),
    
    new entry("Song", "10/28/2024", 
    "When the statues have all crumbled<br> \
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
    I could only see my star"),

    new entry("Listening to", "10/7/2024", 
    "<a href=https://www.youtube.com/watch?v=zU1MUqD2q04>Listening to</a>"),

    new entry("Dear diary,", "10/7/2024", "Me testing my blog")
]

const urlParams = new URLSearchParams(window.location.search);
var page = parseInt(urlParams.get('p'));
if (page == null) {
    page = 0;
} else if (!Number.isInteger(page)) {
    page = 0;
} else if (page >= entries.length) {
    page = entries.length - 1;
}
const url = "https://www.otherseas1.com/diary/"
reload(page);

function populateGrid() {
    for (i = 0; i < entries.length; i++) {
        var n = document.createElement("div")
        gridparent.append(n)
        n.innerHTML = "<a style='pointer-events:none'><em>" + entries[i].date + "</em><br><strong>" 
                        + entries[i].title + "</strong></a>" 
        if (entries[i].img) {
            n.style.backgroundImage = 'url(' + entries[i].img + ')'
        }
        n.className = "blogBlock"
        n.id = i;
    }
    gridparent.innerHTML +="<br><br>"
}

function init() {
    parent.innerHTML = ''
    i = page;
    var n = document.createElement("div")
    parent.append(n)
    n.innerHTML = "<em'>" + entries[i].date + "</em><p><strong>" 
                    + entries[i].title + "</strong></p><p>" 
    if (entries[i].img) {
        n.innerHTML += "<img style='max-width:100%; width:70vh' src='" + entries[i].img + "'><br>"
    }
    n.innerHTML += entries[i].txt + "</p>"
    n.className = "blogPost"
    if (page > 0) {
        document.getElementById("new").style.color = 'black';
    } else {
        document.getElementById("new").style.color = '#c7c7c7';
    }
    if ((page+1) < entries.length) {
        document.getElementById("old").style.color = 'black';
    } else {
        document.getElementById("old").style.color = '#c7c7c7';
    }
}

function swap() {
    if (isgrid) {
        isgrid = false
        gridparent.style.display = "none"
        parent.style.display = "contents"
        scroller.style.display = "contents"
        grid.innerText = "Grid view"
    } else {
        isgrid = true
        parent.style.display = "none"
        gridparent.style.display = "contents"
        scroller.style.display = "none"
        grid.innerText = "Normal view"
    }
}

function reload(newpage) {
    newUrl = url + "?p=" + newpage.toString();
    window.location.href = newUrl;
}

function goNew() {
    if (page >0) {
        page--;
        reload(page);
        init();
    }
}

function goOld() {
    if ((page+1) < entries.length) {
        page++; 
        reload(page);
        init();
    }
}

document.getElementById("new").addEventListener("click", goNew)
document.getElementById("old").addEventListener("click", goOld)

document.getElementById("grid").addEventListener("click", swap)

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        swap();
    } else if (event.key == 'ArrowRight') {
        goOld();
    } else if (event.key == 'ArrowLeft') {
        goNew();
    }
});


init(page)
populateGrid()

$( ".blogBlock" ).on( "click", function(event) {
    page = parseInt(event.target.id)
    swap()
    init()
} );

$( ".blogBlock" ).on( "mouseover", function(e) {
    e.target.style.scale = "105%"
  } )
  .on( "mouseout", function(e) {
    e.target.style.scale = "100%"
} );
