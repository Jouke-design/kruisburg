// ### Variables ###

// TODO: ## Log ##
// use the temp log to store the user action
let tempLog = {
    mode: '', // log the map mode (cross or star)
    nodes: [], // log the map nodes clicked
    evidence: [] // log the evidence used
};
// use the logs to store temp log
let logs = [];

// ## Misc. ##
// Score of how many guesses the player has already made: crosses or stars placed
let guesScore = 0;
// The right node
const rightAnswer = 19;
// determines wheter the player is currently picking evidence
let isPicking = false;
let r = document.querySelector(':root');

// ## Map ##
let collumnAmount = 8;
let rowAmount = Math.round(collumnAmount * (3/4))
let itemAmount = collumnAmount * rowAmount

let isNodeClicked = false;
// Stores the clicked nodes. Resets when evidence is served.
let clickedNodes = [];
let mapMode = "cross";

let tempGuesScore = 0;

// ## Windows ##
let spbb = document.getElementById('speechBubble');
let idWindow = document.getElementById('idWindow');

// Avatar text animation
let skipTextAnm = false;
// Determines wether the avatar is speaking
let isSpeaking = false;

// stores whats inside of the evidence so you can not add the same evidence twice
let addedEvidence = [];

// Stores the state of the avatar text
let avaState = 0;


// ## Map ##
// Creates grid
document.getElementById("myGrid").style.gridTemplateColumns = `${" auto".repeat(collumnAmount)}`;

for (let i = 1; i <= itemAmount; i++) {
    let node = document.createElement("button");
    node.setAttribute("onclick", "nodeClicked(this.id)");
    node.classList.add("grid-item");
    node.setAttribute("id", i.toString());
    document.getElementById("myGrid").appendChild(node);
} 

function nodeClicked(myId){
    //    console.log(myId);
    skipTextAnm = true;
    // checks state of the node
    if (document.getElementById(myId).style.backgroundImage == ""){
        // if empty -> fill
        if (mapMode == "cross") {
            document.getElementById(myId).style.backgroundImage = "url(img/cross.svg)";
            document.getElementById(myId).style.backgroundColor = "#837c71";
            document.getElementById(myId).style.opacity = "0.8";
            document.getElementById(myId).style.border = "1px solid rgba(0, 0, 0, 0)";
            document.getElementById(myId).style.boxShadow = "";

        } else if (mapMode == "star") {
            document.getElementById(myId).style.border = "1px solid rgba(255, 139, 59, 0)";
            document.getElementById(myId).style.backgroundColor = "rgba(255, 139, 59, 0.2)";

        } else if (mapMode == "dig") {
            // avatar text change: are you sure?
            avatarSay(3);
            // yes/no button window
            idWindow.innerHTML = '<p style="text-align: left;">Ligt hier de schatkist? Deze keuze is definitief.</p> <button onclick="noDig('+myId+')" style="background-image: url(img/tg_btn_no.svg); width: 100px;"></button> <button onclick="dig('+myId+')" style="background-image: url(img/tg_btn_yes.svg); width: 100px;"></button>';
            idWindow.style.display = "block";
            clickedNodes.push(parseInt(myId));
            // change appearance node
            document.getElementById(myId).style.border = "1px solid rgb(255, 93, 93)";
            document.getElementById(myId).style.boxShadow = "0 0 0 2px rgb(255, 93, 93) inset";
            return
        }
        isNodeClicked = true;
        tempGuesScore++;

        // add to clickedNodes
        clickedNodes.push(parseInt(myId));

    } else {
        // if it has something -> empty
        document.getElementById(myId).style.backgroundImage = "";
        document.getElementById(myId).style.backgroundColor = "rgba(0, 0, 0, 0)";
        document.getElementById(myId).style.border = "1px solid rgba(0, 0, 0, 0.3)";
        tempGuesScore--;

        // remove from clickedNodes
        let index = clickedNodes.indexOf(myId);
        if (index > -1) { // only splice array when item is found
            clickedNodes.splice(index, 1);
        }
    }
}

function mouseLeaveMap() {
    if (isNodeClicked) {
        isNodeClicked = false;
        // Where did you get that from?
        avatarSay(1);

        // make identification window appear
        idWindow.style.display = "block";
        isPicking = true;
        togglePicking();
        guesScore += tempGuesScore;
        tempGuesScore = 0;
        console.log("mouse left and clicked| guesScore:", guesScore, " | Nodes clicked: ");
        console.log(clickedNodes);
    }
}

// toggles between map modes
function mapClickMode(mode) {
    console.log(mode);
    // change hover and when node is clicked

    if (mode == "star"){
        r.style.setProperty('--bgimg', 'url(../img/star.svg)');
    } else if (mode == "dig"){
        r.style.setProperty('--bgimg', 'url(../img/shovel.svg)');
    } else{
        r.style.setProperty('--bgimg', 'url(../img/cross.svg)');  
    }
    mapMode = mode;
}

// adds /removes little plusses to the sources
function togglePicking(){
    // get all the buttons
    let buttons = [];
    for (var i = 0; i < 5; i++) {
        buttons[i] = document.getElementById('srcbtn'+(i+1));
    }

    if (isPicking) {
        // add plusses
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].innerHTML = '<img src="img/tg_btn_add.svg">'
        }

    } else {
        // remove plusses
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].innerHTML = ''
        }
    }
}


// Toggle visibility of the sources
function srcVisToggle(num) {
    let x = document.getElementById("src"+num);
    let y = document.getElementById("srcbtn"+num);

    // toggle visibility and change the button appearance
    if (x.style.display === "none") {
        x.style.display = "block";
        y.classList.add("selected");
    } else {
        x.style.display = "none";
        y.classList.remove("selected");
    }

    // if player is picking evidence -> add to evidence list
    if (isPicking) {
        addToEvidence(num);
    }

}


// get inside of response bubble
function addToEvidence(num) {

    for(var i = 0; i < addedEvidence.length; i++) {
        if(addedEvidence[i] == num){
            return;
        }
    }

    addedEvidence.push(num);

    switch(num) {
        case 1:
            idWindow.innerHTML = "<div id='ev1' style='background-image: url(img/tg_testament.png);' onclick='removeEvidence(this)'></div>" + idWindow.innerHTML;
            break;
        case 2:
            idWindow.innerHTML = "<div id='ev2' style='background-image: url(img/tg_schets.png);' onclick='removeEvidence(this)'></div>" + idWindow.innerHTML;
            break;
        case 3:
            idWindow.innerHTML = "<div id='ev3' style='background-image: url(img/tg_kaart_2.png);' onclick='removeEvidence(this)'></div>" + idWindow.innerHTML;
            break;
        case 4:
            idWindow.innerHTML = "<div id='ev4' style='background-image: url(img/tg_kaart_3.png);' onclick='removeEvidence(this)'></div>" + idWindow.innerHTML;
            break;
        case 5:
            idWindow.innerHTML = "<div id='ev5' style='background-image: url(img/tg_logboek.png);' onclick='removeEvidence(this)'></div>" + idWindow.innerHTML;
            break;
        default:
            break;
    }

}

function removeEvidence(me) {
    me.remove();
    for(var i = 0; i < addedEvidence.length; i++) {
        if(addedEvidence[i] == me.id[2]){
            addedEvidence.splice(i, 1);
        }
    }
}

function serveEvidence() {
    // get rid of everything inside the idwindow
    idWindow.innerHTML = '<div class="example_evidence"></div> <button onclick="serveEvidence()"></button>';
    // make the idwindow dissapear
    idWindow.style.display = "none";
    // make avatar say something else
    checkState();
    // the player is no longer picking evidence
    isPicking = false;
    togglePicking();
    // TODO: store the data
    tempLog.mode = mapMode;
    tempLog.nodes = clickedNodes;
    tempLog.evidence = addedEvidence;

    const clone = {...tempLog};
    logs.push(clone);

    // reset evidence served & 
    addedEvidence = [];
    clickedNodes = [];
}

function dig(num) {

    idWindow.style.display = "none";
    avatarSay(4);

    tempLog.mode = mapMode;
    tempLog.nodes = clickedNodes;
    tempLog.evidence = [];

    const clone = {...tempLog};
    logs.push(clone);
    
    localStorage.setItem("logs", JSON.stringify(logs));
    
    console.log(logs);

    // show reveal animation
    setTimeout(function() {
        let showMe = document.getElementsByClassName('revealAnm')[0];
        if (num == rightAnswer) {
            showMe.style.display = 'block';
            avatarSay(7);

        } else {
            showMe.childNodes[1].src = "img/tg_niet_gevonden.png";
            showMe.style.display = 'block';
            avatarSay(8);
        }
    }, 1000);
}

function noDig(num) {
    idWindow.style.display = "none";
    idWindow.innerHTML = '<div class="example_evidence"></div> <button onclick="serveEvidence()"></button>';
    
    // TODO: reset apearance node
    node = document.getElementById(num);
//    console.log(node);
    document.getElementById(num).style.backgroundImage = "";
    document.getElementById(num).style.backgroundColor = "rgba(0, 0, 0, 0)";
    document.getElementById(num).style.border = "1px solid rgba(0, 0, 0, 0.3)";
//    console.log(document.getElementById(num));
}

// Detects when the avatar speechbubble is clicked 
function spbbClicked() {
    //skips avatar text animation
    skipTextAnm = true;

    // goto the next state if relevent
    if (!isSpeaking) {
        checkState();
    }
}

function checkState() {
    if (avaState == 0 && guesScore <= 4) {
        avaState = 1;
        setTimeout(avatarSay(0), 50);
    } else if (avaState == 1 && guesScore <= 4){
        avatarSay(0);
    } else if (guesScore > 4){
        avaState = 2;
        avatarSay(6);

        // enable all disabled buttons
        x = document.getElementsByClassName("disabled");
        for(var i = 0; i < x.length;) {
            x[0].disabled = false;
            x[0].classList.add('btn_highlight_anm');
            x[0].classList.remove('disabled');
        }
    }
}

function avatarSay(textNum) {
    let i = 0;
    let txt = avaText[textNum];
    // controls the speed of the text: low number = fast; high number = slow
    let speed = 20;

    skipTextAnm = false;
    spbb.innerHTML = "";

    function typeWriter() {
        if (i < txt.length && !skipTextAnm) {
            isSpeaking = true;
            spbb.innerHTML += txt[i];
            i++;
            setTimeout(typeWriter, speed);
        } else {
            spbb.innerHTML = txt;
            skipTextAnm = false;
            isSpeaking = false;
        }
    }
    typeWriter();
}

// Stores the text off the avatar
let avaText = [
    "Wat denk je nu? Klik op de vakjes met een kruisje als je denkt dat de schatkist hier kan liggen of een vlaggetje als deze hier niet ligt. Laat me vervolgens weten op welke bron(nen) je dit baseert.", // 0
    "Aan de hand van welke bron(nen) baseer je dit?", // 1
    "Ik denk niet dat dit helemaal correct is, probeer het opnieuw", // 2
    "Ligt hier de schatkist? Deze keuze is definitief.", // 3
    "Laten we gaan graven dan!", // 4
    "Hallo, ik ben Janneke! We zijn er kort geleden achter gekomen dat er een schat is begraven in de omgeving van Kruisburg. We weten nog niet waar, maar met de bronnen die ik heb gevonden geloof ik er in dat we het samen kunnen vinden. We hebben maar genoeg subsidie om in één van de vakken te graven. Als jij alvast op de kaart kan wegstrepen waar de schatkist niet ligt kan ik meer bronnen vinden.", // 5
    "Heel goed! Ik heb in de tussentijd twee extra bronnen gevonden. Dit zijn al de beschikbare bronnen. We kunnen nu ook op een plek gaan graven.", // 6
    "Daar ligt hij inderdaad! Goed gedaan!", // 7
    "Daar ligt niks..." // 8
]

avatarSay(5);