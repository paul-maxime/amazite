/*
** game.cockpit.js
*/

Game.cockpit = [];

Game.cockpit.init = function()
{
    this.winCockpit = new Window('cockpit', '#tabs-cockpit')
        .css("border-width", "3")
        .css("border-color", "black");

    this.winCockpitPlanet = new Window('planet', '#window-cockpit')
        .title(tr('planetCurrent'))
        .text(tr('planetName').format('<span id="cockpit-planet-name"></span>'))
        .text(tr('planetRay').format('<span id="cockpit-planet-ray"></span>'))
        .text(tr('planetPopulation').format('<span id="cockpit-planet-population"></span>'))
        .text(tr('planetAmazite').format('<span id="cockpit-planet-production"></span>'));

    this.winCockpitFleet = new Window('fleet', '#window-cockpit')
        .text(tr("shipsOverview"))
        .text('<span id="window-cockpit-fleet"></span>');

    this.winCockpitView  = new Window('view', '#window-cockpit')
        .css("height", "500")
        .css("width", "500");
};

Game.cockpit.set = function(planet)
{
    $("#cockpit-planet-name").html(planet.name);
    $("#cockpit-planet-ray").html(planet.ray);
    $("#cockpit-planet-population").html(planet.population);
    $("#cockpit-planet-production").html(planet.production);
};
