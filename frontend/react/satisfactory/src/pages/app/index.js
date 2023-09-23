import Head from "next/head";
import { Box, Container } from "@mui/material";
import { usePageView } from "../../hooks/use-page-view";
import { useSettings } from "../../hooks/use-settings";
import { Layout as DashboardLayout } from "../../layouts/dashboard";
import { siteSettings } from "config";
import { useList, usePermissions } from "@pankod/refine-core";
import {
  getSatisfactoryBuildList,
  getSatisfactoryBuildListArray,
  getSatisfactoryData,
  getSatisfactoryEndProducts,
} from "libs/satisfactory";

const now = new Date();

const Page = () => {
  const settings = useSettings();
  //const data = useList({ resource: "events" });
  const permissions = usePermissions();

  usePageView();

  const items = [
    { itemClass: "Desc_IronPlateReinforced_C", quantity: 10 },
    { itemClass: "Desc_CircuitBoardHighSpeed_C", quantity: 5 },
    { itemClass: "Desc_SteelPlateReinforced_C", quantity: 6 },
  ];

  const products = getSatisfactoryData("items");
  const buildables = getSatisfactoryData("buildables");
  const recipes = getSatisfactoryData("recipes");
  const endProducts = getSatisfactoryBuildListArray(items);
  console.log(endProducts);

  const resources = Object.fromEntries(
    Object.entries(endProducts).filter(([key, value]) => !value.machineType)
  );

  const nonResources = Object.fromEntries(
    Object.entries(endProducts).filter(([key, value]) => value.machineType)
  );

  console.log(resources, nonResources);

  return (
    <>
      <Head>
        <title>Overview | {siteSettings.title}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          als je de volgende producten wil maken:
          <br />
          {items.map((item) => (
            <>
              {products[item.itemClass].name} - Aantal: {item.quantity} per
              minuut
              <br />
            </>
          ))}
          <br />
          <br />
          Dan heb je de volgende dingen nodig:
          <br />
          {Object.entries(nonResources).map(([key, value]) => (
            <>
              {/* {JSON.stringify(value)} */}
              {products[key].name} - Aantal: {value.amount} - Aantal machines:{" "}
              {value.machines} - Machine: {buildables[value.machineType]?.name}{" "}
              - Recept: {recipes[value.recipe]?.name}
              <br />
            </>
          ))}
          <br />
          En dan zijn de starter resources: <br />
          {Object.entries(resources).map(([key, value]) => (
            <>
              {/* {JSON.stringify(value)} */}
              {products[key].name} - Aantal: {value.amount}
              <br />
            </>
          ))}
          Berekeningen todo: op basis van resource en recepten optimale
          verdeling op basis van alternates een nieuwe berekening
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
