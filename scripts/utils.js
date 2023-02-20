export const text = document.getElementById("text");
export const infoHeader = document.getElementById("infoHeader");
export const buttons = document.getElementsByTagName("button");

const keys = {};

export var selected;
export var info;
export var def;
export var kval;

export function initKeyValues(kvalMax=2) {
    kval = {ArrowUp:-kvalMax, ArrowDown:kvalMax, ArrowLeft: -1, ArrowRight: 1};
}

export function setSelected(sel) {
    selected = sel;
}

export async function initInfoState(array, dir, param, def) {
    initKeyValues(2);

    let info = {};
    
    for(let i = 0; i < array.length; i++) {
        let a = array[i];

        await readInfo(array[i], dir).then(e => info[a] = e);
    };

    initAll(array);
    initParams(param, def);

    setInfo(info);

    selectDef();

    window.onkeydown = (e) => {
        handleKeyDown(e, array);
    }
}

export function initParams(param, deff, repA, repB) {   
    def = deff;

    let query = window.location.search;

    if(query) {
        let params = new URLSearchParams(query);
        let item = params.get(param);

        if(item) def = item;

        if(repA && repB) {
            item = item.replaceAll(repA, repB);
        }
    }
}

export function selectDef() {
    select(def);
}

export function initAll(array) {
    initKeys(array);
    initButtons(array);
}

export function initKeys(array) {
    array.forEach(item => {
        let split = item.split(" ");
        let val = [];
        split.forEach(e => {
            val.push(e.charAt(0).toUpperCase());
        });

        keys[item] = val;
    });
}

export function setInfo(i) {
    info = i;
}

export function createButton(text) {
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

export function readInfo(filename, dir) {
    filename = filename.toLowerCase().replace(" ", "");

    return new Promise((resolve) => {
        var request = new XMLHttpRequest();
        request.open('GET', `./res/${dir}/${filename}.txt`, true);
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

export function handleKeyDown(e, array, ret=false) {
    if(!kval) initKeyValues();

    let s;
    let key = e.key;
    let am = kval[key];

    if(am) {
        s = set(array, am, ret);
    } else {
        s = handleKey(key, ret);
    }

    if(s && ret) {
        return s;
    }
}

export function handleKey(key, ret=false) {
    if(key.length != 1) return;
    if(!key.match("[a-zA-Z]")) return;

    let array = getFromKey(key.toUpperCase());

    if(array.length == 0) return;

    if(array.length == 1) {
        if(ret) {
            return array[0];
        } else {
            select(array[0]);
        }
        return;
    }

    let index = array.indexOf(selected) + 1;

    if(index == array.length) index = 0;

    if(ret) {
        return array[index];
    } else {
        select(array[index]);
    }
    
    // select(cursedItems[index]);
}

export function set(array, am, ret=false) {
    let index = array.indexOf(selected);

    for(let i = 0; i < Math.abs(am); i++) {
        let ii = am < 0 ? -1 : 1;

        index += ii;

        if(index == array.length) index = 0;

        if(index < 0) index = array.length - 1;
    }

    if(ret) {
        return array[index];
    } else {
        select(array[index]);
    }
}

export function select(item) {
    if(selected == item) return;

    selected = item;
    text.textContent = info[item];
    infoHeader.textContent = item;

    updateButtons();
}

export function updateButtons() {
    for(let i = 0; i < buttons.length; i++) {
        let text = buttons[i].textContent;

        if(text == selected) {
            buttons[i].style.color = "orange";
        } else {
            buttons[i].style.color = "rgb(202, 201, 201)";
        }
    }
}

export function initButtons(names) {
    let left = document.getElementsByClassName("btns-left")[0];
    let right = document.getElementsByClassName("btns-right")[0];

    for(let i = 0; i < names.length; i++) {
        let name = names[i];
        let button = createButton(name);

        button.onclick = () => select(name);

        if(i % 2 == 0) {
            left.appendChild(button);
        } else {
            right.appendChild(button);
        }
    }
}