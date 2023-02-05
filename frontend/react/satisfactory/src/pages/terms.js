import Head from "next/head";
import { Box } from "@mui/material";
import { usePageView } from "../hooks/use-page-view";
import { Layout as MarketingLayout } from "../layouts/marketing";
import { TermsAndConditions } from "modules/terms-and-conditions";
import { siteSettings } from "config";

const Page = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>{siteSettings.title}: Terms</title>
      </Head>
      <main>
        <Box
          sx={{
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "top center",
            // backgroundImage: 'url("/assets/gradient-bg.svg")',
            pt: "50px",
            margin: "50px",
          }}
        >
          <TermsAndConditions
            title={siteSettings.title}
            url={siteSettings.url}
          />
        </Box>
      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
