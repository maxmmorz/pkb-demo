import { Iphone } from "@/components";
import { CheckCircle } from "lucide-react";

const Success = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-900">
      <div className="h-screen py-4">
        <Iphone className="h-full w-auto">
          <div
            className="flex h-full flex-col items-center justify-center bg-gray-50 px-6"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <div className="mb-6 animate-[scale-in_0.3s_ease-out]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-semibold text-gray-900">Оплата прошла успешно</h1>
            <p className="text-center text-gray-500">
              Спасибо за покупку! Детали заказа отправлены на вашу почту.
            </p>
          </div>
        </Iphone>
      </div>
    </div>
  );
};

export default Success;
