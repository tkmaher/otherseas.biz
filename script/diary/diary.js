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
    new entry("Dear diary,", "10-7-2024", "Me testing my blog"),

    new entry("Listening to", "10-7-2024", 
    "<a href=https://www.youtube.com/watch?v=zU1MUqD2q04>Listening to</a>"),

    new entry("Song", "10-28-2024", 
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

    new entry("Happy 2025!", "1-17-2025", 
    "Édouard Manet. <i>The Execution of Emperor Maximilian</i>. 1868<br><br> \
    I updated this blog to have an archive/index feature. Click \"Grid View\" at the top.", 
    "https://d2w9rnfcy7mm78.cloudfront.net/33771627/original_f5e0d2dd6f956cc81092e57d537c68de.jpg?1737170219?bc=0"),
    
    new entry("radio show", "4-30-2025",
    "Listen to my radio show with faulkner on <a href=https://reduxrad.io/shows/loisirs>reduxrad.io</a>",
    "https://s3.us-east-005.backblazeb2.com/redux-test-bucket/hostimages/Loisirs.png"),

    new entry("Green Poem", "5-21-2025",
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

    new entry("Law", "5-25-2025",
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

    new entry("Insect poem", "6-18-2025",
    `In the cool shade of the Golden Pavilion, those insects who only come out under the cover of darkness held a tribunal<br>
    To amend the rights of the dead and dying, and to deliver them<br>
    Further into their strange dark world, and away from our own<br>
    <br>
    The defendant was a cold, emaciated photograph<br>
    The photograph depicted two pears and an apple<br>
    His bones, writhing under musculature, directed his canvas limbs to lurch and sway<br>
    Silently signing treatise after treatise<br>
    <br>
    The juniper-bug began:<br>
    “It is clear to all, that the body in question<br>
    Has committed an offense so grievous,<br>
    So indelibly atrocious,<br>
    That even those twin maidens of virtue ("Truth" and "Reason") have been compelled to bow their heads in shame.<br>
    In the face of such a heinous transgression,<br>
    Our system of ideal law <br>
    (Which has yet to fail)<br>
    Has turned mute, and it becomes apparent<br>
    That we lack the language to adequately address the usual questions, or to even ask them in the first place.<br>
    Cross-examination becomes cannibalism<br>
    Foreclosure of evidence becomes murder-suicide<br>
    And even if we were to arrive at a verdict, its inadequacy might castrate us<br>
    Or even drive us to madness.”<br>
    <br>
    “Hear, hear!”<br>
    Said the giant mantis.<br>
    “It is wholly the case,<br>
    Preterite notwithstanding,<br>
    That questions such as ‘Are they innocent?’ or<br>
    ‘Are they guilty?’<br>
    No longer have any cogency<br>
    That their meanings have been stripped away, leaving only bare, indolent ululations <br>
    Which pollute the air as if born from the mouth of a blind idiot.<br>
    All I’m saying <br>
    And I’m sure you will agree<br>
    Is that the language of law is no longer our language.<br>
    If we were to continue to use it<br>
    We would only fall into the defendants’ grand design<br>
    As they have twisted and expropriated our language to align with their own means<br>
    (As they tend to do with anything that is pure).<br>
    Gentlemen!<br>
    We must not stoop to their level.”<br>
    <br>
    The spider-king chimed in:<br>
    “Absolutely.<br>
    I couldn’t agree more.<br>
    Clearly, the best place to begin<br>
    Is at the end.<br>
    Let’s forgo the miseries of lawful procedure:<br>
    Those only serve to alienate us from ourselves, anyway.<br>
    Let us return our selves to ourselves<br>
    And deliver a punishment of a strictly passionate nature.<br>
    Punishment, if one can rightly call it that —<br>
    What we promise is not punishment.<br>
    It is a return to the natural order of things<br>
    Prophecy made real<br>
    And an overdue exorcism of the historical record<br>
    Which has, up until now, been a veritable playground for devils and fiends.”<br>
    <br>
    All the bugs murmured in agreement<br>
    The moon flickered in the sky, and they breathlessly spun up their ultimate verdict<br>
    I was asleep<br>
    I was deep under the ocean`),

    new entry("Story", "8-26-2025",
    `In a country far from here, in a place now distant, in a time without memory, there lived an emperor with a castle most majestic.
    <br><br>
    The walls of the castle were taller than the mountains. Its courtyards were swathed in every variety of flower, and were home to animals without name. Its gardens stretched to the horizon, and its battlements stretched to the sea. It was said that an anvil dropped from the highest parapet would fall seven days before reaching the Earth, and seven more before reaching the depths of the castle’s deepest dungeon. 
    <br><br>
    The wonders of the Emperor’s palace were kept in their eternal resplendence by an enchanted crown. Mystes aver that as long as the emperor wore it, no entropy could hope to possess his spires and courtyards. But it was whispered that, if he were to take it off, the entire kingdom would crumble to dust.
    <br><br>
    One day, a cloaked traveller from beyond the hills appeared at the gates of this great palace. The officer of the gate looked him up and down, and asked him his province. “I seek audience with the king,” said the traveller. The officer paused. “You may enter,” he replied, “but I cannot guarantee you will find that which you seek.”. With a snap of his fingers, the officer opened the gates and directed the stranger down a shining path encrusted with jewels. Without a word, the traveller walked through.
    <br><br>
    The traveller, driven by desire, hastened down the path. Certain ulterior motives had brought him to the castle. He had spent his years on Earth making a name for himself as a thief. Having heard whispers of the emperor’s wondrous crown, he had come to claim it as his own. The officer’s lack of suspicion at the palace gates had unnerved him. Still, he ventured further into the grounds.
    <br><br>
    After walking for hours and passing countless treasures, the traveller noticed that the sun was beginning to set. He still seemed no closer to the distant spires of the palace proper. So, he laid his supplies down on velvet grass and rested without dreams.
    <br><br>
    The next day, he spied a peacock in a bush. It turned away from him, showing a thousand open eyes. He realized that he had seen not one soul in these great gardens. Still, he pressed on.
    <br><br>
    The thief continued to walk. He lost track of the days. He felt as if he was walking backwards. His only companion was his mirrored reflection in the endless brilliant fountains. Flowers of many colors leered on every side. One day, looking down at his feet, he noticed that the grass had turned to brick. He had reached the foothills of the palace itself, a winding maze of alleys and outposts. Glancing up, he saw a small figure dart into a side street; when he gave chase, he found only a dead end.
    <br><br>
    He climbed up spiral staircases, through reverberant halls, across countless moats and bridges, and past stained glass windows most ornate. The moon above waxed and waned again and again, but the thief ignored his hunger and thirst. His mind was set on his quarry. 
    <br><br>
    With little strength left, he arrived at the base of the greatest tower. He climbed its great stone steps, hewn of obsidian, and passed through double doors taller than the tallest tree. Therein lay the throne room. A beam of light, flecked with dust, shone upon the throne of the emperor, but the man himself was nowhere to be seen. Upon the throne instead lay the crown.
    <br><br>
    The thief rushed to pick it up, stumbling over his own ragged cloak. He looked down at his hands, and noticed for the first time how wizened and knotted their backs were. He took the crown off of the throne, placed it upon his head, and collapsed into the seat. His eyes closed like heavy doors. He felt that he would be sitting there for a long time to come.
    <br><br>
    <i>September 2024</i>`),
]

const url = "https://www.otherseas1.com/diary"
const urlParams = new URLSearchParams(window.location.search);
var page = parseInt(urlParams.get('p'));
if (page == null) {
    page = entries.length - 1;
    reload(page);
} else if (!Number.isInteger(page)) {
    page = entries.length - 1;
    reload(page);
} else if (page >= entries.length) {
    page = entries.length - 1;
    reload(page);
} else if (page < 0) {
    page = 0;
    reload(page);
}

function populateGrid() {
    for (i = entries.length - 1; i >= 0; i--) {
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
    n.innerHTML = "<em>" + entries[i].date + "</em><p><strong>" 
                    + entries[i].title + "</strong></p><p>" 
    if (entries[i].img) {
        n.innerHTML += "<img style='max-width:100%; width:70vh' src='" + entries[i].img + "'><br>"
    }
    n.innerHTML += entries[i].txt + "</p>"
    n.className = "blogPost"
    if (page < (entries.length - 1)) {
        document.getElementById("new").style.color = 'black';
    } else {
        document.getElementById("new").style.color = '#c7c7c7';
    }
    if (page > 0) {
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
        reload(page);
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
    //window.history.pushState({}, "", newUrl); // todo: fix this and have better sharing
    document.title = "Diary | " + entries[newpage].title;
}

function goNew() {
    if ((page+1) < entries.length) {
        page++;
        reload(page);
        init();
    }
}

function goOld() {
    if (page > 0) {
        page--; 
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
