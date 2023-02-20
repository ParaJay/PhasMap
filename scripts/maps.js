import { handleKeyDown, initParams, def, initKeys, initKeyValues, setSelected } from "./utils.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const image = document.createElement("img");

var scale, x, y, clickX, clickY, clicking, xoffset, yoffset;

// canvas.width = screen.availWidth * 0.8;

const iw = canvas.width;
const ih = canvas.height;

const maps = [
    "bleasedale", "brownstone_high_school", "camp_woodwind", "edgefield", "grafton", "maple_lodge_campsite", "prison", 
    "ridgeview", "sunny_meadows", "sunny_meadows_restricted", "tanglewood", "willow"
]

function init() {
    initKeyValues(1);
    initParams("map", "grafton");
    initKeys(maps);

    select(def);
}

function select(map) {
    map = map.toLowerCase().replaceAll(" ", "_");

    setSelected(map);

    scale = 1;
    x = 0;
    y = 0;
    xoffset = 0;
    yoffset = 0;
    clicking = false;

    image.src = "./res/maps/" + map + ".png";

    image.onload = draw;
}

function draw() {
    context.fillStyle = "rgb(60, 63, 65)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, xoffset, yoffset, iw * scale, ih * scale);
}

window.onload = init;

function change(am) {
    let s = set(maps, am, true);

    if(s) select(s);
}

document.getElementById("next").onclick = () => change(1);
document.getElementById("previous").onclick = () => change(-1);

window.onkeydown = (e) => {
    let s = handleKeyDown(e, maps, true);

    if(s) select(s);
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

    if(x < canvas.offsetLeft || x > canvas.offsetLeft + (xoffset + (iw * scale))) return;

    if(y < canvas.offsetTop || y > canvas.offsetTop + yoffset + (ih * scale)) return;

    clicking = true;
    clickX = x;
    clickY = y;
}

window.onmouseup = () => clicking = false;