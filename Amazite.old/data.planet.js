/*
** data.planet.js
*/

var Planet = function() {
    this.buildings = [];
    this.researches = [];
    this.tree = [];
    this.currentResearch = 0;
    this.productionMultiplier = 1;
};

Planet.prototype.init = function (name, ray, population, production) {
    this.name = name;
    this.ray = ray;
    this.population = population;
    this.production = production;
};

Planet.prototype.initEarth = function () { 
    this.init(tr("earth"), 6371, 7, 1);
    this.buildings[0] = new Building().init("Handmade", UnitType.NONE,            15, 1, 60, 15, true);
    this.buildings[1] = new Building().init("Laboratory", UnitType.NONE,          50, 3, 10, 50, true);
    this.buildings[2] = new Building().init("Study Center", UnitType.NONE,        300, 8, 10, 300, false);
    this.buildings[3] = new Building().init("Melting Factory", UnitType.NONE,     700, 20, 10, 700, false);
    this.buildings[4] = new Building().init("Synthesis Facility", UnitType.NONE,  1750, 30, 5, 1750, false);
    this.buildings[5] = new Building().init("Production Complex", UnitType.NONE,  5000, 75, 3, 5000, false);

    this.buildings[1].setCallback(function() {
        Game.ui.unlockWindow("researches");
    });

    this.buildings[2].setCallback(function() {
        Game.ui.unlockTab("options");
    });

    this.buildings[3].setCallback(function() {
        Game.ui.unlockTab("ships");
    });

    this.buildings[5].setCallback(function() {
        Game.ui.unlockWindow("upgrades");
    });

    this.researches[0] = new Research("A new Material", "hat", UnitType.NONE, 35, 10, 2);
    this.researches[1] = new Research("Fusion power", "generator", UnitType.NONE, 100, 20, 3);
    this.researches[2] = new Research("Nuclear creation", "nuclear", UnitType.NONE, 200, 30, 4);
    this.researches[3] = new Research("World distribution", "moneybag", UnitType.NONE, 400, 40, 5);

    // Same way
    this.tree = new Upgrade().init(null, "Root of the Universe", 1, UnitType.KILO, "handmade", 0, 20);
    this.tree.sons[0] = new Upgrade().init(this.tree, "Space Station", 1, UnitType.KILO, "facility", 0, 30);
    this.tree.sons[0].sons[0] = new Upgrade().init(this.tree.sons[0], "Spaceship", 2, UnitType.KILO, "factory", 0, 50);

    //First branch
    this.tree.sons[0].sons[0].sons[0] = new Upgrade().init(this.tree.sons[0].sons[0], "Spaceship 2", 2, UnitType.KILO, "nuclear", 1, 5);
    this.tree.sons[0].sons[0].sons[0].sons[0] = new Upgrade().init(this.tree.sons[0].sons[0].sons[0], "Spaceship 3", 2, UnitType.KILO, "nuclear", 1, 10);
    this.tree.sons[0].sons[0].sons[0].sons[0].sons[0] = new Upgrade().init(this.tree.sons[0].sons[0].sons[0].sons[0], "Spaceship 4", 2, UnitType.KILO, "nuclear", 2, 2);

    //Second branch
    this.tree.sons[0].sons[0].sons[1] = new Upgrade().init(this.tree.sons[0].sons[0], "Space Station 2", 2, UnitType.KILO, "generator", 1, 0.1);
    this.tree.sons[0].sons[0].sons[1].sons[0] = new Upgrade().init(this.tree.sons[0].sons[0].sons[1], "Space Station 3", 2, UnitType.KILO, "generator", 1, 15);
    this.tree.sons[0].sons[0].sons[1].sons[0].sons[0] = new Upgrade().init(this.tree.sons[0].sons[0].sons[1].sons[0], "Space Station 4", 2, UnitType.KILO, "generator", 2, 1);
};

Planet.prototype.research = function() {
    return (this.researches[this.currentResearch]);
};

Planet.prototype.researchAvailable = function() {
    return (this.currentResearch < this.researches.length);
};

Planet.prototype.getProduction = function() {
    return (this.production * this.productionMultiplier)
};

Planet.prototype.addProduction = function(value) {
    this.production += value;
};

Planet.prototype.increaseMultiplier = function(value) {
    this.productionMultiplier += value;
}