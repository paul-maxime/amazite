/*
 * Amazite Project
 * ui/tooltip.js
 */

var Tooltip = function (parent) {
    var root = this;

    this._parent = parent;
    this._div = $("<div>")
        .css("position", "absolute")
        .addClass("default-border")
        .addClass("default-color")
        .css("padding", "2px 2px 2px 2px")
        .css("z-index", "10")
        .appendTo("body")
        .hide();

    parent.mouseenter(function (e) {
        root._div.css("left", (e.pageX + 10) + "px");
        root._div.css("top", (e.pageY + 5) + "px");
        root.show();
    });
    parent.mousemove(function (e) {
        root._div.css("left", (e.pageX + 10) + "px");
        root._div.css("top", (e.pageY + 5) + "px");
    });
    parent.mouseleave(function () {
        root.hide();
    });
};

Tooltip.prototype.css = function (command) {
    this._div.css(command);
};

Tooltip.prototype.html = function (text) {
    this._div.html(text);
};

Tooltip.prototype.show = function () {
    this._div.show();
};

Tooltip.prototype.hide = function () {
    this._div.hide();
};

Tooltip.prototype.remove = function () {
    this._div.remove();
};