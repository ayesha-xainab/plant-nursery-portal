import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [payment, setPayment] = useState({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "", type: "cod" });
  const [shipping, setShipping] = useState({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: token },
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const updateQty = async (plantId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { plantId, quantity: 0 },
        { headers: { Authorization: token } }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { plantId, quantity: newQuantity },
        { headers: { Authorization: token } }
      );
    }
    fetchCart(); // Refresh cart
  };

  const checkout = () => {
    setShowCheckoutForm(true);
  };

  const handleConfirm = async (e) => {
    e && e.preventDefault();
    try {
      // Client-side validation for shipping
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

      const payload = paymentMethod === "cod" ? { payment: { type: "cod" }, shipping } : { payment: { ...payment, type: "card" }, shipping };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/checkout`, payload, {
        headers: { Authorization: token },
      });
      const orderId = res.data.orderId;
      alert(`Order placed 🌱\nConfirmation: ${orderId}`);
      setCart({ items: [] });
      setShowCheckoutForm(false);
      setPaymentMethod("cod");
      setPayment({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "", type: "cod" });
      setShipping({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    }
  };

  const handleConfirmCod = async () => {
    try {
      // validate shipping on client
      const { fullName, address, city, postalCode, phone } = shipping;
      if (!fullName || !address || !city || !postalCode || !phone) {
        alert("Please fill shipping information (name, address, city, postal code, phone)");
        return;
      }

      const payload = { payment: { type: "cod" }, shipping };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/checkout`, payload, {
        headers: { Authorization: token },
      });
      const orderId = res.data.orderId;
      alert(`Order placed 🌱\nConfirmation: ${orderId}`);
      setCart({ items: [] });
      setShowCheckoutForm(false);
      setPaymentMethod("cod");
      setPayment({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "", type: "cod" });
      setShipping({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    }
  };

  const handleCancel = () => {
    setShowCheckoutForm(false);
  };

  const total = cart.items.reduce((sum, item) => {
    const price = item.plant?.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  if (!user) {
    return <p className="p-6">Please log in to view your cart. 🛒</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p className="p-6">Cart is empty 🛒</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart 🛒</h2>

      {cart.items.map((item) => (
        <div key={item._id} className="border p-3 mb-2 flex justify-between items-center">
          <span>{item.plant.name} × {item.quantity}</span>
          <div>
            <button
              onClick={() => updateQty(item.plant._id, item.quantity - 1)}
              className="bg-red-500 text-white px-2 py-1 rounded mr-2"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQty(item.plant._id, item.quantity + 1)}
              className="bg-green-500 text-white px-2 py-1 rounded ml-2"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={checkout}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        Checkout
      </button>
      <div className="mt-3 text-right text-lg font-semibold">Total: Rs. {total.toFixed(2)}</div>
      {showCheckoutForm && (
        <div className="mt-6 bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-bold mb-3">Checkout</h3>

          <div className="mb-3">
            <h4 className="font-semibold mb-2">Shipping information</h4>
            <div className="mb-2">
              <input placeholder="Full name" required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="w-full border p-2 mb-2" />
              <input placeholder="Address" required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full border p-2 mb-2" />
              <div className="flex gap-3">
                <input placeholder="City" required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="flex-1 border p-2 mb-2" />
                <input placeholder="Postal code" required value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="w-36 border p-2 mb-2" />
              </div>
              <input placeholder="Contact phone" required value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full border p-2 mb-2" />
            </div>
          </div>

          <div className="mb-3">
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
            <form onSubmit={handleConfirm} className="space-y-3">
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
                <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Pay & Confirm</button>
              </div>
            </form>
          )}

          {paymentMethod === "cod" && (
            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
              <button type="button" onClick={handleConfirmCod} className="px-4 py-2 bg-green-600 text-white rounded">Confirm Order (COD)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
