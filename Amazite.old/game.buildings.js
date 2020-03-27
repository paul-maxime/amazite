/*
** game.buildings.js
*/

Game.buildings = [];

Game.buildings.init = function() {

    this.winBuildings = new Window("buildings", "#tabs-buildings");
    this.winBuildingsDetails = new Window("buildingsDetails")
        .text('<center><span id="building-fullname"></span></center>')
        .text(tr("buildingDetailsPrice").format('<span id="building-numeric"></span>'))
        .text(tr("buildingDetailsBonus").format('<span id="buildingProduction-numeric"></span>'))
        .css("position", "absolute")
        .css("background-color", "white")
        .hide();

    $("#window-buildings").mousemove(function(event)
    {
        var popup = $("#window-buildingsDetails");
        var height = popup.height() + event.pageY + 20;
        var y = event.pageY + 3;
        if ($(window).height() < height)
            y -= popup.height();
        popup.css("left", event.pageX + 2)
             .css("top", y);
    });
};

/*A utiliser dans un mouseclick dans les windows avec le nom des planètes !*/ 
Game.buildings.set = function(planet) {

    this.planet = planet;
    this.refreshBuildings();
};

Game.buildings.refreshBuildings = function() {

    this.winBuildings.clear();
    for (i = 0; i < this.planet.buildings.length; i++)
    {
        if (this.planet.buildings[i].isUnlocked)
        {
            this.displayBuilding(this.planet.buildings[i]);
        }
    }
};

Game.buildings.displayBuilding = function(building) {

    var shortName = building.id;
    var lowerName = shortName.toLowerCase();

    var imageId = "window-buildings-" + lowerName;
    var textId = imageId + "-text";

    this.winBuildings.img(lowerName, Content.upgrades)
                     .append('<span id="'+textId+'"></span>')
                     .append('<div style="clear: both" />');

    $("#" + textId)
        .html(shortName + "<br />")
        .css("float", "left").css("margin", "5px");

    $("#" + imageId)
        .css("float", "left").css("margin", "5px");

    if (building.maxOwnable > building.currentOwned)
    {
        $("#" + textId)
            .append(building.currentOwned + ' / ' + building.maxOwnable);
        $("#" + imageId + ",#" + textId)
            .css("cursor", "pointer")
            .click(i, function(event) {
                Game.buildings.onBuildingClick(event.data);
            })
            .mouseenter(i, function(event) {
                Game.buildings.onBuildingMouseEnter(event.data);
            })
            .mouseleave(function() {
                Game.buildings.winBuildingsDetails.hide();
            });
    }
    else
    {
        $("#" + textId).append(tr("buildingMaximum"));
    }
};

Game.buildings.onBuildingClick = function(index) {

    var building = this.planet.buildings[index];
    if (building.currentOwned < building.maxOwnable
        && Game.resources.removeAmazite(building.priceAmount, building.priceUnit))
    {
        building.buy();
        this.planet.addProduction(building.bonusAmount);
        Game.resources.refreshProduction();
        this.refreshBuildings();

        if (building.currentOwned == building.maxOwnable)
            this.winBuildingsDetails.hide();

        if (building.callback !== null)
            building.callback();
    }
};

Game.buildings.onBuildingMouseEnter = function(index) {

    var building = this.planet.buildings[index];
    $("#building-fullname").html(building.name);
    $("#building-numeric").html(building.price());
    $("#buildingProduction-numeric").html(building.bonus());
    this.winBuildingsDetails.show();
};

Game.buildings.getPlanet = function() {

    return planet.name;
};