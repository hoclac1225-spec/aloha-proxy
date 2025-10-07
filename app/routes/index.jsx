import React from "react";
import { AppProviderFix } from "~/utils/AppProviderFix";

export default function Index() {
  return (
    <AppProviderFix>
      <div>Hello Shopify/Remix</div>
    </AppProviderFix>
  );
}
