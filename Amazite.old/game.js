/*
** game.js
*/

var Game = {};

Game.debug = false;

Game.main = function () {
    I18n.init();
    
    Game.ui.init();
    Game.resources.init();
    Game.planets.init();
    Game.buildings.init();
    Game.researches.init();
    Game.upgrades.init();
    Game.ships.init();
    Game.cockpit.init();
    Game.stats.init();
    Game.options.init();
    
    Game.init();
}

Game.init = function () {
    Game.researches.set(Game.planets.planets[0]);
    Game.upgrades.set(Game.planets.planets[0]);
    Game.ships.set(Game.planets.planets[0]);
    Game.cockpit.set(Game.planets.planets[0]);
    
    if (Game.debug) {
        Game.ui.unlockTab("researches");
        Game.ui.unlockTab("upgrades");
        Game.ui.unlockTab("ships");
        Game.ui.unlockTab("cockpit");
        Game.ui.unlockTab("options");
        Game.ui.unlockTab("buildings");
        Game.ui.unlockTab("stats");
        Game.resources.addProduction(90000, UnitType.NONE);
        Game.start();
    } else {
        Game.introduction.init();
    }
};

Game.start = function () {
    Game.ui.icon.show("slow");
    Game.ui.production.show("slow");
    setInterval(Game.update, 1000);
};

Game.update = function () {
    Game.stats.update();
    Game.resources.update();
    Game.researches.researchTimeUpdate();
    if (!Game.upgradesUnlocked && Game.resources.amazite.compare(15, UnitType.NONE) >= 0)
    {
        Game.upgradesUnlocked = true;
        Game.ui.unlockTab("buildings");
        Game.ui.unlockTab("stats");
    }
};

$(function () {
    Game.main();
});