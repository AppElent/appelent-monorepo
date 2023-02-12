import items_v700 from "data/satisfactory/v700/items.json";
import buildables_v700 from "data/satisfactory/v700/buildables.json";
import buildableRecipes_v700 from "data/satisfactory/v700/buildableRecipes.json";
import productionRecipes_v700 from "data/satisfactory/v700/productionRecipes.json";
import resources_v700 from "data/satisfactory/v700/resources.json";
import schematics_v700 from "data/satisfactory/v700/schematics.json";
import tierList_v700 from "data/satisfactory/v700/tierList.json";

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
};

export const satisfactoryVersions = [
  {
    label: "Update 7",
    key: "v700",
  },
];

export const SatisfactoryCurrentVersion = "v700";

export const getSatisfactoryData = (type, version) => {
  const localVersion = version ? version : SatisfactoryCurrentVersion;
  const items = satisfactory_data[localVersion][type];
  if (!items) return satisfactory_data[app_version][type];
  return items;
};

export const getSatisfactoryDataArray = (type, version) => {
  const localVersion = version ? version : SatisfactoryCurrentVersion;
  const items = getSatisfactoryData(type, localVersion);
  let array = Object.keys(items).map((k) => ({
    ...items[k],
    className: k,
  }));
  return array;
};

export const getSatisfactoryItem = (itemClassName, version) => {
  const item = getSatisfactoryData("items", version)[itemClassName];
  const recipes = getSatisfactoryRecipesByItem(itemClassName, version);
  item["recipes_for"] = recipes.used_for;
  item["recipes_by"] = recipes.made_by;
  item["resource"] = getSatisfactoryResourceByItem(itemClassName, version);
  item["buildable_recipes"] = getSatisfactoryBuildableRecipeByItem(
    itemClassName,
    version
  );
  item["schematics"] = getSatisfactorySchematicByItem(itemClassName, version);
  item["className"] = itemClassName;
  return item;
};

export const getSatisfactorySchematicByRecipe = (recipeClassName, version) => {
  let schematic = getSatisfactoryDataArray("schematics", version).find(
    (schematic) => schematic.unlocks?.recipes?.includes(recipeClassName)
  );
  return schematic;
};

export const getSatisfactorySchematicByItem = (itemClassName, version) => {
  let schematics = getSatisfactoryDataArray("schematics", version).filter(
    (schematic) => {
      const tempSchematics = schematic.cost.filter(
        (itemCost) => itemCost.itemClass === itemClassName
      );
      return tempSchematics.length > 0;
    }
  );
  return schematics;
};

export const getSatisfactoryRecipesByItem = (itemClassName, version) => {
  const product = getSatisfactoryData("items", version)[itemClassName];
  if (!product) {
    console.log("Product with class " + itemClassName + " cannot be found");
    return undefined;
  }
  const recipes = getSatisfactoryData("recipes", version); //getSatisfactoryData("recipes", version);
  const returnObject = {
    used_for: [],
    made_by: [],
  };
  for (const [key, value] of Object.entries(recipes)) {
    // console.log(key, value);
    const tier = getSatisfactoryData("tierList", version).find(
      (tierItem) =>
        tierItem.name === value.name || value.name.includes(tierItem.name)
    );
    const schematic = getSatisfactorySchematicByRecipe(key, version);
    const ingredient_found = value.ingredients.find((ingredient) => {
      return ingredient.itemClass == itemClassName;
    });
    if (ingredient_found) {
      returnObject.used_for.push({ ...value, className: key, schematic, tier });
    }
    const product_found = value.products.find((ingredient) => {
      return ingredient.itemClass == itemClassName;
    });
    if (product_found) {
      returnObject.made_by.push({ ...value, className: key, schematic, tier });
    }
  }
  return returnObject;
};

export const getSatisfactoryResourceByItem = (itemClassName, version) => {
  const product = getSatisfactoryData("items", version)[itemClassName];
  if (!product) {
    console.log("Product with class " + itemClassName + " cannot be found");
    return undefined;
  }
  const resources = getSatisfactoryData("resources", version);
  if (resources[itemClassName]) return { ...resources[itemClassName] };

  return undefined;
};

export const getSatisfactoryBuildableRecipeByItem = (
  itemClassName,
  version
) => {
  const product = getSatisfactoryData("items", version)[itemClassName];
  if (!product) {
    console.log("Product with class " + itemClassName + " cannot be found");
    return undefined;
  }
  const buildableRecipes = getSatisfactoryData("buildableRecipes", version);
  const buildables = getSatisfactoryData("buildables", version);
  const returnObject = [];
  for (const [key, value] of Object.entries(buildableRecipes)) {
    // console.log(key, value);

    const ingredient_found = value.ingredients.find((ingredient) => {
      return ingredient.itemClass == itemClassName;
    });
    const buildable = buildables[value.product];
    if (ingredient_found) {
      returnObject.push({ ...value, className: key, buildable });
    }
  }
  return returnObject;
};
