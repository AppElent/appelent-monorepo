import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { SeverityPill } from "components/severity-pill";
import { PropertyListTemplate } from "components/app/property-list-template";
import { tokens } from "locales/tokens";

export const SatisfactoryProductDetail = ({ product, translate }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const getSeverityPill = (item) => {
    let status = "error";
    let text = translate(tokens.common.words.no);
    if (item) {
      status = "success";
      text = translate(tokens.common.words.yes);
    }
    return <SeverityPill color={status}>{text}</SeverityPill>;
  };

  const propertyItems = [
    {
      label: translate(tokens.common.fields.name),
      value: product.name,
    },
    {
      label: translate(tokens.common.fields.description),
      value: product.description,
    },
    {
      label: translate(tokens.satisfactory.pages.products.stackSize),
      value: product.stackSize.toString(),
    },
    {
      label: "Sink points",
      value: product.sinkPoints.toString(),
    },
    {
      label: "Is Fuel",
      value: getSeverityPill(product.isFuel),
    },
  ];
  const propertyItems2 = [
    {
      label: "Is Equipment",
      value: getSeverityPill(product.isEquipment),
    },
    {
      label: "Is Fluid",
      value: getSeverityPill(product.isFluid),
    },
    {
      label: "Is Resource",
      value: getSeverityPill(product.resource != undefined),
    },
  ];
  return (
    <Stack>
      <Card>
        <CardHeader
          title={translate(tokens.satisfactory.pages.products.info)}
        />
        <CardContent>
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems} />
          {/* </Stack> */}
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems2} />
          {/* </Stack> */}
        </CardContent>
      </Card>
    </Stack>
  );
};

SatisfactoryProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
};
