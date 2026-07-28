"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFormSchema, EventFormValues } from '@/lib/validators/forms';
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { submitToGoogleScript } from '@/lib/google/script';

/**
 * EventForm Component
 * A production-ready, client-side form for Event Registration.
 * Handles text fields and a screenshot file upload via FormData.
 */
export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
  });

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    setServerMessage(null);

    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await submitToGoogleScript({
        formType: 'event',
        firstName,
        lastName,
        phone: data.phone,
        email: data.email,
        eventName: data.eventName,
        donationTime: new Date().toLocaleString(),
      });

      // Construct FormData for multipart submission (including the file)
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('eventName', data.eventName);

      // Handle file extraction from FileList
      if (data.screenshot && data.screenshot.length > 0) {
        formData.append('screenshot', data.screenshot[0]);
      } else {
        throw new Error('Please upload a screenshot.');
      }

      const response = await fetch('/api/forms/event', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setServerMessage({ type: 'success', text: result.message });
      reset(); // Clear the form on success

    } catch (error: any) {
      setServerMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Register Your Event
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Join the Sustainable Sundays movement by sharing your local event details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500'
              } bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="john@example.com"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500'
              } bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="1234567890"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500'
              } bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <label htmlFor="eventName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Event Name
            </label>
            <input
              {...register('eventName')}
              type="text"
              id="eventName"
              placeholder="Sunday Beach Cleanup"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.eventName ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500'
              } bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.eventName && <p className="text-xs font-medium text-red-500">{errors.eventName.message}</p>}
          </div>
        </div>

        {/* Screenshot Upload */}
        <div className="space-y-2">
          <label htmlFor="screenshot" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Event Screenshot / Graphic
          </label>
          <div className="relative group">
            <input
              {...register('screenshot')}
              type="file"
              id="screenshot"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${
              errors.screenshot ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-950/20'
            }`}>
              <Upload className={`w-10 h-10 mb-2 ${errors.screenshot ? 'text-red-400' : 'text-zinc-400 group-hover:text-emerald-500'}`} />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG or WebP allowed</p>
            </div>
          </div>
          {errors.screenshot && <p className="text-xs font-medium text-red-500">{errors.screenshot.message as string}</p>}
        </div>

        {/* Status Messages */}
        {serverMessage && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
            serverMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}>
            {serverMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{serverMessage.text}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Registration...</span>
            </>
          ) : (
            <>
              <span>Submit Event Registration</span>
              <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
