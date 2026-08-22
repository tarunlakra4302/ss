"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Calendar, 
  Share2, 
  User, 
  MapPin, 
  Ticket, 
  Heart, 
  Plus, 
  Minus, 
  Clock, 
  Music, 
  GlassWater,
  ChevronRight,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useRouter, useSearchParams } from "next/navigation";
import { EventSuccessView } from "@/components/EventSuccessView";

interface EventDetailProps {
  slug?: string;
}

const EVENTS_DATA: Record<string, any> = {
  "edible-gardening-workshop": {
    title: "Edible Gardening Workshop",
    location: "Pure & Sure Organic Cafe & Store",
    subLocation: "Jayanagar, Bangalore",
    date: "August 23, 2026",
    time: "10:00 AM – 01:00 PM",
    heroImage: "/edible-gardening-workshop.png",
    description: "Wanting to grow your own fresh vegetables and leafy greens at home? Even with limited space, be it balcony, terrace or small backyard. You can make it happen. This workshop will show you how!",
    narrative: "Join us for the Edible Gardening Workshop by Barani Muthukumaran and learn soil ecology, moon phases, companion planting, beneficial insects & more, all in one hands-on session. Take home up to 10 heirloom seed varieties!",
    expectations: [
      { emoji: "🌱", label: "Soil Ecology" },
      { emoji: "🌕", label: "Moon Phases & Planting" },
      { emoji: "🌿", label: "Companion Planting" },
      { emoji: "🎁", label: "10 Heirloom Seed Varieties" }
    ],
    tickets: [
      { label: "₹700 per Adult", price: 700 }
    ],
    summary: "Edible Gardening Workshop by Barani Muthukumaran",
    ticketTime: "Sunday Aug 23, 2026 @ 10am IST"
  },
  "sustainable-market": {
    title: "Sustainable Market",
    location: "Town Square",
    subLocation: "Market District",
    date: "May 30, 2026",
    time: "09:00 AM – 06:00 PM",
    heroImage: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop",
    description: "Join us for a vibrant gathering of eco-conscious creators, local farmers, and sustainable brands. Discover unique products, learn about zero-waste living, and support a greener future.",
    narrative: "Sustainable Sundays is proud to present our annual Market. This year, we're bringing together over 50 local vendors who share our commitment to the planet.",
    expectations: [
      { emoji: "🌿", label: "Artisanal Crafts" },
      { emoji: "🍎", label: "Organic Produce" },
      { emoji: "🎨", label: "DIY Workshops" },
      { emoji: "🎶", label: "Acoustic Sets" }
    ],
    tickets: [
      { label: "₹50 Online", price: 50 },
      { label: "₹60 At the Door", price: 60 }
    ],
    summary: "Sustainable Sundays x Local Artisans: Spring Market 2026",
    ticketTime: "Saturday May 30, 2026 @ 9am EDT"
  },
  "plogging": {
    title: "Plogging",
    location: "Cubbon Park, KA",
    subLocation: "",
    date: "September 27, 2026",
    time: "07:00 PM – 11:00 PM",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuClS9sW-O-mUHSHPzz3U-wOzQaIf5qtdOiwmw5USaMmnpmqI7x72jmnAcT3kIqeh6r0o7BMJarYqDvi1-P5U2N52Ln3R6qh519LIf13Dhbh91Wtt5LKhCbojLTyGwcTCqZHW47bH956BebYT-kB3esrg996Z3_1IrS_-rx6361_dQekB6LSXr1rx_FCloW9ejzcmHwxPDu1mTUeR1AI63gZl9XkL9oInpEByUOmFkDe6QIuwFV9F2RzTKwnNKRDZWOWCeaVCwFXFv8",
    description: "We're thrilled to host the Sustainable Sundays fundraising party! Join us for an evening of impact as we celebrate our community and raise vital funds for cancer patients worldwide.",
    narrative: "Sustainable Sundays is a non-profit organization dedicated to improving cancer care in developing nations. Every ticket sold directly supports the mission to provide essential equipment and training to medical centers where resources are most needed.",
    expectations: [
      { emoji: "🪩", label: "Live Music & Dancing" },
      { emoji: "🍸", label: "Signature Cocktails" }
    ],
    tickets: [
      { label: "₹30 Online", price: 30 },
      { label: "₹35 At the Door", price: 35 }
    ],
    summary: "Sustainable Sundays x ASRT Foundation: Fundraising Party at ASTRO 2026",
    ticketTime: "Sunday Sep 27, 2026 @ 7pm EDT"
  }
};

export function EventDetail({ slug }: EventDetailProps) {
  const [ticketCount, setTicketCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isActive = ticketCount > 0;
  const incrementTickets = () => setTicketCount(prev => prev + 1);
  const decrementTickets = () => setTicketCount(prev => Math.max(0, prev - 1));
  const [mode, setMode] = useState<'tickets' | 'donate' | 'form'>('tickets');
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const donationBoxRef = useRef<HTMLDivElement>(null);
  const [donationError, setDonationError] = useState<string | null>(null);

  const { openPayment } = useRazorpay();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPaidLocally, setIsPaidLocally] = useState(false);
  const [localPaymentType, setLocalPaymentType] = useState<string>("ticket");
  const [localPaidAmount, setLocalPaidAmount] = useState<number | string>(0);
  const [localPaymentId, setLocalPaymentId] = useState<string>("");

  const isUrlPaymentSuccess = searchParams?.get("payment") === "success";
  const isPaymentSuccess = isPaidLocally || isUrlPaymentSuccess;
  const activePaymentType = isPaidLocally ? localPaymentType : (searchParams?.get("type") || "ticket");
  const activePaidAmount = isPaidLocally ? localPaidAmount : (searchParams?.get("amount") || 0);
  const activePaymentId = isPaidLocally ? localPaymentId : (searchParams?.get("paymentId") || "");

  const handleDonatePayment = async () => {
    setDonationError(null);

    if (!donationAmount || isNaN(donationAmount) || donationAmount < 1) {
      setDonationError('Please select or enter a valid donation amount.');
      return;
    }

    if (donationAmount < 25) {
      setDonationError('Minimum donation amount is ₹25.');
      return;
    }

    if (!Number.isInteger(donationAmount)) {
      setDonationError('Please enter a whole number.');
      return;
    }

    setSubmitState('loading');

    try {
      await fetch("/api/forms/submit-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: 'donation',
          amount: Number(donationAmount),
          donationTime: new Date().toLocaleString(),
        }),
      });
    } catch (e) {
      console.warn('Failed to submit event donation to Google Sheets:', e);
    }

    // Donations use the donate API directly (free-form amount)
    try {
      const orderRes = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        setSubmitState('idle');
        setDonationError(orderData.error || 'Could not initiate donation.');
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        setSubmitState('idle');
        setDonationError('Razorpay SDK failed to load. Please refresh.');
        return;
      }

      try {
        router.prefetch("/event/success");
      } catch (_) {}

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: "INR",
        name: "Sustainable Sundays",
        description: `Donation — Sustainable Sundays ₹${donationAmount}`,
        order_id: orderData.orderId,
        theme: { color: "#0f1f3d" },
        modal: {
          ondismiss: () => setSubmitState('idle'),
        },
        handler: (response: RazorpayPaymentResponse) => {
          const redirectUrl = `/event/success?type=donation&amount=${donationAmount}&paymentId=${response.razorpay_payment_id || ''}`;

          fetch("/api/donate/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({ ...response, amount: donationAmount, note: "" }),
          }).catch((err) => console.error("Background donation verification error:", err));

          setSubmitState("success");
          try {
            router.replace(redirectUrl);
          } catch (_) {
            window.location.replace(redirectUrl);
          }
        },
      });
      rzp.on("payment.failed", (res: any) => {
        setSubmitState('idle');
        setDonationError(res.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      setSubmitState('idle');
      setDonationError(err.message || 'Something went wrong. Please try again.');
    }
  };
  
  // Form states
  const [fields, setFields] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');

  const { scrollYProgress } = useScroll({
    target: container ? { current: container } : undefined,
    offset: ["start start", "end start"]
  });

  const handleDonateClick = () => {
    setMode('donate');
    setTimeout(() => {
      donationBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const contentFade = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form Handlers
  const handleFieldChange = (field: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateField = (field: keyof typeof fields, value: string) => {
    switch (field) {
      case 'firstName': return value.trim() ? '' : 'Please enter your first name';
      case 'lastName': return value.trim() ? '' : 'Please enter your last name';
      case 'phone': return /^\d{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Enter a valid 10-digit mobile number';
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      default: return '';
    }
  };

  const handleBlur = (field: keyof typeof fields) => {
    setErrors(prev => ({ ...prev, [field]: validateField(field, fields[field]) }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      firstName: validateField('firstName', fields.firstName),
      lastName: validateField('lastName', fields.lastName),
      phone: validateField('phone', fields.phone),
      email: validateField('email', fields.email),
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(err => err !== '')) {
      setSubmitState('loading');
      
      const totalAmount = ticketCount * ticketPrice;

      // Non-blocking submission with keepalive so payment opens instantly
      fetch("/api/forms/submit-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          formType: 'event',
          firstName: fields.firstName,
          lastName: fields.lastName,
          phone: fields.phone,
          email: fields.email,
          quantity: ticketCount,
          amount: totalAmount,
          donationTime: new Date().toLocaleString(),
        }),
      }).catch((e) => console.warn('Failed to submit event registration to Google Sheets:', e));

      openPayment({
        eventId: slug || 'plogging',
        quantity: ticketCount,
        description: `${ticketCount}x General Admission — ₹${totalAmount}`,
        prefill: {
          name: `${fields.firstName} ${fields.lastName}`.trim(),
          email: fields.email,
          contact: fields.phone,
        },
        onDismiss: () => setSubmitState('idle'),
        onError: (msg) => { setSubmitState('idle'); setDonationError(msg); },
        successRedirect: `/event/success?type=ticket&amount=${totalAmount}`,
      });
    }
  };

  const event = slug ? EVENTS_DATA[slug] || EVENTS_DATA["plogging"] : EVENTS_DATA["plogging"];

  if (!isMounted) return null;

  const ticketPrice = event.tickets[0].price;

  return (
    <div className="min-h-screen selection:bg-primary/20 bg-white text-black">
      <main ref={setContainer} className="relative pt-24 pb-24">
        <SectionContainer className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <section className="mb-24 flex flex-col items-center text-center relative overflow-hidden">
            <motion.h1 
              style={{ opacity: contentFade }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter mb-12 leading-none whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
            >
              {event.title}
            </motion.h1>
            <motion.div 
              style={{ y: heroY, scale: heroScale }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full max-w-5xl aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl relative group bg-neutral-100"
            >
              <img 
                src={event.heroImage} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-6 lg:-ml-20">
              
              {/* Meta Information (Top) */}
              <div className="flex flex-col mb-6">
                <div className="border-b border-gray-200 pb-2 mb-2 w-fit">
                  <p className="text-gray-800 text-xl">📍 {event.location}</p>
                </div>
                {event.subLocation && (
                  <p className="text-gray-800 text-xl mb-2">{event.subLocation}</p>
                )}
                <p className="text-2xl text-gray-500 font-medium">📅 {event.date} | ⏰ {event.time}</p>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black tracking-tight mt-6 mb-4 whitespace-nowrap -ml-1 sm:-ml-1.5">
                🎉 {event.title}
              </h1>

              {/* Body Text */}
              <div className="text-lg lg:text-xl text-gray-800 leading-relaxed space-y-4 mb-8">
                <p>{event.description}</p>
                <p>{event.narrative}</p>
              </div>

              {/* Expect Section */}
              <section className="mb-10">
                <h3 className="text-xl font-medium mt-8 mb-4">Expect:</h3>
                <div className="flex flex-col">
                  {event.expectations.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-lg lg:text-xl text-gray-800">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tickets Section */}
              <section className="mb-10">
                <h3 className="text-3xl font-semibold mt-10 mb-3">🎟️ Tickets</h3>
                <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
                  General admission tickets are available now. Grab yours before they sell out!
                </p>
              </section>

              {/* Can't Attend? Section */}
              <section className="mb-10">
                <h3 className="text-3xl font-semibold mt-10 mb-3">❤️ Can't Attend?</h3>
                <p className="text-lg lg:text-xl text-gray-800 leading-relaxed mb-4">
                  You can still support the cause by making a direct donation to the Sustainable Sundays mission.
                </p>
                <button 
                  onClick={handleDonateClick}
                  className="text-[#F97316] text-lg font-medium hover:underline flex items-center gap-1"
                >
                  Donate Now <ChevronRight size={20} />
                </button>
              </section>
            </div>

            {/* Right Column: Sticky Widget */}
            <aside className="lg:col-span-6 relative lg:translate-x-16" ref={donationBoxRef}>
              <motion.div layout className="sticky top-8 bg-white rounded-3xl ambient-shadow overflow-hidden border border-outline-variant/10 min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  {mode === 'tickets' ? (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="min-h-[530px] flex flex-col justify-between overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                          {!showSummary ? (
                            <motion.div
                              key="ticket-view"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="flex-1 flex flex-col justify-between"
                            >
                              {/* Widget Header */}
                              <div className="p-10 space-y-5">
                                <h3 className="text-2xl font-extrabold leading-tight">
                                  {event.summary}
                                </h3>
                                <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
                                  <Clock size={16} />
                                  <span>{event.ticketTime}</span>
                                </div>
                              </div>

                              {/* Widget Body */}
                              <div className="px-10 pb-6 space-y-8">
                                {/* Ticket Stub Selection Card */}
                                <div className={`relative flex flex-col w-full max-w-[440px] rounded-xl shadow-sm mx-auto border transition-colors duration-300 ${
                                  isActive ? 'bg-[#FFF8F3] border-[#FF5A00]' : 'bg-white border-gray-200'
                                }`}>
                                  {/* 2. The Top "Spine" (Ticket Binding) */}
                                  <div className={`w-full h-2.5 border-b rounded-t-xl transition-colors duration-300 ${
                                    isActive ? 'bg-[#FF5A00] border-[#FF5A00]' : 'bg-[#F9FAFB] border-gray-200'
                                  }`} />

                                  {/* 3. Top Section (Ticket Info & Quantity Controls) */}
                                  <div className="p-5 md:p-6 pb-5 flex justify-between items-start">
                                    {/* Left Column (Text Info) */}
                                    <div className="flex flex-col">
                                      <h4 className="text-lg font-medium text-gray-900 tracking-tight">General Admission</h4>
                                      <span className="text-base font-medium text-[#7C3A16]">₹{ticketPrice.toFixed(2)}</span>
                                      <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mt-1">400 REMAINING</span>
                                    </div>

                                    {/* Right Column (Quantity Counter Controls) */}
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={decrementTickets}
                                        disabled={ticketCount === 0}
                                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center font-medium text-lg transition-all ${
                                          ticketCount === 0 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-[#FF5A00] text-white hover:bg-[#E04F00] active:scale-95 cursor-pointer shadow-sm'
                                        }`}
                                        aria-label="Decrease tickets"
                                      >
                                        −
                                      </button>
                                      <span className="w-4 text-center text-base font-semibold text-gray-800">{ticketCount}</span>
                                      <button
                                        onClick={incrementTickets}
                                        className="w-9 h-9 rounded-[10px] bg-[#FF5A00] text-white flex items-center justify-center font-medium text-xl hover:bg-[#E04F00] active:scale-95 transition-all shadow-sm cursor-pointer"
                                        aria-label="Increase tickets"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* 4. The Perforation Line & Perfect Notches */}
                                  <div className="relative w-full h-[1px]">
                                    {/* The Dashed Line */}
                                    <div className="absolute inset-0 border-b border-dashed border-gray-300" />
                                    {/* Left Notch (Perfect Half-Circle) */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 -left-[1px] w-3 h-6 bg-white border-r border-y rounded-r-full z-10 transition-colors duration-300 ${
                                      isActive ? 'border-r-[#FF5A00] border-y-[#FF5A00]' : 'border-r-gray-200 border-y-gray-200'
                                    }`} />
                                    {/* Right Notch (Perfect Half-Circle) */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 -right-[1px] w-3 h-6 bg-white border-l border-y rounded-l-full z-10 transition-colors duration-300 ${
                                      isActive ? 'border-l-[#FF5A00] border-y-[#FF5A00]' : 'border-l-gray-200 border-y-gray-200'
                                    }`} />
                                  </div>

                                  {/* 5. Bottom Section (Rules List) */}
                                  <div className="p-5 md:p-6 pt-5 flex flex-col gap-2 rounded-b-xl">
                                    <p className="text-sm text-gray-600 font-medium leading-normal">
                                      💵 <span className="text-gray-900 font-semibold">₹{ticketPrice} online</span> – Buy now and save your spot!
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium leading-normal">
                                      💵 <span className="text-gray-900 font-semibold">₹{ticketPrice + 50} at the door</span> – If we're not sold out 😉
                                    </p>
                                  </div>
                                </div>

                                {/* Total Row */}
                                <div 
                                  onClick={() => setShowSummary(true)}
                                  className="flex items-center justify-between px-1 cursor-pointer select-none group"
                                >
                                  <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#00BA7C]" viewBox="0 0 24 24" fill="currentColor">
                                      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.09 6.273a.75.75 0 0 0-1.212-.886L10.5 12.793l-1.894-1.894a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.137-.089l4.423-5.921Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg font-semibold text-black tracking-tight">Total</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-lg font-semibold text-black">₹{(ticketCount * ticketPrice).toFixed(2)}</span>
                                    <ChevronDown size={20} className="text-black stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="summary-view"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="p-10 space-y-8 flex-1 flex flex-col"
                            >
                              {/* Summary Top Header */}
                              <div 
                                onClick={() => setShowSummary(false)}
                                className="flex items-center justify-between cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-[#00BA7C]" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.09 6.273a.75.75 0 0 0-1.212-.886L10.5 12.793l-1.894-1.894a.75.75 0 0 0 1.137-.089l4.423-5.921Z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-base font-bold text-black tracking-tight">Secure</span>
                                </div>
                                <ChevronDown size={20} className="text-black stroke-[2.5] rotate-180 transition-transform" />
                              </div>

                              {/* Summary Details */}
                              <div className="pt-2 border-b border-gray-200 pb-5">
                                <span className="text-xs font-bold text-gray-800 tracking-wider uppercase block mb-4">
                                  SUMMARY
                                </span>
                                <div className="flex items-center justify-between text-base">
                                  <span className="text-gray-700 font-normal">Subtotal</span>
                                  <span className="text-gray-900 font-medium">₹{(ticketCount * ticketPrice).toFixed(2)}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="px-10 pb-10 space-y-4">
                        <button 
                          onClick={() => setMode('form')}
                          disabled={ticketCount === 0}
                          className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-lg transition-all ${
                            ticketCount === 0 
                              ? 'bg-gray-300 cursor-not-allowed opacity-60' 
                              : 'bg-[oklch(0.2_0.08_240)] hover:shadow-[oklch(0.2_0.08_240)]/20 hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          Continue
                        </button>
                        <button 
                          onClick={handleDonateClick}
                          className="w-full py-5 text-[oklch(0.2_0.08_240)] font-bold hover:bg-[oklch(0.2_0.08_240)]/5 rounded-2xl transition-colors border border-[oklch(0.2_0.08_240)]/20"
                        >
                          I'd just like to donate
                        </button>
                      </div>
                    </motion.div>
                  ) : mode === 'form' ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="flex-1 flex flex-col p-8"
                    >
                      <button 
                        onClick={() => { setMode('tickets'); setSubmitState('idle'); }}
                        className="flex items-center gap-2 text-[oklch(0.2_0.08_240)] text-sm font-bold hover:gap-3 transition-all mb-4 self-start"
                      >
                        <ArrowLeft size={16} /> Back to tickets
                      </button>

                      <div className="text-sm font-bold text-neutral-500 mb-2">
                        {ticketCount} × General Admission — ₹{(ticketCount * ticketPrice).toFixed(2)}
                      </div>
                      
                      <h3 className="text-2xl font-black leading-tight tracking-tighter mb-6">
                        Your Details
                      </h3>

                      <div className="flex flex-col gap-4 mb-6">
                        {(['firstName', 'lastName', 'phone', 'email'] as const).map(field => (
                          <div key={field} className="relative">
                            <input
                              type={field === 'phone' ? 'tel' : field === 'email' ? 'email' : 'text'}
                              placeholder={
                                field === 'firstName' ? 'First Name' :
                                field === 'lastName' ? 'Last Name' :
                                field === 'phone' ? '+91 XXXXX XXXXX' :
                                'Email Address'
                              }
                              value={fields[field]}
                              onChange={handleFieldChange(field)}
                              onBlur={() => handleBlur(field)}
                              className={`w-full py-3 px-5 rounded-2xl border-2 transition-colors focus:outline-none ${
                                errors[field] ? 'border-red-400 focus:border-red-500' : 'border-neutral-100 focus:border-[oklch(0.2_0.08_240)]'
                              }`}
                            />
                            <AnimatePresence>
                              {errors[field] && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, height: 0 }}
                                  animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 4 }}
                                  exit={{ opacity: 0, y: -4, height: 0, marginTop: 0 }}
                                  className="text-red-500 text-xs font-medium px-2"
                                >
                                  {errors[field]}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-neutral-100 pt-5 mb-6 space-y-3 font-medium text-neutral-600 text-sm">
                        <div className="flex justify-between">
                          <span>{ticketCount} × General Admission</span>
                          <span>₹{(ticketCount * ticketPrice).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Booking Fee</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between font-black text-black text-xl pt-3">
                          <span>Total</span>
                          <span>₹{(ticketCount * ticketPrice).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={submitState === 'loading' || submitState === 'success'}
                        className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center ${
                          submitState === 'success' ? 'bg-green-600' : 'bg-[oklch(0.2_0.08_240)] hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {submitState === 'idle' && (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              Proceed to Payment →
                            </motion.span>
                          )}
                          {submitState === 'loading' && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </motion.div>
                          )}
                          {submitState === 'success' && (
                            <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                              ✓ You're in!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>

                      <div className="text-center text-neutral-400 text-xs mt-6 font-medium">
                        🔒 Secure checkout · Razorpay
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="donate"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Donation Header */}
                      <div className="p-10 space-y-4">
                        <button 
                          onClick={() => setMode('tickets')}
                          className="flex items-center gap-2 text-[oklch(0.2_0.08_240)] text-sm font-bold hover:gap-3 transition-all mb-4"
                        >
                          <ArrowLeft size={16} /> Back to tickets
                        </button>
                        <h3 className="text-3xl font-black leading-tight tracking-tighter uppercase">
                          Support <br /><span className="text-[oklch(0.2_0.08_240)]">Sustainable Sundays</span>
                        </h3>
                        <p className="text-neutral-500 font-medium text-sm">
                          Every contribution directly funds our community initiatives and global impact projects.
                        </p>
                      </div>

                      {/* Donation Body */}
                      <div className="px-10 pb-10 space-y-8">
                        {/* Amount Presets */}
                        <div className="grid grid-cols-2 gap-4">
                          {[25, 50, 100, 250].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setDonationAmount(amount)}
                              className={`py-4 rounded-2xl font-black text-xl border-2 transition-all ${
                                donationAmount === amount 
                                  ? 'bg-[oklch(0.2_0.08_240)] border-[oklch(0.2_0.08_240)] text-white shadow-lg' 
                                  : 'bg-white border-neutral-100 text-neutral-400 hover:border-[oklch(0.2_0.08_240)]/30 hover:text-[oklch(0.2_0.08_240)]'
                              }`}
                            >
                              ₹{amount}
                            </button>
                          ))}
                        </div>

                        {/* Custom Input Placeholder */}
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-neutral-300">₹</span>
                          <input 
                            type="number" 
                            placeholder="Custom Amount" 
                            className="w-full py-5 pl-12 pr-6 rounded-2xl border-2 border-neutral-100 font-bold focus:border-[oklch(0.2_0.08_240)] focus:outline-none transition-colors"
                            onChange={(e) => setDonationAmount(Number(e.target.value))}
                          />
                        </div>

                        <div className="space-y-4">
                          <button
                            onClick={handleDonatePayment}
                            className="w-full py-5 bg-[oklch(0.2_0.08_240)] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-[oklch(0.2_0.08_240)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            Donate {donationAmount ? `₹${donationAmount}` : 'Now'}
                          </button>
                          {donationError && (
                            <p className="text-sm text-red-500 text-center">{donationError}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </aside>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
