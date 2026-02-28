import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [recentEmails, setRecentEmails] = useState([]);

  useEffect(() => {
    if (user && user.role === "admin") navigate("/admin");
    if (user && user.role === "customer") navigate("/plants");
   }, [user]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentEmails");
      if (stored) setRecentEmails(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await axios.post(`${base}/api/auth/login`, { email, password });
      // pass remember flag so auth provider stores token appropriately
      login(res.data, remember);

      // Save recent email for autofill (keep max 5, dedup)
      try {
        const next = [email, ...recentEmails.filter(e => e !== email)].slice(0, 5);
        setRecentEmails(next);
        localStorage.setItem("recentEmails", JSON.stringify(next));
      } catch (e) {
        // ignore storage errors
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message || err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded"
      autoComplete="on"
    >
      <h2 className="text-xl font-bold mb-4 text-green-700">Login 🔐</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        list="recent-emails"
        autoComplete="email"
        required
      />
      <datalist id="recent-emails">
        {recentEmails.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <span className="text-sm">Remember me</span>
      </label>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
