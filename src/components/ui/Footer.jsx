import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Browse Livestock", to: "/browse" },
  { label: "Sell With Farmart", to: "/register" },
  { label: "My Orders", to: "/orders" },
  { label: "Cart", to: "/cart" },
];

const CATEGORY_LINKS = [
  { label: "Cattle", to: "/browse?type=cow" },
  { label: "Goats", to: "/browse?type=goat" },
  { label: "Sheep", to: "/browse?type=sheep" },
  { label: "Poultry", to: "/browse?type=chicken" },
];

export default function Footer() {
  return (
    <footer className="bg-farmart-green-deep text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-2xl font-bold">Farmart</p>
            <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-[220px]">
              Kenya&rsquo;s livestock marketplace &mdash; connecting verified
              farmers with buyers, no middlemen.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/60 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/80 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/60 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/80 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/60 mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>support@farmart.co.ke</li>
              <li>+254 700 000 000</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Farmart. Livestock Marketplace KE
          </p>
          <p className="text-white/50 text-xs">Built for farmers and buyers across Kenya</p>
        </div>
      </div>
    </footer>
  );
}