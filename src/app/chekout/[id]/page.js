import React from "react";
import axios from "axios";

const Page = ({ params }) => {
  const orderId = params.id;
  const payWithKhalti = async () => {
    const res = await axios.post("/api/payment/khalti/initiate", { orderId });
    window.location.href = res.data.payment_url;
  };
  return (
    <div className="max-w-full mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">choose payment Method</h1>
      <button
        className="w--full p-4 bg-purple-600 text-white rounded-lg mt-4"
        onClick={payWithKhalti}
      >
        Pay with Khalti
      </button>
      <form
        action="https://rc-epay.esewa.com.np/epay/main/v2/form"
        method="PoST"
      >
        <input type="hidden" name="transaction_uuid" value={orderId} />
        <button
          type="submit"
          className="w-full p-4 bg-green-600 text-white rounded-lg"
        >
          Pay with eSewa
        </button>
      </form>
    </div>
  );
};
export default Page;
