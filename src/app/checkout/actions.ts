"use server";
import { products } from "@/data/products";

export type CheckoutField = "name" | "phone" | "email" | "address" | "city" | "state" | "pincode" | "giftMessage";

export type CheckoutState = {
  status: "idle" | "error" | "success";
  errors?: Partial<Record<CheckoutField, string>>;
  formError?: string;
  values?: Partial<Record<CheckoutField | "gift", string>>;
  orderId?: string;
};

type OrderLine = { id: string; name: string; unitPrice: number; quantity: number };

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function placeOrder(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  const values = {
    name: text(fd, "name"),
    phone: text(fd, "phone").replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""),
    email: text(fd, "email"),
    address: text(fd, "address"),
    city: text(fd, "city"),
    state: text(fd, "state"),
    pincode: text(fd, "pincode"),
    gift: fd.get("gift") === "on" ? "on" : "",
    giftMessage: text(fd, "giftMessage"),
  };

  const errors: CheckoutState["errors"] = {};
  if (values.name.length < 2) errors.name = "Enter the full name for delivery.";
  if (!/^[6-9]\d{9}$/.test(values.phone)) errors.phone = "Enter a 10-digit mobile number, like 98765 43210.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Check the email address, or leave it empty.";
  if (values.address.length < 8) errors.address = "Add the house number, street and area.";
  if (values.city.length < 2) errors.city = "Enter the city.";
  if (values.state.length < 2) errors.state = "Enter the state.";
  if (!/^[1-9]\d{5}$/.test(values.pincode)) errors.pincode = "Enter a 6-digit pincode.";
  if (values.giftMessage.length > 150) errors.giftMessage = "Keep the gift message under 150 characters.";

  // Never trust prices from the browser: rebuild the order from the catalogue.
  let lines: OrderLine[] = [];
  try {
    const raw = JSON.parse(text(fd, "cart") || "[]") as { id: string; quantity: number }[];
    lines = raw.flatMap(({ id, quantity }) => {
      const p = products.find((x) => x.id === id);
      const qty = Math.floor(Number(quantity));
      return p && p.inStock && qty > 0 && qty <= 20
        ? [{ id: p.id, name: p.name, unitPrice: p.price, quantity: qty }]
        : [];
    });
  } catch {
    lines = [];
  }
  if (!lines.length) return { status: "error", values, formError: "Your cart is empty. Add a kit before checking out." };
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const orderId = `TP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const order = {
    orderId,
    placedAt: new Date().toISOString(),
    customer: { name: values.name, phone: values.phone, email: values.email || null },
    shipping: { address: values.address, city: values.city, state: values.state, pincode: values.pincode },
    gift: values.gift ? { message: values.giftMessage || null } : null,
    lines,
    subtotal: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
  };

  // Orders go to ORDER_WEBHOOK_URL (Google Apps Script, Zapier, Make, Slack, your API...).
  // Without it, development logs the order; production refuses rather than losing it.
  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("Order webhook failed", err);
      return {
        status: "error",
        values,
        formError: "We couldn't send your order just now. Please try again in a minute.",
      };
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("ORDER_WEBHOOK_URL is not set; refusing order", orderId);
    return {
      status: "error",
      values,
      formError: "Online ordering isn't switched on yet. Please check back soon.",
    };
  } else {
    console.info("[dev] New order (set ORDER_WEBHOOK_URL to deliver it):", JSON.stringify(order, null, 2));
  }

  return { status: "success", orderId };
}
