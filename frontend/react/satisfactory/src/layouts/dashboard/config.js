import { SvgIcon } from "@mui/material";
import HomeSmileIcon from "../../icons/untitled-ui/duocolor/home-smile";
import ShoppingBag03Icon from "../../icons/untitled-ui/duocolor/shopping-bag-03";
import LineChartUp04Icon from "../../icons/untitled-ui/duocolor/line-chart-up-04";
import { tokens } from "../../locales/tokens";
import { paths } from "../../paths";

export const getSections = (t, sections, refineMenuItems, permissionData) => {
  console.log(sections);
  let returnArray = [
    {
      items: [
        {
          title: t(tokens.dashboard.nav.overview),
          path: paths.app.index,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmileIcon />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.dashboard.nav.account),
          path: paths.app.account,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmileIcon />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: "Satisfactory",
      items: [
        {
          title: t(tokens.satisfactory.products),
          path: paths.app.satisfactory.products.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03Icon />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.satisfactory.product_details),
          path: paths.app.satisfactory.products.detail + "dummy",
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03Icon />
            </SvgIcon>
          ),
        },
        {
          title: t(tokens.satisfactory.games),
          path: paths.app.satisfactory.games,
          icon: (
            <SvgIcon fontSize="small">
              <LineChartUp04Icon />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: "Golf",
      items: [
        {
          title: t(tokens.satisfactory.products),
          path: paths.app.satisfactory.products.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03Icon />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: "Admin",
      items: [
        {
          title: "Overview",
          path: paths.app.admin.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03Icon />
            </SvgIcon>
          ),
        },
      ],
    },
  ];

  const adminItem = returnArray.find((item) => item.subheader === "Admin");

  if (sections) {
    returnArray = returnArray.filter(
      (arrayItem) =>
        !arrayItem.subheader ||
        (arrayItem?.subheader &&
          sections.includes(arrayItem.subheader) &&
          arrayItem.subheader !== "Admin")
    );
  }

  if (permissionData?.admin) {
    const existingAdmin = returnArray.find(
      (item) => item.subheader === "Admin"
    );
    if (!existingAdmin) {
      returnArray.push(adminItem);
    }
  }

  if (refineMenuItems && permissionData?.admin) {
    const refineMenuObject = {
      subheader: "Refine",
      items: [],
    };
    refineMenuItems.forEach((menuItem) => {
      refineMenuObject.items.push({
        title: menuItem.label,
        path: menuItem.key,
        icon: (
          <SvgIcon key={menuItem.key} fontSize="small">
            <ShoppingBag03Icon />
          </SvgIcon>
        ),
      });
    });
    const existingRefine = returnArray.find(
      (item) => item.subheader === "Refine"
    );
    if (!existingRefine) {
      returnArray.push(refineMenuObject);
    }
  }

  console.log(returnArray);

  return returnArray;
};
