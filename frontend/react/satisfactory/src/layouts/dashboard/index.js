import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useSettings } from "../../hooks/use-settings";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { getSections } from "./config";
import { withAuthGuard } from "../../hocs/with-auth-guard";
import { useData } from "libs/appelent-framework";
import { useMenu } from "@pankod/refine-mui";
import { usePermissions } from "@pankod/refine-core";

const useTranslatedSections = (sections, refineMenuItems, permissionData) => {
  const { t } = useTranslation();

  return useMemo(
    () => getSections(t, sections, refineMenuItems, permissionData),
    [t, permissionData]
  );
};

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const appSettings = useData("settings");
  const { menuItems: refineMenuItems } = useMenu();
  const { data: permissionData } = usePermissions();
  const sections = useTranslatedSections(
    appSettings.sections,
    refineMenuItems,
    permissionData
  );

  if (settings.layout === "horizontal") {
    return (
      <HorizontalLayout
        sections={sections}
        navColor={settings.navColor}
        {...props}
      />
    );
  }

  return (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      {...props}
    />
  );
});

Layout.propTypes = {
  children: PropTypes.node,
};
