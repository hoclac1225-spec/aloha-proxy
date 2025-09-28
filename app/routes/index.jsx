// app/routes/index.jsx
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { startOnboarding } from "../../src/js/onboarding.js";

// Loader chạy ở server, lấy từ biến môi trường
export const loader = () => {
  return {
    shopifyUrl: process.env.SHOPIFY_APP_URL || "",
  };
};

export default function Index() {
  const { shopifyUrl: loaderUrl } = useLoaderData();
  const [shopifyUrl, setShopifyUrl] = useState(loaderUrl);

  useEffect(() => {
    // đảm bảo đọc đúng từ window khi client đã hydrate
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
      // truyền shopifyUrl vào startOnboarding nếu cần
      const res = await startOnboarding(userData, shopifyUrl);
      console.log("Onboarding result:", res);
      alert(JSON.stringify(res));
    } catch (err) {
      console.error("Onboarding error:", err);
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
