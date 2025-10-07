import "@shopify/polaris/build/esm/styles.css"; // CSS sẽ load trên client
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";

hydrateRoot(document, <RemixBrowser />);
