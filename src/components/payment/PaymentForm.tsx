import { OrderSummary } from "./OrderSummary";
import { PaymentAccordion } from "./PaymentAccordion";
import type { Order, SavedCard, PaymentMethod } from "./types";

interface PaymentFormProps {
  order?: Order;
  savedCards?: SavedCard[];
  onPaymentSubmit?: (method: PaymentMethod, data?: unknown) => void;
}

const defaultOrder: Order = {
  orderNumber: "#78234",
  items: [{ name: "Премиум подписка", quantity: 1, price: 1990 }],
  total: 1990,
};

const defaultSavedCards: SavedCard[] = [
  {
    id: "1",
    last4: "4242",
    brand: "visa",
    expiry: "12/25",
  },
];

export function PaymentForm({
  order = defaultOrder,
  savedCards = defaultSavedCards,
  onPaymentSubmit,
}: PaymentFormProps) {
  const handleSubmit = (method: PaymentMethod, data?: unknown) => {
    console.log("Payment submitted:", { method, data });
    onPaymentSubmit?.(method, data);
  };

  return (
    <div
      className="flex h-full flex-col bg-gray-50 px-3 py-6"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      {/* Header */}
      <div className="mb-3 pt-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Оплата</h1>
      </div>

      {/* Order Summary */}
      <OrderSummary order={order} />

      {/* Payment Methods */}
      <div className="flex-1 overflow-y-auto">
        <p className="mb-2 text-sm font-medium text-gray-500">Способ оплаты</p>
        <PaymentAccordion savedCards={savedCards} onSubmit={handleSubmit} />
      </div>

      {/* Footer */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          Нажимая кнопку оплаты, вы соглашаетесь с{" "}
          <a href="#" className="text-gray-900 hover:underline">
            условиями сервиса
          </a>
        </p>
      </div>
    </div>
  );
}
