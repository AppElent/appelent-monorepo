const items_v700 = require("../../src/data/satisfactory/v700/items.json");
const buildables_v700 = require("../../src/data/satisfactory/v700/buildables.json");
const buildableRecipes_v700 = require("../../src/data/satisfactory/v700/buildableRecipes.json");
const productionRecipes_v700 = require("../../src/data/satisfactory/v700/productionRecipes.json");
const resources_v700 = require("../../src/data/satisfactory/v700/resources.json");
const schematics_v700 = require("../../src/data/satisfactory/v700/schematics.json");
const tierList_v700 = require("../../src/data/satisfactory/v700/tierList.json");
const { values } = require("lodash");

const satisfactory_data = {
  v700: {
    items: items_v700,
    buildables: buildables_v700,
    buildableRecipes: buildableRecipes_v700,
    recipes: productionRecipes_v700,
    resources: resources_v700,
    schematics: schematics_v700,
    tierList: tierList_v700,
  },
  v600: {
    items: items_v700,
    buildables: buildables_v700,
    buildableRecipes: buildableRecipes_v700,
    recipes: productionRecipes_v700,
    resources: resources_v700,
    schematics: schematics_v700,
    tierList: tierList_v700,
  },
};

const version = "v700";

const data = satisfactory_data[version];

let productData = { startProducts: {}, endProducts: {} };
let recipeData = {};

// data.schematics.forEach((schematic) => {
//   console.log(schematic.techTier + " - " + schematic.type);
// });

const getSchematicTypes = (schematics) => {
  const schematicTypes = {};
  for (const [key, value] of Object.entries(schematics)) {
    //   /console.log(value.techTier + " - " + value.type, schematicTypes[value.type]);
    if (!schematicTypes[value.type]) schematicTypes[value.type] = [];
    schematicTypes[value.type].push(value.name === "" ? key : value.name);
  }
  return schematicTypes;
};

const getSchematicByTier = (schematics) => {
  const returnObject = {};
  for (const [key, value] of Object.entries(schematics)) {
    if (!returnObject[value.techTier]) returnObject[value.techTier] = [];
    returnObject[value.techTier].push(value.name === "" ? key : value.name);
  }
  return returnObject;
};

const getProductByTier = (items, schematics, recipes) => {
  const returnObject = {};
  const list = [];
  for (const [schematicKey, schematicValue] of Object.entries(schematics)) {
    schematicValue.unlocks?.recipes?.forEach((recipe) => {
      const recipeObject = recipes[recipe];

      recipeObject?.products?.forEach((product) => {
        if (!returnObject[schematicValue.techTier])
          returnObject[schematicValue.techTier] = [];
        // const found = Object.keys(returnObject).forEach(key => {
        //     returnObject[key].find(returnO => returnO === product.itemClass)
        // })
        // if (!list.find((l) => l === product.itemClass)) {
        //   returnObject[schematicValue.techTier].push(product.itemClass);
        //   list.push(product.itemClass);
        // }
        returnObject[schematicValue.techTier].push({
          productClass: product.itemClass,
          recipe,
          //schematic: schematicValue,
        });
        list.push(product.itemClass);
      });
    });
  }
  return returnObject;
};

console.log(getProductByTier(data.items, data.schematics, data.recipes));

// berekeningen:
// tier
// beginproducten, eindproducten, eindproducten incl alternate, hoeveel nodig om per eindprod 1 machine te laten draaien
// misschien: functie om per product een alternate te selecteren en dan dit opnieuw berekenen
