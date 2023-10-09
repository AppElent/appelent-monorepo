import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'src/hooks/use-router';
import { CardDefault } from '../card-default';

const SimpleCard = ({ title, content, onClick }) => {
  return (
    <Grid
      item
      xs={12}
      md={3}
    >
      <Card>
        <CardHeader title={title} />
        <CardContent>{content}</CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onClick}
          >
            Go
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

const Index = () => {
  const router = useRouter();
  return (
    <>
      <Stack
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Welcome to Satisfactory Tool!</Typography>
      </Stack>
      <Divider />
      <Box sx={{ m: 2 }}>
        <CardDefault title="Important information">
          - You can use ctrl-p anywhere on this website to call for a list of products <br />- You
          can use ctrl-r anywhere on this website to call for a list of recipes
        </CardDefault>
      </Box>
      <Grid
        container
        spacing={3}
      >
        <SimpleCard
          title="Account info"
          content="Set your personal preferences."
          onClick={() => router.push('/app/account')}
        />
        <SimpleCard
          title="Game"
          content="Store your factories and settings and make smart calculations"
          onClick={() => router.push('/app/satisfactory/games')}
        />
        <SimpleCard
          title="Product list"
          content="Show all the products of the best game in the world!"
          onClick={() => router.push('/app/satisfactory/products')}
        />
        <SimpleCard
          title="Recipe list"
          content="Show all the recipes of the best game in the world!"
          onClick={() => router.push('/app/satisfactory/recipes')}
        />
        <SimpleCard
          title="Calculations"
          content="Some predefined calculations"
          onClick={() => router.push('/app/satisfactory/calculations')}
        />
        <SimpleCard
          title="Factory planner"
          content="Plan your factories before you start building!"
          onClick={() => router.push('/app/satisfactory/planner')}
        />
      </Grid>
    </>
  );
};

export default Index;
