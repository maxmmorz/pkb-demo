import { useState, useRef, useEffect } from "react";
import { ChevronDown, Phone, CreditCard, Smartphone } from "lucide-react";
import type { PaymentMethod, SavedCard } from "./types";
import { CardInput } from "./CardInput";

interface PaymentAccordionProps {
  savedCards: SavedCard[];
  onMethodSelect?: (method: PaymentMethod) => void;
  onSubmit?: (method: PaymentMethod, data?: unknown) => void;
}

export function PaymentAccordion({ savedCards, onMethodSelect, onSubmit }: PaymentAccordionProps) {
  const [openMethod, setOpenMethod] = useState<PaymentMethod | null>("kasi");
  const [selectedCardId, setSelectedCardId] = useState<string | "new">("new");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isNewCardValid, setIsNewCardValid] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openMethod === "phone") {
      setTimeout(() => phoneInputRef.current?.focus(), 50);
    }
  }, [openMethod]);

  const toggleMethod = (method: PaymentMethod) => {
    const newMethod = openMethod === method ? null : method;
    setOpenMethod(newMethod);
    if (newMethod) {
      onMethodSelect?.(newMethod);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9)
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  };

  const methods: { id: PaymentMethod; label: string; commission: string; icon: React.ReactNode }[] =
    [
      {
        id: "kasi",
        label: "Kaspi",
        commission: "Без комиссии",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F14635] text-xs font-bold text-white">
            K
          </div>
        ),
      },
      {
        id: "apple",
        label: "Apple Pay",
        commission: "+ 80 ₸",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </div>
        ),
      },
      {
        id: "card",
        label: "Карты",
        commission: "+ 80 ₸",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
            <CreditCard className="h-5 w-5 text-gray-600" />
          </div>
        ),
      },
      {
        id: "phone",
        label: "Оплата по телефону",
        commission: "+ 2.7%",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
            <Smartphone className="h-5 w-5 text-gray-600" />
          </div>
        ),
      },
    ];

  const renderContent = (method: PaymentMethod) => {
    switch (method) {
      case "kasi":
        return (
          <button
            onClick={() => onSubmit?.("kasi")}
            className="w-full rounded-xl bg-[#F14635] py-3.5 font-semibold text-white transition-all hover:bg-[#D93D2E] active:scale-[0.98]"
          >
            Оплатить через Kaspi
          </button>
        );

      case "apple":
        return (
          <button
            onClick={() => onSubmit?.("apple")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 font-semibold text-white transition-all hover:bg-gray-900 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Pay
          </button>
        );

      case "card":
        return (
          <div className="space-y-3">
            <div
              onClick={() => setSelectedCardId("new")}
              className={`cursor-pointer rounded-xl border-2 p-2.5 transition-all ${
                selectedCardId === "new"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="card"
                  value="new"
                  checked={selectedCardId === "new"}
                  onChange={() => setSelectedCardId("new")}
                  className="sr-only"
                />
                <span className="text-gray-900">Новая карта</span>
              </div>
              {selectedCardId === "new" && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <CardInput
                    onChange={(data) => setIsNewCardValid(data.isComplete)}
                    autoFocus={openMethod === "card"}
                  />
                </div>
              )}
            </div>

            {savedCards.map((card) => (
              <label
                key={card.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-2.5 transition-all ${
                  selectedCardId === card.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="card"
                  value={card.id}
                  checked={selectedCardId === card.id}
                  onChange={() => setSelectedCardId(card.id)}
                  className="sr-only"
                />
                <div className="flex flex-1 items-center gap-2">
                  {card.brand === "visa" && (
                    <svg className="h-4 w-6" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="#1A1F71" />
                      <path d="M13.5 13.5L14.8 6.5H16.8L15.5 13.5H13.5Z" fill="white" />
                    </svg>
                  )}
                  {card.brand === "mastercard" && (
                    <svg className="h-4 w-6" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="#000" />
                      <circle cx="12" cy="10" r="5" fill="#EB001B" />
                      <circle cx="20" cy="10" r="5" fill="#F79E1B" />
                    </svg>
                  )}
                  <span className="text-gray-900">•••• {card.last4}</span>
                </div>
                <span className="text-sm text-gray-400">{card.expiry}</span>
              </label>
            ))}

            <button
              onClick={() => onSubmit?.("card", { cardId: selectedCardId })}
              disabled={selectedCardId === "new" && !isNewCardValid}
              className="mt-4 w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Оплатить картой
            </button>
          </div>
        );

      case "phone":
        return (
          <div className="space-y-3">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 transition-all focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
              <Phone className="mr-3 h-5 w-5 text-gray-400" />
              <input
                ref={phoneInputRef}
                type="tel"
                inputMode="numeric"
                placeholder="+7 (___) ___-__-__"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-300 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-400">Сумма будет списана с баланса телефона</p>
            <button
              onClick={() => onSubmit?.("phone", { phone: phoneNumber })}
              disabled={phoneNumber.replace(/\D/g, "").length !== 11}
              className="w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Оплатить с баланса
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {methods.map((method) => (
        <div key={method.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            onClick={() => toggleMethod(method.id)}
            className="flex w-full items-center gap-3 px-3 py-4 text-left transition-colors hover:bg-gray-50"
          >
            {method.icon}
            <div className="flex-1">
              <span className="font-medium text-gray-900">{method.label}</span>
              <span
                className={`ml-2 text-xs ${method.id === "kasi" ? "text-green-600" : "text-gray-400"}`}
              >
                {method.commission}
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                openMethod === method.id ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-200 ease-out ${
              openMethod === method.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-gray-100 px-3 py-4">{renderContent(method.id)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
