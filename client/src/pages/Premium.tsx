// frontend/pages/Premium.tsx
import { MainLayout } from "../components/MainLayout";

export const Premium = () => {
  return (
    <MainLayout>
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-4">Upgrade to Bird App Blue</h1>
        <p className="text-lg mb-8">
          Enjoy exclusive features and support Bird App by upgrading to one of
          our premium plans.
        </p>
        <div className="flex flex-col lg:flex-row justify-center items-center space-y-8 lg:space-y-0 lg:space-x-8">
          <PricingCard
            title="Basic Plan"
            price="$5/month"
            features={[
              "Ad-free experience",
              "Custom themes",
              "Priority support",
            ]}
          />
          <PricingCard
            title="Pro Plan"
            price="$10/month"
            features={[
              "All features of Basic",
              "Advanced analytics",
              "Early access to new features",
            ]}
          />
          <PricingCard
            title="Elite Plan"
            price="$20/month"
            features={[
              "All features of Pro",
              "Dedicated account manager",
              "Exclusive beta testing",
            ]}
          />
        </div>
      </div>
    </MainLayout>
  );
};

const PricingCard = ({
  title,
  price,
  features,
}: {
  title: string;
  price: string;
  features: string[];
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full lg:w-1/4 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-2xl font-bold mb-4">{price}</p>
      <ul className="text-left mb-6">
        {features.map((feature, index) => (
          <li key={index} className="mb-2">
            {feature}
          </li>
        ))}
      </ul>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300">
        Upgrade Now
      </button>
    </div>
  );
};
