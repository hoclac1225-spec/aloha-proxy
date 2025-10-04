import { redirect } from "@remix-run/node";

export const action = async ({ request }) => {
  const form = await request.formData();
  const shop = form.get("shop");
  if (!shop) throw new Response("Missing shop", { status: 400 });
  return redirect(/auth?shop=);
};
