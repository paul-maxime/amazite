/*
** game.ui.js
*/

Game.ui = {
    tabs : [],
    unlockedMenus : [],
    unlockedWindows : []
};

Game.ui.init = function () {
    $("body").css("font-family", 'Arial, "Times New Roman", Times, serif');
    this.initIcon();
    
    this.menuBuildings = this.createMenu('buildings')
        .text(tr("menuBuildings"));
    this.menuResearches = this.createMenu('researches')
        .text(tr("menuResearches"));
    this.menuUpgrades = this.createMenu('upgrades')
        .text(tr("menuUpgrades"));
    this.menuShips = this.createMenu('ships')
        .text(tr("menuShips"));
    this.menuCockpit = this.createMenu('cockpit')
        .text(tr("menuCockpit"));
    this.menuStats = this.createMenu('stats')
        .text(tr("menuStats"));
    this.menuOptions = this.createMenu('options')
        .text(tr("menuOptions"));
        
    this.production = new Window('production');
    this.createTabs();
};

Game.ui.initIcon = function () {
    this.icon = new Window("icon")
        .sprite("amazite", Content.sprites, "amaziteMini")
        .css("margin-right", "15px");
    this.iconDetails = new Window('iconDetails')
        .sprite('amazite', Content.sprites, 'amazite')
        .title('<em>' + tr("iconDescription") + '</em>')
        .css('position', 'absolute')
        .css('background-color', 'white')
        .css('left', '0px')
        .css('top', '0px');

    $("#window-icon-amazite").mouseenter(function () {
        $("#window-iconDetails").show();
    });
    $("#window-iconDetails-amazite").mouseleave(function () {
        $("#window-iconDetails").hide();
    });
};

Game.ui.showTab = function(name) {
    if (this.currentTab != name) {
        if (this.currentTab !== undefined) {
            $("#window-menu-" + this.currentTab).css("background-color", "white");
            $("#tabs-" + this.currentTab).hide(200);
        }
        this.currentTab = name;
        $("#tabs-" + name).show(200);
    }
};

Game.ui.createMenu = function(name) {
    var menu = new Window("menu-" + name).css("cursor", "pointer");
    menu.css("height", "57px")
        .css("padding-top", "15px");

    menu.div.mouseenter(function()
    {
        $(this).css("background-color", "#eeeeee");
    });
    menu.div.click(name, function(event)
    {
        $(this).css("background-color", "#dddddd");
        Game.ui.showTab(name);
    });
    menu.div.mouseleave(function()
    {
        if (name == Game.ui.currentTab) {
            $(this).css("background-color", "#dddddd");
        } 
        else {
            $(this).css("background-color", "white");
        }
    });
    this.tabs.push(name);
    this.unlockedMenus[name] = false;
    return menu;
};

Game.ui.createTabs = function() {
    $('body').append('<div style="clear: both" />');
    for (var i = 0; i < this.tabs.length; i++)
    {
        $('body').append('<div id="tabs-' + this.tabs[i] + '" style="display:none"></div>');
    }
};

Game.ui.unlockTab = function(name) {
    if (!this.unlockedMenus[name]) {
        $("#window-menu-" + name).show(200);
        this.unlockedMenus[name] = true;
    }
};

Game.ui.unlockWindow = function(name) {
    if (!this.unlockedWindows[name]) {
        $("#window-" + name).show(200);
        this.unlockedWindows[name] = true;
    }
};

Game.ui.isTabUnlocked = function(name) {
    return this.unlockedMenus[name];
};

Game.ui.isWindowUnlocked = function(name) {
    return this.unlockedWindows[name];
};
