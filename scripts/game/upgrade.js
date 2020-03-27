/*
 * Amazite Project
 * game/upgrade.js
 */

/* Constructor */

var Upgrade = function () {
    this.name = "";
    this.icon = "";

    this.cost = null;
    this.adjacents = [];
};

/* Static Variables */

Upgrade.list = [
["Test A", "Execute terrible and stupid tests during the segmentation. Improve the global amazite production by 5%.", 100, 100, 32]
];

/* Public Methods */

Upgrade.prototype.init = function (cost) {
    var infos = Database.getResearch();
    this.name = infos[0];
    this.icon = infos[1];

    this.cost = new Amount(cost);
};

Upgrade.prototype.serialize = function () {
    return {
        name: this.name,
        icon: this.icon,

        cost: this.cost.serialize()
    };
};

Upgrade.prototype.unserialize = function (data) {
    this.name = data.name;
    this.icon = data.icon;

    this.cost = new Amount();
    this.cost.unserialize(data.cost);
};
