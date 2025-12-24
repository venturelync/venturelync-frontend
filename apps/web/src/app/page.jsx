"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Flame,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Zap,
  ShieldCheck,
  Users,
  FileText,
  Layout,
  Globe,
  MessageSquare,
  Lock,
  ChevronRight,
  Plus,
  Minus,
  ExternalLink,
} from "lucide-react";

const COLORS = {
  blue: "#00008B",
  red: "#FF4B4B",
  green: "#00C853",
  yellow: "#FFD600",
  orange: "#FF6D00",
  purple: "#AA00FF",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#FDFCF8",
};

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Founder",
    project: "",
    website: "",
    linkedin: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setXp((prev) => (prev + Math.floor(Math.random() * 10)) % 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          whatsapp: "N/A", // Placeholder as it's not in the new form but required by API
        }),
      });

      if (res.ok) {
        // Redirect to Discord immediately after successful submission
        window.location.href = "https://discord.gg/ZWNzqm7nvC";
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-[#FDFCF8] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-black uppercase tracking-tighter">
            VentureLync
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/account/signin"
              className="text-sm font-black uppercase hover:underline"
            >
              Sign In
            </a>
            <a
              href="#invite"
              className="bg-[#00008B] px-6 py-2 text-sm font-black uppercase text-white transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#FFD600]"
            >
              Request Invite
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute left-[10%] top-[20%] hidden md:block"
          >
            <div className="border-4 border-[#00008B] bg-white p-4 shadow-[8px_8px_0px_#00C853]">
              <div className="flex items-center gap-2 font-black">
                <Flame className="text-[#FF6D00]" /> 12 DAY STREAK
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute right-[15%] top-[30%] hidden md:block"
          >
            <div className="border-4 border-[#00008B] bg-white p-4 shadow-[8px_8px_0px_#AA00FF]">
              <div className="flex items-center gap-2 font-black">
                <Zap className="text-[#FFD600]" /> XP: {xp}
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-[20%] left-[15%] hidden md:block"
          >
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-[#00C853] border-2 border-[#00008B]" />
              <div className="h-8 w-8 rounded-full bg-[#FF4B4B] border-2 border-[#00008B]" />
              <div className="h-8 w-8 rounded-full bg-[#FFD600] border-2 border-[#00008B]" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 max-w-5xl"
        >
          <h1 className="mb-8 text-6xl font-black leading-[0.9] tracking-tighter md:text-9xl uppercase">
            The venture world <br />
            <span className="text-[#FF4B4B]">runs on noise.</span> <br />
            <span className="font-black">VentureLync</span> <br />
            <span className="text-[#00C853]">runs on signal.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl font-bold leading-tight md:text-2xl">
            Private operating infrastructure for founders and investors who are
            done with performative progress and hollow narratives.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="#invite"
              className="group relative bg-[#00008B] px-12 py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#FFD600]"
            >
              Request Invite
              <ArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-2" />
            </a>
            <p className="text-sm font-black uppercase tracking-widest opacity-60">
              Invite only. Gated for integrity, not hype.
            </p>
          </div>
        </motion.div>
      </section>

      {/* What's Broken */}
      <section className="border-y-8 border-[#00008B] bg-[#FFD600] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full border-4 border-[#00008B] bg-white" />
              <div className="relative border-4 border-[#00008B] bg-white p-8 shadow-[12px_12px_0px_#FF4B4B]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#00008B] pb-2">
                    <span className="font-black uppercase">
                      Pitch Deck v42.pdf
                    </span>
                    <XCircle className="text-[#FF4B4B]" />
                  </div>
                  <div className="flex items-center justify-between border-b-2 border-[#00008B] pb-2">
                    <span className="font-black uppercase">
                      LinkedIn "Humbled" Post
                    </span>
                    <XCircle className="text-[#FF4B4B]" />
                  </div>
                  <div className="flex items-center justify-between border-b-2 border-[#00008B] pb-2 opacity-40">
                    <span className="font-black uppercase">
                      Actual Progress
                    </span>
                    <CheckCircle2 className="text-[#00C853]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl font-black uppercase leading-none md:text-7xl">
                Founders learned to perform instead of build.
              </h2>
              <p className="text-2xl font-bold">
                Investors learned to read stories instead of patterns.
              </p>
              <div className="inline-block border-4 border-[#00008B] bg-[#00008B] px-8 py-4 text-3xl font-black uppercase text-white">
                Truth arrives late. <br />
                VentureLync fixes that.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it actually is */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-4 border-[#00008B] p-8 transition-transform hover:-rotate-2">
              <div className="mb-4 text-4xl">🚫</div>
              <h3 className="text-2xl font-black uppercase">
                Not social media
              </h3>
            </div>
            <div className="border-4 border-[#00008B] p-8 transition-transform hover:rotate-2">
              <div className="mb-4 text-4xl">🚫</div>
              <h3 className="text-2xl font-black uppercase">
                Not a content platform
              </h3>
            </div>
            <div className="border-4 border-[#00008B] p-8 transition-transform hover:-rotate-1">
              <div className="mb-4 text-4xl">🚫</div>
              <h3 className="text-2xl font-black uppercase">
                Not a pitch stage
              </h3>
            </div>
          </div>

          <h2 className="mb-16 text-6xl font-black uppercase md:text-8xl">
            Infrastructure for the <br />
            <span className="bg-[#00008B] text-white px-4">venture world.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4">
              <div className="h-16 w-16 bg-[#00C853] border-4 border-[#00008B] flex items-center justify-center text-white">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase">
                Founders log reality daily
              </h4>
              <p className="font-bold">
                No fluff. Just what moved, what broke, and what was learned.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 bg-[#FF6D00] border-4 border-[#00008B] flex items-center justify-center text-white">
                <TrendingUp size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase">
                Consistency compounds
              </h4>
              <p className="font-bold">
                Streaks and XP track the only metric that matters: showing up.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 bg-[#AA00FF] border-4 border-[#00008B] flex items-center justify-center text-white">
                <Zap size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase">
                Signal emerges over time
              </h4>
              <p className="font-bold">
                Patterns of behavior beat polished pitches every single time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Infrastructure */}
      <section className="bg-[#00008B] py-32 px-6 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-24 text-5xl font-black uppercase md:text-7xl text-center">
            Core Infrastructure
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText />,
                title: "Daily reality logs",
                color: "#FF4B4B",
              },
              { icon: <Flame />, title: "Streaks and XP", color: "#FF6D00" },
              {
                icon: <Layout />,
                title: "Monthly venture wrapped",
                color: "#00C853",
              },
              {
                icon: <ShieldCheck />,
                title: "AI Investor MIS PDFs",
                color: "#FFD600",
              },
              {
                icon: <Globe />,
                title: "Single source of truth",
                color: "#AA00FF",
              },
              {
                icon: <MessageSquare />,
                title: "Smart Redistribution",
                color: "#FFFFFF",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 1 : -1 }}
                className="border-4 border-white p-8 flex flex-col gap-4"
                style={{
                  backgroundColor:
                    item.color === "#FFFFFF" ? "transparent" : "transparent",
                }}
              >
                <div className="text-white">{item.icon}</div>
                <h3 className="text-2xl font-black uppercase">{item.title}</h3>
              </motion.div>
            ))}
          </div>
          <p className="mt-16 text-center text-3xl font-black uppercase italic">
            “This is infrastructure, not content.”
          </p>
        </div>
      </section>

      {/* For Founders */}
      <section className="py-32 px-6 border-b-8 border-[#00008B]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="bg-[#FFD600] border-4 border-[#00008B] p-4">
              <Users size={48} />
            </div>
            <h2 className="text-5xl font-black uppercase md:text-7xl">
              For Founders 🛠
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6 flex flex-col justify-start pt-4">
              <h3 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tighter">
                Build once. <br />
                <span className="bg-[#FF4B4B] text-white px-2">Stop</span>{" "}
                <br />
                half-assing
              </h3>
              <p className="max-w-md text-sm md:text-base font-medium leading-relaxed text-[#00008B]/60">
                Founders are forced to build products and perform online. This
                leads to context switching, rushed posts, and burnout.
                VentureLync removes this entirely.
              </p>
            </div>
            <div className="grid gap-8">
              <div className="border-4 border-[#00008B] p-8 bg-white shadow-[8px_8px_0px_#00C853]">
                <h4 className="text-2xl font-black uppercase mb-4">
                  One platform to build
                </h4>
                <ul className="space-y-2 font-bold">
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#00C853]" /> What moved
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#FF4B4B]" /> What broke
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#FFD600]" /> What you learned
                  </li>
                </ul>
              </div>
              <div className="border-4 border-[#00008B] p-8 bg-white shadow-[8px_8px_0px_#AA00FF]">
                <h4 className="text-2xl font-black uppercase mb-4">
                  Redistribution without noise
                </h4>
                <p className="font-bold">
                  Optional intelligent redistribution to LinkedIn and X. No
                  influencer threads. No hype cycles. Clean progress signals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-32 px-6 bg-[#FDFCF8]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="bg-[#AA00FF] border-4 border-[#00008B] p-4 text-white">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-5xl font-black uppercase md:text-7xl">
              For Investors 🧠
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="grid gap-8 order-2 md:order-1">
              <div className="border-4 border-[#00008B] p-8 bg-white shadow-[8px_8px_0px_#FF6D00]">
                <h4 className="text-2xl font-black uppercase mb-4">
                  Authenticity as signal
                </h4>
                <p className="font-bold">
                  Founders are not pitching. They are logging work daily.
                  Behavior becomes the signal.
                </p>
              </div>
              <div className="border-4 border-[#00008B] p-8 bg-white shadow-[8px_8px_0px_#00008B]">
                <h4 className="text-2xl font-black uppercase mb-4">
                  Deal sourcing by observation
                </h4>
                <p className="font-bold">
                  Observe founders quietly. Track consistency. Spot operators
                  early. Reduce narrative risk.
                </p>
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2 text-right flex flex-col items-end justify-start pt-4">
              <h3 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tighter">
                The truth <br />
                layer of <br />
                <span className="bg-[#AA00FF] text-white px-2">venture.</span>
              </h3>
              <p className="max-w-md text-sm md:text-base font-medium leading-relaxed text-[#00008B]/60">
                By the time companies pitch, the story is optimized and chaos is
                hidden. VentureLync provides authenticity before the pitch.
              </p>
              <div className="flex flex-wrap gap-4 justify-end">
                {["No cold emails", "No demo days", "No noise"].map((tag) => (
                  <span
                    key={tag}
                    className="border-2 border-[#00008B] px-4 py-1 font-black uppercase text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite Flow */}
      <section className="bg-[#FF4B4B] py-32 px-6 text-white border-y-8 border-[#00008B]">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-24 text-5xl font-black uppercase md:text-7xl">
            Invite-Only Flow
          </h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {[
              { step: "01", title: "Request Invite", icon: <MessageSquare /> },
              { step: "02", title: "Join Discord", icon: <Users /> },
              {
                step: "03",
                title: "Green Flag Approval",
                icon: <CheckCircle2 />,
              },
              { step: "04", title: "Enter VentureLync", icon: <Zap /> },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center gap-4"
              >
                <div className="h-24 w-24 bg-white border-4 border-[#00008B] flex items-center justify-center text-[#00008B] shadow-[8px_8px_0px_#00008B]">
                  {item.icon}
                </div>
                <div className="text-xl font-black uppercase">{item.step}</div>
                <h3 className="text-2xl font-black uppercase">{item.title}</h3>
              </div>
            ))}
            {/* Connector Line */}
            <div className="absolute top-12 left-0 w-full h-1 bg-white hidden md:block" />
          </div>
          <p className="mt-16 text-2xl font-bold max-w-2xl mx-auto">
            “Invites are reviewed manually to protect culture and signal
            quality.”
          </p>
        </div>
      </section>

      {/* Request Invite Form */}
      <section
        id="invite"
        className="bg-[#FDFCF8] py-32 px-6 text-[#00008B] border-b-8 border-[#00008B]"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-6xl font-black uppercase md:text-8xl">
              Request Invite
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest opacity-60">
              Not everyone gets in. And that’s the point.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="border-8 border-[#00008B] bg-white p-12 text-center shadow-[16px_16px_0px_#00C853]"
            >
              <div className="mb-6 inline-flex h-24 w-24 items-center justify-center bg-[#00C853] border-4 border-[#00008B] text-white">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="mb-4 text-4xl font-black uppercase">
                Request Received!
              </h3>
              <p className="mb-8 text-xl font-bold">
                Redirecting you to our Discord clubhouse...
              </p>

              {/* Fallback button for iframe environments */}
              <a
                href="https://discord.gg/ZWNzqm7nvC"
                target="_blank"
                rel="noreferrer"
                className="mb-8 inline-flex items-center gap-2 bg-[#00008B] px-8 py-4 text-lg font-black uppercase text-white hover:shadow-[4px_4px_0px_#FFD600] transition-all"
              >
                Join Discord Manually <ExternalLink size={20} />
              </a>

              <div className="h-2 w-full bg-[#FDFCF8] border-2 border-[#00008B]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-[#00C853]"
                />
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8 border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  Who are you?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Founder", "Investor"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`border-4 border-[#00008B] p-4 font-black uppercase transition-all ${
                        formData.role === role
                          ? "bg-[#00008B] text-white"
                          : "bg-white hover:bg-[#FDFCF8]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  {formData.role === "Founder"
                    ? "What are you building?"
                    : "Investment Focus"}
                </label>
                <input
                  required
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                  placeholder={
                    formData.role === "Founder"
                      ? "One line about your startup"
                      : "Sectors, stages, etc."
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    Website (Optional)
                  </label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    LinkedIn / Twitter URL
                  </label>
                  <input
                    required
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                    placeholder="Profile link"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00008B] py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request Invite"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FFD600] py-32 px-6 border-t-8 border-[#00008B]">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-12 text-6xl font-black uppercase md:text-8xl">
            This is a place for people who actually build.
          </h2>
          <a
            href="#invite"
            className="inline-block bg-[#00008B] px-16 py-8 text-3xl font-black uppercase text-white transition-all hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[16px_16px_0px_#FFFFFF]"
          >
            Request Invite
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#00008B] py-16 px-6 text-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-3xl font-black uppercase tracking-tighter">
            VentureLync
          </div>
          <div className="flex gap-8 font-black uppercase text-sm">
            <a
              href="https://x.com/venturelync"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/company/venturelync/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://discord.gg/ZWNzqm7nvC"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Discord
            </a>
          </div>
          <div className="text-sm font-black uppercase opacity-60">
            © 2025 VENTURELYNC. NO BULLSHIT.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .asymmetric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
      `}</style>
    </div>
  );
}
