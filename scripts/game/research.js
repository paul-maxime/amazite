/*
 * Amazite Project
 * game/research.js
 */

/* Constructor */

var Research = function (parent) {
    this.planet = parent;

    this.name = "";
    this.icon = "";
    this.power = 0;

    this.type = 0;
    this.panel = "";
    this.cost = null;
    this.duration = 0;

    this.remainingTime = -1;
};

/* Enumerations */

Research.Type = {
    Building: 0,
    Panel: 1
};

/* Static Variables */

Research.actives = [];

/* Public Methods */

Research.prototype.init = function (power) {
    var infos = Database.getResearch();
    this.name = infos[0];
    this.icon = infos[1];
    this.power = power;

    this.cost = new Amount(Random.next(this.power * 2, this.power * 3), Units.NONE);
    this.duration = Random.next(power * 2, power * 6);
};

Research.prototype.advancedInit = function (name, icon, type, cost, duration) {
    this.name = name;
    this.icon = icon;

    this.type = type;
    this.cost = cost;
    this.duration = duration;
};

Research.prototype.start = function () {
    this.remainingTime = this.duration;
    Research.actives.push(this);

    if (Game.onResearchTick) Game.onResearchTick(this);
};

Research.prototype.stop = function () {
    this.remainingTime = -1;
    for (var i = 0; i < Research.actives.length; ++i) {
        if (Research.actives[i] === this) {
            Research.actives.splice(i, 1);
            break;
        }
    }

    if (Game.onResearchTick) Game.onResearchTick(this);
};

Research.prototype.tick = function () {
    if (Game.amazite.remove(this.cost)) {
        if (--this.remainingTime <= 0) {
            this.remainingTime = -1;
            if (this.type == Research.Type.Building) {
                this.planet.unlockedBuildings++;
            } else if (this.type == Research.Type.Panel) {
                Game.unlockPanel(this.panel);
            }
            this.planet.unlockedResearches++;
            if (Game.onResearchDone) Game.onResearchDone(this, this.planet);
            return true;
        }
        if (Game.onResearchTick) Game.onResearchTick(this);
    }
    return false;
};

Research.prototype.serialize = function () {
    return {
        name: this.name,
        icon: this.icon,
        power: this.power,

        type: this.type,
        panel: this.panel,
        cost: this.cost.serialize(),
        duration: this.duration,

        remainingTime: this.remainingTime
    };
};

Research.prototype.unserialize = function (data) {
    this.name = data.name;
    this.icon = data.icon;
    this.power = data.power;

    this.type = data.type;
    this.panel = data.panel;
    this.cost = new Amount();
    this.cost.unserialize(data.cost);
    this.duration = data.duration;

    this.remainingTime = data.remainingTime;

    if (this.remainingTime > -1) {
        Research.actives.push(this);
    }
};
