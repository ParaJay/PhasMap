const text = document.getElementById("text");
const ghostName = document.getElementById("ghostName");
const buttons = document.getElementsByTagName("button");

const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
]

const keys = {};

var selected;

const info = {}

async function init() {
    for(let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];

        await readInfo(ghosts[i]).then(e => info[ghost] = e);

        let k = keys[ghost] ? keys[ghost] : [];

        k.push(ghost.charAt(0));

        if(ghost.includes("The ")) k.push(ghost.replace("The ", "").charAt(0));

        keys[ghost] = k;
    };

    initButtons();

    let def = "Banshee";

    let query = window.location.search;

    if(query) {
        let params = new URLSearchParams(query);
        let ghost = params.get("ghost");

        if(ghost) def = ghost.replaceAll("%20", " ");
    }

    select(def);
}

function initButtons() {
    let left = document.getElementsByClassName("btns-left")[0];
    let right = document.getElementsByClassName("btns-right")[0];

    for(let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        let button = createButton(ghost);

        button.onclick = () => select(ghost);

        if(i % 2 == 0) {
            left.appendChild(button);
        } else {
            right.appendChild(button);
        }
    }
}

function createButton(text) {
    let button = document.createElement("button");

    button.textContent = text;
    button.style.margin = "6px 6px";
    button.style.borderRadius = "12%";
    button.style.color = "rgb(202, 201, 201)";
    button.style.backgroundColor = "rgb(78, 80, 82)";
    button.style.borderColor = "rgb(94, 97, 98)";
    button.style.padding = "5px 4px";

    return button;
}

function readInfo(ghost) {
    ghost = ghost.toLowerCase().replace(" ", "");

    return new Promise((resolve) => {
        var request = new XMLHttpRequest();
        request.open('GET', `./ghosts/res/${ghost}.txt`, true);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');

                if (type.indexOf("text") !== 1) {
                    resolve(request.responseText);
                }
            }
        }
    });   
}

function select(ghost) {
    if(selected == ghost) return;

    selected = ghost;
    text.textContent = info[ghost];
    ghostName.textContent = ghost;

    updateButtons();
}

function updateButtons() {
    for(let i = 0; i < buttons.length; i++) {
        let text = buttons[i].textContent;

        if(text == selected) {
            buttons[i].style.color = "orange";
        } else {
            buttons[i].style.color = "rgb(202, 201, 201)";
        }
    }
}

function getFromKey(key) {
    let res = [];
    let okeys = Object.keys(keys);

    for(let i = 0; i < okeys.length; i++) {
        let okey = okeys[i];
        let val = keys[okey];

        if(val.includes(key)) {
            res.push(okey);
        }
    }

    return res;
}

function handleKey(key) {
    if(key.length != 1) return;
    if(!key.match("[a-zA-Z]")) return;

    let ghosts = getFromKey(key.toUpperCase());

    if(ghosts.length == 0) return;

    if(ghosts.length == 1) {
        select(ghosts[0]);
        return;
    }

    let index = ghosts.indexOf(selected) + 1;

    if(index == ghosts.length) index = 0;
    
    select(ghosts[index]);
}

const kval = {ArrowUp:-2, ArrowDown:2, ArrowLeft: -1, ArrowRight: 1};

window.onkeydown = (e) => {
    let am = 0;

    if(kval[e.key]) {
        am = kval[e.key];
    } else {
        handleKey(e.key);
        return;
    }

    let index = ghosts.indexOf(selected);

    for(let i = 0; i < Math.abs(am); i++) {
        let ii = am < 0 ? -1 : 1;

        index += ii;

        if(index == ghosts.length) index = 0;

        if(index < 0) index = ghosts.length - 1;
    }

    select(ghosts[index]);
}

init();