// ## Log ##
let logs = JSON.parse(localStorage.getItem("logs"));

function createMap(mode, nodes, evi) {

    let container = document.createElement("div");
    container.style.width = '500px';
    container.style.padding = '20px';
    container.style.aspectRatio = '1/1';
    container.style.borderRadius = '30px'
    container.style.backgroundColor = 'var(--clrwhite)';
    container.style.margin = '30px';
    container.style.float = 'left';
    container.style.boxShadow = '#0000006e 0px 5px 13px, inset 0 -20px 1px var(--clrlion)';
    container.style.animation = 'unfold 0.2s linear';

    let header = document.createElement("h2");
    if (mode == 'cross'){
        header.innerHTML = "Hier ligt de schat niet: <img src='img/cross.svg' width= '20px'></img>";
    }
    else if (mode == 'star'){
        header.innerHTML = "Hier verdacht ik dat de schat lag: <img src='img/star.svg' width= '20px'></img>";
    }
    else {
        header.innerHTML = "Hier ligt de schat: <img src='img/shovel.svg' width= '20px'></img>";
    }

    let map = document.createElement("div");
    map.classList.add("grid-container");

    let collumnAmount = 8;
    let rowAmount = Math.round(collumnAmount * (3/4))
    let itemAmount = collumnAmount * rowAmount

    map.style.gridTemplateColumns = `${" auto".repeat(collumnAmount)}`;
    map.style.width = '500px';
    map.style.position = 'inherit';

    for (let i = 1; i <= itemAmount; i++) {
        // All nodes in the grid
        let node = document.createElement("div");
        //        node.classList.add("grid-item");
        node.setAttribute("id", i.toString());
        node.style.opacity = '0.8';
        node.style.backgroundColor = 'var(--clrwhite)';

        for (let j = 0; j < nodes.length; j++){
            // All nodes selected by the player
            if (i == nodes[j]){
                node.style.opacity = '0.5';
                if (mode == 'cross'){
                    node.style.backgroundImage = 'url(img/cross.svg)';
                }
                else if (mode == 'star'){
                    node.style.backgroundImage = 'url(img/star.svg)';
                }
                else {
                    node.style.border = "1px solid rgb(255, 93, 93)";
                    node.style.boxShadow = "0 0 0 2px rgb(255, 93, 93) inset";
                }
                node.style.backgroundColor = '#fcfbe524';
            } else {
                node.style.border = '1px solid rgba(120, 60, 30, 0.2)';
            }
        }
        map.appendChild(node);
    }

    let subheader = document.createElement("h3");
    if (mode == "cross" || mode == "star") {
        subheader.innerText = "Bewijs:";
    }

    let evidence = document.createElement("div");
    for (let i = 0; i <= evi.length; i++) {

        switch(evi[i]) {
            case 1:
                evidence.innerHTML = "<div id='ev1' style='background-image: url(img/tg_testament.png); width: 100px; height: 100px; background-position: center; background-size: cover; float: left; margin: 10px;' onclick='removeEvidence(this)'></div>" + evidence.innerHTML;
                break;
            case 2:
                evidence.innerHTML = "<div id='ev2' style='background-image: url(img/tg_schets.png); width: 100px; height: 100px; background-position: center; background-size: cover; float: left; margin: 10px;' onclick='removeEvidence(this)'></div>" + evidence.innerHTML;
                break;
            case 3:
                evidence.innerHTML = "<div id='ev3' style='background-image: url(img/tg_kaart_2.png); width: 100px; height: 100px; background-position: center; background-size: cover; float: left; margin: 10px;' onclick='removeEvidence(this)'></div>" + evidence.innerHTML;
                break;
            case 4:
                evidence.innerHTML = "<div id='ev4' style='background-image: url(img/tg_kaart_3.png); width: 100px; height: 100px; background-position: center; background-size: cover; float: left; margin: 10px;' onclick='removeEvidence(this)'></div>" + evidence.innerHTML;
                break;
            case 5:
                evidence.innerHTML = "<div id='ev5' style='background-image: url(img/tg_logboek.png); width: 100px; height: 100px; background-position: center; background-size: cover; float: left; margin: 10px;' onclick='removeEvidence(this)'></div>" + evidence.innerHTML;
                break;
            default:
                break;
        }
    }

    container.appendChild(header);
    container.appendChild(map);
    container.appendChild(subheader);
    container.appendChild(evidence);

//    document.body.appendChild(container);
    document.getElementsByClassName('holder')[0].appendChild(container);
}

function controller(){
    console.log(logs);
    
    let i = 0
    
    function showCard(){
        if(i < logs.length){
            createMap(logs[i].mode, logs[i].nodes, logs[i].evidence);
        } else {
            return
        }
        i++;
        setTimeout(showCard, 300);
    }
    
    showCard();
//    for (let i = 0; i < logs.length; i++){
//        createMap(logs[i].mode, logs[i].nodes, logs[i].evidence);
//    }
    
}