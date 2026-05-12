import Link from "next/link";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const amount = params["amount"];
  const paymentId = params["paymentId"];
  // Backward compat: also check the old Payment Pages query params
  const legacyPaymentId = params["razorpay_payment_id"];
  const legacyStatus = params["razorpay_payment_link_status"];

  const resolvedPaymentId = paymentId || legacyPaymentId;
  // SDK flow always has amount+paymentId; legacy flow checks status=paid
  const isSuccess = amount ? true : legacyStatus === "paid";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1f3d] px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        {isSuccess ? (
          <>
            <div className="text-6xl mb-5">🌱</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Thank You for Your Support!
            </h1>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {amount ? (
                <>
                  Your donation of{" "}
                  <span className="font-semibold text-green-600">₹{amount}</span>{" "}
                  has been received.
                </>
              ) : (
                <>Your donation has been received.</>
              )}{" "}
              Seeds are going in the ground and tools are in the hands of our
              weekend volunteers — because of you.
            </p>
            {resolvedPaymentId && (
              <p className="text-xs text-gray-400 mb-6 font-mono">
                Payment ID: {resolvedPaymentId}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="text-6xl mb-5">🌿</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Incomplete
            </h1>
            <p className="text-gray-600 mb-6">
              It looks like the payment didn&apos;t go through. No amount was
              deducted. Please try again.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          {!isSuccess && (
            <Link
              href="/#donate"
              className="inline-block bg-[#0f1f3d] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Try Again
            </Link>
          )}
          <Link
            href="/"
            className="inline-block border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition"
          >
            Back to Sustainable Sundays
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          🍃 Powered by Sustainable Sundays
        </p>
      </div>
    </main>
  );
}
