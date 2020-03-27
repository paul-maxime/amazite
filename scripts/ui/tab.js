/*
 * Amazite Project
 * ui/tab.js
 */

var Tab = function (name) {
    this._name = name;

    var root = this;
    var tabSize = 64;

    this._div = $("<div>")
        .appendTo("body")
        .addClass("default-border")
        .css("display", "inline-block")
        .css("height", tabSize + "px")
        .css("margin", "5px")
        .css("padding", "3px")
        .css("cursor", "pointer")
        .mouseenter(function () {
            root._div.css("background-color", "#500050");
        })
        .mouseleave(function () {
            if (Ui.currentTab != name)
                root._div.css("background-color", "#005000");
            else
                root._div.css("background-color", "#707070");
        })
        .click(function () {
            if (Ui.currentTab != root._name)
                Ui.changeTab(root._name);
        })
        .hide();

        $("<span>")
            .appendTo(root._div)
            .text(this._name)
            .css("vertical-align", -tabSize / 3 + "px");
};

Tab.prototype.getName = function () {
    return this._name;
};

Tab.prototype.getDiv = function () {
    return this._div;
};

Tab.prototype.show = function () {
    this._div.show();
};