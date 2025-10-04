// app/routes/index.jsx
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { startOnboarding } from "../../src/js/onboarding.js"; // nÃƒÂ¡Ã‚ÂºÃ‚Â¿u file thÃƒÂ¡Ã‚Â»Ã‚Â±c sÃƒÂ¡Ã‚Â»Ã‚Â± ÃƒÂ¡Ã‚Â»Ã…Â¸ src/js

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
      name: "LÃƒÂ¡Ã‚ÂºÃ‚Â¡c HÃƒÂ¡Ã‚Â»Ã‚Âc",
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
      alert("CÃƒÆ’Ã‚Â³ lÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i xÃƒÂ¡Ã‚ÂºÃ‚Â£y ra khi onboarding!");
    }
  };

  return (
    <div>
      <h1>Shopify App Ãƒâ€žÃ¢â‚¬Ëœang chÃƒÂ¡Ã‚ÂºÃ‚Â¡y!</h1>
      <p>App URL: {shopifyUrl}</p>
      <button onClick={handleOnboard}>BÃƒÂ¡Ã‚ÂºÃ‚Â¯t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u Onboarding</button>
    </div>
  );
}
