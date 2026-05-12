
"use client";

import { useState } from "react";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaWLTHSLnQVuOrrK_Wq2XMDUxSyoKwDZnQETVVxFHF_wGpajn2E6AE3oxxj1zK2bIFwg/exec";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  membershipType: string;
  message: string;
};

const initialState: FormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  membershipType: "General",
  message: "",
};

export default function MembershipForm() {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        // NOTE: Apps Script requires 'no-cors' mode
        // This means you won't get a response body back, but the data IS written
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Since no-cors gives an opaque response, we optimistically treat it as success
      setStatus("success");
      setFormData(initialState);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-green-600 mb-2">
          🎉 Welcome aboard!
        </h3>
        <p className="text-gray-600">
          Your membership request has been received. We'll reach out to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm underline text-gray-500"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Delhi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Membership Type</label>
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="General">General Member</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Supporter">Supporter</option>
          <option value="Corporate">Corporate Partner</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message / Why do you want to join?</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tell us a bit about yourself..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Become a Member"}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}