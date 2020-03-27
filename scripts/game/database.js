/*
 * Amazite Project
 * game/database.js
 */

var Database = {
    /* Variables */

    buildingPrefix: [
        "",
        "Large",
        "Powerful",
        "Ultra"
    ],
    
    buildingNames: [
        "Collider",
        "Condenser",
        "Container",
        "Detacher",
        "Factory",
        "Industry",
        "Magnetizer",
        "Merge tool",
        "Mill",
        "Mixer",
        "Plant",
        "Separator",
        "Striker",
        "Transformer"
    ],

    buildingImages: [
        "hand",
        "hangar",
        "stone-tower",
        "windmill"
    ],

    researchPrefix: [
        "",
        "Atomic",
        "Cosmic",
        "Electronic",
        "Global",
        "Huge",
        "Immense",
        "Improved",
        "Infinite",
        "Large-scale",
        "Hyper",
        "Macro",
        "Magnetic",
        "Micro",
        "Neutronic",
        "Photonic",
        "Planetary"
    ],

    researchNames: [
        "Assembly",
        "Condensation",
        "Dovetailing",
        "Control",
        "Fusion",
        "Matter control",
        "Process",
        "Separation",
        "Shuffling",
        "Stockage",
        "Thermofusion",
        "Transformation",
        "Transplantation",
        "Weaving"
    ],

    researchImages: [
        "acid",
        "flame",
        "planet",
        "planks"
    ],

    /* Functions */
    
    getBuilding: function () {
        return [
            (Database.buildingPrefix[Random.next(Database.buildingPrefix.length)] + " " +
             Database.buildingNames[Random.next(Database.buildingNames.length)]),
            Database.buildingImages[Random.next(Database.buildingImages.length)]
        ];
    },

    getResearch: function () {
        return [
            Database.researchPrefix[Random.next(Database.researchPrefix.length)] + " " +
            Database.researchNames[Random.next(Database.researchNames.length)],
            Database.researchImages[Random.next(Database.researchImages.length)]
        ];
    },

    getPlanet: function () {
        return "Alpha";
    }
};
