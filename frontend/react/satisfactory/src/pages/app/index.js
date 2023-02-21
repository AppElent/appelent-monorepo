import Head from "next/head";
import { Box, Container } from "@mui/material";
import { usePageView } from "../../hooks/use-page-view";
import { useSettings } from "../../hooks/use-settings";
import { Layout as DashboardLayout } from "../../layouts/dashboard";
import { siteSettings } from "config";
import {
  useList,
  usePermissions,
} from "@pankod/refine-core";


const now = new Date();

const Page = () => {
  const settings = useSettings();
  const data = useList({ resource: "events" });
  const permissions = usePermissions();
  console.log(data, permissions);

  usePageView();

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
        <Container maxWidth={settings.stretch ? false : "xl"}></Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
