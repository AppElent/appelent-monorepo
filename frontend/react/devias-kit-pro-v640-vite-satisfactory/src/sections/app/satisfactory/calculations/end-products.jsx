import { useMemo } from 'react';
import { CardDefault } from 'src/components/app/card-default';
import { getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';

const EndProducts = ({ version }) => {
  const products = useMemo(() => getSatisfactoryDataArray('items', version), [version]);
  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);

  const p = products[49];
  const test = recipeArray.find((r) => r.ingredients.find((i) => i.itemClass === p.className));

  const endProducts = products.filter(
    (p) =>
      !p.isEquipment &&
      !recipeArray.find((r) => r.ingredients.find((i) => i.itemClass === p.className))
  );
  console.log(test, products, recipeArray, endProducts);

  return (
    <CardDefault title="End products">
      {endProducts.map((prod) => (
        <div key={prod.className}>{prod.name}</div>
      ))}
    </CardDefault>
  );
};

export default EndProducts;
