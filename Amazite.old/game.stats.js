/*
** game.stats.js
*/

Game.stats = [];

Game.stats.init = function() {

    this.amazite = new Material();
    this.time = [0,0,0];
    
    this.winStats = new Window("stats", "#tabs-stats")
        .html(tr("statsTotal")
            .format('<span id="stats-totalAmazite"></span>',
                    '<span id="stats-totalAmazite-numeric"></span>',
                    '<span id="stats-totalHours"></span>',
                    '<span id="stats-totalMinutes"></span>',
                    '<span id="stats-totalSecondes"></span>'));
};

Game.stats.update = function() {
    
    this.addTime();
};

Game.stats.addAmazite = function(material) {

    this.amazite.addMaterial(material);
    $("#stats-totalAmazite").html(this.amazite.toString());
    $("#stats-totalAmazite-numeric").html(this.amazite.toNumericString());
};

Game.stats.addTime = function() {

    this.time = this.convertTime();
    $("#stats-totalHours").html(this.time[0]);
    $("#stats-totalMinutes").html(this.time[1]);
    $("#stats-totalSecondes").html(this.time[2]);
};

Game.stats.convertTime = function() {

    var aux = this.time;
    aux[2] += 1;
    if (aux[2] >= 60) {
        aux[2] = 0;
        aux[1] += 1;
    }
    if (aux[1] >= 60) {
        aux[1] = 0;
        aux[0] += 1;
    }
    return aux;
};