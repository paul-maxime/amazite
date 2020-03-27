/*
** game.introduction.js
*/

Game.introduction = {
    currentPhase: -1,
    meteoriteLife: 60,
    meteoritePosition: -10,
    brokenState: 0
};

Game.introduction.init = function() {

    this.dialogs = I18n.current.introduction;

    $("body").append('<div id="introduction-character"><span id="introduction-character-image"></span></div>');
    Content.drawPart($("#introduction-character-image"), Content.sprites, "character");
    $("#introduction-character-image")
        .css("position", "relative")
        .css("left", "30px").css("top", "-30px")
        .css("cursor", "pointer");
    $("#introduction-character")
        .css("position", "absolute")
        .css("top", "50%").css("left", "50%");

    $("body").append('<div id="introduction-text-container"><span id="introduction-text"></span></div>');
    $("#introduction-text")
        .css("position", "relative")
        .css("left", "60px").css("top", "-68px");
    $("#introduction-text-container")
        .css("position", "absolute")
        .css("top", "50%").css("left", "50%");

    $("body").append('<div id="introduction-meteorite"><span id="introduction-meteorite-image"></span></div>');
    Content.drawImage($("#introduction-meteorite-image"), Content.meteorite, "intact");
    $("#introduction-meteorite-image")
        .css("position", "relative")
        .css("left", "-64px").css("top", "-64px")
        .css("cursor", "pointer");
    $("#introduction-meteorite")
        .css("position", "absolute")
        .css("top", "-5%").css("left", "-5%");

    this.initEvents();
};

Game.introduction.initEvents = function() {

    $("#introduction-character-image").click(function()
    {
        $(this).css("cursor", "auto");
        Game.introduction.fallMeteorite();
        return false;
    });
    $("#introduction-meteorite-image").mousedown(function()
    {
        if (Game.introduction.currentPhase >= 3 && Game.introduction.currentPhase < 9) {
            var size = [64, 64];
            size[0] += Math.floor((Math.random()*10)-5);
            size[1] += Math.floor((Math.random()*10)-5);
            $("#introduction-meteorite-image")
                .css("left", "-" + size[0] + "px")
                .css("top", "-" + size[1] + "px");
        }
        return false;
    });
    $("#introduction-meteorite-image").mouseup(function()
    {
        if (Game.introduction.currentPhase >= 14) {
            Game.introduction.end();
        }
        else if (Game.introduction.currentPhase >= 3 && Game.introduction.currentPhase < 9) {
            $("#introduction-meteorite-image")
                .css("left", "-64px").css("top", "-64px");
            Game.introduction.meteoriteLife--;
            if (Game.introduction.meteoriteLife % 10 == 0) {
                Game.introduction.setDialog(++Game.introduction.currentPhase);
                if (Game.introduction.meteoriteLife != 0) {
                    Content.drawImage(
                        $("#introduction-meteorite-image"),
                        Content.meteorite, "broken" + ++Game.introduction.brokenState
                    );
                }
                else
                {
                    Content.drawPart($("#introduction-meteorite-image"), Content.sprites, "amazite");
                }
            }
        }
        else
        {
            Game.introduction.setDialog(++Game.introduction.currentPhase);
        }
        return false;
    });
};

Game.introduction.fallMeteorite = function() {

    Game.introduction.meteoritePosition += 10;
    var delta = $(window).width() - $(window).height();
    if (Game.introduction.meteoritePosition * 2 < $(window).height()) {
        setTimeout(Game.introduction.fallMeteorite, 1);
        $("#introduction-meteorite")
            .css("top", Game.introduction.meteoritePosition)
            .css("left", Game.introduction.meteoritePosition + delta / 2);
    }
    else
        $("#introduction-meteorite").css("top", "50%").css("left", "50%");
};

Game.introduction.setDialog = function(index) {

    var text = this.dialogs[index];
    var index = text.indexOf("<br />");
    var size = (index == -1) ? ("-50px") : ("-68px");
    $("#introduction-text").css("top", size);
    $("#introduction-text").html(text);
};

Game.introduction.end = function(index) {

    $("#introduction-character").hide(400, function() {
        $(this).remove();
    });
    $("#introduction-text-container").hide(400, function() {
        $(this).remove();
    });
    $("#introduction-meteorite").hide(500, function() {
        $(this).remove();
        Game.start();
    });
};
