import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useSettings } from "../../hooks/use-settings";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { getSections } from "./config";
import { withAuthGuard } from "../../hocs/with-auth-guard";
import { useFirebaseData } from "libs/firebase";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "libs/firebase";
import { useGlobalData } from "hooks/use-global-data";

const useTranslatedSections = () => {
  const { t } = useTranslation();

  return useMemo(() => getSections(t), [t]);
};

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const sections = useTranslatedSections();
  const firebase = useFirebaseData();
  useGlobalData();
  console.log(firebase);

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
