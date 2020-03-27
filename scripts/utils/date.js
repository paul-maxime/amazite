/*
 * Amazite Project
 * utils/date.js
 */

Date.prototype.currentDate = function () {
    if (this.toLocaleDateString) return this.toLocaleDateString();
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/"
        + ((this.getMonth() + 1 < 10) ? "0" : "") + (this.getMonth() + 1) + "/"
        + this.getFullYear();
}

Date.prototype.currentTime = function () {
    if (this.toLocaleTimeString) return this.toLocaleTimeString();
     return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":"
        + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":"
        + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

Date.prototype.fullDate = function () {
    return this.currentDate() + " @ " + this.currentTime();
}
