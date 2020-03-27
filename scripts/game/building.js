/*
 * Amazite Project
 * game/building.js
 */

/* Constructor */

var Building = function (parent, index) {
    this.planet = parent;
    this.index = index;

    this.name = "";
    this.icon = "";
    this.size = 0;

    this.type = 0;
    this.power = 0;

    this.production = null;
    this.storage = null;
    this.capacity = null;
    this.cost = null;
    this.originalCost = null;

    this.quantity = 0;
};

/* Enumerations */

Building.Type = {
    Production: 0,
    Storage: 1,
    Hangar: 2
};

/* Public Methods */

Building.prototype.init = function (power, type) {
    var infos = Database.getBuilding();
    this.name = infos[0];
    this.icon = infos[1];
    this.size = Random.next(2, 25);

    this.power = power;
    this.type = typeof type !== 'undefined' ? type : Random.next(3);

    this._initType();
};

Building.prototype.advancedInit = function (name, icon, size, type, effect, cost) {
    this.name = name;
    this.icon = icon;
    this.size = size;

    this.type = type;

    switch (this.type)
    {
    case Building.Type.Production:
        this.production = new Amount(effect, Units.NONE);
        break;
    case Building.Type.Storage:
        this.storage = new Amount(effect, Units.NONE);
        break;
    case Building.Type.Hangar:
        this.capacity = effect;
        break;
    };

    this.cost = new Amount(cost, Units.NONE);
    this.originalCost = this.cost;
};

Building.prototype.purchase = function () {
    if (this.index > this.planet.unlockedBuildings) return false;
    if (!this.planet.canSpendSize(this.size)) return false;
    if (!Game.amazite.remove(this.cost)) return false;

    this.planet.spendSize(this.size);
    this.quantity += 1;
    this.changeCost();
    Game.calculate();

    if (Game.onBuildingCountChanged) Game.onBuildingCountChanged(this);

    return true;
};

Building.prototype.destroy = function () {
    if (this.index > this.planet.unlockedBuildings) return false;
    if (this.quantity <= 0) return false;

    this.planet.spendSize(-this.size);
    this.quantity -= 1;
    this.changeCost();
    Game.calculate();

    if (Game.onBuildingCountChanged) Game.onBuildingCountChanged(this);

    return true;
};

Building.prototype.changeCost = function () {
    var newCost = new Amount();
    newCost.add(this.originalCost);

    for (var i = 0; i < this.quantity; i++)
        newCost.add(new Amount(this.planet.power * (this.size + i), Units.NONE));

    this.cost = newCost;
};

Building.prototype.getType = function () {
    return (this.type == Building.Type.Production ? "Production" :
            this.type == Building.Type.Storage ? "Storage" :
            this.type == Building.Type.Hangar ? "Hangar" :
            "Unknown");
};

Building.prototype.getEffect = function () {
    var effects = [];

    effects[Building.Type.Production] = "Produces " + this.production + " per second.";
    effects[Building.Type.Storage] = "Increases storage by " + this.storage + ".";
    effects[Building.Type.Hangar] = "Increases hangar capacity by " + this.capacity + ".";

    return effects[this.type];
};

Building.prototype.serialize = function () {
    return {
        name: this.name,
        icon: this.icon,
        size: this.size,
        type: this.type,
        power: this.power,

        production: this.production != null ? this.production.serialize() : null,
        storage: this.storage != null ? this.storage.serialize() : null,
        capacity: this.capacity,
        cost: this.cost.serialize(),
        originalCost: this.originalCost.serialize(),

        quantity: this.quantity
    };
};

Building.prototype.unserialize = function (data) {
    this.name = data.name;
    this.icon = data.icon;
    this.size = data.size;
    this.type = data.type;
    this.power = data.power;

    if (data.production != null) {
        this.production = new Amount();
        this.production.unserialize(data.production);
    }
    if (data.storage != null) {
        this.storage = new Amount();
        this.storage.unserialize(data.storage);
    }
    if (data.capacity != null) {
        this.capacity = data.capacity;
    }
    this.cost = new Amount();
    this.cost.unserialize(data.cost);
    this.originalCost = new Amount();
    this.originalCost.unserialize(data.originalCost);

    this.quantity = data.quantity;
};

Building.prototype._initType = function () {
    switch (this.type)
    {
    case Building.Type.Production:
        this.production = new Amount(Random.next(this.power, this.power * 5), Units.NONE);
        break;
    case Building.Type.Storage:
        this.storage = new Amount(Random.next(this.power * 50, this.power * 250), Units.NONE);
        break;
    case Building.Type.Hangar:
        this.capacity = Random.next(this.power * 50, this.power * 250);
        break;
    };
    this.cost = new Amount(Random.next(this.power * 3, this.power * 8), Units.NONE);
    this.originalCost = this.cost;
};
