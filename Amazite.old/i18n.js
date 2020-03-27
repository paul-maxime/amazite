/*
** i18n.js
*/

var I18n = {};

I18n.init = function()
{
    this.initFormat();
	this.languages = [I18n.en, I18n.fr];

    I18n.current = I18n.en;
};

I18n.initFormat = function()
{
    if (!String.prototype.format)
    {
        String.prototype.format = function()
        {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return args[number];
            });
        };
    }
};

I18n.change = function(index)
{
    I18n.current = this.languages[index];
};

var tr = function(key)
{
    return I18n.current[key].replace(/\n/g, '<br />');
};
