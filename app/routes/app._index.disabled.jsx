// app/routes/app._index.disabled.jsx
import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
// Import Polaris module namespace so it works whether package is CommonJS or ESM
import * as polaris from "@shopify/polaris";

import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

/**
 * Safely pick components from polaris with fallbacks.
 * Some Polaris distributions export different sets / names (VerticalStack vs LegacyStack, etc.)
 */
const {
  Page: PolarisPage,
  Card,
  Button,
  Box,
  List,
  Layout,
  Text,
  Link,
  // possible stack/container names
  VerticalStack,
  LegacyStack,
  BlockStack: PolarisBlockStack,
  InlineStack: PolarisInlineStack,
  Inline,
} = polaris || {};

// Provide fallbacks: prefer explicit names, else try alternatives, else no-op components
const Page = PolarisPage || (({ children }) => <div>{children}</div>);
const BlockStack =
  PolarisBlockStack || VerticalStack || LegacyStack || (({ children }) => <div>{children}</div>);
const InlineStack = PolarisInlineStack || Inline || (({ children }) => <div style={{ display: "inline-block" }}>{children}</div>);
const LayoutComponent = Layout || (({ children }) => <div>{children}</div>);
const CardComponent = Card || (({ children }) => <div>{children}</div>);
const TextComponent = Text || (({ children, as: As = "div", variant }) => <As>{children}</As>);
const LinkComponent = Link || (({ children }) => <a>{children}</a>);
const BoxComponent = Box || (({ children, style }) => <div style={style}>{children}</div>);
const ListComponent = List || (({ children }) => <ul>{children}</ul>);
const ButtonComponent = Button || (({ children, ...props }) => <button {...props}>{children}</button>);

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
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
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
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
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id?.replace?.("gid://shopify/Product/", "");

  useEffect(() => {
    if (productId && shopify?.toast?.show) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Remix app template">
        <ButtonComponent variant="primary" onClick={generateProduct}>
          Generate a product
        </ButtonComponent>
      </TitleBar>

      <BlockStack gap="500">
        <LayoutComponent>
          <LayoutComponent.Section>
            <CardComponent>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <TextComponent as="h2" variant="headingMd">
                    Congrats on creating a new Shopify app ðŸŽ‰
                  </TextComponent>
                  <TextComponent variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <LinkComponent
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </LinkComponent>{" "}
                    interface examples like an{" "}
                    <LinkComponent url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </LinkComponent>
                    , as well as an{" "}
                    <LinkComponent
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                      removeUnderline
                    >
                      Admin GraphQL
                    </LinkComponent>{" "}
                    mutation demo, to provide a starting point for app development.
                  </TextComponent>
                </BlockStack>

                <BlockStack gap="200">
                  <TextComponent as="h3" variant="headingMd">
                    Get started with products
                  </TextComponent>
                  <TextComponent as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for that product.
                  </TextComponent>
                </BlockStack>

                <InlineStack gap="300">
                  <ButtonComponent loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </ButtonComponent>

                  {fetcher.data?.product && (
                    <ButtonComponent
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </ButtonComponent>
                  )}
                </InlineStack>

                {fetcher.data?.product && (
                  <>
                    <TextComponent as="h3" variant="headingMd">
                      productCreate mutation
                    </TextComponent>
                    <BoxComponent
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
                      </pre>
                    </BoxComponent>

                    <TextComponent as="h3" variant="headingMd">
                      productVariantsBulkUpdate mutation
                    </TextComponent>
                    <BoxComponent
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.variant, null, 2)}</code>
                      </pre>
                    </BoxComponent>
                  </>
                )}
              </BlockStack>
            </CardComponent>
          </LayoutComponent.Section>

          <LayoutComponent.Section variant="oneThird">
            <BlockStack gap="500">
              <CardComponent>
                <BlockStack gap="200">
                  <TextComponent as="h2" variant="headingMd">
                    App template specs
                  </TextComponent>

                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <TextComponent as="span" variant="bodyMd">
                        Framework
                      </TextComponent>
                      <LinkComponent url="https://remix.run" target="_blank" removeUnderline>
                        Remix
                      </LinkComponent>
                    </InlineStack>

                    <InlineStack align="space-between">
                      <TextComponent as="span" variant="bodyMd">
                        Database
                      </TextComponent>
                      <LinkComponent url="https://www.prisma.io/" target="_blank" removeUnderline>
                        Prisma
                      </LinkComponent>
                    </InlineStack>

                    <InlineStack align="space-between">
                      <TextComponent as="span" variant="bodyMd">
                        Interface
                      </TextComponent>
                      <span>
                        <LinkComponent url="https://polaris.shopify.com" target="_blank" removeUnderline>
                          Polaris
                        </LinkComponent>
                        {", "}
                        <LinkComponent
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </LinkComponent>
                      </span>
                    </InlineStack>

                    <InlineStack align="space-between">
                      <TextComponent as="span" variant="bodyMd">
                        API
                      </TextComponent>
                      <LinkComponent
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </LinkComponent>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </CardComponent>

              <CardComponent>
                <BlockStack gap="200">
                  <TextComponent as="h2" variant="headingMd">
                    Next steps
                  </TextComponent>
                  <ListComponent>
                    <ListComponent.Item>
                      Build an{" "}
                      <LinkComponent
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        example app
                      </LinkComponent>{" "}
                      to get started
                    </ListComponent.Item>
                    <ListComponent.Item>
                      Explore Shopifyâ€™s API with{" "}
                      <LinkComponent
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </LinkComponent>
                    </ListComponent.Item>
                  </ListComponent>
                </BlockStack>
              </CardComponent>
            </BlockStack>
          </LayoutComponent.Section>
        </LayoutComponent>
      </BlockStack>
    </Page>
  );
}
