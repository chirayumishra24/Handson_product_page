"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gift, Lock, PartyPopper, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/lib/useHydrated";
import { formatINR } from "@/lib/format";
import Burst from "@/components/store/Burst";
import { placeOrder, type CheckoutField, type CheckoutState } from "./actions";

const initialState: CheckoutState = { status: "idle" };

// Shown under the total. Change this once online payment (e.g. Razorpay) is set up.
const PAYMENT_NOTE =
  "No payment is taken on this page. We'll call or message you on this number to confirm your order, delivery and payment.";

const inputClass =
  "clay-pressed w-full rounded-2xl bg-panel-muted px-4 py-3 text-base font-semibold text-ink placeholder:font-medium placeholder:text-ink-muted/80 focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-create";

function Field({
  name,
  label,
  error,
  hint,
  className = "",
  ...input
}: {
  name: CheckoutField;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="font-display font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass}
        {...input}
      />
      {hint && (
        <p id={`${name}-hint`} className="text-sm font-medium text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm font-bold text-create-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutClient() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [gift, setGift] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const v = state.values ?? {};
  const e = state.errors ?? {};
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const cartPayload = JSON.stringify(items.map((i) => ({ id: i.product.id, quantity: i.quantity })));

  // After a failed submit, move focus to the first field with an error.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;
    const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]");
    first?.focus();
  }, [state]);

  // On success the long form collapses into a short card, so bring the
  // confirmation into view (phones would otherwise be left at the footer).
  useEffect(() => {
    if (state.status !== "success") return;
    clearCart();
    window.scrollTo({ top: 0 });
    doneRef.current?.focus();
  }, [state.status, clearCart]);

  if (state.status === "success") {
    return (
      <div className="clay relative mx-auto max-w-xl rounded-[36px] bg-panel px-6 py-12 text-center sm:px-10">
        <span className="clay relative mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-sun text-ink">
          <PartyPopper className="h-10 w-10" strokeWidth={2.25} aria-hidden="true" />
          <Burst fire={1} />
        </span>
        <h1 ref={doneRef} tabIndex={-1} className="mt-6 font-display text-4xl font-bold text-ink focus:outline-none">
          Order Received!
        </h1>
        <p className="mt-3 font-medium text-ink-muted">
          Your order number is{" "}
          <strong className="whitespace-nowrap font-display text-ink" translate="no">
            {state.orderId}
          </strong>
          . We&apos;ll be in touch soon to confirm delivery and payment.
        </p>
        <Link
          href="/#kits"
          className="clay mt-8 inline-flex min-h-12 items-center rounded-[22px] bg-accent px-7 font-display text-lg font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
        >
          Back to Kits
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return <div className="clay h-96 animate-pulse rounded-[32px] bg-panel" aria-label="Loading your cart" />;
  }

  if (items.length === 0) {
    return (
      <div className="clay mx-auto max-w-xl rounded-[36px] bg-panel px-6 py-12 text-center">
        <span className="clay animate-float mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-sun text-ink">
          <ShoppingBag className="h-9 w-9" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 font-medium text-ink-muted">Pick a kit first, then come back to check out.</p>
        <Link
          href="/#kits"
          className="clay mt-6 inline-flex min-h-12 items-center rounded-[22px] bg-accent px-7 font-display text-lg font-semibold text-on-accent"
        >
          Browse Kits
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/#kits"
        className="clay-sm inline-flex min-h-11 items-center gap-1.5 rounded-full bg-panel px-4 font-display text-sm font-semibold text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" /> Keep Shopping
      </Link>
      <h1 className="mt-6 font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">
        Checkout
      </h1>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Order summary: first on phones so shoppers see what they're buying. */}
        <aside aria-labelledby="summary-title" className="clay rounded-[30px] bg-panel p-5 sm:p-6 lg:sticky lg:top-28 lg:order-2 lg:col-span-5">
          <h2 id="summary-title" className="font-display text-xl font-bold text-ink">
            Your Order <span className="text-base font-semibold text-ink-muted">({count} {count === 1 ? "item" : "items"})</span>
          </h2>
          <ul className="mt-4 grid gap-3">
            {items.map((i) => (
              <li key={i.product.id} className="flex items-center gap-3">
                <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-panel-muted">
                  <Image
                    src={i.product.images.realistic || i.product.images.stylized || ""}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display font-semibold text-ink">{i.product.name}</span>
                  <span className="text-sm font-semibold tabular-nums text-ink-muted">Qty {i.quantity}</span>
                </span>
                <span className="font-display font-semibold tabular-nums text-ink">
                  {formatINR(i.product.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-line pt-4">
            <span className="font-semibold text-ink-muted">Subtotal</span>
            <span className="font-display text-2xl font-bold tabular-nums text-ink">{formatINR(subtotal)}</span>
          </div>
          <p className="mt-3 flex gap-2 text-sm font-medium text-ink-muted">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            {PAYMENT_NOTE}
          </p>
        </aside>

        <form ref={formRef} action={formAction} noValidate className="grid gap-6 lg:order-1 lg:col-span-7">
          <input type="hidden" name="cart" value={cartPayload} />

          <fieldset className="clay grid gap-5 rounded-[30px] bg-panel p-5 sm:grid-cols-2 sm:p-6">
            <legend className="sr-only">Contact details</legend>
            <h2 className="font-display text-xl font-bold text-ink sm:col-span-2" aria-hidden="true">
              Who&apos;s it for?
            </h2>
            <Field
              name="name"
              label="Full name"
              autoComplete="name"
              defaultValue={v.name}
              error={e.name}
              placeholder="e.g. Ananya Rao…"
              className="sm:col-span-2"
              required
            />
            <Field
              name="phone"
              label="Mobile number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              defaultValue={v.phone}
              error={e.phone}
              placeholder="98765 43210…"
              hint="We'll use this to confirm your order."
              required
            />
            <Field
              name="email"
              label="Email (optional)"
              type="email"
              autoComplete="email"
              spellCheck={false}
              defaultValue={v.email}
              error={e.email}
              placeholder="you@example.com…"
            />
          </fieldset>

          <fieldset className="clay grid gap-5 rounded-[30px] bg-panel p-5 sm:grid-cols-2 sm:p-6">
            <legend className="sr-only">Delivery address</legend>
            <h2 className="font-display text-xl font-bold text-ink sm:col-span-2" aria-hidden="true">
              Where should it go?
            </h2>
            <Field
              name="address"
              label="House, street and area"
              autoComplete="street-address"
              defaultValue={v.address}
              error={e.address}
              placeholder="Flat 4B, Green Park Society, MG Road…"
              className="sm:col-span-2"
              required
            />
            <Field name="city" label="City" autoComplete="address-level2" defaultValue={v.city} error={e.city} required />
            <Field name="state" label="State" autoComplete="address-level1" defaultValue={v.state} error={e.state} required />
            <Field
              name="pincode"
              label="Pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              defaultValue={v.pincode}
              error={e.pincode}
              placeholder="560001…"
              required
            />
          </fieldset>

          <fieldset className="clay grid gap-4 rounded-[30px] bg-panel p-5 sm:p-6">
            <legend className="sr-only">Gift options</legend>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 font-display text-lg font-semibold text-ink">
              <input
                type="checkbox"
                name="gift"
                defaultChecked={v.gift === "on"}
                onChange={(ev) => setGift(ev.target.checked)}
                className="h-6 w-6 shrink-0 accent-[var(--create)]"
              />
              <Gift className="h-5 w-5 text-create-ink" strokeWidth={2.5} aria-hidden="true" />
              This is a gift
            </label>
            {(gift || v.gift === "on") && (
              <div className="flex flex-col gap-2">
                <label htmlFor="giftMessage" className="font-display font-semibold text-ink">
                  Gift message (optional)
                </label>
                <textarea
                  id="giftMessage"
                  name="giftMessage"
                  rows={3}
                  maxLength={150}
                  defaultValue={v.giftMessage}
                  aria-invalid={e.giftMessage ? true : undefined}
                  aria-describedby="giftMessage-hint"
                  placeholder="Happy birthday, Kabir! Time to start your first business…"
                  className={inputClass}
                />
                <p id="giftMessage-hint" className="text-sm font-medium text-ink-muted">
                  Up to 150 characters.
                </p>
              </div>
            )}
          </fieldset>

          {state.formError && (
            <p role="alert" className="clay-sm rounded-2xl bg-create-soft px-4 py-3 font-bold text-create-ink">
              {state.formError}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="clay min-h-14 w-full rounded-[22px] bg-accent font-display text-lg font-semibold text-on-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Placing Order…" : `Place Order (${formatINR(subtotal)})`}
          </button>
        </form>
      </div>
    </>
  );
}
