import { Box, Button, Stack } from '@mui/material';
import PlannerProductList from './tab-production/planner-product-list';
import { getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import { useMemo } from 'react';
import _ from 'lodash';

const TabProduction = ({ products, setProducts, version }) => {
  const allProducts = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('items', version), 'name'),
    [version]
  );

  // const productsWithNew = useMemo(() => {
  //   return [...products, { product: '', amount: 0, mode: 'itemsMin' }];
  // }, [products]);

  return (
    <>
      <Stack
        justifyContent={'flex-end'}
        //spacing={1}
      >
        {/* <Button
          onClick={() => {
            const firstProduct =
              products?.length > 0
                ? allProducts.find(
                    (p) => products?.findIndex((pr) => pr.product === p.className) === -1
                  )
                : allProducts[0];
            console.log(firstProduct, allProducts);
            setProducts([
              ...(products || []),
              {
                product: firstProduct.className,
                amount: 0,
                mode: 'itemsMin',
                production_mode: 'output',
              },
            ]);
          }}
          sx={{ marginLeft: 'auto', mb: 1 }}
          variant="outlined"
        >
          Add
        </Button> */}
      </Stack>
      <PlannerProductList
        products={products || []}
        setProducts={(list) => {
          setProducts(list);
        }}
      />
    </>
  );
};

export default TabProduction;
