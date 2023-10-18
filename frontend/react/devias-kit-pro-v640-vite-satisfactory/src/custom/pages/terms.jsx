import { Box } from '@mui/material';
import { siteSettings } from 'src/config';
import { TermsAndConditions } from 'src/custom/components/terms-and-conditions';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';

const Page = () => {
  usePageView();

  return (
    <>
      <main>
        <Box
          sx={{
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "top center",
            // backgroundImage: 'url("/assets/gradient-bg.svg")',
            pt: '50px',
            margin: '50px',
          }}
        >
          <TermsAndConditions
            title={siteSettings.title}
            url={window.location.hostname}
          />
        </Box>
      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
