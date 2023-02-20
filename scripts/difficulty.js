import { initInfoState } from "./utils.js";

let difficulties = ["Amateur", "Intermediate", "Professional", "Nightmare"]

async function init() {
    await initInfoState(difficulties, "difficulties", "difficulty");
}

init();