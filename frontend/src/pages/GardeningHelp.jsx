const GardeningHelp = () => {
  const tips = [
    {
      title: "Watering Basics 💧",
      desc: "Most indoor plants prefer moist soil but hate standing water. Always check the topsoil before watering."
    },
    {
      title: "Sunlight Matters ☀️",
      desc: "Bright indirect light is ideal for most plants. Avoid harsh afternoon sun."
    },
    {
      title: "Pot & Soil 🪴",
      desc: "Choose pots with drainage holes and well-aerated soil to prevent root rot."
    },
    {
      title: "Fertilizing 🌱",
      desc: "Feed plants once a month during growing seasons with organic fertilizer."
    }
  ];

  const faqs = [
    {
      q: "How often should I water my plants?",
      a: "It depends on the plant type. Indoor plants usually need watering once or twice a week."
    },
    {
      q: "Can rented plants be used for outdoor events?",
      a: "Yes, but ensure shade and proper watering during the event."
    },
    {
      q: "What if my plant starts wilting?",
      a: "Move it to indirect sunlight and check watering schedule."
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Gardening Care & Help 🌿
      </h1>

      {/* Tips Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-xl p-5"
          >
            <h2 className="text-lg font-semibold mb-2">
              {tip.title}
            </h2>
            <p className="text-gray-600">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <h2 className="text-2xl font-semibold mb-4">
        Frequently Asked Questions ❓
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-4"
          >
            <p className="font-medium">{faq.q}</p>
            <p className="text-gray-600 mt-1">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GardeningHelp;
