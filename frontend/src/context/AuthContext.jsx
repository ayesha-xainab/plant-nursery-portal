import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // prefer localStorage (remembered), fall back to sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");
    const name = localStorage.getItem("name") || sessionStorage.getItem("name");

    if (token && role) {
      setUser({ name, role });
    }
  }, []);

  // if remember=true store in localStorage, otherwise use sessionStorage
  const login = (data, remember = true) => {
    if (remember) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
    } else {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("name", data.name);
    }

    setUser({ name: data.name, role: data.role });
  };

  const logout = () => {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
