import { useEffect, useState } from "react";
import axios from "axios";

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [rentals, setRentals] = useState([]);
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${base}/api/sales`, { headers: { Authorization: token } });
        // filter out incomplete sales (no buyer info)
        const filteredSales = (res.data || []).filter(s => s.user && (s.user.email || s.user.name));
        setSales(filteredSales);
      } catch (err) {
        console.error("fetchSales", err.response || err.message || err);
      }
    };

    const fetchRentals = async () => {
      try {
        const res = await axios.get(`${base}/api/rentals`, { headers: { Authorization: token } });
        // filter out incomplete rentals (no renter info)
        const filteredRentals = (res.data || []).filter(r => r.user && (r.user.email || r.user.name));
        setRentals(filteredRentals);
      } catch (err) {
        console.error("fetchRentals", err.response || err.message || err);
      }
    };

    fetchSales();
    fetchRentals();
  }, [token, base]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activity — Sales & Rentals</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sales</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-gray-600">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Plant</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Buyer</th>
                  <th className="px-4 py-2 text-left">Order ID</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-2 text-left">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-left">{s.plant?.name || "—"}</td>
                    <td className="px-4 py-2 text-left">{s.quantity}</td>
                    <td className="px-4 py-2 text-left">{s.price}</td>
                    <td className="px-4 py-2 text-left">{s.user?.email || s.user?.name || "—"}</td>
                    <td className="px-4 py-2 text-left">{s.orderId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Rentals</h2>
        {rentals.length === 0 ? (
          <p className="text-sm text-gray-600">No rentals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Plant</th>
                  <th className="px-4 py-2 text-left">Renter</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="px-4 py-2 text-left">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-left">{r.plant?.name || "—"}</td>
                    <td className="px-4 py-2 text-left">{r.user?.email || r.user?.name || "—"}</td>
                    <td className="px-4 py-2 text-left">{r.status}</td>
                    <td className="px-4 py-2 text-left">{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSales;
