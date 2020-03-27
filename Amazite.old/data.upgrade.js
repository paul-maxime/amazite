/*
** data.upgrade.js
*/

var Upgrade = function()
{
    this.sons = [];
    this.isUnlocked = false;
    this.isFatherBought = false;
    this.isEndOfTreeBought = false;
};

Upgrade.prototype.init = function(father, name, price, unit, imageName, effectId, effectValue)
{
    this.father = father;
    this.name = name;
    this.id = name.toLowerCase().replace(/ /g, "");
    this.price = price;
    this.unit = unit;
    this.imageName = imageName;
    this.effectId = effectId;
    this.effectValue = effectValue;
    
    this.priceMaterial = new Material();
    this.priceMaterial.add(this.price, this.unit);
    
    if (father == null)
        this.isUnlocked = true;
    
    return this;
}
Upgrade.prototype.addSon = function(name, price, unit, imageName, effectId, effectValue)
{
    this.sons.push(new Upgrade(this, name, price, unit, imageName, effectId, effectValue));
}

Upgrade.prototype.buy = function()
{
    if (this.isUnlocked && Game.resources.removeAmazite(this.price, this.unit))
    {
        if (this.sons.length == 0)
            this.isEndOfTreeBought = true;
            
        for (i = 0; i < this.sons.length; i++)
        {
            this.sons[i].isUnlocked = true;
            this.sons[i].isFatherBought = true;
        }
        this.isUnlocked = false;
        
        return true;
    }
    return false;
}

Upgrade.prototype.effectToString = function()
{
    return tr("effect"+this.effectId).format(this.effectValue);
}