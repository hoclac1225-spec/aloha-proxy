// app/routes/_index.jsx
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

/**
 * Thử require ../shopify.server nếu có, nếu không thì dùng stub để dev không crash.
 * Nếu file shopify.server của bạn nằm ở chỗ khác, sửa đường dẫn require tương ứng.
 */
let authenticate, login;
try {
  ({ authenticate, login } = require("../shopify.server"));
} catch (e) {
  authenticate = {
    // admin(request) phải trả { isAuthenticated: boolean } nếu có
    admin: async () => ({ isAuthenticated: false }),
  };
  login = null;
}

/**
 * Chỉ 1 loader duy nhất ở đây:
 * - Nếu có ?shop=... -> redirect sang /auth?shop=... (bắt đầu OAuth/install flow)
 * - Nếu đã authenticated -> trả thông tin installed
 * - Nếu không -> trả showForm để hiển thị form nhập shop
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
    // fallback an toàn: nếu có ?shop redirect để bắt OAuth, nếu không thì hiện form
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
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Aloha — Welcome</h1>
        <p style={{ marginBottom: 16 }}>
          Đây là trang index tạm cho app. Dùng form dưới để bắt đầu flow cài app (OAuth).
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
                Nhập domain dạng <code>your-shop.myshopify.com</code>
              </div>
            </label>
            <button type="submit" style={{ padding: "8px 12px" }}>
              Log in / Install
            </button>
          </Form>
        )}

        <ul>
          <li><strong>Feature:</strong> Quick install flow & app proxy testing.</li>
          <li><strong>Note:</strong> Nếu bạn có shopify.server, loader sẽ dùng authenticate.admin(request).</li>
          <li><strong>Dev tip:</strong> Nếu gặp lỗi route duplicate, chỉ giữ một file `_index`.</li>
        </ul>
      </div>
    </div>
  );
}
