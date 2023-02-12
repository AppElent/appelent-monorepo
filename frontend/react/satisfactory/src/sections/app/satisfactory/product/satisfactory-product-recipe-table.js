import PropTypes from "prop-types";
import {
  useMediaQuery,
  Card,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
} from "@mui/material";
import React from "react";

export const SatisfactoryProductRecipeTable = ({
  recipes,
  title,
  products,
  conditionFunction,
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const columns = [
    { label: "Recipe name" },
    { label: "Input" },
    { label: "Machine" },
    { label: "Output" },
    { label: "Requirements" },
  ];

  //   return <Stack></Stack>;

  return (
    // <Stack>
    //   <Stack spacing={3}>
    <Card>
      <CardHeader title={title} />
      {/* <Scrollbar> */}
      <CardContent>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.label}>{column.label}</TableCell>
              ))}
              {/* <TableCell>Description</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Amount</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => {
              const perMinute = 60 / recipe.craftTime;
              if (conditionFunction && !conditionFunction(recipe, products)) {
                return <React.Fragment key={recipe.className}></React.Fragment>;
              }

              return (
                <TableRow key={recipe.className}>
                  <TableCell>{recipe.name}</TableCell>
                  <TableCell>
                    {recipe.ingredients.map((ingredient) => {
                      return (
                        <React.Fragment key={ingredient.itemClass}>
                          {ingredient.quantity} *{" "}
                          {products[ingredient.itemClass].name} (
                          {perMinute * ingredient.quantity} p.m.)
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    {recipe.producedIn}
                    <br />({recipe.craftTime} seconds)
                  </TableCell>
                  <TableCell>
                    {" "}
                    {recipe.products.map((ingredient) => {
                      return (
                        <React.Fragment key={ingredient.itemClass}>
                          {ingredient.quantity} *{" "}
                          {products[ingredient.itemClass].name} (
                          {perMinute * ingredient.quantity} p.m.)
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    {recipe.schematic.name} ({recipe.schematic.type})
                  </TableCell>
                </TableRow>
              );
            })}
            {/* {items.map((item) => {
                const unitAmount = numeral(item.unitAmount).format(
                  `${item.currency}0,0.00`
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.name} x {item.quantity}
                    </TableCell>
                    <TableCell>{item.billingCycle}</TableCell>
                    <TableCell>{unitAmount}</TableCell>
                  </TableRow>
                );
              })} */}
          </TableBody>
        </Table>
        {/* </Scrollbar> */}
      </CardContent>
    </Card>
    //   </Stack>
    // </Stack>
  );
};

SatisfactoryProductRecipeTable.propTypes = {
  recipes: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
