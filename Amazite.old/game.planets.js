/*
** game.planets.js
*/

Game.planets = [];

Game.planets.init = function () {
    this.planets = [];
    
    this.earth = new Planet();
    this.earth.initEarth();
    this.addPlanet(this.earth);
    
    this.currentPlanet = "Earth";
    
    /* Example */
    // this.earth2 = new Planet();
    // this.earth2.initEarth();
    // this.earth2.name = "Earth2";
    // this.addPlanet(this.earth2);
    
    Game.resources.addProduction(this.planets[0].production, UnitType.NONE);
};

Game.planets.addPlanet = function (planet) {
    var id = "buildingsPlanet" + this.planets.length;
    var winId = "#window-" + id;
    
    this.winBuildingsPlanet = new Window(id, "#tabs-buildings")
        .text(tr("earth"))
        .css("cursor", "pointer")
        .css("float", "left");

    $(winId).click(this.planets.length, function (event) {
        Game.planets.onPlanetNameClick(event.data);
    });
    $(winId).mouseenter(function () {
        $(winId).css("background-color", "#eeeeee");
    });
    $(winId).mouseleave(planet.name, function (event) {
        if (event.data == Game.planets.currentPlanet) {
            $(winId).css("background-color", "white");
        }
    });
        
    this.planets.push(planet);
};

Game.planets.onPlanetNameClick = function (index) {
    this.currentPlanet = this.planets[index].name;
    Game.buildings.set(this.planets[index]);
};
