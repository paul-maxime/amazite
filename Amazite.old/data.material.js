/*
** data.material.js
*/

var UNITS = ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"];
var UNITS_COUNT = 9;
var UnitType = {
    NONE : 0,
    KILO : 1,
    MEGA : 2,
    GIGA : 3,
    TERA : 4,
    PETA : 5,
    EXA : 6,
    ZETTA : 7,
    YOTTA : 8
};

var Material = function() {

    this.amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
};

Material.prototype.add = function(amount, type) {

    if (amount >= 0 && type >= 0 && type < UNITS_COUNT) {
        this.amounts[type] += amount;
        this.fix();
    }
};

Material.prototype.addMaterial = function(materialB) {

    var unit = materialB.maxUnit();
    for (var i = 0; i <= unit; i++)
        this.amounts[i] += materialB.amounts[i];
    this.fix();
};

Material.prototype.remove = function(amount, type) {

    var materialB = new Material();
    materialB.add(amount, type);
    
    if (this.compareTo(materialB) == -1)
        return false;
        
    var unit = materialB.maxUnit();
    for (var i = 0; i <= unit; i++)
        this.amounts[i] -= materialB.amounts[i];
    this.fix();
    
    return true;
};

Material.prototype.fix = function() {

    var remainder = 0;
    for (var i = 0; i < UNITS_COUNT; i++)
    {
        this.amounts[i] += remainder;
        if (this.amounts[i] < 0) {
            this.amounts[i + 1] -= 1;
            this.amounts[i] += 1000;
        }
        remainder = Math.floor(this.amounts[i] / 1000);
        this.amounts[i] -= remainder * 1000;
    }
};

Material.prototype.compare = function(amount, type) {

    var materialB = new Material();
    materialB.add(amount, type);
    return this.compareTo(materialB);
};

Material.prototype.compareTo = function(materialB) {

    var unitA = this.maxUnit();
    var unitB = materialB.maxUnit();
    if (unitA < unitB)
        return -1;
    if (unitA > unitB)
        return 1;
    for (var i = unitA; i >= 0; i--)
    {
        var amountA = this.amounts[i];
        var amountB = materialB.amounts[i];
        if (amountA < amountB)
            return -1;
        if (amountA > amountB)
            return 1;
    }
    return 0;
};

Material.prototype.maxUnit = function() {

    for (var i = UNITS_COUNT - 1; i > 0; i--)
    {
        if (this.amounts[i] != 0)
            return i;
    }
    return 0;
};

Material.prototype.toString = function() {

    var unit = this.maxUnit();
    if (unit == 0) {
        var s = this.amounts[unit] == 1 ? "" : "s";
        return this.amounts[unit] + " " + UNITS[unit] + tr("unit") + s;
    }
    var subAmount = ".";
    if (this.amounts[unit - 1] < 100)
        subAmount += "0";
    if (this.amounts[unit - 1] < 10)
        subAmount += "0";
    subAmount += this.amounts[unit - 1];
    var s = (this.amounts[unit] == 1 && this.amounts[unit - 1] == 0) ? "" : "s";
    return this.amounts[unit] + subAmount + " " + UNITS[unit] + tr("unit") + s;
};

Material.prototype.toNumericString = function() {

    var unit = this.maxUnit();
    var s = "";
    for (var i = unit; i >= 0; i--)
    {
        if (i != unit) {
            if (this.amounts[i] < 100)
                s += "0";
            if (this.amounts[i] < 10)
                s += "0";
        }
        s += this.amounts[i];
        if (i != 0)
            s += ",";
    }
    return s;
};