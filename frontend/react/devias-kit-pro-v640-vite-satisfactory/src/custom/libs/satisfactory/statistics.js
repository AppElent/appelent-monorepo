import { SatisfactoryCurrentVersion, getSatisfactoryData, getSatisfactoryDataArray } from '.';
import _ from 'lodash';

export const CONFIG_TEMPLATE = {
  autoUpdate: true,
  dirty: false,
  updateSeconds: 3,
  version: SatisfactoryCurrentVersion,
  products: [], //  {recipe: <class>, amount: <number>, mode:"max/itemsMin"} --> items to produce
  resources: [], // {resource: <class>, amount: <number>}
  inputs: [], // {product: <class>, amount: <number>}
  recipes: [], //  {product: <class>, recipe: <class>}
};

export const RESULT_TEMPLATE = {
  data: {
    buildings: {
      buildings: {},
      resources: {},
      amount: 0,
    },
    power: {
      byRecipe: {},
      byBuilding: {},
      total: {
        isVariable: false,
        average: 0,
        max: 0,
      },
    },
    items: {},
    production: {},
    production2: {},
    input: {},
    rawResources: {},
    output: {},
    byProducts: {},
    alternatesNeeded: [],
    usedRecipes: {},
    usedInputs: {},
    usedResources: {},
    alternateDefaultRecipes: {},
    availableResources: {},
    allEntries: {},
    temp: {},
    chains: {},
  },
  loading: false,
  error: [],
};

// inputobject: [{recipe: 'class', amount: 2}]
export const getFactoryStatistics = (factoryItems, version) => {
  // Retrieve static reference data
  const productionRecipes = getSatisfactoryData('recipes', version);
  const products = getSatisfactoryData('items', version);

  // Create empty object with arrays
  const returnObject = {
    inputs: [],
    outputs: [],
    total: [],
    totalInputs: [],
    totalOutputs: [],
  };

  // Iterate factoryItems and check all recipes
  factoryItems?.forEach((recipe) => {
    const foundRecipe = productionRecipes[recipe.recipe];
    if (foundRecipe) {
      const itemsPerMinute = 60 / foundRecipe?.craftTime || 0;
      // Check input
      foundRecipe.ingredients.forEach((ingredient) => {
        const productData = {
          product: ingredient.itemClass,
          quantity: ingredient.quantity * parseFloat(recipe.amount) * -1,
          quantityMin: itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount) * -1,
        };
        returnObject.inputs.push(productData);
        const foundIngredientIndex = returnObject.total.findIndex(
          (x) => x.product === ingredient.itemClass
        );
        if (foundIngredientIndex > -1) {
          returnObject.total[foundIngredientIndex].quantity += productData.quantity;
          returnObject.total[foundIngredientIndex].quantityMin += productData.quantityMin;
        } else {
          returnObject.total.push(productData);
        }
      });

      // Check output
      foundRecipe.products.forEach((product) => {
        const productData = {
          product: product.itemClass,
          quantity: product.quantity * parseFloat(recipe.amount),
          quantityMin: itemsPerMinute * product.quantity * parseFloat(recipe.amount),
        };
        returnObject.outputs.push(productData);
        const foundIngredientIndex = returnObject.total.findIndex(
          (x) => x.product === product.itemClass
        );
        if (foundIngredientIndex > -1) {
          returnObject.total[foundIngredientIndex].quantity += productData.quantity;
          returnObject.total[foundIngredientIndex].quantityMin += productData.quantityMin;
        } else {
          returnObject.total.push(productData);
        }
      });
    }
  });
  returnObject.total.forEach((prod) => {
    if (prod.quantityMin > 0) {
      returnObject.totalOutputs.push(prod);
    } else if (prod.quantityMin < 0) {
      const inverted = {
        ...prod,
        quantityMin: prod.quantityMin * -1,
        quantity: prod.quantity * -1,
      };
      returnObject.totalInputs.push(inverted);
    }
  });
  return returnObject;
};

class Logger {
  logArray = [];

  log(...messages) {
    this.logArray.push(messages);
  }

  error(...messages) {
    this.logArray.push(['ERROR', ...messages]);
  }

  output() {
    console.log(this.logArray);
  }
}

export const getRecipesByProduct = (
  configObject,
  version = SatisfactoryCurrentVersion
  //logger = console
) => {
  const products = getSatisfactoryData('items', version);
  const resources = getSatisfactoryData('resources', version);
  const recipes = getSatisfactoryDataArray('recipes', version);
  const recipeObject = getSatisfactoryData('recipes', version);

  const resultObject = {
    ...JSON.parse(JSON.stringify(RESULT_TEMPLATE)),
    config: configObject,
    logging: {},
  };

  const logger = new Logger();

  const log = (goal, ...messages) => {
    if (!resultObject.logging[goal]) resultObject.logging[goal] = [];
    resultObject.logging[goal].push(messages);
  };

  log('main', {
    text: 'getRecipesByProduct started (configObject, version)',
    configObject,
    version,
  });

  // Set available resources (resources, inputs, produced resources)
  configObject.resources?.forEach((resource) => {
    if (resource.checked)
      resultObject.data.availableResources[resource.resource] = {
        total: resource.amount,
        used: 0,
        unused: resource.amount,
        type: 'resource',
      };
  });
  configObject.inputs?.forEach((input) => {
    resultObject.data.availableResources[input.product] = {
      total: parseFloat(input.amount),
      used: 0,
      unused: parseFloat(input.amount),
      type: 'input',
    };
  });

  const getProductionRecipe = (productClass) => {
    let foundRecipe;
    let foundRecipes;

    const standardDefaultRecipes = {
      Desc_SulfuricAcid_C: 'Recipe_SulfuricAcid_C',
      Desc_Silica_C: 'Recipe_Silica_C',
    };

    // If product is found in preferred recipe Array, look for that recipe
    const preferredRecipe = configObject.recipes.find((r) => r.product === productClass);
    if (preferredRecipe) {
      foundRecipe = recipes.find((r) => r.className === preferredRecipe.recipe);
    } else {
      // Look at all recipes that are not alternate and that have this product (p) as output
      // We also exclude all slugs that have package or unpackage in the name, because this creates an endless loop
      foundRecipes = recipes.filter(
        (recipe) =>
          !recipe.isAlternate &&
          !recipe.slug.includes('package-') &&
          recipe.products.find((prod) => prod.itemClass === productClass)
      );
      // first recipe is the used one, the rest is an alternate default list
      if (standardDefaultRecipes[productClass]) {
        foundRecipe = foundRecipes.find(
          (r) => r.className === standardDefaultRecipes[productClass]
        );
        foundRecipes = foundRecipes.filter(
          (r) => r.className !== standardDefaultRecipes[productClass]
        );
      } else {
        foundRecipe = foundRecipes.shift();
      }
    }
    return { foundRecipe, foundRecipes };
  };

  const productChains = {};
  const getProductChains = (productClass) => {
    // Return chain with all products and recipes needed
    const product = products[productClass];
    // If product cannot be found, return
    if (!product) return;
    // If productchain is already created, return
    if (resultObject.chains?.[productClass]) return resultObject.chains?.[productClass];
    // If product is a resource, return
    if (resources[productClass]) return;
    // Set default variable
    productChains[productClass] = { resources: {}, recipes: {} };

    const getProductChain = (childProduct, childAmount) => {
      // Check if chain is already present on main object. If so, return
      if (resultObject.chains?.[productClass]) return;

      const { foundRecipe, foundRecipes } = getProductionRecipe(childProduct);
      if (!foundRecipe) return;

      // Set variables
      const productFound = foundRecipe.products.find((prod) => prod.itemClass === childProduct);
      const productQuantity = productFound?.quantity;
      const cyclesMin = parseFloat(60 / foundRecipe.craftTime);
      const numberOfMachines = parseFloat(childAmount / (cyclesMin * productQuantity));

      // Calculate byProducts
      const byProducts = foundRecipe.products.filter(
        (otherProduct) => otherProduct.itemClass !== childProduct
      );
      const byProductsObject = {};
      byProducts.forEach((byProduct) => {
        byProductsObject[byProduct.itemClass] = numberOfMachines * (cyclesMin * byProduct.quantity);
      });
      //TODO: add ByProducts to available list

      // Set data
      const totalNumberOfMachines = productChains[productClass].recipes?.[childProduct]
        ? productChains[productClass].recipes?.[childProduct].nrOfMachines + numberOfMachines
        : numberOfMachines;
      const totalAmount = productChains[productClass].recipes?.[childProduct]
        ? productChains[productClass].recipes?.[childProduct].amount + childAmount
        : childAmount;

      productChains[productClass].recipes[childProduct] = {
        recipeClass: foundRecipe.className,
        recipe: foundRecipe,
        defaultItemsMin: cyclesMin * productQuantity,
        nrOfMachines: totalNumberOfMachines,
        amount: totalAmount,
        cyclesMin,
        byProducts: byProductsObject,
        alternateDefaultRecipes: foundRecipes?.map((r) => r.className),
      };
      // _.set(productChains[productClass], `recipes[${childProduct}]`, {
      //   recipeClass: foundRecipe.className,
      //   recipe: foundRecipe,
      //   defaultItemsMin: cyclesMin * productQuantity,
      //   nrOfMachines: totalNumberOfMachines,
      //   amount: totalAmount,
      //   byProducts: byProductsObject,
      //   alternateDefaultRecipes: foundRecipes?.map((r) => r.className),
      // });

      // If there are ingredients, re-iterate
      if (foundRecipe.ingredients) {
        foundRecipe.ingredients.forEach((ingredient) => {
          const multiplier = ingredient.quantity / productQuantity;
          const amountIngredient = childAmount * multiplier;
          // If ingredient is a resource, add resource and DO NOT re-iterate
          if (resources[ingredient.itemClass]) {
            const resourceAmount = productChains[productClass].resources?.[ingredient.itemClass]
              ? productChains[productClass].resources[ingredient.itemClass] + amountIngredient
              : amountIngredient;
            productChains[productClass].resources[ingredient.itemClass] = resourceAmount;
            // _.set(
            //   productChains[productClass],
            //   `resources[${ingredient.itemClass}]`,
            //   resourceAmount
            // );
          } else {
            // Re-iterate
            getProductChain(ingredient.itemClass, amountIngredient);
            getProductChains(ingredient.itemClass);
          }
        });
      }
    };

    getProductChain(productClass, 1);

    resultObject.data.chains[productClass] = productChains[productClass];

    return productChains[productClass];
  };

  // Create product chains
  configObject.products?.forEach((pr) => {
    getProductChains(pr.product);
  });

  // Add mode=PRODUCE items to available items
  const calculateMultiplier = (inputObject, chainObject) => {
    // calculate amount based on mode, leftovers, etc
    const { product, amount, mode, production_mode, build_mode } = inputObject;
    log('calculateMultiplier', { inputObject, chainObject });
    const defaultItemsMin = chainObject.recipes[product].defaultItemsMin;

    let newAmount = parseFloat(amount);

    //If mode is set to number of machines, calculate the items per minute and return
    if (mode === 'machines') newAmount = defaultItemsMin * amount;

    // If mode is set to maximize, get total resources and calculate leftover
    if (mode === 'max') {
      const amountArray = [];
      Object.keys(chainObject.resources).forEach((resourceKey) => {
        const totalAmountAvailable =
          configObject.resources.find((r) => r.resource === resourceKey)?.amount || 0;
        const unused = totalAmountAvailable - (resultObject.data.usedResources[resourceKey] || 0);
        if (unused <= 0) {
          return 0;
        }

        amountArray.push(unused / chainObject.resources[resourceKey]);
      });
      log('calculateMultiplier', {
        text: 'Mode is set to maximize',
        product,
        resources: chainObject.resources,
        amountArray,
      });
      newAmount = Math.min(amountArray);
    }

    if (production_mode.toUpperCase() === 'PRODUCE') {
      // If production_mode = PRODUCE, then also add to list of available resources
      resultObject.data.availableResources[product] = {
        total: (parseFloat(resultObject.data.availableResources[product]?.total) || 0) + newAmount,
        used: resultObject.data.availableResources[product]?.total || 0,
        unused: (resultObject.data.availableResources[product]?.unused || 0) + newAmount,
        type: 'produced_item',
      };
    } else {
      // If production_mode is not PRODUCE, we need to also check for available items (resources, inputs, produced items)
      //TODO: or do later, because we dont know for sure if all produce items are set
    }

    return newAmount;
  };
  const multipliers = {};
  configObject.products?.forEach((pr) => {
    const m = calculateMultiplier(pr, productChains[pr.product]);
    multipliers[pr.product] = m;
    log('main', { text: 'Calculating multiplier', multiplier: m, product: pr.product });
  });
  log('main', { text: 'All multipliers', multipliers });

  // Check all products, see if there are available resources that we can use
  const checkForAvailableResources = (productClass, amount, production_mode) => {
    const availableItem = resultObject.data.availableResources[productClass];
    // return if there is no available item or if all is used
    if (!availableItem || availableItem.used >= availableItem.total) return amount;

    // Set new variables
    let newAmount = amount;

    // If mode is set to PRODUCE, we need to account for that (they are added to availableresources)
    let unusedAmount = availableItem.unused;
    if (production_mode.toUpperCase() === 'PRODUCE') {
      unusedAmount = unusedAmount - amount;
    }

    // Set new values
    if (unusedAmount >= amount) {
      newAmount = 0;
      resultObject.data.availableResources[productClass] = {
        total: availableItem.total,
        used: availableItem.used + amount,
        unused: availableItem.unused - amount,
        type: availableItem.type,
      };
    } else {
      newAmount = amount - unusedAmount;
      resultObject.data.availableResources[productClass] = {
        total: availableItem.total,
        used:
          production_mode.toUpperCase() === 'PRODUCE'
            ? availableItem.total - amount
            : availableItem.total,
        unused:
          production_mode.toUpperCase() === 'PRODUCE' ? availableItem.total - unusedAmount : 0,
        type: availableItem.type,
      };
    }

    return newAmount;
  };
  log('main', {
    text: 'checking for available products before going to the loop',
    availableResources: resultObject.data.availableResources,
    products: configObject.products,
  });
  configObject.products?.forEach((pr) => {
    if (pr.input_mode === 'false') return;
    multipliers[pr.product] = checkForAvailableResources(
      pr.product,
      multipliers[pr.product],
      pr.production_mode
    );
  });

  // main function per product
  const getRecipes = (productObject, neededFor, goal) => {
    let { p, itemsMin, mode, production_mode, build_mode } = productObject;
    const product = products[p];
    if (!product) logger.error('PRODUCT CANNOT BE FOUND', p);
    let amount = parseFloat(itemsMin);
    let originalAmount = parseFloat(itemsMin);
    log(goal, { text: 'getRecipes start', product });
    if (!product) return;

    const productChain = productChains[p];
    if (!productChain) return;

    // Create empty object
    resultObject.data.items[p] = { resources: {} };

    const amountMultiplier = multipliers[p]; //calculateMultiplier(productObject, productChain);

    // Iterate recipes
    for (let [productClass, recipeData] of Object.entries(productChain.recipes)) {
      log(productClass, { text: 'Start iterating productChain.recipes', build_mode, p });
      // If the build_mode is set to SINGLE, this means that we only need to produce the requested item
      // So, if the productClass and p are not the same, we can skip this one
      if (productClass !== p && build_mode === 'single') continue;
      let productAmount = amountMultiplier * recipeData.amount;
      let numberOfMachines = productAmount / recipeData.defaultItemsMin;

      // Check if there are available resources. If so, use them
      // If item is set to produce, and the class is the same as main class, we need to produce anyway
      if (!(production_mode.toUpperCase() === 'PRODUCE' && p === productClass)) {
        //TODO: do we need to check here as well?
      }

      // calculate ingredients and convert to object
      const convertProductArrayToObject = (array, cyclesMin, numberOfMachines) => {
        const items = {};
        array.forEach((item) => {
          const localItemsMin = cyclesMin * item.quantity;
          items[item.itemClass] = numberOfMachines * localItemsMin;
        });
        return items;
      };

      const productionConfig = {
        amount: productAmount,
        numberOfMachines,
        recipe: recipeData.recipeClass,
        ingredients: convertProductArrayToObject(
          recipeData.recipe?.ingredients,
          recipeData.cyclesMin,
          numberOfMachines
        ),
        products: convertProductArrayToObject(
          recipeData.recipe?.products,
          recipeData.cyclesMin,
          numberOfMachines
        ),
      };

      if (p === productClass) {
        resultObject.data.items[p].recipe = productionConfig;
      } else {
        resultObject.data.items[p][productClass] = productionConfig;
      }

      // Add to general used list
      resultObject.data.usedRecipes[productClass] = recipeData.recipeClass;

      // Add to total
      //TODO: resultObject.data.production2[productClass]

      // If there are alternate DEFAULT recipes, add to alternate recipe list
      if (recipeData.alternateDefaultRecipes && recipeData.alternateDefaultRecipes.length > 0)
        resultObject.data.alternateDefaultRecipes[productClass] =
          recipeData.alternateDefaultRecipes;
    } // end foreach recipe

    // Add raw resources
    for (let [key, value] of Object.entries(productChain.resources)) {
      //const amountMultiplier = calculateMultiplier(productObject, { product: key, amount: value });
      const resourceAmount = amountMultiplier * value;

      // Save resource amount to total amount and to local amount
      resultObject.data.items[p].resources[key] =
        (resultObject.data.items[p].resources[key] || 0) + resourceAmount;
      resultObject.data.rawResources[key] =
        (resultObject.data.rawResources[key] || 0) + resourceAmount;
    }

    //TODO:
    // totalresources
    // totalproducts

    //
    //
    //
    //
    // OLD
    //
    //
    //
    //
    //
    //
    //

    const { foundRecipe, foundRecipes } = getProductionRecipe(p);

    // If recipe found and this product is not a resource, add to array
    if (foundRecipe && !resources[p]) {
      // Set variables
      const productFound = foundRecipe.products.find((prod) => prod.itemClass === p);
      const productQuantity = productFound?.quantity;
      const cyclesMin = parseFloat(60 / foundRecipe.craftTime);

      // Correct amount based on MODE
      // If itemsMin, keep same
      // if machines, number of machines, calculate total amount
      // if maximize set to 1?
      if (mode === 'machines') {
        const itemsPerMinute = cyclesMin * parseFloat(productQuantity);
        amount = itemsPerMinute * amount;
        originalAmount = itemsPerMinute * originalAmount;
      }

      //First, check if this product is already defined as an input.
      // If so, and the PRODUCTION_MODE is not set to PRODUCE, then we can just skip it (if input is enough)
      const inputFound = configObject.inputs?.find((i) => i.product === p);
      const inputAmount = parseFloat(inputFound?.amount);
      if (inputFound && production_mode?.toUpperCase() !== 'PRODUCE') {
        const usedAmount = resultObject.data.usedInputs[p] || 0;

        // if the amount of input is bigger then the used amount, we can use the leftovers
        if (inputAmount > usedAmount) {
          const leftOverInput = inputAmount - usedAmount;
          if (leftOverInput >= amount) {
            resultObject.data.usedInputs[p] = usedAmount + amount;
          } else {
            resultObject.data.usedInputs[p] = inputAmount;
            amount = amount - leftOverInput;
          }
          //console.log('checking', itemsMin, amount, leftOverInput, inputFound, originalAmount);
        }
      }

      // Also check if there are items which are set to PRODUCE.
      // They can be used for other recipes because there dont have to be outputs
      const producedFound = {}; //TODO:

      // Also check if there are byProducts. If so, we can reduce the production TODO:
      const byProductsFound = {};

      // Calculate number of machines after correcting amount and checking for unused items
      const numberOfMachines = parseFloat(amount / (cyclesMin * productQuantity));

      // Add recipe to used list
      // if (!resultObject.data.usedRecipes[p]) {
      //   resultObject.data.usedRecipes[p] = {
      //     recipe: foundRecipe.className,
      //     recipes: foundRecipes?.map((r) => r.className),
      //   };
      // } //DONE

      // If there are more than 1 recipes found, this means that there are more than 1 default recipes. Add to alternatives list
      // if (foundRecipes?.length > 1 && !resultObject.data.alternateDefaultRecipes[p]) {
      //   resultObject.data.alternateDefaultRecipes[p] = foundRecipes
      //     .filter((r) => r.className !== foundRecipe.className)
      //     .map((r) => r.className);
      // } //DONE

      logger.log(goal, {
        text: 'Setting variables (amount, productQuantity, cyclesMin, numberOfMachines)',
        amount,
        productQuantity,
        cyclesMin,
        numberOfMachines,
      });

      // If recipe is already part of array, update
      const productionRecipeFound = resultObject.data.production[foundRecipe.className];
      if (productionRecipeFound) {
        // Add amount to current amount and add needed for {amount, numberOfMachines, products}
        resultObject.data.production[foundRecipe.className].amount += amount;
        resultObject.data.production[foundRecipe.className].numberOfMachines += numberOfMachines;

        if (!resultObject.data.production[foundRecipe.className].products[neededFor]) {
          resultObject.data.production[foundRecipe.className].products[neededFor] = amount;
        } else {
          resultObject.data.production[foundRecipe.className].products[neededFor] += amount;
        }
      } else {
        // Create new production object if it doesnt exist
        resultObject.data.production[foundRecipe.className] = {
          amount,
          numberOfMachines,
          products: {
            [neededFor]: amount,
          },
        };
      }
      log(goal, 'Adding ' + p + ' to total array');

      // Find byProducts and add to byProduct list
      const excessProducts = foundRecipe.products.filter(
        (excessProduct) => excessProduct.itemClass !== p
      );
      if (excessProducts.length > 0) {
        logger.log(goal, {
          text: 'Excess products found (recipe, product, excess-products)',
          foundRecipe,
          p,
          excessProducts,
        });
        excessProducts.forEach((excessProduct, i) => {
          // If excess product is present, add to it, ELSE add new entry
          const excessProductAmount = parseFloat(cyclesMin * excessProduct.quantity);
          if (resultObject.data.byProducts[excessProduct.itemClass]) {
            resultObject.data.byProducts[excessProduct.itemClass].amount += excessProductAmount;
            if (
              resultObject.data.byProducts[excessProduct.itemClass].recipes[foundRecipe.className]
            ) {
              resultObject.data.byProducts[excessProduct.itemClass].recipes[
                foundRecipe.className
              ] += excessProductAmount;
            } else {
              resultObject.data.byProducts[excessProduct.itemClass].recipes[foundRecipe.className] =
                excessProductAmount;
            }
          } else {
            resultObject.data.byProducts[excessProduct.itemClass] = {
              amount: excessProductAmount,
              recipes: { [foundRecipe.className]: excessProductAmount },
            };
          }
        });
      }

      // If there are ingredients, re-iterate
      if (foundRecipe.ingredients) {
        log(goal, {
          text: 'Re-iterating for ingredients of recipe ' + foundRecipe.className,
          ingredients: foundRecipe.ingredients,
        });
        foundRecipe.ingredients.forEach((ingredient) => {
          const multiplier = ingredient.quantity / productQuantity;
          const amountIngredient = amount * multiplier;
          //console.log('-----', ingredient.itemClass, amountIngredient, amount, multiplier);
          //getRecipes({ p: ingredient.itemClass, itemsMin: amountIngredient }, p, goal);
        });
      }
    } else {
      // If recipe is not found, it probably means that it is a resource, so just add it
      if (resultObject.data.rawResources[p]) {
        // Add ore amount to current amount
        resultObject.data.rawResources[p].amount += amount;
        resultObject.data.rawResources[p].products[neededFor]
          ? (resultObject.data.rawResources[p].products[neededFor] += amount)
          : (resultObject.data.rawResources[p].products[neededFor] = amount);
      } else {
        resultObject.data.rawResources[p] = { amount, products: { [neededFor]: amount } };
      }
    }

    //Add to all items list

    if (!resultObject.data.allEntries[goal]) resultObject.data.allEntries[goal] = {};
    resultObject.data.allEntries[goal][p] = resultObject.data.allEntries[goal][p]
      ? resultObject.data.allEntries[goal][p] + originalAmount
      : originalAmount;

    // At the end, check if the MODE is maximise. If so, we need to calculate the maximum
    //TODO: maximize
  };

  // Sort items in the following order:
  // all items with production_mode produce --> need to produce anyway
  // all items with mode ItemsMin or machines and production_mode OUTPUT --> check if items are already produced, it not add them
  // all items with mode maximize --> all what is left maximize in this specific order
  const produceProducts = configObject.products?.filter(
    (pr) => pr.production_mode.toUpperCase() === 'PRODUCE'
  );
  const outputProducts = configObject.products?.filter(
    (pr) => pr.mode.toUpperCase() !== 'MAX' && pr.production_mode.toUpperCase() !== 'PRODUCE'
  );
  const maximizeProducts = configObject.products?.filter(
    (pr) => pr.mode.toUpperCase() === 'MAX' && pr.production_mode.toUpperCase() !== 'PRODUCE'
  );

  //console.log(produceProducts, outputProducts, maximizeProducts);

  produceProducts.forEach((listItem) => {
    if (listItem.amount > 0) {
      getRecipes(
        {
          p: listItem.product,
          itemsMin: listItem.amount,
          mode: listItem.mode,
          production_mode: listItem.production_mode,
          build_mode: listItem.build_mode,
        },
        `PRODUCE`,
        listItem.product
      );
    }
  });

  outputProducts.forEach((listItem) => {
    if (listItem.amount > 0) {
      getRecipes(
        {
          p: listItem.product,
          itemsMin: listItem.amount,
          mode: listItem.mode,
          production_mode: listItem.production_mode,
          build_mode: listItem.build_mode,
        },
        `OUTPUT`,
        listItem.product
      );
    }
  });

  maximizeProducts.forEach((listItem) => {
    if (listItem.amount > 0) {
      getRecipes(
        {
          p: listItem.product,
          itemsMin: 1,
          mode: listItem.mode,
          production_mode: listItem.production_mode,
          build_mode: listItem.build_mode,
        },
        `MAX`,
        listItem.product
      );
    }
  });

  // Check if rawResources is bigger then input.
  // If so, add error to result
  for (const [resource, value] of Object.entries(resultObject.data.rawResources)) {
    const inputResource = configObject.resources?.find((r) => r.resource === resource);

    // If the resource is not present, add as error
    if (!inputResource || !inputResource.checked)
      resultObject.error?.push({
        type: 'ResourceNotPresent',
        resource,
        amountNeeded: value.amount,
        amountPresent: 0,
      });

    // If there is insufficient rawresources, add as error
    if (inputResource && inputResource.checked && inputResource.amount < value.amount) {
      resultObject.error?.push({
        type: 'ResourceInsufficient',
        resource,
        amountNeeded: value.amount,
        amountPresent: inputResource.amount,
      });
    }
  }

  //resultObject.data.chains = productChains;

  console.log('RESULTOBJECT', resultObject);

  return resultObject;
};
