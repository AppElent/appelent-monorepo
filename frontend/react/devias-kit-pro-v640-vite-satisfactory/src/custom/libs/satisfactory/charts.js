export const recipeChart = (recipe, items, machines, options = {}) => {
  const { hideTitle } = options;
  console.log(recipe, items);
  const itemsMin = 60 / recipe.craftTime;
  let graphString = hideTitle
    ? `graph LR;
`
    : `---
title: Recipe ${recipe.name}
---
graph LR;
    ${recipe.slug}[${recipe.name}
    ${machines[recipe.producedIn].name}]`;

  recipe.ingredients.forEach((ingredient) => {
    graphString += `
    ${ingredient.itemClass}[${items[ingredient.itemClass].name}] -->|${
      ingredient.quantity * itemsMin
    } p.m.| ${recipe.slug}`;
  });

  recipe.products.forEach((product) => {
    graphString += `
    ${recipe.slug} -->|${product.quantity * itemsMin} p.m.| ${product.itemClass}[${
      product.quantity
    } x ${items[product.itemClass].name}]
    `;
  });

  return graphString;
};
