/*
** data.building.js
*/

var Building = function() {

    this.currentOwned = 0;
    this.callback = null;
};

Building.prototype.init = function(name, unit, price, prod, max, inflation, isUnlocked) {

    this.name = name;
    this.priceUnit = unit;
    this.priceAmount = price;
    this.bonusUnit = UnitType.NONE;
    this.bonusAmount = prod;
    this.maxOwnable = max;
    this.priceInflation = inflation;
    this.isUnlocked = isUnlocked;

    this.initMaterial();
    this.id = name.split(' ')[name.split(' ').length - 1];
    return this;
};

Building.prototype.initMaterial = function() {

    this.priceMaterial = new Material();
    this.priceMaterial.add(this.priceAmount, this.priceUnit);
    this.bonusMaterial = new Material();
    this.bonusMaterial.add(this.bonusAmount, this.bonusUnit);
};

Building.prototype.setCallback = function(callback) {

    this.callback = callback;
    return this;
};

Building.prototype.price = function() {

    return this.priceMaterial.toString();
};

Building.prototype.bonus = function() {

    return this.bonusMaterial.toString();
};

Building.prototype.buy = function() {

    this.currentOwned += 1;
    this.priceAmount = Math.floor(this.priceAmount + (this.priceInflation * this.currentOwned));

    this.priceMaterial = new Material();
    this.priceMaterial.add(this.priceAmount, this.priceUnit);
};
