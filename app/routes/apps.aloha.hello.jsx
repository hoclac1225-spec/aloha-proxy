import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "Proxy connected thành công 🚀" });
}
