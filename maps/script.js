const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const image = document.createElement("img");

var scale, x, y, clickX, clickY, clicking, xoffset, yoffset;

// canvas.width = screen.availWidth * 0.8;

const iw = canvas.width;
const ih = canvas.height;

var selected;

const kval = {ArrowUp:-1, ArrowDown:1, ArrowLeft: -1, ArrowRight: 1};

const maps = [
    "bleasedale", "brownstone_high_school", "camp_woodwind", "edgefield", "grafton", "maple_lodge_campsite", "prison", 
    "ridgeview", "sunny_meadows", "sunny_meadows_restricted", "tanglewood", "willow"
]

const keys = {};

function init() {
    let def = "grafton";

    let query = window.location.search;

    if(query) {
        let params = new URLSearchParams(query);

        let map = params.get("map");

        if(map) def = map;
    }

    maps.forEach(map => {
        let split = map.split("_");
        let val = [];
        split.forEach(e => {
            val.push(e.charAt(0).toUpperCase());
        });

        keys[map] = val;
    });

    select(def);
}

function select(map) {
    map = map.toLowerCase().replaceAll(" ", "_");

    selected = map;

    scale = 1;
    x = 0;
    y = 0;
    xoffset = 0;
    yoffset = 0;
    clicking = false;

    image.src = "./maps/res/" + map + ".png";

    image.onload = () => {
        context.drawImage(image, 0, 0, iw, ih);
    }  
}

function set(am) {
    let index = maps.indexOf(selected);

    for(let i = 0; i < Math.abs(am); i++) {
        let ii = am < 0 ? -1 : 1;

        index += ii;

        if(index == maps.length) index = 0;

        if(index < 0) index = maps.length - 1;
    }

    select(maps[index]);
}

function draw() {
    context.fillStyle = "rgb(60, 63, 65)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, xoffset, yoffset, iw * scale, ih * scale);
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

    let maps = getFromKey(key.toUpperCase());

    if(maps.length == 0) return;

    let index = maps.indexOf(selected) + 1;

    if(index == maps.length) index = 0;
    
    select(maps[index]);
}

window.onload = init;

document.getElementById("next").onclick = () => set(1);
document.getElementById("previous").onclick = () => set(-1);

window.onkeydown = (e) => {
    let am = kval[e.key];

    if(am) {
        set(am);
    } else {
        handleKey(e.key);
    }
}

window.onmousemove = (e) => {
    if(clicking) {
        e.preventDefault();

        let x = e.x - clickX;
        let y = e.y - clickY;

        xoffset += x;
        yoffset += y;

        clickX = e.x;
        clickY = e.y;

        draw();
    }
}

window.onwheel = (e) => {
    let am = e.deltaY < 0 ? 1.1 : 0.9;
    
    scale *= am;

    draw();
}

window.onmousedown = (e) => {
    let x = e.x;
    let y = e.y;

    if(x < canvas.offsetLeft || x > canvas.offsetLeft + (xoffset + (iw * scale))) {
        return;
    }

    if(y < canvas.offsetTop || y > canvas.offsetTop + yoffset + (ih * scale)) {
        return;
    }

    clicking = true;
    clickX = x;
    clickY = y;
}

window.onmouseup = () => clicking = false;