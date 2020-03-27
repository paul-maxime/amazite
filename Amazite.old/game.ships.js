/*
** game.ships.js
*/

Game.ships = {
    prototypes : [],
    fleet : [],
    planet : null
};

Game.ships.init = function()
{
    this.winShips = new Window("ships", "#tabs-ships");
    
    this.prototypes.push(new Ship("Scout", 100, 10, 5, 1000, 1, UnitType.MEGA));
    
    for (var i = 0; i < this.prototypes.length; i++)
        this.fleet.push(0);
    
    this.refresh();
};

Game.ships.set = function(planet)
{
    this.planet = planet;
};

Game.ships.fleetSize = function()
{
    var size = 0;
    for (var i = 0; i < this.fleet.length; i++)
        size += this.fleet[i];
    return size;
};

Game.ships.refresh = function()
{
    this.winShips.clear();
    for (i = 0; i < this.prototypes.length; i++)
    {
        var ship = this.prototypes[i];
        var lower = ship.name.toLowerCase();
        var id = "window-ships-" + lower;
        
        this.winShips
            .sprite(lower + '-icon', Content.ships, lower)
            .append('<span id="'+id+'-price"></span><br />')
            .append('<span id="'+id+'-name"></span>')
            .append('<div style="clear:left"></div>');
        
        $("#"+id+"-icon")
            .css("float", "left");
        $("#"+id+"-price")
            .html(ship.price())
            .css("margin", "5px");
        $("#"+id+"-name")
            .html(tr("shipsBuild").format(ship.name))
            .css("margin", "5px")
            .css("cursor", "pointer")
            .css("text-decoration", "underline")
            .click(i, function(event) {
                Game.ships.buyShip(event.data);
            });
    }
};

Game.ships.buyShip = function(id)
{
    var ship = this.prototypes[id];
    if (Game.resources.removeAmazite(ship.priceAmount, ship.priceUnit))
    {
        this.fleet[id] += 1;
        Game.ui.unlockTab("cockpit");
        if (this.fleetSize() < 2)
            $("#window-cockpit-fleet").html(tr("shipFleet").format(this.fleetSize()));
        else
            $("#window-cockpit-fleet").html(tr("shipsFleet").format(this.fleetSize()));
    }
};
