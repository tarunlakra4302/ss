import Link from "next/link";

export default function EventSuccessPage({
  searchParams,
}: {
  searchParams: { type?: string; amount?: string; paymentId?: string };
}) {
  const isTicket = searchParams.type === "ticket";
  const amount = searchParams.amount;
  const paymentId = searchParams.paymentId;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1f3d] px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
        <div className="text-6xl mb-5">{isTicket ? "🎟️" : "🌱"}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isTicket ? "You're In!" : "Thank You!"}
        </h1>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {isTicket
            ? `Your ticket is confirmed. We'll see you at the Spring Market 2026! A confirmation has been sent to your email.`
            : `Your donation of ₹${amount} has been received. Every rupee goes directly to our community and impact projects.`}
        </p>
        {paymentId && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Payment ID: {paymentId}
          </p>
        )}
        <Link
          href="/"
          className="inline-block bg-[#0f1f3d] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          Back to Sustainable Sundays
        </Link>
        <p className="mt-6 text-xs text-gray-400">
          🍃 Powered by Sustainable Sundays
        </p>
      </div>
    </main>
  );
}
