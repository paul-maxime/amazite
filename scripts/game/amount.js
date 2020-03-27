/*
 * Amazite Project
 * game/amount.js
 */

/* Constructor */

var Amount = function () {
    this.values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (arguments.length == 2) {
        this.addValue(arguments[0], arguments[1]);
    }
};

/* Enumerations */

var Units = {
    NONE : 0,
    KILO : 1,
    MEGA : 2,
    GIGA : 3,
    TERA : 4,
    PETA : 5,
    EXA : 6,
    ZETTA : 7,
    YOTTA : 8,
    KILOYOTTA : 9,

    texts : ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta", "kiloyotta"],
    count : 10
};

/* Public Methods */

Amount.prototype.add = function () {
    if (arguments.length == 2)
        this.addValue(arguments[0], arguments[1]);
    else if (arguments.length == 1)
        this.addAmount(arguments[0]);
    else
        console.error("Amount.add() called with " + arguments.length + " arguments.");
};

Amount.prototype.addValue = function (value, unit) {
    if (value >= 0 && unit >= 0 && unit < Units.count) {
        this.values[unit] += value;
        this._fix();
    } else {
        console.error("Amount.addValue() called with invalid arguments (" + value + ", " + unit + ").");
    }
};

Amount.prototype.addAmount = function (amount) {
    var unit = amount.maxUnit();
    for (var i = 0; i <= unit; i++)
        this.values[i] += amount.values[i];
    this._fix();
};

Amount.prototype.remove = function () {
    if (arguments.length == 2)
        return this.removeValue(arguments[0], arguments[1]);
    else if (arguments.length == 1)
        return this.removeAmount(arguments[0]);
    else
        console.error("Amount.remove() called with " + arguments.length + " arguments.");
};

Amount.prototype.removeValue = function (value, unit) {
    if (value >= 0 && unit >= 0 && unit < Units.count) {
        return this.removeAmount(new Amount(value, unit));
    }
    console.error("Amount.removeValue() called with invalid arguments (" + value + ", " + unit + ").");
    return false;
};

Amount.prototype.removeAmount = function (amount) {
    if (this.compareAmount(amount) == -1)
        return false;
    var unit = amount.maxUnit();
    for (var i = 0; i <= unit; i++)
        this.values[i] -= amount.values[i];
    this._fix();
    return true;
};

Amount.prototype.multiplyInteger = function (value) {
    if (value >= 0) {
        var unit = this.maxUnit();
        for (var i = 0; i <= unit; i++)
            this.values[i] *= value;
        this._fix();
    } else {
        console.error("Amount.multiplyInteger() called with an invalid argument (" + value + ").");
    }
};

Amount.prototype.divideInteger = function (value) {
    if (value > 0) {
        var unit = this.maxUnit();
        for (var i = unit; i >= 0; i--) {
            if (this.values[i] != 0) {
                var div = ~~(this.values[i] / value);
                var rem = (this.values[i] % value)
                this.values[i] = div;
                if (i - 1 >= 0) {
                    this.values[i - 1] += ~~(rem * 1000);
                }
            }
        }
    } else {
        console.error("Amount.divideInteger() called with an invalid argument (" + value + ").");
    }
};

Amount.prototype.compare = function () {
    if (arguments.length == 2)
        return this.compareValue(arguments[0], arguments[1]);
    else if (arguments.length == 1)
        return this.compareAmount(arguments[0]);
    else
        console.error("Amount.compare() called with " + arguments.length + " arguments.");
};

Amount.prototype.compareValue = function (value, unit) {
    return this.compareAmount(new Amount(value, unit));
};

Amount.prototype.compareAmount = function (amount) {
    var unitA = this.maxUnit();
    var unitB = amount.maxUnit();
    if (unitA < unitB) return -1;
    if (unitA > unitB) return 1;
    for (var i = unitA; i >= 0; i--) {
        var amountA = this.values[i];
        var amountB = amount.values[i];
        if (amountA < amountB) return -1;
        if (amountA > amountB) return 1;
    }
    return 0;
};

Amount.prototype.maxUnit = function () {
    for (var i = Units.count - 1; i > 0; i--) {
        if (this.values[i] != 0) {
            return i;
        }
    }
    return 0;
};

Amount.prototype.toString = function () {
    var unit = this.maxUnit();
    var str = "";
    var isPlural = false;

    if (unit > 0) {
        str += this.values[unit] + ",";
        if (this.values[unit] > 0) isPlural = true;
        --unit;
        if (this.values[unit] < 100) str += "0";
        if (this.values[unit] < 10) str += "0";
    }

    if (this.values[unit] > 1) isPlural = true;
    str += this.values[unit] + " " + Units.texts[unit] + "gram" + (isPlural ? "s" : "");

    return str;
};

Amount.prototype.toNumericString = function () {
    var unit = this.maxUnit();
    var s = "";
    for (var i = unit; i >= 0; i--) {
        if (i != unit) {
            if (this.values[i] < 100) s += "0";
            if (this.values[i] < 10) s += "0";
        }
        s += this.values[i];
        if (i != 0) s += ",";
    }
    var isPlural = false;
    if (unit > 0 || this.values[0] > 1) isPlural = true;
    return s + " gram" + (isPlural ? "s" : "");
};

Amount.prototype.serialize = function () {
    return this.values;
};

Amount.prototype.unserialize = function (values) {
    this.values = values;
};

/* Private Methods */

Amount.prototype._fix = function () {
    var remainder = 0;
    for (var i = 0; i < Units.count; i++) {
        this.values[i] += remainder;
        if (this.values[i] < 0) {
            this.values[i + 1] -= 1;
            this.values[i] += 1000;
        }
        remainder = Math.floor(this.values[i] / 1000);
        this.values[i] -= remainder * 1000;
    }
};
