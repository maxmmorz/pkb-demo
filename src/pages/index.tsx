import { Iphone } from "@/components";
import { PaymentForm } from "@/components/payment";

const Home = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-900">
      <div className="h-screen py-4">
        <Iphone className="h-full w-auto">
          <PaymentForm />
        </Iphone>
      </div>
    </div>
  );
};

export default Home;
