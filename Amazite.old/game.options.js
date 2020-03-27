/*
** game.options.js
*/

Game.options = {
    effectsEnabled : true
};

Game.options.init = function() {

    this.languageIndex = 0;

    this.winOptions = new Window('options', '#tabs-options')
        .form()
        .checkbox('effects', tr('optionsEffects'));
        
        /*.img("leftArrow", Content.tools)
        .append(tr("language"))
        .img("rightArrow", Content.tools);*/
    
    $("#window-options-effects").attr('checked', this.effectsEnabled)
                                .change(function() {
                                    Game.options.effectsEnabled = this.checked;
                                    $.fx.off = !Game.options.effectsEnabled;
                                });

    /*$("#window-options-leftArrow")
        .css("cursor", "pointer")
        .click(function() {
        Game.options.changeLanguage(-1)
        });

    $("#window-options-rightArrow")
        .css("cursor", "pointer")
        .click(function() {
        Game.options.changeLanguage(1)
        });*/
};

Game.options.changeLanguage = function (delta) {

    var result = this.languageIndex + delta;
    if (result >= 0 && result < I18n.languages.length)
    {
        I18n.change(result);
        this.languageIndex = result;
    }
}