// app/routes/index.jsx
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { startOnboarding } from "../../src/js/onboarding.js"; // nếu file thực sự ở src/js

export const loader = () => {
  return {
    shopifyUrl: process.env.SHOPIFY_APP_URL || "",
  };
};

export default function Index() {
  const { shopifyUrl: loaderUrl } = useLoaderData();
  const [shopifyUrl, setShopifyUrl] = useState(loaderUrl);

  useEffect(() => {
    if (typeof window !== "undefined" && window.SHOPIFY_APP_URL) {
      setShopifyUrl(window.SHOPIFY_APP_URL);
    }
  }, []);

  const handleOnboard = async () => {
    const userData = {
      name: "Lạc Học",
      email: "hoclac1225@gmail.com",
      phone: "0327525280",
    };

    try {
      console.log("[index] Starting onboarding with endpoint base:", shopifyUrl);
      const res = await startOnboarding(userData, shopifyUrl);
      console.log("[index] Onboarding result:", res);
      alert(JSON.stringify(res));
    } catch (err) {
      console.error("[index] Onboarding error:", err);
      alert("Có lỗi xảy ra khi onboarding!");
    }
  };

  return (
    <div>
      <h1>Shopify App đang chạy!</h1>
      <p>App URL: {shopifyUrl}</p>
      <button onClick={handleOnboard}>Bắt đầu Onboarding</button>
    </div>
  );
}
