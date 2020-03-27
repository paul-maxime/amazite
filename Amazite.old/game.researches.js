/*
** game.researches.js
*/

Game.researches = [];

Game.researches.init = function()
{
    this.researchTime = -1;
    
    this.winResearch = new Window("researches", "#tabs-researches")
        .css("float", "left")
        .hide();
};

Game.researches.set = function(planet)
{
    this.planet = planet;
    this.refreshResearch();
};

Game.researches.refreshResearch = function()
{
    if (this.researchTime != -1)
    {
        var research = this.planet.research();

        this.winResearch.clear()
            .img(research.imageName, Content.upgrades)
            .append('<div id="research"></div>')
            .append('<div id="research-speedup"></div>')
            .append('<div id="research-cancel"></div>')
            .css('text-align', 'center');

        $("#window-researches-" + research.imageName)
            .css('float', 'left')
            .css('margin', '5px');

        $("#research")
            .append('<div id="research-title"></div>')
            .append('<div id="research-bar"></div>');

        $("#research-title")
            .html(research.name)
            .css('display', 'inline-block')
            .css('margin-top', '10px');

        $("#research-bar")
            .append('<div id="research-bar-1"></div>')
            .append('<div id="research-bar-2"></div>')
            .css('display', 'inline-block')
            .css('margin-top', '5px');
        $("#research-bar-1")
            .css('background-color', 'black')
            .css('display', 'inline-block')
            .css('width', '0px')
            .css('height', '20px');
        $("#research-bar-2")
            .css('background-color', 'gray')
            .css('display', 'inline-block')
            .css('width', '200px')
            .css('height', '20px');

        $("#research-speedup")
            .html(tr("researchEndNow").format(research.endPrice()))
            .css("margin-top", "20px")
            .click(function() {
                Game.researches.researchSpeedUp();
            });

        $("#research-cancel")
            .html(tr("researchCancel"))
            .css("margin-top", "5px")
            .click(function() {
                Game.researches.researchCancel();
            });

        $("#research-speedup, #research-cancel")
            .css("cursor", "pointer")
            .css("font-size", "0.9em")
            .css("text-decoration", "underline");
    }
    else if (this.planet.researchAvailable())
    {
        var research = this.planet.research();

        this.winResearch.clear()
            .img(research.imageName, Content.upgrades)
            .append('<div id="research-title"></div>')
            .append('<div id="research-available"></div>')
            .append('<div id="research-price"></div>')
            .css('text-align', 'center');

        $("#window-researches-" + research.imageName)
            .css('float', 'left')
            .css('margin', '5px');

        $('#research-title')
            .html(tr("researchAvailable"))
            .css('float', 'left')
            .css('margin-top', '15px');

        $('#research-available')
            .html(research.name)
            .css('text-decoration', 'underline');

        $('#research-price')
            .html(tr("researchDetails").format(research.price(), research.time))
            .css('margin-top', '25px')
            .css('margin-bottom', '3px')
            .css('font-size', '0.9em');

        $("#research-available, #window-researches-" + research.imageName)
            .css('cursor', 'pointer')
            .click(function() {
                Game.researches.onResearchClick();
            });
    }
    else
    {
        this.winResearch.clear()
            .text(tr("researchAvailable"))
            .text(tr("researchNone"))
            .css("text-align", "center");
    }
};

Game.researches.onResearchClick = function()
{
    var research = this.planet.research();
    if (this.researchTime == -1)
    {
        this.researchTime = research.time;
        this.refreshResearch();
    }
};

Game.researches.researchTimeUpdate = function()
{
    if (this.researchTime > 0)
    {
        var research = this.planet.research();
        if (Game.resources.removeAmazite(research.pricePerSecond, research.priceUnit))
        {
            this.researchTime--;
            var size = Math.floor(this.researchTime * 200 / research.time);
            $("#research-bar-1").css("width", (200 - size) + "px");
            $("#research-bar-2").css("width", size + "px");
        }
        if (this.researchTime == 0)
            this.researchTimeElapsed();
    }
};

Game.researches.researchTimeElapsed = function()
{
    this.researchTime = -1;

    var research = this.planet.research();

    this.planet.currentResearch++;
    this.planet.buildings[research.unlockId].isUnlocked = true;
    this.refreshResearch();
    Game.buildings.refreshBuildings();
};

Game.researches.researchSpeedUp = function()
{
    var research = this.planet.research();

    if (this.researchTime != -1)
    {
        var fullPrice = research.pricePerSecond * research.time;
        if (Game.resources.removeAmazite(fullPrice, research.priceUnit))
            this.researchTimeElapsed();
    }
};

Game.researches.researchCancel = function()
{
    this.researchTime = -1;
    this.refreshResearch();
};