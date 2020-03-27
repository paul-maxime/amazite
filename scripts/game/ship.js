/*
 * Amazite Project
 * game/ship.js
 */

/* Constructor */

var Ship = function () {
    this.name = "";
    this.size = 0;
    this.cost = 0;
    this.attack = 0;
    this.defense = 0;
    this.speed = 0;
};

/* Public Methods */

Ship.prototype.init = function (name, size, cost, attack, defense, speed) {
    this.name = name;
    this.size = size;
    this.cost = cost;
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
};
