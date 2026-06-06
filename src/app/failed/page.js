"use client";
import Link from "next/link";

const Page =()=> {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

        <div className="text-6xl mb-4">❌</div>

        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment could not be completed. This may happen if:
        </p>

        <ul className="text-left text-gray-700 bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
          <li>• Payment was cancelled.</li>
          <li>• Insufficient balance.</li>
          <li>• Network interruption occurred.</li>
          <li>• Transaction timed out.</li>
        </ul>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}
export default Page