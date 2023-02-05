import { usePageView } from "../hooks/use-page-view";
import { Layout as MarketingLayout } from "../layouts/marketing";
import { SplashScreen } from "components/splash-screen";

const Page = () => {
  usePageView();

  return (
    <>
      {/* <Head>
        <title>{}</title>
      </Head> */}
      <main>
        {/* <SplashScreen /> */}
        {/* <HomeHero />
        <HomeFeatures />
        <HomeReviews />
        <HomeCta />
        <HomeFaqs /> */}
      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
