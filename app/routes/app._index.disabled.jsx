// app/routes/app._index.disabled.jsx
import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

/**
 * Import Polaris robustly:
 * - Một số package xuất CommonJS (default), một số xuất ESM named exports.
 * - Dùng import * as polarisPkg để luôn có namespace, rồi ưu tiên polarisPkg.default nếu tồn tại.
 */
import * as polarisPkg from "@shopify/polaris";
const polaris = (polarisPkg && polarisPkg.default) ? polarisPkg.default : polarisPkg || {};

/**
 * Lấy các component cần dùng từ Polaris (nếu có),
 * nếu không có thì dùng fallback nhẹ để tránh crash (đặc biệt trong môi trường dev/build khác nhau).
 */
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

/* --- Fallback components (rất nhỏ, chỉ để tránh crash) --- */
const Fallback = {
  Page: ({ children }) => <div className="fallback-page">{children}</div>,
  Layout: ({ children }) => <div className="fallback-layout">{children}</div>,
  Section: ({ children, variant }) => <section className={`fallback-section ${variant || ""}`}>{children}</section>,
  Card: ({ children }) => <div style={{ border: "1px solid #e1e1e1", padding: 12, borderRadius: 6 }}>{children}</div>,
  Button: ({ children, onClick, loading, url, variant, target }) => {
    if (url) return <a href={url} target={target} rel="noreferrer" className="fallback-link">{children}</a>;
    return <button disabled={!!loading} onClick={onClick} className={`fallback-button ${variant || ""}`}>{children}</button>;
  },
  Stack: ({ children }) => <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>,
  InlineStack: ({ children, style }) => <div style={{ display: "flex", gap: 12, alignItems: "center", ...(style || {}) }}>{children}</div>,
  Box: ({ children, style, ...rest }) => <div style={style} {...rest}>{children}</div>,
  List: ({ children }) => <ul>{children}</ul>,
  Text: ({ children, as = "p", variant }) => {
    const Tag = as;
    return <Tag className={variant}>{children}</Tag>;
  },
  Link: ({ url, children, ...props }) => <a href={url} {...props}>{children}</a>,
};

/* --- UI mapping: ưu tiên Polaris, fallback nếu không có --- */
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

/* ------------------- Server handlers ------------------- */
export const loader = async ({ request }) => {
  // đảm bảo admin đã authenticate (nếu không sẽ redirect/throw theo shopify.server implementation)
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  // Lấy admin client từ middleware authenticate
  const { admin } = await authenticate.admin(request);

  // random title color (ví dụ demo)
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];

  // 1) Tạo product (Admin GraphQL)
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
    { variables: { product: { title: `${color} Snowboard` } } }
  );

  // Một số client trả về Response-like object, một số trả JSON trực tiếp.
  let createJson;
  try {
    createJson = createResp && typeof createResp.json === "function" ? await createResp.json() : createResp;
  } catch (e) {
    return { error: "FAILED_CREATE", detail: e?.message || String(e) };
  }

  const product = createJson?.data?.productCreate?.product;
  if (!product) {
    return { error: "NO_PRODUCT_CREATED", detail: createJson || null };
  }

  // 2) Update variant price (ví dụ bulk update)
  const variantId = product?.variants?.edges?.[0]?.node?.id;
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
    { variables: { productId: product.id, variants: [{ id: variantId, price: "100.00" }] } }
  );

  let variantJson;
  try {
    variantJson = variantResp && typeof variantResp.json === "function" ? await variantResp.json() : variantResp;
  } catch {
    variantJson = null;
  }

  return {
    product,
    variant: variantJson?.data?.productVariantsBulkUpdate?.productVariants || null,
  };
};

/* ------------------- Client component ------------------- */
export default function Index() {
  const fetcher = useFetcher();
  const app = useAppBridge();

  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id?.replace?.("gid://shopify/Product/", "");

  useEffect(() => {
    if (productId && app && app.toast && typeof app.toast.show === "function") {
      try {
        app.toast.show({ message: "Product created" });
      } catch {
        // ignore if API shape differs
      }
    }
  }, [productId, app]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  // unpack UI components (Polaris hoặc fallback)
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
        {/* TitleBar children: Polaris/AppBridge có thể không chấp nhận trực tiếp DOM nodes,
            nhưng đa số vẫn an toàn; nếu thấy bất thường, có thể bỏ phần children này. */}
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
                    mutation demo.
                  </UText>
                </UStack>

                <UStack>
                  <UText as="h3" variant="headingMd">Get started with products</UText>
                  <UText as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for that product.
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
