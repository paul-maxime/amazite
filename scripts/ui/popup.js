/*
 * Amazite Project
 * ui/popup.js
 */

var Popup = {
    init: function () {
        $("<div id='popup-container'>").appendTo("body");
        $("#popup-container")
            .css("position", "absolute")
            .addClass("default-color")
            .css("bottom", "20px")
            .css("right", "20px");
    },
    show: function (text) {
        var popup = $("<div>")
            .css("border", "2px ridge white")
            .css("cursor", "pointer")
            .css("padding", "0px 10px 0px 10px")
            .css("margin", "5px 0px 0px 0px")
            .append("<p>" + text + "</p>")
            .appendTo("#popup-container");
        var height = popup.height();
        popup
            .css("height", "0px")
            .click(function (e) {
                $(this).animate({
                    height: 0
                }, 250, "swing", function () {
                    $(this).remove();
                });
                return false;
            })
            .mousedown(function () {
                return false;
            })
            .animate({
                height: height
            }, 250);
    }
};
