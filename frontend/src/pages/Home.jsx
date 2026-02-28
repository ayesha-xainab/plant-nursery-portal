import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-green-50 overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        {/* Background Image */}
        <img
          src="/nursery.jpg"
          alt="Plant Nursery"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-green-900/70" />

        {/* Center Content */}
        <div className="relative z-10 max-w-3xl text-center px-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
              Plant Nursery Portal
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white leading-relaxed">
              Discover, buy, rent, and care for plants — all in one digital nursery 🌱
            </p>

            <Link
              to="/plants"
              className="inline-block mt-10 bg-white text-green-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-white-500 hover:scale-105 transition"
            >
              Explore Plants
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-16 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-900 text-center mb-14">
          What You Can Do 🌿
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
          <Feature
            title="🛒 Purchase Plants"
            desc="Buy indoor, outdoor, flowering, and medicinal plants with complete care instructions."
            link="/purchase"
          />

          <Feature
            title="🌱 Borrow Plants"
            desc="Rent plants for offices, events, and short-term décor — flexible and easy"
            link="/plant-rentals"
            highlight
          />

          <Feature
            title="🌼 Gardening Help"
            desc="Simple, beginner-friendly tips to keep your plants healthy and thriving."
            link="/help"
          />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ title, desc, link, highlight = false }) => (
  <div
    className={`relative bg-white/80 backdrop-blur-xl border border-green-200 rounded-[2.5rem] p-9 shadow-lg hover:shadow-2xl transition
    ${highlight ? "md:-translate-y-6" : ""}`}
  >
    {highlight && (
      <span className="absolute -top-4 left-8 bg-green-700 text-white text-sm px-4 py-1 rounded-full shadow">
        Popular
      </span>
    )}

    <h2 className="text-3xl font-bold text-green-900 mb-4">
      {title}
    </h2>

    <h4 className="text-green-700 text-lg leading-relaxed mb-6">
      {desc}
    </h4>

    <Link
      to={link}
      className="text-green-700 text-xl font-semibold hover:underline"
    >
      Explore →
    </Link>
  </div>
);

export default Home;
