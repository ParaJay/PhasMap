const text = document.getElementById("text");
const itemName = document.getElementById("ghostName");
const buttons = document.getElementsByTagName("button");

const cursedItems = [
    "Haunted Mirror", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll"
]

const keys = {};

var selected;

const info = {}

async function init() {
    for(let i = 0; i < cursedItems.length; i++) {
        let item = cursedItems[i];

        await readInfo(cursedItems[i]).then(e => info[item] = e);
    };

    cursedItems.forEach(item => {
        let split = item.split("_");
        let val = [];
        split.forEach(e => {
            val.push(e.charAt(0).toUpperCase());
        });

        keys[item] = val;
    });

    initButtons();

    let def = "Haunted Mirror";

    let query = window.location.search;

    if(query) {
        let params = new URLSearchParams(query);
        let item = params.get("curseditem");

        if(item) def = item.replaceAll("%20", " ");
    }

    select(def);
}

function initButtons() {
    let left = document.getElementsByClassName("btns-left")[0];
    let right = document.getElementsByClassName("btns-right")[0];

    for(let i = 0; i < cursedItems.length; i++) {
        let item = cursedItems[i];
        let button = createButton(item);

        button.onclick = () => select(item);

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

function readInfo(item) {
    item = item.toLowerCase().replace(" ", "");

    return new Promise((resolve) => {
        var request = new XMLHttpRequest();
        request.open('GET', `./res/cursed-items/${item}.txt`, true);
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

function select(item) {
    if(selected == item) return;

    selected = item;
    text.textContent = info[item];
    itemName.textContent = item;

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

    let cursedItems = getFromKey(key.toUpperCase());

    if(cursedItems.length == 0) return;

    if(cursedItems.length == 1) {
        select(cursedItems[0]);
        return;
    }

    let index = cursedItems.indexOf(selected) + 1;

    if(index == cursedItems.length) index = 0;
    
    select(cursedItems[index]);
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

    let index = cursedItems.indexOf(selected);

    for(let i = 0; i < Math.abs(am); i++) {
        let ii = am < 0 ? -1 : 1;

        index += ii;

        if(index == cursedItems.length) index = 0;

        if(index < 0) index = cursedItems.length - 1;
    }

    select(cursedItems[index]);
}

init();