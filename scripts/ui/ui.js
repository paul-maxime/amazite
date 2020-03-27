/*
 * Amazite Project
 * ui/ui.js
 */

$(function () {
    Game.init();
    Ui.init();
});

// Prevent image-dragging on firefox
$(document).on("dragstart", function(e) {
     if (e.target.nodeName.toUpperCase() == "IMG") {
         return false;
     }
});

var Ui = {
    /* Variables */
    amaziteArea: null,
    amaziteAmount: null,
    amaziteToolTip: null,
    amaziteProduction: null,

    saveArea: null,
    saveButton: null,
    saveReset: null,
    saveDate: null,

    currentTab: null,
    areas: [],
    tabs: [],
    tooltips: [],
    
    /* Private Variables */
    _colorClass: null,

    /* Functions */
    init: function () {
        if (!Game.config.ui) {
            Game.config.ui = {
                isNightMode: true
            };
        }
        
        $("html").contextmenu(function() { return false; });
        Ui.setColorMode(Game.config.ui.isNightMode);
        $("body").css("font-family", '"Lucida Console", "Lucida Sans Typewriter", Monaco, "Bitstream Vera Sans Mono", monospace');
        $("body").css("font-size", "15px");
        $("body").addClass("default-color");

        Popup.init();

        Game.currentPlanet = Game.planets[0];

        Ui._initSaveArea();
        Ui._initIconArea();
        Ui._initAmaziteArea();
        Ui._initPlanetsSelectionArea();
        Ui._initTabs();
    },
    
    setColorMode: function(isNightMode) {
        Game.config.ui.isNightMode = isNightMode;
        var foregroundColor = isNightMode ? "white" : "black";
        var backgroundColor = isNightMode ? "black" : "white";
        var selectedColor = isNightMode ? "#505050" : "#A0A0A0";
        var invertCss = isNightMode ? "" : "img { filter: invert(100%); -webkit-filter: invert(100%); }";
        if (Ui._colorClass) Ui._colorClass.remove();
        Ui._colorClass = $('<style type="text/css">'
            + '.default-color { color: ' + foregroundColor + '; background-color: ' + backgroundColor + ' }'
            + '.default-color-front { color: ' + foregroundColor + ' }'
            + '.default-color-back { background-color: ' + backgroundColor + ' }'
            + '.default-color-reverse { color: ' + backgroundColor + '; background-color: ' + foregroundColor + ' }'
            + '.default-color-front-reverse { color: ' + backgroundColor + ' }'
            + '.default-color-back-reverse { background-color: ' + foregroundColor + ' }'
            + '.default-color-back-selected { background-color: ' + selectedColor + ' }'
            + '.default-border { border: 1px solid ' + foregroundColor + ' }'
            + invertCss + ' </style>').appendTo("head");
    },

    _initSaveArea: function () {
        Ui.saveArea = $("<p>")
            .appendTo("body")
            .css("position", "absolute")
            .css("left", "10px")
            .css("bottom", "2px")
            .css("font-size", "12px");

        Ui.saveButton = $("<span>Save</span>")
            .appendTo(Ui.saveArea)
            .css("cursor", "pointer")
            .css("text-decoration", "underline")
            .click(function () {
                Game.save();
                Popup.show("Game saved!");
            });

        Ui.saveArea.append(" | ");

        Ui.saveReset = $("<span>Reset</span>")
            .appendTo(Ui.saveArea)
            .css("cursor", "pointer")
            .css("text-decoration", "underline")
            .click(function () {
                if (confirm("Are you sure you want to reset your game?") &&
                    confirm("Are you really sure? This action cannot be undone!")) {
                    Game.reset();
                }
            });

        Ui.saveDate = $("<span>")
            .appendTo(Ui.saveArea);

        Game.onGameSaved = function () {
            date = new Date();
            Ui.saveDate.html(" | Game saved: " + date.fullDate());
        };

        Game.onGameReset = function () {
            $("body").empty();
            Ui.init();
            Popup.show("Game reset!");
        };
    },

    _initIconArea: function () {
        iconArea = $('<div id="iconContainer">')
            .appendTo("body")
            .addClass("default-border")
            .css("display", "inline-block")
            .css("vertical-align", "top")
            .css("height", "64px")
            .css("margin", "5px")
            .css("padding", "3px");

        $('<img src="images/amazite.svg" id="amaziteIcon"/>')
            .appendTo(iconArea)
            .css("width", "64px")
            .click(function () {
                if (Game.amazite.compare(Game.storage) < 0)
                    Game.amazite.add(1, Units.NONE);
                Game.calculate();
            });
    },

    _initAmaziteArea: function () {
        Ui.amaziteArea = $("<div>")
            .appendTo("body")
            .addClass("default-border")
            .css("display", "inline-block")
            .css("vertical-align", "top")
            .css("height", "64px")
            .css("margin", "5px")
            .css("padding", "3px")
            .css("text-align", "center");

        $("<p>Amazite</p>")
            .appendTo(Ui.amaziteArea)
            .css("margin", "0 0 10px 0");

        tmpAmazite = $("<p>")
            .appendTo(Ui.amaziteArea)
            .css("margin", "0");

        tmpProduction = $("<p> per second</p>")
            .appendTo(Ui.amaziteArea)
            .css("margin", "0");

        Ui.amaziteAmount = $("<span>").appendTo(tmpAmazite);
        $("<span> / </span>").appendTo(tmpAmazite);
        Ui.amaziteStorage = $("<span>").appendTo(tmpAmazite);
        Ui.amaziteProduction = $("<span>").prependTo(tmpProduction);

        Ui.amaziteToolTip = new Tooltip(Ui.amaziteArea);

        Game.onAmaziteChanged = function () {
            Ui.amaziteAmount.html(Game.amazite.toString());
            Ui.amaziteStorage.html(Game.storage.toString());
            Ui.amaziteProduction.html(Game.production.toString());

            Ui.amaziteToolTip.html(
                "Amazite: " + Game.amazite.toNumericString() + "<br>" +
                "Storage: " + Game.storage.toNumericString() + "<br>" +
                "Production: " + Game.production.toNumericString() + " / sec");
        };

        Game.onAmaziteChanged();
    },

    _initPlanetsSelectionArea: function () {
        Ui.planetsSelectionArea = $("<div id=\"PlanetSelection\">")
            .appendTo("body")
            .addClass("default-border")
            .css("display", "inline-block")
            .css("vertical-align", "top")
            .css("height", "64px")
            .css("margin", "5px")
            .css("padding", "3px")
            .css("text-align", "center");

        Ui.planetsSelectionList = $('<select id="selectList">')
            .appendTo(Ui.planetsSelectionArea)
            .addClass("default-border")
            .css("margin", "0 0 3px 0")
            .css("font-size", "15px")
            .css("text-align", "center")
            .css("padding", "0 10px 0 5px")
            .addClass("default-color")
            .change(function() {
                Ui.selectPlanet($("#selectList option:selected").index());
            });

        for (var i = 0; i < Game.planets.length; ++i) {
            $("<option>")
                .text(Game.planets[i].name).appendTo(Ui.planetsSelectionList);
        }

        Ui.planetsSelectionInfo = $("<p>")
            .appendTo(Ui.planetsSelectionArea)
            .css("margin-top", "4px");

        Ui.planetsSelectionToolTip = new Tooltip(Ui.planetsSelectionInfo);

        Ui.selectPlanet = function (planetIndex) {
            Game.currentPlanet = Game.planets[planetIndex];
            Game.onPlanetSizeChanged(Game.planets[planetIndex]);

            Ui.removeAreas();
            Ui.removeTooltips();
            Ui.changeTab(Ui.currentTab);
        };

        Game.onPlanetSizeChanged = function (planet) {
            if (Game.currentPlanet == planet) {
                Ui.planetsSelectionInfo.html(
                    "Size: " +
                    Game.currentPlanet.spentSize + " / " + Game.currentPlanet.landSize + " km²");
                Ui.planetsSelectionToolTip.html(
                    "Potential:&nbsp&nbsp&nbsp&nbsp" + Game.currentPlanet.getPotential() + " (" + Game.currentPlanet.power + ")<br>"
                    + "Land surface: " + Game.currentPlanet.landSize + " km²<br>"
                    + "Sea surface:&nbsp&nbsp" + Game.currentPlanet.seaSize + " km²<br>"
                    + "Air surface:&nbsp&nbsp" + (Game.currentPlanet.landSize + Game.currentPlanet.seaSize) + " km²");
            }
        };

        Game.onPlanetSizeChanged(Game.currentPlanet);
    },

    _initPlanetArea: function () {
        Ui.planetArea = $("<div id=\"Planet\">")
            .appendTo("body");
        Ui._initBuildingArea();
        Ui._initResearchArea();
    },

    _initBuildingArea: function () {
        Ui.buildingArea = $("<table>")
            .appendTo(Ui.planetArea)
            .addClass("default-border")
            .css("margin", "5px")
            .css("padding", "3px")
            .hide();

		Ui.displayBuildings = function(fromIndex) {
            var buildingPerLine = 3;
        
            var lineCount = Math.ceil(Game.currentPlanet.unlockedBuildings / buildingPerLine);
            for (var i = 0; i < lineCount; ++i)
                $('<tr id="line' + i + '">').appendTo(Ui.buildingArea);

			for (var i = fromIndex; i < Game.currentPlanet.unlockedBuildings; ++i) {
				$('<td id="object' + i + '">')
                    .appendTo("#line" + Math.floor(i / buildingPerLine));
				$('<img src="images/icons/buildings/' + Game.currentPlanet.buildings[i].icon + '.svg" id="building' + Game.currentPlanet.name + i + '"/>')
					.appendTo("#object" + i)
					.css("cursor", "pointer")
					.css("padding", "10px")
					.css("width", "48px")
                    .mouseup(i, function(e) {
                        if (e.button == 0)
                            Game.currentPlanet.buildings[e.data].purchase();
                        else if (e.button == 2)
                            Game.currentPlanet.buildings[e.data].destroy();
					});

                $('<div id="buildingInfo' + Game.currentPlanet.name + i + '">')
					.appendTo("#object" + i)
					.html(Game.currentPlanet.buildings[i].name + "<br>"
						+ Game.currentPlanet.buildings[i].getType() + "<br>")
					.css("vertical-align", "9px")
                    .css("display", "inline-block");

                $('<div>')
					.appendTo("#buildingInfo" + Game.currentPlanet.name + i + "")
					.html("[" + Game.currentPlanet.buildings[i].quantity + "]")
                    .css("margin-top", "8px");

                if (Ui.tooltips[Ui.tooltips.length] == null)
                {
                    Ui.buildingTooltip = new Tooltip($("#building" + Game.currentPlanet.name + i));
                    Ui.buildingTooltip.html("Cost: " + Game.currentPlanet.buildings[i].cost + "<br>"
                                            + "Size: " + Game.currentPlanet.buildings[i].size + " km²<br>"
                                            + Game.currentPlanet.buildings[i].getEffect());
                    Ui.tooltips[Ui.tooltips.length] = Ui.buildingTooltip;
                }
			}
		}

        Game.onBuildingCountChanged = function (building) {
            $("#buildingInfo" + Game.currentPlanet.name + building.index)
				.html(Game.currentPlanet.buildings[building.index].name + "<br>"
                    + Game.currentPlanet.buildings[building.index].getType() + "<br>");

            $('<div>')
                .appendTo("#buildingInfo" + Game.currentPlanet.name + building.index + "")
                .html("[" + Game.currentPlanet.buildings[building.index].quantity + "]")
                .css("font-size", "14px")
                .css("margin-top", "8px");

            Ui.tooltips[building.index]
                .html("Cost : " + Game.currentPlanet.buildings[building.index].cost + "<br>"
                    + "Size : " + Game.currentPlanet.buildings[building.index].size + "<br>"
                    + Game.currentPlanet.buildings[building.index].getEffect())
        };

		Ui.displayBuildings(0);

        Ui.areas[Ui.areas.length] = Ui.buildingArea;
        Ui.buildingArea.show();
    },

	_initResearchArea: function() {
		var currentResearch = Game.currentPlanet.researches[Game.currentPlanet.unlockedResearches];
		if (currentResearch == null)
			return;

		Ui.researchArea = $("<div>")
            .appendTo(Ui.planetArea)
            .addClass("default-border")
            .css("vertical-align", "top")
            .css("width", "315px")
            .css("margin", "5px")
            .css("padding", "3px")
            .hide();

        Ui.researchName = $("<div>")
            .appendTo(Ui.researchArea)
            .html((currentResearch == null ? "" : currentResearch.name + "<br>") + "<br>")
            .css("font-size", "16px")
            .css("text-align", "center");

        Ui.researchImage = $('<img src="images/icons/researches/' + currentResearch.icon + '.svg" id="researchImage"/>')
            .appendTo(Ui.researchArea)
            .css("padding", "15px")
            .css("width", "48px")
			.css("cursor", "pointer")
			.css("margin-top", "-32px")
			.css("float", "left")
			.click(function() { Ui.launchResearch(); });

        var timeToDraw = (currentResearch.remainingTime == -1 ? currentResearch.duration : currentResearch.remainingTime) + " seconds<br>";
		Ui.researchTime = $("<div>")
			.appendTo(Ui.researchArea)
            .html(timeToDraw)
			.css("margin", "left");

        Ui.researchCost = $("<div>")
			.appendTo(Ui.researchArea)
            .html(currentResearch.cost + " per second")
			.css("margin", "left");

        Ui.researchBar = $("<div>")
			.appendTo(Ui.researchArea)
            .addClass("default-border")
            .addClass("default-color-back-selected")
            .css("margin-top", "16px")
            .css("color", "white");

        Ui.researchFillBar = $("<div>")
			.appendTo(Ui.researchBar)
            .addClass("default-color-back-reverse")
            .css("width", "0px")
            .css("height", "16px")
            .addClass("default-color");

        Ui.researchState = $("<div>")
            .appendTo(Ui.researchArea)
            .html("<br>" + (currentResearch.remainingTime == -1 ? "Research" : "Researching..."))
			.css("text-decoration", "underline")
			.css("cursor", "pointer")
            .css("text-align", "center")
			.click(function() { Ui.launchResearch(); });

        Ui.launchResearch = function () {
            currentResearch.remainingTime == -1 ? currentResearch.start() : currentResearch.stop();
        };

        Game.onResearchTick = function (research) {
            if (research.planet == Game.currentPlanet)
            {
                Ui.researchState.html("<br>" + (research.remainingTime == -1 ? "Research" : "Researching...") + "<br>");
                Ui.researchTime.html((research.remainingTime == -1 ? research.duration : research.remainingTime) + " seconds<br>");
                var filled = research.remainingTime == -1 ? 0 : (1 - (research.remainingTime / research.duration)) * Ui.researchBar.width();
                Ui.researchFillBar.css("width", filled + "px");
            }};

        Game.onResearchDone = function (research, planet) {
            if (planet === Game.currentPlanet)
            {
                if (research.type === Research.Type.Building) {
                    Ui.displayBuildings(planet.unlockedBuildings - 1);
                }

                var nextResearch = planet.researches[planet.unlockedResearches];
                if (nextResearch != null) {
                    Ui.researchName.html(nextResearch.name + "<br><br>");
                    Ui.researchImage.attr("src", "images/icons/researches/" + nextResearch.icon + ".svg");
                    Ui.researchTime.html(nextResearch.duration + " seconds");
                    Ui.researchCost.html(nextResearch.cost + " per second");
                    Ui.researchFillBar.css("width", "0px");
                    currentResearch = planet.researches[planet.unlockedResearches];
                    Game.onResearchTick(nextResearch);
                }
                else
                    Ui.researchArea.remove();
            }
			Popup.show("\"" + research.name + "\" on planet \"" + planet.name + "\" done!")
		};

        Ui.areas[Ui.areas.length] = Ui.researchArea;
        Ui.researchArea.show(0, function() {
            var filled = currentResearch.remainingTime == -1 ? 0 : (1 - (currentResearch.remainingTime / currentResearch.duration)) * Ui.researchBar.width();
            Ui.researchFillBar.css("width", filled + "px");
        });
	},

    _initUpgradeArea: function() {
        Ui.upgradeArea = $("<div id=\"Upgrade\">")
            .appendTo("body")
            .addClass("default-border")
            .css("display", "inline-block")
            .css("vertical-align", "top")
            .css("text-align", "center")
            .css("width", "512px")
            .css("height", "512px")
            .css("margin", "5px")
            .css("padding", "3px")
            .hide();

        Ui.areas[Ui.areas.length] = Ui.upgradeArea;
        Ui.upgradeArea.show();
    },

    _initHangarArea: function() {
        Ui.hangarArea = $("<div id=\"Hangar\">")
            .appendTo("body")
            .addClass("default-border")
            .css("display", "inline-block")
            .css("vertical-align", "top")
            .css("text-align", "center")
            .css("width", "256px")
            .css("margin", "5px")
            .css("padding", "3px")
            .hide();

        Ui.hangarCapacity = $("<div>")
            .appendTo(Ui.hangarArea)
            .html("Capacity: " + Game.capacity + "<br>");

        Game.onCapacityChanged = function (capacity) {
            Ui.hangarCapacity.html("Capacity: " + Game.capacity + "<br>");
        };

        Ui.areas[Ui.areas.length] = Ui.hangarArea;
        Ui.hangarArea.show();
    },

    _initTabs: function () {
        Ui.currentTab = null;
        Ui.tabs = [];
        Ui.tabs[Ui.tabs.length] = [new Tab("Planet"), Ui._initPlanetArea];
        Ui.tabs[Ui.tabs.length] = [new Tab("Upgrade"), Ui._initUpgradeArea];
        Ui.tabs[Ui.tabs.length] = [new Tab("Hangar"), Ui._initHangarArea];

        Ui.tabs[0][0].show();
        Ui.tabs[1][0].show();

        Ui.changeTab("Planet");
        $("<div>").appendTo("body");
    },

    changeTab: function(name) {
        Ui.removeAreas();
        for (var i = 0; i < Ui.tabs.length; ++i) {
            var tab = Ui.tabs[i];
            var tabName = tab[0].getName();

            var color = "#707070";
            if (tabName == name)
                tab[1]();
            else
                color = "#000000";
            tab[0].getDiv().css("background-color", color);
        }

        if (Ui.currentTab == "Planet")
            Ui.removeTooltips();
        Ui.currentTab = name;
    },

    removeAreas: function() {
        for (var i = 0; i < Ui.areas.length; ++i)
            Ui.areas[i].remove();
    },

    removeTooltips: function() {
        for (var i = 0; i < Ui.tooltips.length; ++i)
            Ui.tooltips[i].remove();
        Ui.tooltips.splice(0, Ui.tooltips.length);
    }
};
