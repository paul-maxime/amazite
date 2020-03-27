/*
 * Amazite Project
 * game/game.js
 */

var Game = {
    /* Variables */
    amazite: null,
    production: null,
    storage: null,
    capacity: null,
    planets: [],
    currentPlanet: null,
    unlockedPanels: [],
    config: {},
    
    /* Private Variables */
    _saveDelay: 30,

    /* Events */
    onAmaziteChanged: null,
    onGameSaved: null,
    onGameReset: null,
    onPlanetSizeChanged: null,
    onBuildingCountChanged: null,
    onResearchTick: null,
    onResearchDone: null,
    onPanelUnlocked: null,

    /* Functions */
    init: function () {
        if (!Game.load()) {
            Game.start();
        }
        Game.run();
    },
    run: function () {
        setInterval(Game.tick, 1000);
    },
    tick: function () {
        for (var i = 0; i < Research.actives.length; ++i) {
            if (Research.actives[i].tick()) {
                Research.actives.splice(i--, 1);
            }
        }
        if (Game.amazite.compare(Game.storage) < 0) {
            Game.amazite.add(Game.production);
        }
        if (Game.amazite.compare(Game.storage) == 1)
        {
            Game.amazite = new Amount();
            Game.amazite.add(Game.storage);
        }
        if (Game.onAmaziteChanged) Game.onAmaziteChanged();
        if (--Game._saveDelay <= 0) {
            Game._saveDelay = 30;
            Game.save();
        }
    },
    start: function () {
        Game.amazite = new Amount(0, Units.NONE);
        Game.production = new Amount(1, Units.NONE);
        Game.storage = new Amount(1, Units.KILO);

        Game.planets = [];

        Research.actives = [];

        var first = new Planet();
        first.initEarth();
        Game.planets.push(first);
        Game.currentPlanet = first;
        
        Game.unlockedPanels = ["Amazite"];
        
        Game.config = {};

        /* Test */

        var ultimatePowerPlanet = new Planet();
        ultimatePowerPlanet.init("Test");
        Game.planets.push(ultimatePowerPlanet);
    },
    calculate: function () {
        Game.production = new Amount(1, Units.NONE);
        Game.storage = new Amount(1, Units.KILO);
        Game.capacity = 0;

        for (var i = 0; i < Game.planets.length; ++i) {
            for (var j = 0; j < Game.planets[i].buildings.length; ++j) {
                for (var k = 0; k < Game.planets[i].buildings[j].quantity; ++k) {
                    var n;
                    if (n = Game.planets[i].buildings[j].production)
                        Game.production.addAmount(n);
                    if (n = Game.planets[i].buildings[j].storage)
                        Game.storage.addAmount(n);
                    if (n = Game.planets[i].buildings[j].capacity)
                        Game.capacity += n;
                }
            }
        }
        if (Game.onAmaziteChanged) Game.onAmaziteChanged();
        if (Game.onCapacityChanged) Game.onCapacityChanged();
    },
    unlockPanel: function (panel) {
        Game.unlockedPanels.push(panel);
        if (Game.onPanelUnlocked) Game.onPanelUnlocked();
    },
    save: function () {
        localStorage.setItem("amazite-save", JSON.stringify(Game.serialize()));
        if (Game.onGameSaved) Game.onGameSaved();
    },
    reset: function () {
        Game.start();
        if (Game.onGameReset) Game.onGameReset();
        Game.save();
    },
    load: function () {
        var json;
        if (json = localStorage.getItem("amazite-save")) {
            var data = JSON.parse(json);
            Game.unserialize(data);
            return true;
        }
        return false;
    },
    serialize: function () {
        var planetsData = [];
        var currentId = 0;
        for (var i = 0; i < this.planets.length; ++i) {
            planetsData.push(this.planets[i].serialize());
            if (this.planets[i] == this.currentPlanet) currentId = i;
        }
        return {
            amazite: this.amazite.serialize(),
            production: this.production.serialize(),
            storage: this.storage.serialize(),
            capacity: this.capacity,
            planets: planetsData,
            currentPlanetId: currentId,
            unlockedPanels: this.unlockedPanels,
            config: this.config
        };
    },
    unserialize: function (data) {
        this.amazite = new Amount();
        this.amazite.unserialize(data.amazite);
        this.production = new Amount();
        this.production.unserialize(data.production);
        this.storage = new Amount();
        this.storage.unserialize(data.storage);
        this.capacity = data.capacity;

        var planetsData = data.planets;
        for (var i = 0; i < planetsData.length; ++i) {
            var planet = new Planet();
            planet.unserialize(planetsData[i]);
            this.planets.push(planet);
        }

        this.currentPlanet = this.planets[data.currentPlanetId];
        this.unlockedPanels = data.unlockedPanels;
        this.config = data.config;
    }
};
