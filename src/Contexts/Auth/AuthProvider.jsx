import { React, createContext, useState } from "react";
export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const authLogout = () => {
    setAuth({});
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };
  return (
    <AuthContext.Provider value={{ auth, setAuth, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
