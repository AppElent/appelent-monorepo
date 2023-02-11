import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { SeverityPill } from "components/severity-pill";
import { PropertyListTemplate } from "components/app/property-list-template";

export const SatisfactoryProductDetail = ({ product }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const getSeverityPill = (item) => {
    let status = "error";
    let text = "No";
    if (item) {
      status = "success";
      text = "Yes";
    }
    return <SeverityPill color={status}>{text}</SeverityPill>;
  };

  const propertyItems = [
    {
      label: "Name",
      value: product.name,
    },
    {
      label: "Description",
      value: product.description,
    },
    {
      label: "Stacksize",
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
        <CardHeader title="Info" />
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
