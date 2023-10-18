import { Box, Container } from '@mui/material';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';

const EndProducts = () => {
  usePageView();
  const settings = useSettings();

  return (
    <>
      <Seo title={'Account'} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}></Container>
      </Box>
    </>
  );
};

export default EndProducts;
