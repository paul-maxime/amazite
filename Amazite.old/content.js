/*
** content.js
*/

var Content = [];

Content.drawImage = function(dom, content, name) {

    loc = content[name];
    if (dom.css("background-image") == "none") {
        dom.css("background-image", "url(images/" + content.file + ")");
    }
    dom.css("width", content.size[0])
       .css("height", content.size[1])
       .css("display", "inline-block")
       .css("background-repeat", "none")
       .css("background-position", "-" + loc[0] + "px " + " -" + loc[1] + "px");
};

Content.drawPart = function(dom, content, name) {

    loc = content[name];
    dom.css("width", loc[2])
       .css("height", loc[3])
       .css("display", "inline-block")
       .css("background", "url(images/" + content.file + ") no-repeat")
       .css("background-position", "-" + loc[0] + "px " + " -" + loc[1] + "px");
};

Content.meteorite = {

    file :      "meteorite.png",
    size :      [128, 128],

    intact :    [0, 0],
    broken1 :   [128, 0],
    broken2 :   [256, 0],
    broken3 :   [0, 128],
    broken4 :   [128, 128],
    broken5 :   [256, 128]
};

Content.upgrades = {

    file :      "upgrades.png",
    size :      [64, 64],

    handmade :    [0, 0],
    laboratory :  [64, 0],
    center :      [128, 0],
    factory :     [192, 0],
    facility :    [0, 64],
    complex :     [64, 64],
    
    hat :         [128, 64],
    nuclear :     [192, 64],
    generator :   [0, 128],
    moneybag :    [64, 128]
};

Content.sprites = {

    file :  		"sprites.png",

    amazite :       [0, 0, 128, 128],
    amaziteMini :   [0, 128, 64, 64],
    character :     [128, 0, 96, 128]
};

Content.ships = {

    file : 	"ships.png",

    scout : [0, 0, 256, 128]
};

Content.tools = {

	file : 			"tools.png",
	size : 			[32, 16],
	
	leftArrow : 	[0, 0],
	rightArrow : 	[32, 0]
};