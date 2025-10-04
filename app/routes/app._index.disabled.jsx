// app/routes/app._index.disabled.jsx
import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

// Import Polaris robustly: support both ESM named exports and CommonJS default export
import * as polarisPkg from "@shopify/polaris";

// Resolve exported namespace (if polarisPkg.default exists then package used default export)
const polaris = polarisPkg && polarisPkg.default ? polarisPkg.default : polarisPkg || {};

// Try to extract the components we need; if any missing, provide a minimal fallback
const {
  Page,
  Layout,
  Card,
  Button,
  BlockStack,
  VerticalStack,
  LegacyStack,
  InlineStack,
  Box,
  List,
  Text,
  Link,
} = polaris;

// Very small dumb fallbacks (render simple HTML) for each major component if missing.
// These keep layout/markup readable and prevent runtime crashes.
const Fallback = {
  Page: ({ children }) => <div className="fallback-page">{children}</div>,
  Layout: ({ children, variant }) => <div className={`fallback-layout ${variant || ""}`}>{children}</div>,
  Section: ({ children, variant }) => <section className={`fallback-section ${variant || ""}`}>{children}</section>,
  Card: ({ children }) => <div className="fallback-card" style={{ border: "1px solid #ddd", padding: 12 }}>{children}</div>,
  Button: ({ children, onClick, loading, url, variant, target }) => {
    if (url) return <a href={url} target={target} rel="noreferrer" className="fallback-link">{children}</a>;
    return <button disabled={!!loading} onClick={onClick} className={`fallback-button ${variant || ""}`}>{children}</button>;
  },
  Stack: ({ children }) => <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>,
  InlineStack: ({ children }) => <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{children}</div>,
  Box: ({ children, ...rest }) => <div {...rest}>{children}</div>,
  List: ({ children }) => <ul>{children}</ul>,
  Text: ({ children, as = "p", variant }) => {
    const Tag = as;
    return <Tag className={variant}>{children}</Tag>;
  },
  Link: ({ url, children, ...props }) => <a href={url} {...props}>{children}</a>,
};

// Choose components: prefer Polaris ones, else fallback
const UI = {
  Page: Page || Fallback.Page,
  Layout: Layout || Fallback.Layout,
  LayoutSection: (Layout && Layout.Section) || Fallback.Section,
  Card: Card || Fallback.Card,
  Button: Button || Fallback.Button,
  Stack: VerticalStack || BlockStack || LegacyStack || Fallback.Stack,
  InlineStack: InlineStack || Fallback.InlineStack,
  Box: Box || Fallback.Box,
  List: List || Fallback.List,
  Text: Text || Fallback.Text,
  Link: Link || Fallback.Link,
};

export const loader = async ({ request }) => {
  // Ensure admin auth (throws/redirects if not authenticated)
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  // This action runs server-side and uses shopify.authenticate to get an admin client
  const { admin } = await authenticate.admin(request);

  // pick a random color/title for example product
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];

  // 1) create product
  const createResp = await admin.graphql(
    `#graphql
      mutation productCreate($product: ProductInput!) {
        productCreate(input: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    }
  );

  // Try parse response (some admin clients return Response-like)
  let createJson;
  try {
    // if createResp.json is available (fetch Response), parse it
    if (createResp && typeof createResp.json === "function") {
      createJson = await createResp.json();
    } else {
      createJson = createResp;
    }
  } catch (e) {
    // fallback: attach minimal error
    return { error: "FAILED_CREATE", detail: e?.message || String(e) };
  }

  const product = createJson?.data?.productCreate?.product;
  if (!product) return { error: "NO_PRODUCT_CREATED", detail: createJson };

  // 2) update variant price (bulk update example)
  const variantId = product.variants?.edges?.[0]?.node?.id;
  if (!variantId) {
    return { product };
  }

  const variantResp = await admin.graphql(
    `#graphql
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    }
  );

  let variantJson;
  try {
    variantJson = variantResp && typeof variantResp.json === "function" ? await variantResp.json() : variantResp;
  } catch (e) {
    variantJson = null;
  }

  return {
    product,
    variant: variantJson?.data?.productVariantsBulkUpdate?.productVariants || null,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const app = useAppBridge();
  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";

  // get product id from fetcher data (strip gid if present)
  const productId = fetcher.data?.product?.id?.replace?.("gid://shopify/Product/", "");

  useEffect(() => {
    if (productId && app && app.toast && typeof app.toast.show === "function") {
      // Some app-bridge versions might use different APIs; try-safe:
      try {
        app.toast.show({ message: "Product created" });
      } catch {
        // ignore
      }
    }
  }, [productId, app]);

  const generateProduct = () => {
    // submit empty form to invoke action
    fetcher.submit({}, { method: "POST" });
  };

  // UI components (may be Polaris or fallback)
  const {
    Page: UPage,
    Layout: ULayout,
    LayoutSection: USection,
    Card: UCard,
    Button: UButton,
    Stack: UStack,
    InlineStack: UInlineStack,
    Box: UBox,
    List: UList,
    Text: UText,
    Link: ULink,
  } = UI;

  return (
    <UPage>
      <TitleBar title="Remix app template">
        {/* TitleBar children in App Bridge might not accept DOM nodes; keep a fallback */}
        <UButton onClick={generateProduct} variant="primary">Generate a product</UButton>
      </TitleBar>

      <UStack>
        <ULayout>
          <USection>
            <UCard>
              <UStack>
                <UStack>
                  <UText as="h2" variant="headingMd">Congrats on creating a new Shopify app 🎉</UText>
                  <UText as="p" variant="bodyMd">
                    This embedded app template uses{" "}
                    <ULink url="https://shopify.dev/docs/apps/tools/app-bridge" target="_blank" removeUnderline>
                      App Bridge
                    </ULink>{" "}
                    interface examples like an{" "}
                    <ULink url="/app/additional" removeUnderline>additional page in the app nav</ULink>
                    , as well as an{" "}
                    <ULink url="https://shopify.dev/docs/api/admin-graphql" target="_blank" removeUnderline>
                      Admin GraphQL
                    </ULink>{" "}
                    mutation demo, to provide a starting point for app development.
                  </UText>
                </UStack>

                <UStack>
                  <UText as="h3" variant="headingMd">Get started with products</UText>
                  <UText as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for that product. Learn more about the{" "}
                    <ULink url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate" target="_blank" removeUnderline>
                      productCreate
                    </ULink>{" "}
                    mutation in our API references.
                  </UText>
                </UStack>

                <UInlineStack>
                  <UButton loading={isLoading} onClick={generateProduct}>Generate a product</UButton>
                  {fetcher.data?.product && (
                    <UButton url={`https://admin.shopify.com/${productId}`} target="_blank" variant="plain">
                      View product
                    </UButton>
                  )}
                </UInlineStack>

                {fetcher.data?.product && (
                  <>
                    <UText as="h3" variant="headingMd">productCreate mutation</UText>
                    <UBox style={{ padding: 12, background: "#f6f7f8", overflowX: "auto", borderRadius: 6 }}>
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
                      </pre>
                    </UBox>

                    <UText as="h3" variant="headingMd">productVariantsBulkUpdate mutation</UText>
                    <UBox style={{ padding: 12, background: "#f6f7f8", overflowX: "auto", borderRadius: 6 }}>
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.variant, null, 2)}</code>
                      </pre>
                    </UBox>
                  </>
                )}
              </UStack>
            </UCard>
          </USection>

          <USection variant="oneThird">
            <UStack>
              <UCard>
                <UStack>
                  <UText as="h2" variant="headingMd">App template specs</UText>
                  <UStack>
                    <UInlineStack style={{ justifyContent: "space-between" }}>
                      <UText as="span" variant="bodyMd">Framework</UText>
                      <ULink url="https://remix.run" target="_blank" removeUnderline>Remix</ULink>
                    </UInlineStack>

                    <UInlineStack style={{ justifyContent: "space-between" }}>
                      <UText as="span" variant="bodyMd">Database</UText>
                      <ULink url="https://www.prisma.io/" target="_blank" removeUnderline>Prisma</ULink>
                    </UInlineStack>

                    <UInlineStack style={{ justifyContent: "space-between" }}>
                      <UText as="span" variant="bodyMd">Interface</UText>
                      <span>
                        <ULink url="https://polaris.shopify.com" target="_blank" removeUnderline>Polaris</ULink>
                        {", "}
                        <ULink url="https://shopify.dev/docs/apps/tools/app-bridge" target="_blank" removeUnderline>App Bridge</ULink>
                      </span>
                    </UInlineStack>

                    <UInlineStack style={{ justifyContent: "space-between" }}>
                      <UText as="span" variant="bodyMd">API</UText>
                      <ULink url="https://shopify.dev/docs/api/admin-graphql" target="_blank" removeUnderline>GraphQL API</ULink>
                    </UInlineStack>
                  </UStack>
                </UStack>
              </UCard>

              <UCard>
                <UStack>
                  <UText as="h2" variant="headingMd">Next steps</UText>
                  <UList>
                    <li>
                      Build an{" "}
                      <ULink url="https://shopify.dev/docs/apps/getting-started/build-app-example" target="_blank" removeUnderline>
                        example app
                      </ULink>{" "}
                      to get started
                    </li>
                    <li>
                      Explore Shopify’s API with{" "}
                      <ULink url="https://shopify.dev/docs/apps/tools/graphiql-admin-api" target="_blank" removeUnderline>
                        GraphiQL
                      </ULink>
                    </li>
                  </UList>
                </UStack>
              </UCard>
            </UStack>
          </USection>
        </ULayout>
      </UStack>
    </UPage>
  );
}
