/*
** data.window.js
*/

var Window = function(id, parent) {

    this.id = "window-" + id;
    this.hasContent = false;

    if (arguments.length == 1)
        parent = 'body';

    $(parent).append('<div id="' + this.id + '"></div>');
    this.div = $("#" + this.id);
    this.div.css("float", "left")
            .css("margin", "3px")
            .css("padding", "3px")
            .css("border", "1px solid gray")
            .css("border-radius", "5px");

    if (arguments.length == 1)
        this.div.css("display", "none");
};

Window.prototype.show = function() {

    if (arguments.length == 1)
        this.div.show(arguments[0]);
    else
        this.div.show();
    return this;
};

Window.prototype.hide = function() {

    if (arguments.length == 1)
        this.div.hide(arguments[0]);
    else
        this.div.hide();
    return this;
};

Window.prototype.html = function(content) {

    this.div.html(content);
    return this;
};


Window.prototype.clear = function() {

    this.div.html("");
    this.hasContent = false;
    return this;
};

Window.prototype.title = function(content) {

    this.div.append('<div style="text-align: center;">' + content + '</div>');
    return this;
};

Window.prototype.css = function(key, value) {

    this.div.css(key, value);
    return this;
};

Window.prototype.append = function(content) {

    this.div.append(content);
    return this;
};

Window.prototype.img = function(name, content) {

    var id = this.id + '-' + name;
    this.div.append('<span id="' + id + '"></span>');
    Content.drawImage($("#" + id), content, name);
    return this;
};

Window.prototype.sprite = function(name, content, part) {

    var id = this.id + '-' + name;
    this.div.append('<span id="' + id + '"></span>');
    Content.drawPart($("#" + id), content, part);
    return this;
};

Window.prototype.text = function(content) {

    this.checkNewLine();
    this.div.append(content);
    return this;
};

Window.prototype.checkNewLine = function() {

    if (this.hasContent)
        this.div.append('<br />');
    this.hasContent = true;
};

Window.prototype.form = function() {

    this.hasFormContent = false;
    this.div.append('<form action="#" id="' + this.id + '-form"></form>');
    this.form = $("#" + this.id + "-form");
    return this;
};

Window.prototype.checkbox = function(id, text) {

    this.checkNewFormLine();
    var id = this.id + "-" + id;
    this.form.append('<input type="checkbox" id="'+id+'" name="'+id+'" /><label for="'+id+'">'+text+'</label>')
    return this;
};

Window.prototype.checkNewFormLine = function() {

    if (this.hasFormContent)
        this.form.append('<br />');
    this.hasFormContent = true;
};
