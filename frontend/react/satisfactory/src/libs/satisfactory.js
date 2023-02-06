import items_v700 from "data/satisfactory/v700/items.json";
import buildables_v700 from "data/satisfactory/v700/items.json";
import buildableRecipes_v700 from "data/satisfactory/v700/items.json";
import productionRecipes_v700 from "data/satisfactory/v700/items.json";
import resources_v700 from "data/satisfactory/v700/items.json";
import schematics_v700 from "data/satisfactory/v700/items.json";

const satisfactory_data = {
  v700: {
    items: items_v700,
    buildables: buildables_v700,
    buildableRecipes: buildableRecipes_v700,
    recipes: productionRecipes_v700,
    resources: resources_v700,
    schematics: schematics_v700,
  },
};

const app_version = "v700";

export const getSatisfactoryData = (version, type) => {
  const version = version ? version : app_version;
  const items = satisfactory_data[version][type];
  if (!items) return satisfactory_data[app_version][type];
  return items;
};

export const getSatisfactoryDataArray = async (version, type) => {
  const items = getSatisfactoryData(version, type);
  let array = Object.keys(items).map((k) => ({
    ...items[k],
    className: k,
  }));
  return array;
};

export const getSatisfactoryRecipesByItem = (itemClassName) => {
  return [];
};
