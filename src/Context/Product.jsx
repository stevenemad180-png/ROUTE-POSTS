import React, { useContext, useEffect } from "react";
import { AuthContext } from "./Contexttoken";
import { useNavigate } from "react-router-dom";

function Product({ children }) {
  const navigate = useNavigate();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (userToken === null) {
      navigate("/register");
    }
  }, [userToken, navigate]);

  if (userToken === null) {
    return null;
  }

  return children;
}

export default Product;
