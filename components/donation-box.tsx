"use client";

import { useState } from 'react';
import { CheckCircle2, Leaf } from 'lucide-react';
import { useDonation } from '@/hooks/useDonation';
import { motion } from 'framer-motion';

const AMOUNTS = [5000, 2500, 1000, 500, 250, 100];

export default function DonationBox() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [donationError, setDonationError] = useState<string | null>(null);
  const { initiateDonation, isLoading, error: paymentError } = useDonation();

  const handleContinue = async () => {
    setDonationError(null);

    const numericAmount = Number(selectedAmount || customAmount);

    if (!numericAmount || isNaN(numericAmount) || numericAmount < 1) {
      setDonationError('Please select or enter a valid donation amount.');
      return;
    }

    if (numericAmount < 100) {
      setDonationError('Minimum donation amount is ₹100.');
      return;
    }

    await initiateDonation(numericAmount, note);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-md mx-auto w-full relative z-30"
    >
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(1,38,31,0.08)] border border-neutral-200">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-black mb-1">Turn Your Sunday Into Tangible Impact.</h2>
          <p className="text-neutral-500 text-xs font-light">100% of your donation puts seeds in the ground and tools in the hands of our weekend volunteers.</p>
        </div>

        <div className="space-y-6">
          <div className="border border-neutral-100 rounded-2xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 text-black font-medium text-sm">
              <CheckCircle2 className="text-green-600 w-4 h-4 fill-green-600/10" />
              <span>Choose amount</span>
            </div>

            {/* Frequency Toggle */}
            <div className="bg-neutral-50 p-1.5 rounded-2xl flex">
              <button 
                onClick={() => setFrequency('one-time')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  frequency === 'one-time' 
                    ? 'bg-white shadow-sm border border-neutral-200 text-black' 
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                One-time
              </button>
              <button 
                onClick={() => setFrequency('monthly')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  frequency === 'monthly' 
                    ? 'bg-white shadow-sm border border-neutral-200 text-black' 
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Amount Grid */}
            <div className="grid grid-cols-3 gap-3">
              {AMOUNTS.map((amount) => (
                <button 
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`py-3 rounded-xl text-base font-bold transition-colors ${
                    selectedAmount === amount 
                      ? 'bg-black text-white' 
                      : 'bg-neutral-50 hover:bg-neutral-100 text-black'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative flex items-center bg-neutral-50 rounded-xl px-4 py-4 group focus-within:ring-1 focus-within:ring-black/5">
              <span className="text-neutral-500 mr-2">₹</span>
              <input 
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-black font-medium placeholder:text-neutral-400"
                placeholder="Other"
              />
              <span className="text-xs font-bold text-neutral-400 ml-2">INR</span>
            </div>

            {/* Add Note */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={showNote}
                onChange={(e) => setShowNote(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black/5"
              />
              <span className="text-neutral-500 text-sm group-hover:text-black transition-colors">Add note/comment</span>
            </label>
            {showNote && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave a message (optional)"
                rows={2}
                className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm text-black font-medium placeholder:text-neutral-400 focus:ring-1 focus:ring-black/5 focus:outline-none resize-none"
              />
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:scale-[1.01] active:scale-[0.98] transition-all ease-[0.23,1,0.32,1] shadow-[0_10px_30px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
          {(donationError || paymentError) && (
            <p className="mt-3 text-sm text-red-500 text-center">{donationError || paymentError}</p>
          )}

          <div className="flex flex-col items-center gap-1 pt-2">
            <div className="flex items-center gap-1.5 opacity-60">
              <Leaf className="w-4 h-4 text-black" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-black">Powered by Sustainable Sunday</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
