import { initInfoState } from "./utils.js";

const cursedItems = ["Haunted Mirror", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll"]

async function init() {
    await initInfoState(cursedItems, "cursed-items", "curseditem", "Haunted Mirror");
}

init();