// app/routes/_index.jsx
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

/**
 * ThÃ¡Â»Â­ require ../shopify.server nÃ¡ÂºÂ¿u cÃƒÂ³, nÃ¡ÂºÂ¿u khÃƒÂ´ng thÃƒÂ¬ dÃƒÂ¹ng stub Ã„â€˜Ã¡Â»Æ’ dev khÃƒÂ´ng crash.
 * NÃ¡ÂºÂ¿u file shopify.server cÃ¡Â»Â§a bÃ¡ÂºÂ¡n nÃ¡ÂºÂ±m Ã¡Â»Å¸ chÃ¡Â»â€” khÃƒÂ¡c, sÃ¡Â»Â­a Ã„â€˜Ã†Â°Ã¡Â»Âng dÃ¡ÂºÂ«n require tÃ†Â°Ã†Â¡ng Ã¡Â»Â©ng.
 */
let authenticate, login;
try {
  ({ authenticate, login } = require("../shopify.server"));
} catch (e) {
  authenticate = {
    // admin(request) phÃ¡ÂºÂ£i trÃ¡ÂºÂ£ { isAuthenticated: boolean } nÃ¡ÂºÂ¿u cÃƒÂ³
    admin: async () => ({ isAuthenticated: false }),
  };
  login = null;
}

/**
 * ChÃ¡Â»â€° 1 loader duy nhÃ¡ÂºÂ¥t Ã¡Â»Å¸ Ã„â€˜ÃƒÂ¢y:
 * - NÃ¡ÂºÂ¿u cÃƒÂ³ ?shop=... -> redirect sang /auth?shop=... (bÃ¡ÂºÂ¯t Ã„â€˜Ã¡ÂºÂ§u OAuth/install flow)
 * - NÃ¡ÂºÂ¿u Ã„â€˜ÃƒÂ£ authenticated -> trÃ¡ÂºÂ£ thÃƒÂ´ng tin installed
 * - NÃ¡ÂºÂ¿u khÃƒÂ´ng -> trÃ¡ÂºÂ£ showForm Ã„â€˜Ã¡Â»Æ’ hiÃ¡Â»Æ’n thÃ¡Â»â€¹ form nhÃ¡ÂºÂ­p shop
 */
export const loader = async ({ request }) => {
  try {
    const { isAuthenticated } = await authenticate.admin(request);
    if (!isAuthenticated) {
      const url = new URL(request.url);
      const shop = url.searchParams.get("shop");
      if (shop) return redirect(`/auth?shop=${shop}`);
      return json({ ok: true, showForm: Boolean(login) });
    }
    return json({ ok: true, installed: true, showForm: false });
  } catch (err) {
    // fallback an toÃƒÂ n: nÃ¡ÂºÂ¿u cÃƒÂ³ ?shop redirect Ã„â€˜Ã¡Â»Æ’ bÃ¡ÂºÂ¯t OAuth, nÃ¡ÂºÂ¿u khÃƒÂ´ng thÃƒÂ¬ hiÃ¡Â»â€¡n form
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (shop) return redirect(`/auth?shop=${shop}`);
    return json({ ok: true, showForm: Boolean(login) });
  }
};

export default function Index() {
  const { showForm } = useLoaderData();

  return (
    <div style={{ padding: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Aloha Ã¢â‚¬â€ Welcome</h1>
        <p style={{ marginBottom: 16 }}>
          Ã„ÂÃƒÂ¢y lÃƒÂ  trang index tÃ¡ÂºÂ¡m cho app. DÃƒÂ¹ng form dÃ†Â°Ã¡Â»â€ºi Ã„â€˜Ã¡Â»Æ’ bÃ¡ÂºÂ¯t Ã„â€˜Ã¡ÂºÂ§u flow cÃƒÂ i app (OAuth).
        </p>

        {showForm && (
          <Form method="post" action="/auth/login" style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              <div>Shop domain</div>
              <input
                name="shop"
                type="text"
                placeholder="e.g: aloha-pwa-dev.myshopify.com"
                style={{ padding: 8, width: 360, marginTop: 6 }}
              />
              <div style={{ fontSize: 12, color: "#666" }}>
                NhÃ¡ÂºÂ­p domain dÃ¡ÂºÂ¡ng <code>your-shop.myshopify.com</code>
              </div>
            </label>
            <button type="submit" style={{ padding: "8px 12px" }}>
              Log in / Install
            </button>
          </Form>
        )}

        <ul>
          <li><strong>Feature:</strong> Quick install flow & app proxy testing.</li>
          <li><strong>Note:</strong> NÃ¡ÂºÂ¿u bÃ¡ÂºÂ¡n cÃƒÂ³ shopify.server, loader sÃ¡ÂºÂ½ dÃƒÂ¹ng authenticate.admin(request).</li>
          <li><strong>Dev tip:</strong> NÃ¡ÂºÂ¿u gÃ¡ÂºÂ·p lÃ¡Â»â€”i route duplicate, chÃ¡Â»â€° giÃ¡Â»Â¯ mÃ¡Â»â„¢t file `_index`.</li>
        </ul>
      </div>
    </div>
  );
}
