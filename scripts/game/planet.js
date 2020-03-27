/*
 * Amazite Project
 * game/planet.js
 */

/* Constructor */

var Planet = function () {
    this.name = "";
    this.landSize = 0;
    this.seaSize = 0;
    this.power = 0;

    this.buildings = [];
    this.researches = [];

    this.unlockedBuildings = 1;
    this.unlockedResearches = 0;
    this.spentSize = 0;
};

/* Static Variables */

Planet.POTENTIALS = [ "Terrible", "Bad", "Decent", "Good", "Very Good", "Excellent", "Legendary" ];

/* Public Methods */

Planet.prototype.init = function () {
    this.name = Database.getPlanet();
    this.landSize = Random.next(100, 5500);
    this.seaSize = Random.next(0, 5500);
    this.power = Random.next(1, 5);

    var buildingCount = Random.next(3, 10);

    for (var i = 0; i < buildingCount; ++i) {
        var building = new Building(this, i);
        building.init(this.power + Math.floor(this.power / 5) * i);
        this.buildings.push(building);
        if (i != 0) {
            var research = new Research(this);
            research.init(this.power + Math.floor(this.power / 5) * i);
            this.researches.push(research);
        }
    }
    this.unlockedBuildings = 1;
    this.unlockedResearches = 0;
};

Planet.prototype.initEarth = function () {
    this.name = "Earth";
    this.landSize = 500;
    this.seaSize = 1000;

    /* Prod, Prod, Storage */
    var buildingCount = 4;

    /* Buildings : Name, Icon, Size, Power, Type, Effect, Cost */
    var prodBuilding1 = new Building(this, 0);
    prodBuilding1.advancedInit("Handmade", "hand", 1, 0, 1, 5);
    this.buildings.push(prodBuilding1);

    var prodBuilding2 = new Building(this, 1);
    prodBuilding2.advancedInit("Mill", "windmill", 5, 0, 3, 50);
    this.buildings.push(prodBuilding2);

    var storageBuilding = new Building(this, 2);
    storageBuilding.advancedInit("Warehouse", "stone-tower", 5, 1, 100, 500);
    this.buildings.push(storageBuilding);

    var capacityBuilding = new Building(this, 3);
    capacityBuilding.advancedInit("Hangar", "hangar", 20, 2, 100, 1500);
    this.buildings.push(capacityBuilding);

    /* Researches : Name, Icon, Power, Cost, Duration */
    var research = new Research(this);
    research.advancedInit("First step", "planks", Research.Type.Building, new Amount(25, Units.NONE), 20);
    this.researches.push(research);

    research = new Research(this);
    research.advancedInit("Storage", "flame", Research.Type.Building, new Amount(100, Units.NONE), 50);
    this.researches.push(research);

    research = new Research(this);
    research.advancedInit("Exploration", "field", Research.Type.Panel, new Amount(500, Units.NONE), 60);
    research.panel = "Planet";
    this.researches.push(research);

    research = new Research(this);
    research.advancedInit("To the stars", "planet", Research.Type.Panel, new Amount(8, Units.KILO), 120);
    research.panel = "Hangar";
    this.researches.push(research);
};

Planet.prototype.canSpendSize = function (size) {
    if (this.spentSize + size > this.landSize) return false; // TODO sea
    return true;
}

Planet.prototype.spendSize = function (size) {
    this.spentSize += size;
    if (Game.onPlanetSizeChanged) Game.onPlanetSizeChanged(this);
};

Planet.prototype.getPotential = function () {
    if (this.name == "Earth") {
        return "Native";
    }
    return Planet.POTENTIALS[Math.floor(Math.floor(this.power) / 3)];
};

Planet.prototype.serialize = function () {
    var buildingsData = [];
    for (var i = 0; i < this.buildings.length; ++i) {
        buildingsData.push(this.buildings[i].serialize());
    }
    var researchesData = [];
    for (var i = 0; i < this.researches.length; ++i) {
        researchesData.push(this.researches[i].serialize());
    }
    return {
        name: this.name,
        landSize: this.landSize,
        seaSize: this.seaSize,
        power: this.power,
        buildings: buildingsData,
        researches: researchesData,
        unlockedBuildings: this.unlockedBuildings,
        unlockedResearches: this.unlockedResearches,
        spentSize: this.spentSize
    };
};

Planet.prototype.unserialize = function (data) {
    this.name = data.name;
    this.landSize = data.landSize;
    this.seaSize = data.seaSize;
    this.power = data.power;

    var buildingsData = data.buildings;
    for (var i = 0; i < buildingsData.length; ++i) {
        var building = new Building(this, i);
        building.unserialize(buildingsData[i]);
        this.buildings.push(building);
    }
    var researchesData = data.researches;
    for (var i = 0; i < researchesData.length; ++i) {
        var research = new Research(this);
        research.unserialize(researchesData[i]);
        this.researches.push(research);
    }
    this.unlockedBuildings = data.unlockedBuildings;
    this.unlockedResearches = data.unlockedResearches;

    this.spentSize = data.spentSize;
};
