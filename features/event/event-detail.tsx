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
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { useRazorpay } from "@/hooks/useRazorpay";

interface EventDetailProps {
  slug?: string;
}

const EVENTS_DATA: Record<string, any> = {
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
    subLocation: "Location TBD",
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
  const [ticketCount, setTicketCount] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<'tickets' | 'donate' | 'form'>('tickets');
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const donationBoxRef = useRef<HTMLDivElement>(null);
  const [donationError, setDonationError] = useState<string | null>(null);

  const { openPayment } = useRazorpay();

  const handleDonatePayment = () => {
    setDonationError(null);

    if (!donationAmount || isNaN(donationAmount) || donationAmount < 1) {
      setDonationError('Please select or enter a valid donation amount.');
      return;
    }

    if (donationAmount < 25) {
      setDonationError('Minimum donation amount is ₹25.');
      return;
    }

    setSubmitState('loading');
    openPayment({
      amount: donationAmount,
      type: 'donation',
      description: `Donation — Sustainable Sundays ₹${donationAmount}`,
      onDismiss: () => setSubmitState('idle'),
      onError: (msg) => { setSubmitState('idle'); setDonationError(msg); },
      successRedirect: `/event/success?type=donation&amount=${donationAmount}`,
    });
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
      if (window.innerWidth < 1024) {
        donationBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

  const incrementTickets = () => setTicketCount(prev => prev + 1);
  const decrementTickets = () => setTicketCount(prev => Math.max(1, prev - 1));

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

  const handleSubmit = () => {
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
      openPayment({
        amount: totalAmount,
        type: 'ticket',
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
              className="text-7xl md:text-[10rem] font-black tracking-tighter mb-12 leading-none"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-20">
              
              {/* Metadata Cards */}
              <div className="flex flex-col md:flex-row items-center gap-12 p-8 bg-surface-container-low rounded-2xl w-fit">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg leading-tight m-0">{event.location}</p>
                    <p className="text-secondary text-sm leading-tight m-0 opacity-60">{event.subLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg leading-tight m-0 whitespace-nowrap">{event.date}</p>
                    <p className="text-secondary text-sm leading-tight m-0 opacity-60">{event.time}</p>
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <article className="max-w-2xl">
                <h2 className="text-4xl font-extrabold mb-8 tracking-tight leading-tight">
                  A Night to Remember. A Cause That Matters. 🥳
                </h2>
                <div className="text-lg leading-relaxed text-neutral-600 space-y-6 font-medium">
                  <p>
                    {event.description}
                  </p>
                  <p>
                    {event.narrative}
                  </p>
                </div>
              </article>

              {/* Expect Section */}
              <section>
                <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-neutral-400 text-[10px]">What to Expect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.expectations.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-5 p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/10">
                      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-2xl">
                        {item.emoji}
                      </div>
                      <span className="font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>



              {/* Donation Section */}
              <section className="p-10 rounded-3xl border border-neutral-100">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[oklch(0.2_0.08_240)] shadow-md">
                    <Heart size={28} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Can't Attend?</h3>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      You can still support the cause by making a direct donation to the Sustainable Sundays mission.
                    </p>
                    <button 
                      onClick={handleDonateClick}
                      className="flex items-center gap-2 text-[oklch(0.2_0.08_240)] font-bold hover:gap-4 transition-all group"
                    >
                      Donate Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Widget */}
            <aside className="lg:col-span-5 relative" ref={donationBoxRef}>
              <motion.div layout className="sticky top-32 bg-white rounded-3xl ambient-shadow overflow-hidden border border-outline-variant/10 min-h-[500px] flex flex-col">
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
                      <div className="px-10 pb-10 space-y-10">
                        <div className="p-8 bg-surface-container-low rounded-2xl">
                          <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg">General Admission</span>
                            <span className="font-black text-2xl">₹{ticketPrice.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-[oklch(0.2_0.08_240)] tracking-widest uppercase mb-1">
                                Availability
                              </span>
                              <span className="text-xs font-bold text-[oklch(0.2_0.08_240)]">400 REMAINING</span>
                            </div>
                            
                            <div className="flex items-center bg-white rounded-xl shadow-sm p-1 border border-outline-variant/10">
                              <button 
                                onClick={decrementTickets}
                                className="w-10 h-10 flex items-center justify-center text-[oklch(0.2_0.08_240)] hover:bg-surface-container-low rounded-lg transition-colors"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="w-12 text-center font-black text-lg">{ticketCount}</span>
                              <button 
                                onClick={incrementTickets}
                                className="w-10 h-10 flex items-center justify-center text-[oklch(0.2_0.08_240)] hover:bg-surface-container-low rounded-lg transition-colors"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <button 
                            onClick={() => setMode('form')}
                            className="w-full py-5 bg-[oklch(0.2_0.08_240)] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-[oklch(0.2_0.08_240)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
