import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroImage from "../assets/farmart.jpg";
import heroImage1 from "../assets/farmart1.png";
import heroImage2 from "../assets/farmart2.png";

const HERO_SLIDES = [
  // objectPosition is tuned per-photo so the animals stay in frame on a
  // wide/short banner (default center-crop clips subjects in tall source
  // photos). Adjust the % if a photo gets swapped out.
  { src: heroImage, alt: "Cattle grazing on a Kenyan farm at sunset", objectPosition: "50% 80%" },
  { src: heroImage1, alt: "Livestock on a Farmart-listed farm", objectPosition: "50% 50%" },
  { src: heroImage2, alt: "Livestock on a Farmart-listed farm", objectPosition: "50% 50%" },
];

const HERO_SLIDE_INTERVAL_MS = 5000;

const CATEGORIES = [
  { label: "Cattle", type: "cow", emoji: "" },
  { label: "Goats", type: "goat", emoji: "" },
  { label: "Sheep", type: "sheep", emoji: "" },
  { label: "Poultry", type: "chicken", emoji: "" },
];

const TRUST_POINTS = [
  {
    title: "Verified farmers",
    body: "Every seller is checked before their livestock goes live.",
  },
  {
    title: "Transparent pricing",
    body: "No hidden fees or last-minute haggling at pickup.",
  },
  {
    title: "Secure buying",
    body: "Payments are held safely until you confirm delivery.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Browse",
    body: "Filter by animal, breed, and budget to find the right fit.",
  },
  {
    number: "02",
    title: "Connect",
    body: "Message the farmer directly and agree on the details.",
  },
  {
    number: "03",
    title: "Receive",
    body: "Pay securely and arrange collection or delivery.",
  },
];

function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-farmart-cream">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              style={{ objectPosition: slide.objectPosition }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-farmart-green-deep/90 via-farmart-green-deep/70 to-farmart-green-deep/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-xl">
            <span className="inline-block bg-white/10 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-white/20">
              Kenya&rsquo;s livestock marketplace
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mt-5 leading-tight">
              Fresh from the farm, direct to you.
            </h1>
            <p className="text-white/85 text-lg mt-5 leading-relaxed">
              Buy healthy, farm-raised livestock straight from verified
              farmers across the country &mdash; fair prices, no middlemen,
              and a buying experience built for everyone.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/browse"
                className="bg-farmart-green hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-lg shadow-lg shadow-black/10 transition"
              >
                Browse Livestock
              </Link>
              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-lg border border-white/40 backdrop-blur-sm transition"
              >
                Sell With Farmart
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center gap-2 pb-6">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-gray-800 mb-5">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                to={`/browse?type=${cat.type}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-farmart-cream/60 py-6 hover:border-farmart-green hover:bg-green-50 transition"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="font-semibold text-gray-700 group-hover:text-farmart-green-deep">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST POINTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-800">
            Built for a better buying experience
          </h2>
          <p className="text-gray-600 mt-3">
            Farmart cuts out the guesswork of buying livestock offline, so
            you can source with confidence from wherever you are.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="border-t-4 border-farmart-green pt-4">
              <h3 className="font-display font-bold text-lg text-gray-800">
                {point.title}
              </h3>
              <p className="text-gray-600 mt-2 leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-display text-farmart-green/30 text-5xl font-extrabold">
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-lg text-gray-800 mt-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mt-2 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-farmart-green-deep rounded-2xl px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to find your next livestock?
          </h2>
          <p className="text-white/80 mt-3 max-w-xl mx-auto">
            Explore what farmers across the country have listed today.
          </p>
          <Link
            to="/browse"
            className="inline-block mt-7 bg-white text-farmart-green-deep font-semibold px-8 py-3 rounded-lg hover:bg-farmart-cream transition"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;