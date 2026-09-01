
"use client";

import dynamic from "next/dynamic";

const DeliveryMapClient = dynamic(
  () => import("./DeliveryMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] flex items-center justify-center rounded-xl bg-card border border-border">
        <p className="text-muted">
          Loading delivery map...
        </p>
      </div>
    ),
  }
);

const DeliveryMap = ({
  farmerLocation,
  customerLocation,
  orderId,
}) => {
  return (
    <DeliveryMapClient
      key={orderId}
      farmerLocation={farmerLocation}
      customerLocation={customerLocation}
    />
  );
};

export default DeliveryMap;

