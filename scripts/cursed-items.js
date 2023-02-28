import { initInfoState } from "./utils.js";

const cursedItems = ["Haunted Mirror", "Monkey Paw", "Music Box", "Ouija Board", "Summoning Circle", "Tarot Cards", "Voodoo Doll"]

async function init() {
    await initInfoState(cursedItems, "cursed-items", "curseditem");
}

init();