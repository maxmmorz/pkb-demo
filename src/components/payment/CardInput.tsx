import { useState, useRef, useEffect } from "react";

interface CardInputProps {
  onChange?: (data: { number: string; expiry: string; cvc: string; isComplete: boolean }) => void;
  autoFocus?: boolean;
}

export function CardInput({ onChange, autoFocus }: CardInputProps) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [currentField, setCurrentField] = useState<"number" | "expiry" | "cvc">("number");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const isNumberComplete = number.replace(/\s/g, "").length === 16;
  const isExpiryComplete = expiry.length === 5;
  const isCvcComplete = cvc.length === 3;
  const isComplete = isNumberComplete && isExpiryComplete && isCvcComplete;

  useEffect(() => {
    onChange?.({ number, expiry, cvc, isComplete });
  }, [number, expiry, cvc, isComplete, onChange]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const getDisplayValue = () => {
    if (currentField === "number") {
      return number;
    }
    if (currentField === "expiry") {
      const maskedNumber = number.slice(-4);
      return `•••• ${maskedNumber}  ${expiry}`;
    }
    if (currentField === "cvc") {
      const maskedNumber = number.slice(-4);
      return `•••• ${maskedNumber}  ${expiry}  ${cvc}`;
    }
    return "";
  };

  const getPlaceholder = () => {
    if (currentField === "number") return "0000 0000 0000 0000";
    if (currentField === "expiry") return "MM/ГГ";
    if (currentField === "cvc") return "CVC";
    return "";
  };

  const getFieldLabel = () => {
    if (currentField === "number") return "Номер карты";
    if (currentField === "expiry") return "Срок";
    if (currentField === "cvc") return "CVC";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (currentField === "number") {
      const formatted = formatCardNumber(rawValue);
      setNumber(formatted);
      if (formatted.replace(/\s/g, "").length === 16) {
        setCurrentField("expiry");
      }
    } else if (currentField === "expiry") {
      // Extract just the expiry part from the display
      const parts = rawValue.split("  ");
      const expiryPart = parts[1] || "";
      const formatted = formatExpiry(expiryPart);
      setExpiry(formatted);
      if (formatted.length === 5) {
        setCurrentField("cvc");
      }
    } else if (currentField === "cvc") {
      const parts = rawValue.split("  ");
      const cvcPart = parts[2] || "";
      const digits = cvcPart.replace(/\D/g, "").slice(0, 3);
      setCvc(digits);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (currentField === "cvc" && cvc === "") {
        e.preventDefault();
        setCurrentField("expiry");
      } else if (currentField === "expiry") {
        // Handle backspace in expiry field
        if (expiry === "" || expiry === "/") {
          e.preventDefault();
          setExpiry("");
          setCurrentField("number");
        } else if (expiry.length <= 3) {
          // If we have "MM/" or less, clear and go back
          e.preventDefault();
          const digits = expiry.replace(/\D/g, "");
          if (digits.length <= 1) {
            setExpiry("");
            setCurrentField("number");
          } else {
            setExpiry(digits.slice(0, -1));
          }
        }
      }
    }
  };

  const detectCardBrand = () => {
    const digits = number.replace(/\s/g, "");
    if (digits.startsWith("4")) return "visa";
    if (digits.startsWith("5") || digits.startsWith("2")) return "mastercard";
    if (digits.startsWith("22")) return "mir";
    return null;
  };

  const brand = detectCardBrand();

  return (
    <div className="space-y-2">
      <div className="relative flex items-center gap-3">
        <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white px-3 py-3.5 transition-all focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-300 focus:outline-none"
            placeholder={getPlaceholder()}
            value={getDisplayValue()}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <span className="ml-2 shrink-0 text-xs font-medium text-gray-400">{getFieldLabel()}</span>
        </div>

        {isComplete && (
          <div className="flex items-center gap-2">
            {brand === "visa" ? (
              <svg className="h-6 w-8" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#1A1F71" />
                <path d="M13.5 13.5L14.8 6.5H16.8L15.5 13.5H13.5Z" fill="white" />
                <path
                  d="M21.3 6.7C20.9 6.5 20.2 6.3 19.4 6.3C17.4 6.3 16 7.3 16 8.7C16 9.8 17 10.3 17.8 10.7C18.6 11 18.9 11.3 18.9 11.6C18.9 12.1 18.3 12.3 17.7 12.3C16.9 12.3 16.4 12.2 15.7 11.9L15.4 11.8L15.1 13.5C15.6 13.7 16.5 13.9 17.5 13.9C19.6 13.9 21 12.9 21 11.4C21 10.5 20.4 9.9 19.2 9.3C18.5 9 18.1 8.7 18.1 8.4C18.1 8.1 18.5 7.8 19.2 7.8C19.8 7.8 20.3 7.9 20.6 8L20.8 8.1L21.3 6.7Z"
                  fill="white"
                />
                <path
                  d="M24.5 6.5H23C22.5 6.5 22.1 6.6 21.9 7.1L19 13.5H21.1L21.5 12.3H24.1L24.3 13.5H26.2L24.5 6.5ZM22.1 10.7L23 8.3L23.5 10.7H22.1Z"
                  fill="white"
                />
                <path
                  d="M11.7 6.5L9.7 11.2L9.5 10.2C9 8.8 7.7 7.3 6.2 6.5L8 13.5H10.1L13.8 6.5H11.7Z"
                  fill="white"
                />
                <path
                  d="M7.8 6.5H4.5L4.5 6.7C7 7.3 8.7 8.8 9.4 10.5L8.6 7.1C8.5 6.7 8.2 6.5 7.8 6.5Z"
                  fill="#F9A533"
                />
              </svg>
            ) : brand === "mastercard" ? (
              <svg className="h-6 w-8" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#000" />
                <circle cx="12" cy="10" r="6" fill="#EB001B" />
                <circle cx="20" cy="10" r="6" fill="#F79E1B" />
                <path d="M16 5.3a6 6 0 0 0 0 9.4 6 6 0 0 0 0-9.4z" fill="#FF5F00" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Field progress indicator */}
      {!isComplete && (
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className={isNumberComplete ? "text-green-500" : ""}>
            {isNumberComplete ? "✓" : "○"} Номер
          </span>
          <span className={isExpiryComplete ? "text-green-500" : ""}>
            {isExpiryComplete ? "✓" : "○"} Срок
          </span>
          <span className={isCvcComplete ? "text-green-500" : ""}>
            {isCvcComplete ? "✓" : "○"} CVC
          </span>
        </div>
      )}
    </div>
  );
}
