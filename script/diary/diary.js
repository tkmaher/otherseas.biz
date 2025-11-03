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
    One day, a cloaked traveller from beyond the hills appeared at the gates of this great palace. The officer of the gate looked him up and down, and asked him his province. “I seek audience with the king,” said the traveller. The officer paused. “You may enter,” he replied, “but I cannot guarantee you will find that which you seek.” With a snap of his fingers, the officer opened the gates and directed the stranger down a shining path encrusted with jewels. Without a word, the traveller walked through.
    <br><br>
    The traveller, driven by desire, hastened down the path. Certain ulterior motives had brought him to the castle. He had spent his years on Earth making a name for himself as a thief. Having heard whispers of the emperor’s wondrous crown, he had come to claim it as his own. The officer’s lack of suspicion at the palace gates had unnerved him. Still, he ventured further into the grounds.
    <br><br>
    After walking for hours and passing countless treasures, the traveller noticed that the sun was beginning to set. He still seemed no closer to the distant spires of the palace proper. So, he laid his supplies down on velvet grass and rested without dreams.
    <br><br>
    The next day, he spied a peacock in a bush. It turned away from him, showing a thousand open eyes. He realized that he had yet to see a single soul in these gardens. Still, he pressed on.
    <br><br>
    The thief continued to walk. He lost track of the days. He felt as if he was traveling backwards. His only companion was his mirrored reflection in the countless, brilliant fountains. Flowers of many colors leered on every side. One day, looking down at his feet, he noticed that the grass had turned to brick. He had reached the foothills of the palace itself, a winding maze of alleys and outposts. Glancing up, he saw a small figure dart into a side street; when he gave chase, he found only a dead end.
    <br><br>
    He climbed up spiral staircases, through reverberant halls, across countless moats and bridges, and past stained glass windows most ornate. The moon above waxed and waned again and again, but the thief ignored his hunger and thirst. His mind was set on his quarry. 
    <br><br>
    With little strength left, he arrived at the base of the greatest tower. He climbed its wide stone steps, hewn of obsidian, and passed through double doors taller than the tallest tree. Therein lay the throne room. A beam of light, flecked with dust, shone upon the throne of the emperor, but the man himself was nowhere to be seen. Upon the throne instead lay the crown.
    <br><br>
    The thief rushed to pick it up, stumbling over his own ragged cloak. He looked down at his hands, and noticed for the first time how wizened and knotted their backs were. He took the crown off of the throne, placed it upon his head, and collapsed into the seat. His eyes closed like heavy doors. He felt that he would be sitting there for a long time to come.
    <br><br>
    <i>September 2024</i>`),

    new entry("Im trying to update the links section of the website", "10-7-2025",
    `<a href="https://www.otherseas1.com/halloffame/mind">Especially the pdf part</a><br>`),

    new entry("The Men Who Carefully Weave Dreams", "10-30-2025",
    `These events took place many years ago. It was around this time that I was living in an apartment building holding many floors. Each floor contained one apartment. I lived on the one-thousandth and twenty-third floor. Above me lived the men who carefully weave dreams.
	I do not remember if the men came to live in the apartment above me before or after I came to live in mine, for there is no time I can recall when they were not living there and I was not living below them. However, they never occupied such grand real estate in my mind until just before the time of this story’s happening. Around this time, I had recently begun a gravely important project that involved the careful numeration of every star in the night sky. Because of the Earth’s revolution under the firmament and a phenomenon known as axial precession, there was no night during which I was not counting and re-counting, drawing tally marks across the walls and all over my body. The task became so totally consuming that I was forced to abandon my diurnal habits, purely for the sake of my own health. I would sleep during the day and count stars at night. It was after a few weeks of this that I found myself regularly awoken from my sun-kissed slumber by faint noises that came from above. There is no singular word that could accurately express the character of these noises. However, they fell into a few distinct categories. For example:
    <br><br>
    The noise that sounded like jointed bones sliding around in sockets.<br>
    The noise that sounded like silverfish crawling across eyelashes.<br>
    The noise that sounded like many colors combining to make one putrid brown hue.<br>
    The noise that sounded like the bob of a pendulum tracing an arc but never reaching its zenith.<br><br>

	(Etc.)
    <br><br>
    Of course, I knew that weaving dreams is no easy task. In fact, I had always admired these men for their steadfast commitment to their art, and I understood that these noises were simply its necessary byproduct. However, it came to a point where even the slightest reverberation from upstairs would wrest me from my slumber. I began to stay up even when it was entirely silent, for fear that I might fall asleep and be consequently awakened. Sleep, once my most steadfast friend, became a licentious maiden whose touch I pined for. At night, the numbers in my head would become confused and confounded with one another, and my tally marks, whose veracity I had once been so sure of, seemed to shift and disappear behind my back. Indeed, it had come to a point where the art of the men upstairs was interfering with my own. One day, I decided something had to be done, so I climbed up the building’s central stairwell to the floor above me. By some effect of the apartment’s insulation or another acoustic idiosyncrasy, the noises from the men’s apartment were significantly louder on their own floor than on mine. If the noises that had been perturbing my rest were like whispers, the noises on this floor, fully clear and amplified, had the loudness of a jet engine or a thunderclap. Being slightly unnerved, I nevertheless walked up to the apartment door and knocked loudly. Even though the knock was totally drowned out by the din, something unusual happened: almost immediately, the noises coming from within the apartment ceased. I waited for a time, but nobody came to the door. After knocking some more, I left, satisfied that I had been successful in quelling the horrible sounds. As I thought about it more, however, misgivings began to foment within me: why had the men refused to come to the door? Why had the sounds stopped immediately after I knocked? Could it be that nobody was in the apartment at all? I thought it best to ignore these thoughts, as sleep, faithful once more, beckoned me to enjoy her pleasures. I had scarcely closed my eyes when I entered into a restful slumber, the likes of which I had not enjoyed in weeks.
    <br><br>
    I found myself in a beige wheat field under a dark gray sky. A brisk wind pierced my flesh, and I noticed that the plants in the field had all withered away. Before me was a ladder, which led down a hole into the earth. To escape the frigid environs, I chose to climb down it. The ladder terminated in a subterranean hallway of crude design, dimly lit by no apparent source. As my eyes adjusted, I started at what I saw: two rows of human figures lined each side of the hallway, their faces pressed close against the earthen walls. Each man stood about ten paces from the men to his left and right. They were uniformly hairless and muscular, with a sickly yellow skin tone. My own body appeared similar to theirs, but I was not sure if it had always appeared this way or if this was some kind of new development. The hallway curved slightly, such that its terminus was never visible. I ventured forward to see if any changes would present themselves, but came to find that the rows of men continued ad infinitum. All attempts to communicate with them proved fruitless. When I stood closely to one of them in order to observe his face, his head quickly snapped away from me, only returning to its former position once I had stepped away. I strode over many leagues, but observed little change in the hallway beyond a slight darkening of its eerie light. Finally, I saw something amiss: there were two men standing unusually far apart from one another, with a gap between them that could easily accommodate a third. Without hesitation, I stepped into the gap and placed my face against the wall. 
	<br><br>When I awoke, the stars had come out. Despite it being the hour of my industry, I couldn’t bring myself to begin the night’s tally. Something about the dream—no, it would be more apt to call it a nightmare—had shaken my spirit. My mind instantly turned to the unusual events of the past day and my attempt to silence the men upstairs. I was struck by a grim realization: the men were unquestionably the ones behind my horrific nightmare! I rushed outside to call the police. I knew that a public telephone was located on the first floor of the building. However, when I arrived at the stairwell, I found that the level of the sea had risen through the stories of the apartment building to lap at my feet. Given that there was no other telephone and no alternative form of egress, I decided that I had to confront the men directly. I marched up the stairs and banged resolutely on their door.
	<br><br>“Cowards! Terrorizers! Tormentors!” I cried. “You devils, who disregard the fundamental tenets of etiquette! I may be just a man, but I, like all men, deserve a basic level of respect! To disregard this right is to disregard reason, morality, and all the things that separate us from common beasts! You have trespassed upon my psyche! You have committed a total violation of my mind, worse than the worst of the corporeal crimes, and you must rightly atone!”
	<br><br>I continued to knock on the door. After a few minutes, I heard footsteps on the other side. The door opened a crack, but the chain of the deadbolt was fastened. I sensed the presence of a man but could not see him. After a moment, a deep yet reserved voice resounded from within:
	<br><br>“Could you please be quiet?” said the voice. “We are trying to sleep.”
	<br><br>His curt reply made my blood boil. “You’re trying to sleep? I’ve been trying to sleep for the past month, to no avail! Your horrible noises have kept me awake to the point of madness. You’re probably cooking up more nightmares to send to other poor souls, no doubt. I won’t be quiet. I’ll make as much noise as I want!”
	<br><br>The man seemed to pause. I heard whispers beyond the door but couldn’t make anything out. After a time, he said:
	<br><br>“It would be best if you left now.” 
	<br><br>“That’s ridiculous!” I exclaimed. “I won’t leave until you issue me an apology and swear to stop trespassing on my mind.”
	<br><br>He paused again. “Well,” he began, “it seems that you have some kind of stubborn fixation concerning us and our labor, and that you aren’t one to go away easily. I will begin by saying that we will not, under any circumstances, be issuing you an ‘apology.’ Our work, unlike your facile star-counting, is important work. It is essential work. It is infinitely complex. Perhaps you think you understand its import, its essence, its complexity, simply because you have experienced a few thousand dreams in your short life. This notion is entirely laughable. Without our dreams, the world would cease to spin, and the stars you so naïvely idolize would all blink out. We, the servants of dreams, uphold a sacred duty. To apologize for performing our duty would be totally out of the question, don’t you see? It would be an affront to all that is good and right. How can you claim to know anything about our work? Only we dream-servants understand its true nature. Perhaps you see the shiny exteriors of dreams and fancy yourself their scholar, but you are infinitely far from any true knowledge of the object. It’s like claiming to have knowledge of a clock without understanding the ticking of the gears inside, or without even knowing that those gears exist. I don’t want to spend too many words trying to explain things to you that you won’t get, but even the gears within dreams have gears, and those gears likewise. No matter how far into the thing you look, you will never really comprehend its totality. Please, don’t try to enter into matters that you will never understand! You’ll only embarrass yourself. Be content with the knowledge that you and all the other fools of this world are cattle, and our dreams are the slaughterhouse. Now, it’s time for you to leave. I have spoken long enough, and I prefer not to waste my breath on madmen.”
    <br><br>I was taken aback by the dream-weaver’s bare contempt. I tried to form a reply. “But,” I sputtered, “what about the nightmare? I don’t want any more dreams like that!”
    <br><br>The man let out an exasperated sigh. “You aren’t satisfied with my explanation? Very well,” he continued. “We are not going to cease interfering with your mind. We will continue to provide you with dreams at our own discretion. You call it ‘trespassing’—it is really anything but! You fancy your mind your own, but if it can be so easily molded and influenced by us, it is more rightly ours. It’s clear from your indignation that you’ve been obsessing over us for months, but all you’ve done is open yourself entirely to us and duly invite us in. Concerning the so-called ‘nightmare’ you had the privilege of witnessing: it is a rare occurrence that a lowly individual such as yourself receives a dream directly tailored for him. In fact, if you were wise, you would be groveling at our feet, thanking us for choosing to enlighten your stupid, thoughtless mind with such a wonderful dream. But you are not wise, and you instead take offense at our gift. That’s the other thing about you—you speak of ‘reason’, ‘morals’, and ‘etiquette’ as if they were objective things that exist somewhere in this world, but you treat them merely as rhetorical toys that exist only to prop up your misguided reason! Your own breaches of etiquette—interrupting our craft, deriding our wonderful dream, banging on our door in the middle of the night—seem to be totally OK in your twisted framework of relativistic morals. You mention our crimes — what are those? Making almost imperceptible noises (during the daylight hours, mind you)? Sending you a beautiful dream specifically crafted for your own pleasure? Yes, for this, we must be eternally penitent. Apology is not enough! Hang us! Kill us! Even in death, we wouldn’t be able to atone for such heinous transgressions. No, in choosing to deride us, you’ve only revealed your own stupidity. Hopefully, my words have shed some light on your rational failings, but I doubt that they will lead to any true self-reflection on your behalf. Good night!”
	<br><br>The man slammed the door shut, and silence returned to the hallway. In a daze, I walked back to my apartment and decided that it would be for the best if I counted some stars, if only to take my mind off the man’s callous words. However, when I looked out the window, I couldn’t see anything. To my dismay, I realized that the ocean had risen up to swallow the sky.

    <br><br>
    <i>September 2025</i>
    `),
]

const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
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
        reset();
    }
}

function reload(newpage) {
    newUrl = url + "?p=" + newpage.toString();
    window.history.pushState({}, "", newUrl); 
    document.title = "Diary | " + entries[newpage].title;
}

function reset() {
    newUrl = url;
    window.history.pushState({}, "", newUrl); 
    document.title = "Diary";
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
