/*
** game.introduction.js
*/

Game.introduction = {
    currentPhase: -1,
    meteoriteLife: 60,
    meteoritePositionRatio: 0,
	meteoriteStartTopPercentage: -15,
	meteoriteStartLeftPercentage: -15,
	topTargetPosition: -35,
	leftTargetPosition: -64,
    brokenState: 0
};

Game.introduction.init = function() {

    this.dialogs = I18n.current.introduction;

    $("body").append('<div id="introduction-character"><span id="introduction-text"></span></div>');
    Content.drawPart($("#introduction-character"), Content.sprites, "character");
    $("#introduction-character")
        .css("position", "absolute")
        .css("top", "50%")
		.css("left", "calc(50% + 30px)")
        .css("cursor", "pointer");
	$("#introduction-text")
		.css("position", "relative")
		.css("white-space", "nowrap")
		.css("top", "-20px")
		.css("left", "30px");

    $("body").append('<div id="introduction-meteorite"></div>');
    Content.drawImage($("#introduction-meteorite"), Content.meteorite, "intact");
    $("#introduction-meteorite")
        .css("position", "absolute")
        .css("top", Game.introduction.meteoriteStartTopPercentage + "%")
		.css("left", Game.introduction.meteoriteStartLeftPercentage + "%");

    this.initEvents();
};

Game.introduction.initEvents = function() {

    $("#introduction-character").click(function()
    {
		if (Game.introduction.currentPhase == -1) {
			Game.introduction.currentPhase++;
			Game.introduction.fallMeteorite();
			return;
		}

		if (Game.introduction.currentPhase > 14)
		{
			Game.introduction.end();
			return;
		}

        if (Game.introduction.currentPhase <= 3 || Game.introduction.currentPhase >= 9) {
			Game.introduction.setDialog(Game.introduction.currentPhase++);
			if (Game.introduction.currentPhase == 4) {
				$(this).css("cursor", "auto");
				$("#introduction-meteorite").css("cursor", "pointer");
			}
		}
    });
    $("#introduction-meteorite").mousedown(function()
    {
		if (Game.introduction.currentPhase < 4 || Game.introduction.currentPhase >= 10)
			return;
		
		var randomTop = Math.random() < 0.5 ? -5 : 5;
		var randomLeft = Math.random() < 0.5 ? -5 : 5;
		$("#introduction-meteorite")
			.css("top", "calc(50% + " + (Game.introduction.topTargetPosition + randomTop) + "px)")
			.css("left", "calc(50% + " + (Game.introduction.leftTargetPosition + randomLeft) + "px)");
    });
    $("#introduction-meteorite").mouseup(function()
    {
		if (Game.introduction.currentPhase < 4 || Game.introduction.currentPhase >= 10)
			return;
		
		$("#introduction-meteorite")
			.css("top","calc(50% + " + Game.introduction.topTargetPosition + "px)")
			.css("left", "calc(50% + " + Game.introduction.leftTargetPosition + "px)");
		Game.introduction.meteoriteLife--;
		if (Game.introduction.meteoriteLife % 10 == 0) {
			Game.introduction.setDialog(Game.introduction.currentPhase++);
			if (Game.introduction.meteoriteLife != 0) {
				Content.drawImage($("#introduction-meteorite"), Content.meteorite, "broken" + ++Game.introduction.brokenState);
			}
			else {
				Content.drawPart($("#introduction-meteorite"), Content.sprites, "amazite");
				$(this).css("cursor", "auto");
				$("#introduction-character").css("cursor", "pointer");
			}
		}
    });
};

Game.introduction.fallMeteorite = function() {

    Game.introduction.meteoritePositionRatio += 0.02;

	if (Game.introduction.meteoritePositionRatio < 1) {
        $("#introduction-meteorite")
			.css("top",  "calc(" + Game.introduction.lerp(Game.introduction.meteoriteStartTopPercentage, 50, Game.introduction.meteoritePositionRatio) + "% + " + (Game.introduction.topTargetPosition * Game.introduction.meteoritePositionRatio) + "px)")
            .css("left", "calc(" + Game.introduction.lerp(Game.introduction.meteoriteStartLeftPercentage, 50, Game.introduction.meteoritePositionRatio) + "% + " + (Game.introduction.leftTargetPosition * Game.introduction.meteoritePositionRatio) + "px)");
		setTimeout(Game.introduction.fallMeteorite, 1);
    }
    else
        $("#introduction-meteorite")
			.css("top", "calc(50% + " + Game.introduction.topTargetPosition + "px)")
			.css("left", "calc(50% + " + Game.introduction.leftTargetPosition + "px)");
};

Game.introduction.setDialog = function(index) {

    var text = this.dialogs[index];
    var index = text.indexOf("<br />");
    var size = (index == -1) ? ("-20px") : ("-38px");
    $("#introduction-text")
		.css("top", size)
		.html(text);
};

Game.introduction.end = function(index) {

    $("#introduction-character").hide(400, function() {
        $(this).remove();
    });
    $("#introduction-meteorite").hide(500, function() {
        $(this).remove();
        Game.start();
    });
};

Game.introduction.lerp = function(a, b, time) {
	return a + time * (b - a);
};