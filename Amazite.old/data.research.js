/*
** data.research.js
*/

var Research = function(name, imageName, unit, price, time, unlockId)
{
    this.name = name;
	this.imageName = imageName;
    this.priceUnit = unit;
    this.pricePerSecond = price;
	this.time = time;
    this.unlockId = unlockId;

    this.initMaterial();
};

Research.prototype.initMaterial = function()
{
    this.priceMaterial = new Material();
    this.priceMaterial.add(this.pricePerSecond, this.priceUnit);
    
    this.endPriceMaterial = new Material();
    this.endPriceMaterial.add(this.pricePerSecond * this.time, this.priceUnit);
};

Research.prototype.price = function()
{
    return this.priceMaterial.toString();
};

Research.prototype.endPrice = function()
{
    return this.endPriceMaterial.toString();
};
