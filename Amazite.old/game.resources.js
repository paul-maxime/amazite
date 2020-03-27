/*
** game.resources.js
*/

Game.resources = [];

Game.resources.init = function() {
    this.amazite = new Material();
    this.production = new Material();
    this.generalMultiplier = 1;
    
    this.winProduction = Game.ui.production
        .title(tr('resourcesTitle'))
        .text(tr('resourcesAmazite').format('<span id="amazite-quantity"></span>'))
        .text(tr('resourcesProduction').format('<span id="amaziteProduction-quantity"></span>'))
        .css('height', '69px')
        .css('margin-left', '15px');

    this.winProductionDetails = new Window('productionDetails')
        .text(tr('resourcesAmaziteDetails').format('<span id="amazite-numeric"></span>'))
        .text(tr('resourcesProductionDetails').format('<span id="amaziteProduction-numeric"></span>'))
        .css('position', 'absolute')
        .css('background-color', 'white');

    $("#window-production")
        .mouseenter(function(){
        $("#window-productionDetails").show();
        })
        .mouseleave(function()
        {
        $("#window-productionDetails").hide();
        })
        .mousemove(function(event)
        {
        $("#window-productionDetails").css("left", event.pageX + 2)
                                      .css("top", event.pageY + 3);
        });
};

Game.resources.update = function() {
    this.addAmazite(this.production);
};

Game.resources.increaseMultiplier = function(value) {
    this.generalMultiplier += value;
};

Game.resources.addAmazite = function(material) {
    this.amazite.addMaterial(material);
    Game.stats.addAmazite(material);
    this.refresh();
};

Game.resources.removeAmazite = function(quantity, type) {
    var result = this.amazite.remove(quantity, type);
    if (result)
        this.refresh();
    return result;
};

Game.resources.addProduction = function(quantity, type) {
    this.production.add(quantity, type);
    this.refresh();
};

Game.resources.removeProduction = function(quantity, type) {
    var result = this.production.remove(quantity, type);
    if (result)
        this.refresh();
    return result;
};

Game.resources.refreshProduction = function() {
    var totalProduction = 0;
    for (var i = 0; i < Game.planets.planets.length; i++) {
        totalProduction +=
            Math.floor(Game.planets.planets[i].production *
            Game.planets.planets[i].productionMultiplier);
    }
    totalProduction = Math.floor(totalProduction * this.generalMultiplier);
    this.production = new Material();
    this.addProduction(totalProduction, UnitType.NONE);
};

Game.resources.refresh = function() {
    $("#amazite-quantity").html(this.amazite.toString());
    $("#amazite-numeric").html(this.amazite.toNumericString());
    $("#amaziteProduction-quantity").html(this.production.toString());
    $("#amaziteProduction-numeric").html(this.production.toNumericString());
};
