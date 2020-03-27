/*
** game.upgrades.js
*/

Game.upgrades = [];

Game.upgrades.init = function()
{
    $("#tabs-upgrades").append('<div id="tabs-upgrades-right" style="float: left"></div>');

    this.winUpgrades = new Window("upgrades", "#tabs-upgrades-right")
        .css("position", "relative")
        .hide();
    this.winUpgradesDetails = new Window("upgradesDetails")
        .text('<center><span id="upgrade-fullname"></span></center>')
        .text(tr("upgradeDetailsPrice").format('<span id="upgrade-numeric"></span>'))
        .text(tr("upgradeDetailsEffect").format('<span id="upgrade-effect"></span>'))
        .css("position", "absolute")
        .css("background-color", "white")
        .hide();

    $("#window-upgrades").mousemove(function(event)
    {
        var popup = $("#window-upgradesDetails");
        var height = popup.height() + event.pageY + 20;
        var y = event.pageY + 3;
        if ($(window).height() < height)
            y -= popup.height();
        popup.css("left", event.pageX + 2)
             .css("top", y);
    });
    
    $("#window-menu-upgrades").click(function()
    {
        Game.upgrades.refreshUpgrades();
    });
};

Game.upgrades.set = function(planet)
{
    this.planet = planet;
    this.refreshUpgrades();
};

Game.upgrades.refreshUpgrades = function()
{
    var window = $("#window-upgrades");
    var isUnlocked = Game.ui.isWindowUnlocked("upgrades");
    
    window.empty();
    this.displayUpgrades(window, this.planet.tree);
    
    if (!isUnlocked) window.show();
    this.displayUpgradeBorders(window, this.planet.tree);
    if (!isUnlocked) window.hide();
};

Game.upgrades.displayUpgrades = function(father, tree)
{
    $('<div id="tree-'+tree.id+'" />')
        .append('<div id="tree-image-'+tree.id+'"/>')
        .append('<div id="tree-sons-'+tree.id+'" />')
        .appendTo(father);
    
    $('#tree-image-'+tree.id)
        .css("cursor", "pointer")
        .click(function(){
            Game.upgrades.onUpgradeClick(tree);
        })
        .mouseenter(function() {
            Game.upgrades.onUpgradeMouseEnter(tree);
        })
        .mouseleave(function() {
            Game.upgrades.winUpgradesDetails.hide();
        });
    
    $("#tree-sons-"+tree.id).css("margin-left", "100px");
    Content.drawImage($("#tree-image-"+tree.id), Content.upgrades, tree.imageName);
    
    if (tree.sons.length != 0)
        $('#tree-image-'+tree.id).css("float", "left");
    
    for (var i = 0; i < tree.sons.length; i++)
        this.displayUpgrades($("#tree-sons-"+tree.id), tree.sons[i]);
};

Game.upgrades.onUpgradeClick = function(tree)
{
    if (tree.buy())
    {
        switch (tree.effectId)
        {
            //Add to the planet production
            case 0:
            this.planet.production += tree.effectValue;
            break;

            // Increase the planete production multiplier
            case 1:
            this.planet.productionMultiplier += (tree.effectValue / 100);
            break;

            // Increase the general multiplier
            case 2:
            Game.resources.increaseMultiplier(tree.effectValue / 100);
            break;

            default:
            break;
        }
        Game.upgrades.refreshUpgrades();
        Game.resources.refreshProduction();
    }
};

Game.upgrades.onUpgradeMouseEnter = function(tree)
{
    $("#upgrade-fullname").html(tree.name);
    $("#upgrade-numeric").html(tree.priceMaterial.toString());
    $("#upgrade-effect").html(tree.effectToString());
    this.winUpgradesDetails.show();
}

Game.upgrades.displayUpgradeBorders = function(window, tree)
{
    var sons = tree.sons;
    var father = tree;
    var first = 0;

    //For the end of a tree
    if (sons.length == 0)
    {
        var x = $('#tree-image-'+tree.id).position().left + $('#tree-image-'+tree.id).width();
        var y = $('#tree-image-'+tree.id).position().top + $('#tree-image-'+tree.id).height() / 2 - 4;

        var div = $("<div>").css("position", "absolute")
                            .css("width", "8px")
                            .css("height", "2px")
                            .css("left", x + "px")
                            .css("top", y + "px")
                            .appendTo(window);

        if (tree.isEndOfTreeBought)
            div.css("border-top", "8px solid black");
        else
            div.css("border-top", "4px solid grey");
    }
    
    for (var i = 0; i < sons.length; i++)
    {
        var child = sons[i];
        if (child.father != null)
        {
            var x = $('#tree-image-'+tree.id).position().left + $('#tree-image-'+tree.id).width();
            var x2 = $('#tree-image-'+child.id).position().left;
            var y = $('#tree-image-'+child.id).position().top + 30;

            if (i != 0)
                x += 20;

            var divX = $("<div>").css("position", "absolute")
                                 .css("width", (x2 - x) + "px")
                                 .css("height", "2px")
                                 .css("left", x + "px")
                                 .css("top", y + "px")
                                 .appendTo(window);

            if (child.isFatherBought)
                divX.css("border-top", "4px solid black");
            else
                divX.css("border-top", "2px solid grey");

            if (i == sons.length - 1 && first != 0)
            {
                divY = $("<div>").css("position", "absolute")
                                 .css("width", "2px")
                                 .css("height", (y - first) + "px")
                                 .css("left", x + "px")
                                 .css("top", first + "px")
                                 .appendTo(window);
                
                if (child.isFatherBought)
                    divY.css("border-left", "4px solid black");
                else
                    divY.css("border-left", "2px solid grey");
            }
            else if (i == 0)
                first = y;
        }
        this.displayUpgradeBorders(window, child);
    }
};