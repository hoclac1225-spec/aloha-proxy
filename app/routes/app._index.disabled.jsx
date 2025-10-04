// Thay phần import Polaris hiện có bằng đoạn sau:
import polarisPkg from "@shopify/polaris";

// Some Polaris builds export components as named exports (ESM) and some as default CommonJS.
// Use namespace fallback to be safe:
const {
  Card,
  Button,
  // BlockStack may be a design system component — if absent, try LegacyStack or use Box for layout
  BlockStack,
  VerticalStack,
  LegacyStack,
  Box,
  List,
  Text,
  Link,
  Layout,
  InlineStack,
  Page,
} = polarisPkg && polarisPkg.default ? polarisPkg.default : polarisPkg;

// Provide small fallback aliases
const Stack = VerticalStack || BlockStack || LegacyStack || (({ children }) => <div>{children}</div>);
