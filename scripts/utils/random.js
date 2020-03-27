/*
 * Amazite Project
 * utils/random.js
 */

var Random = {
    next: function () {
        if (arguments.length == 1) {
            return Math.floor(Random._next1(arguments[0]));
        } else if (arguments.length == 2) {
            return Math.floor(Random._next2(arguments[0], arguments[1]));
        } else {
            console.error("Random.next() called with " + arguments.length + " arguments.");
        }
    },
    nextFloat: function () {
        if (arguments.length == 1) {
            return Random._next1(arguments[0]);
        } else if (arguments.length == 2) {
            return Random._next2(arguments[0], arguments[1]);
        } else {
            console.error("Random.nextFloat() called with " + arguments.length + " arguments.");
        }
    },
    _next1: function (max) {
        return Math.random() * max;
    },
    _next2: function (min, max) {
        return Math.random() * (max - min) + min;
    }
};
