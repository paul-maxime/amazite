/*
** data.ship.js
*/

var Ship = function (name, life, power, defense, speed, price, unit)
{
    this.name = name;
    this.life = life;
    this.power = power;
    this.defense = defense;
    this.speed = speed;
    this.priceAmount = price;
    this.priceUnit = unit;
    this.unlocked = false;
    
    this.priceMaterial = new Material();
    this.priceMaterial.add(this.priceAmount, this.priceUnit);
}

Ship.prototype.price = function()
{
    return this.priceMaterial.toString();
};
