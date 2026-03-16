import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function ContextToken({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem("tkn"));
  const [userid, setUserid] = useState(null);

  function saveToken(token) {
    setUserToken(token);

    if (token) {
      localStorage.setItem("tkn", token);
    } else {
      localStorage.removeItem("tkn");
      setUserid(null);
    }
  }

  function decodetoken() {
    try {
      const decoded = jwtDecode(userToken);
      console.log("decoded token", decoded);

      setUserid(decoded?.user || null);
    } catch (error) {
      console.log("decode error", error);
      setUserid(null);
    }
  }

  useEffect(() => {
    if (userToken) {
      decodetoken();
    } else {
      setUserid(null);
    }
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ userToken, userid, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
}