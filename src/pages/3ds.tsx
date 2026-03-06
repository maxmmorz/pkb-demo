import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Iphone } from "@/components";
import { ShieldCheck } from "lucide-react";

const ThreeDS = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      navigate("/success");
    }
  }, [code, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gray-900">
      <div className="h-screen py-4">
        <Iphone className="h-full w-auto">
          <div
            className="flex h-full flex-col bg-gray-50 px-6 py-8"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <ShieldCheck className="h-9 w-9 text-blue-600" strokeWidth={1.5} />
              </div>

              <h1 className="mb-2 text-xl font-semibold text-gray-900">Подтверждение оплаты</h1>
              <p className="mb-8 text-center text-sm text-gray-500">
                Введите код подтверждения из SMS
              </p>

              <div className="flex gap-3" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-14 w-14 rounded-xl border-2 border-gray-200 bg-white text-center text-2xl font-semibold text-gray-900 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  />
                ))}
              </div>

              <p className="mt-6 text-xs text-gray-400">Код отправлен на номер •••• 1234</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400">Защищено технологией 3D Secure</p>
            </div>
          </div>
        </Iphone>
      </div>
    </div>
  );
};

export default ThreeDS;
