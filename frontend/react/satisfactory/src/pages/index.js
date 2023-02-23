import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { siteSettings } from "config";
import Head from "next/head";
import { HomeHero } from "sections/home/home-hero";
import { usePageView } from "../hooks/use-page-view";
import { Layout as MarketingLayout } from "../layouts/marketing";

const Page = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>{siteSettings.title}</title>
      </Head>
      <main>
        <Box
          sx={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundImage: 'url("/assets/gradient-bg.svg")',
            pt: "120px",
          }}
        >
          <Container maxWidth="lg">
            <Typography>AppElent websites</Typography>
            <Stack direction="row" justifyContent="space-between">
              <Card>
                Test
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Card>
              <Card>Test</Card>
              <Card>Test</Card>
              <Card>Test</Card>
            </Stack>
          </Container>
        </Box>
        {/* <SplashScreen /> */}
        {/* <HomeHero /> */}
        {/* <HomeFeatures />
        <HomeReviews />
        <HomeCta />
        <HomeFaqs /> */}
      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
