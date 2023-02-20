const text = document.getElementById("text");
const ghostName = document.getElementById("ghostName");
const checks = document.getElementsByClassName("evidence");
const labels = document.getElementsByTagName("label");
const slider = document.getElementById("slider");
const sliderLabel = document.getElementById("sliderLabel");

//TODO: arrow keys
//TODO: select by charKey
//TODO: auto exclude when evidence unavailable

const ghosts = [
    "Banshee", "Demon", "Deogen", "Goryo", "Hantu", "Jinn", "Mare", "Moroi", "Myling",
    "Obake", "Oni", "Onryo", "Phantom", "Poltergeist", "Raiju", "Revenant", "Shade",
    "Spirit", "Thaye", "The Mimic", "The Twins", "Wraith", "Yokai", "Yurei"
]

const selections = {}
const exclusions = {};
const evidence = {}
const striked = {};
const labelMap = {};
const sanity = {};

var shifting = false;
var selected = "";
var possible = ghosts.slice();

async function init() {
    window.onkeyup = (e) => {
        if(!e.shiftKey && !e.ctrlKey) {
            shifting = false;
        }

        if(e.key == " ") {
            strike();
        }
    }

    window.onkeydown = (e) => {
        if(e.shiftKey || e.ctrlKey) {
            shifting = true;
        }
    }

    slider.oninput = () => {
        sliderLabel.textContent = "Sanity: " + slider.value + "%";
        update();
    }

    for(let i = 0; i < ghosts.length; i++) {
        await readInfo(ghosts[i]).then(e => {
            let lines = e.split("\n");

            for(let j = 0; j < lines.length; j++) {
                let line = lines[j];

                if(line.includes("Evidence: ")) {
                    evidence[ghosts[i]] = line.split(": ")[1].split(", ");
                }

                if(line.includes("Hunts from: ")) {
                    let split = line.split("Hunts from: ")[1].split(" ");

                    let san = 0;

                    split.forEach(ee => {
                        if(ee.includes("%")) {
                            let si = parseInt(ee.replace("%", "").replace("(", ""));

                            if(si > san) {
                                san = si;
                            }
                        }
                    });

                    sanity[ghosts[i]] = san;
                }
            }
        });
    };

    for(let i = 0; i < labels.length; i++) {
        labelMap[labels[i].htmlFor] = labels[i];
    }

    display(possible);

    for(let i = 0; i < checks.length; i++) {
        let check = checks[i];

        check.oninput = () => {
            if(shifting) {
                exclusions[check.id] = !exclusions[check.id];
                check.checked = !check.checked;

                updateCheckLabel(check.id);
            } else {
                selections[check.id] = check.checked;
            }

            update();
        }
    }
}

function update() {
    let pp = getPossibleGhosts();
    possible = pp[2];

    display(possible);
}

function getPossibleGhosts() {
    let evs = [];
    let exc = [];

    let sKeys = Object.keys(selections);

    sKeys.forEach(e => {
        let id = e;

        if(labelMap[id].textContent.includes("NOT")) {
            exc.push(id);
        } else {
            if(selections[e]) {
                evs.push(id);
            }
        }
    });

    let first = [];

    if(evs.length > 0) {
        ghosts.forEach(ghost => {
            let evi = evidence[ghost];
            let pass = true;

            evs.forEach(e => {
                if(!evi.includes(document.getElementById(e).value)) {
                    pass = false;
                }
            });

            if(pass) {
                if(!first.includes(ghost)) {
                    first.push(ghost);
                }
            }
        });
    } else {
        first = ghosts.slice();
    }

    let second = [];

    if(exc.length > 0) {
        first.forEach(ghost => {
            let pass = true;

            for(let i = 0; i < exc.length; i++) {
                let e = exc[i];
                if(evidence[ghost].includes(document.getElementById(e).value)) {
                    pass = false;
                    break;
                }
            };

            if(pass) {
                if(!second.includes(ghost)) {
                    second.push(ghost);
                }
            }
        });
    } else {
        second = first.slice();
    }

    let third = [];

    second.forEach(ghost => {
        let san = sanity[ghost];

        if(san >= slider.value) {
            third.push(ghost);
        }
    });

    //TODO: sanity and nightmare check

    return [first, second, third];
}

function select(ghostId) {
    selected = ghostId;
    updateLabels();
}

function updateCheckLabel(checkId) {
    let label = labelMap[checkId];

    if(exclusions[checkId]) {
        label.textContent = label.textContent.replace(" (NOT)", "") + " (NOT)";
    } else {
        label.textContent = label.textContent.replace(" (NOT)", "")
    }
}

function updateLabels() {
    possible.forEach(e => {
        let gg = document.getElementById(e);

        if(selected === e) {
            gg.style.color = "orange";
        } else {
            gg.style.color = "rgb(202, 201, 201)";
        }

        if(striked[e]) {
            gg.style.color = "rgb(128, 128, 128)";
            gg.style.textDecoration = "line-through";
        } else {
            gg.style.textDecoration = "none";
        }
    });
}

function removeAll(elem) {
    while(elem.childElementCount > 0) {
        elem.removeChild(elem.lastElementChild);
    }
}

function m(s, am) {
    let res = "";

    for(let i = 0; i < am; i++) {
        res += s;
    }

    return res;
}

//TODO: fix
function p(am) {
    let pp = document.createElement("p");
    pp.textContent = m("_", am);
    pp.style.color = "rgb(60, 63, 65)";
    pp.style.fontSize = "30px";
    return pp;
}

function display() {
    let ghosts = possible.slice();

    if(ghosts.length == 0) {
        ghosts = ["None"];
    }

    let left = document.getElementsByClassName("jleft")[0];
    let right = document.getElementsByClassName("jright")[0];
    let center = document.getElementsByClassName("jcenter")[0];

    removeAll(left);
    removeAll(right);
    removeAll(center);

    let x = 0;
    let highest = 0;

    ghosts.forEach(e => {
        if(e.length > highest) {
            highest = e.length;
        }
    })

    for(let i = 0; i < ghosts.length; i++) {
        let g = document.createElement("p");

        g.textContent = ghosts[i];
        g.id = ghosts[i];
        g.onclick = () => {
            select(ghosts[i]);
        }
        g.style.fontFamily = "October Crow"
        g.style.fontSize = "24px";
        g.style.margin = "6px 6px";
        g.style.textAlign = "center";

        //count highest charlen make add, 30
        if(ghosts.length > 12) {
            if(i % 2 == 0) {
                left.appendChild(g);
            } else {
                right.appendChild(g);
            }
            
            if(x == 0) {
                center.appendChild(p(10));

                x++;
            }
        } else {
            if(x == 0) {
                let cl = ((30 - highest) / 2) - 1;
                let cl2 = cl % 2 == 0 ? cl : cl - 1;
                
                left.appendChild(p(cl));
                right.appendChild(p(cl2));
                
                x++;
            }

            center.appendChild(g);
        }
    }
}

function readInfo(ghost) {
    ghost = ghost.toLowerCase().replace(" ", "");

    return new Promise((resolve) => {
        var request = new XMLHttpRequest();
        request.open('GET', `./res/ghosts/${ghost}.txt`, true);
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

function goto() {
    if(!selected) return;

    let url = window.location.href.replace("journal", "ghosts") + "?ghost=" + selected.replaceAll(" ", "%20");

    window.location.href = url;
}

function strike() {
    if(selected) {
        striked[selected] = !striked[selected];
        updateLabels();
    }
}

function reset() {
    for(let i = 0; i < checks.length; i++) {
        checks[i].checked = false;
    }

    selected = undefined;

    Object.keys(striked).forEach(e => {
        striked[e] = false;
    });

    Object.keys(selections).forEach(e => {
        selections[e] = false;
    });

    Object.keys(exclusions).forEach(e => {
        exclusions[e] = false;
    });

    for(let i = 0; i < labels.length; i++) {
        labels[i].textContent = labels[i].textContent.replace(" (NOT)", "");
    }

    slider.value = 0;

    updateLabels();
    update();
}

document.getElementById("goto").onclick = goto;
document.getElementById("strike").onclick = strike;
document.getElementById("reset").onclick = reset;

init();