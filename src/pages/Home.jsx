import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  LineChart,
  Shield,
  Smartphone,
  Zap,
  Wallet,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const features = [
    {
      icon: <LineChart className="h-8 w-8 text-indigo-600" />,
      title: "Insightful Analytics",
      description:
        "Visualize your spending with beautiful, easy-to-understand charts and insights.",
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: "Quick Entry",
      description:
        "Add expenses instantly with our intuitive and lightning-fast interface.",
    },
    {
      icon: <Wallet className="h-8 w-8 text-indigo-600" />,
      title: "Smart Budgets",
      description:
        "Set flexible budgets and get notified when you're close to your limits.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Sync Everywhere",
      description:
        "Access your data seamlessly from mobile, tablet, or desktop — anytime.",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure & Private",
      description:
        "Your data is protected with 256-bit encryption. We value your privacy.",
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Collaborate (Soon)",
      description:
        "Share your financial goals with partners or advisors securely.",
    },
  ];

  const testimonials = [
    {
      quote:
        "SpendFlow changed how I handle money. The charts are beautiful, and I actually enjoy budgeting now!",
      author: "Sarah L.",
      title: "Freelance Designer",
      avatar: "SL",
    },
    {
      quote:
        "I’ve tried a dozen finance apps. SpendFlow is the only one that feels modern, intuitive, and actually useful.",
      author: "Mike R.",
      title: "Entrepreneur",
      avatar: "MR",
    },
  ];
  const handleStart = () => {
    if (user) {
      navigate("/dashboard"); // ✅ Go to dashboard if logged in
    } else {
      openSignIn(); // ✅ Open Clerk sign-in if not logged in
    }
  };


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
      {/* Soft Glows */}
      <div
        className="absolute top-0 right-0 w-[55%] h-[80%] rounded-full bg-indigo-300 opacity-30 blur-[120px] pointer-events-none"
        style={{ zIndex: 0 }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-[50%] h-[70%] rounded-full bg-purple-300 opacity-25 blur-[130px] pointer-events-none"
        style={{ zIndex: 0 }}
      ></div>

      {/* HERO SECTION */}
      <main className="relative px-6 pt-20 pb-16 sm:pt-24 sm:pb-24 lg:pt-22 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900">
              Take control of your{" "}
              <span className="text-indigo-600">spending flow</span>.
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              SpendFlow helps you track expenses, visualize cash flow, and
              achieve your financial goals — effortlessly.
            </p>
            {!user && (
              <div className="mt-10 flex justify-center lg:justify-start">
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center gap-2 px-8 py-4 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg text-lg font-medium hover:scale-105"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img
                src="/cashflowmoney.png"
                alt="Cash Flow Dashboard"
                className="rounded-2xl z-10 relative"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full blur-3xl opacity-70"></div>
              <div className="absolute top-6 -right-8 w-32 h-32 bg-indigo-300 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="py-20 sm:py-28 bg-white/70 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything you need to manage money smartly
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Simplify your financial life with SpendFlow — built for clarity,
              control, and peace of mind.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 hover:shadow-lg transition-all"
              >
                <div className="mb-4 flex items-center justify-center sm:justify-start">
                  <div className="h-12 w-12 flex items-center justify-center bg-white rounded-xl shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-indigo-50 to-white relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by users worldwide
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="p-8 bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <p className="text-lg text-gray-700 italic">“{t.quote}”</p>
                <footer className="mt-6 flex items-center justify-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    {t.avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{t.author}</p>
                    <p className="text-sm text-gray-500">{t.title}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + FOOTER */}
      <footer className="bg-indigo-600 text-white text-center py-20 relative z-10">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to take charge of your finances?
        </h2>
        <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
          Join thousands using SpendFlow to track, save, and grow their wealth.
        </p>
        <button
          onClick={handleStart}

          className="mt-8 px-10 py-4 rounded-full bg-white text-indigo-600 font-medium hover:bg-indigo-50 shadow-md transition-all hover:scale-105"
        >
          Start Free Today
        </button>

        <div className="mt-10 text-white/60 text-sm border-t border-white/20 pt-6">
          &copy; {new Date().getFullYear()} SpendFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
