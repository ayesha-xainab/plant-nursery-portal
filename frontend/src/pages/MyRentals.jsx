import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [payment, setPayment] = useState({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "" });
  const [shipping, setShipping] = useState({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
  const location = useLocation();

  const token = localStorage.getItem("token");

  const fetchRentals = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rentals/my`, {
        headers: { Authorization: token },
      });
      setRentals(res.data);
    } catch (err) {
      console.error(err);
      setRentals([]);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plantId = params.get("plantId");
    if (plantId) {
      // fetch plant details to show rent/day
      (async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/plants/${plantId}`);
          setSelectedPlant(res.data);
        } catch (err) {
          console.error(err);
        }
      })();
    }

    fetchRentals();
  }, [location.search]);

  const returnPlant = async (id) => {
    if (!token) return;
    await axios.put(`${import.meta.env.VITE_API_URL}/api/rentals/return/${id}`, {}, { headers: { Authorization: token } });
    fetchRentals();
  };

  const handleConfirm = async (e) => {
    e && e.preventDefault();
    if (!token || !selectedPlant) return;

    // validate shipping
    const { fullName, address, city, postalCode, phone } = shipping;
    if (!fullName || !address || !city || !postalCode || !phone) {
      alert("Please fill shipping information (name, address, city, postal code, phone)");
      return;
    }

    if (paymentMethod === "card") {
      const { nameOnCard, cardNumber, expiry, cvv } = payment;
      if (!nameOnCard || !cardNumber || !expiry || !cvv) {
        alert("Please fill card payment details");
        return;
      }
    }

    try {
      const payload = {
        plantId: selectedPlant._id,
        days,
        shipping,
        payment: paymentMethod === "cod" ? { type: "cod" } : { ...payment, type: "card" },
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/rentals/borrow`, payload, { headers: { Authorization: token } });
      alert("Rental confirmed 🌿");
      setSelectedPlant(null);
      setDays(1);
      setShipping({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
      setPayment({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "" });
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.message || "Rental failed");
    }
  };

  const msToTime = (ms) => {
    if (!ms || ms <= 0) return "0d 0h 0m";
    const totalMinutes = Math.floor(ms / (60 * 1000));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Rentals 🌿</h1>

      {/* Rental creation form when navigated with plantId */}
      {selectedPlant && (
        <div className="bg-white p-4 mb-4 shadow rounded">
          <h2 className="font-semibold text-lg">Rent: {selectedPlant.name}</h2>
          <p className="text-sm text-gray-600">Rent per day: Rs. {selectedPlant.rentPerDay}</p>

          <div className="mt-3">
            <label className="block mb-1">Number of days</label>
            <input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} className="border p-2 w-32" />
            <div className="mt-2 font-semibold">Total Rent: Rs. {(days * (selectedPlant.rentPerDay || 0)).toFixed(2)}</div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Shipping information</h4>
            <input placeholder="Full name" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="w-full border p-2 mb-2" />
            <input placeholder="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full border p-2 mb-2" />
            <div className="flex gap-3">
              <input placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="flex-1 border p-2 mb-2" />
              <input placeholder="Postal code" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="w-36 border p-2 mb-2" />
            </div>
            <input placeholder="Contact phone" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full border p-2 mb-2" />
          </div>

          <div className="mt-3">
            <h4 className="font-semibold mb-2">Payment method</h4>
            <label className="mr-4">
              <input type="radio" name="pay" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <span className="ml-2">Cash on Delivery</span>
            </label>
            <label className="ml-6">
              <input type="radio" name="pay" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <span className="ml-2">Card Payment</span>
            </label>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handleConfirm} className="space-y-3 mt-3">
              <div>
                <label className="block mb-1">Name on card</label>
                <input required value={payment.nameOnCard} onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })} className="w-full border p-2" />
              </div>
              <div>
                <label className="block mb-1">Card number</label>
                <input required value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} className="w-full border p-2" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1">Expiry</label>
                  <input required value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} className="w-full border p-2" />
                </div>
                <div style={{ width: 140 }}>
                  <label className="block mb-1">CVV</label>
                  <input required value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} className="w-full border p-2" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedPlant(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Pay & Confirm</button>
              </div>
            </form>
          )}

          {paymentMethod === "cod" && (
            <div className="flex justify-end gap-3 mt-3">
              <button type="button" onClick={() => setSelectedPlant(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="button" onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded">Confirm Rental (COD)</button>
            </div>
          )}
        </div>
      )}

      {/* Existing rentals */}
      {rentals.map((r) => (
        <div key={r._id} className="bg-white p-4 mb-3 shadow rounded">
          <h2 className="font-semibold">{r.plant?.name}</h2>
          <p>Status: {r.status}</p>
          {r.status === "borrowed" && (
            <>
              <p>Due in: {msToTime(r.remainingMs)}</p>
              <p>Rent paid: Rs. {r.totalRent?.toFixed ? r.totalRent.toFixed(2) : r.totalRent}</p>
              <button onClick={() => returnPlant(r._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">Return</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyRentals;
