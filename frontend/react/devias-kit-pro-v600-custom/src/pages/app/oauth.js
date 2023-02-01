import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { Box, Stack, Typography } from "@mui/material";
import { usePageView } from "hooks/use-page-view";
import { Layout as DashboardLayout } from "layouts/dashboard";
//import { useSearch, useItems } from "components/app/list/utils";
import { siteSettings, oauthConfigurations } from "config";
import { useOauthClient } from "hooks/use-oauth-client";
import { useFirebaseData } from "libs/firebase";

const Page = () => {
  usePageView();
  const oauth = useOauthClient(oauthConfigurations.enelogic);
  const oauth2 = useOauthClient(oauthConfigurations.enelogic2);
  const data = useFirebaseData();
  //console.log(data, data.firestore.collections.tokens.data.enelogic);
  return (
    <>
      <Head>
        <title>Oauth | {siteSettings.title}</title>
      </Head>
      <Box sx={{ p: 3 }}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={4}
        >
          <div>
            <Typography variant="h4">Oauth</Typography>
          </div>
          {/* <div>
            <Button
              startIcon={
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              }
              variant="contained"
            >
              Add
            </Button>
          </div> */}
        </Stack>
        <>
          <br />
          <button onClick={() => oauth.redirect()}>Redirect enelogic</button>
          <button
            onClick={async () => {
              const newtoken = await oauth.refreshToken(
                data.firestore.collections.tokens.data.enelogic
              );
              await oauth.saveToken("enelogic_new", newtoken);
            }}
          >
            Refresh enelogic
          </button>
          <button
            onClick={async () => {
              const token = await oauth.getToken();
              alert(JSON.stringify(token));
            }}
          >
            Get enelogic token
          </button>
          <button onClick={() => oauth2.redirect()}>Redirect enelogic2</button>
        </>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
