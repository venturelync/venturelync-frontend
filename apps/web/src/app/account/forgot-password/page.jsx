"use client";

import { useState } from "react";
import { Zap, ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-[#00008B] border-4 border-[#00008B] text-white shadow-[8px_8px_0px_#FFD600]">
            <Mail size={40} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
            Reset Pass
          </h1>
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            Get back into the clubhouse
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#00008B]"
        >
          {message ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <p className="font-black uppercase text-sm leading-relaxed">
                {message}
              </p>
              <a
                href="/account/signin"
                className="inline-flex items-center gap-2 text-sm font-black uppercase underline"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  Email or Username
                </label>
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>

              {error && (
                <div className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B] flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Link ⚡"}
              </button>

              <a
                href="/account/signin"
                className="flex items-center justify-center gap-2 text-sm font-black uppercase underline opacity-60 hover:opacity-100"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </a>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
