import type { Order } from "./types";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("kk-KZ", {
      style: "currency",
      currency: "KZT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mb-4 rounded-2xl bg-gray-50 px-3 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Заказ {order.orderNumber}</span>
      </div>

      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">
              {item.name}
              {item.quantity > 1 && <span className="ml-1 text-gray-400">× {item.quantity}</span>}
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">Итого</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
