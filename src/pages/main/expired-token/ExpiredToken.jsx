import React from "react";
import { useNavigate } from "react-router-dom";
import "./token.css";
import gigitise from "../../../assets/logo/gigitise.svg";
const ExpiredToken = () => {
  const navigate = useNavigate();
  return (
    <div className="expired-token">
      <div className="token-box">
        <img className="logo-token" src={gigitise} alt="" />
        <article>Gigitise</article>
        <h1>Expired Link</h1>
        <article>
          The link you provided to reset your password has been used
        </article>
        <button
          className="regenerate-link"
          onClick={() => navigate("/reset-password")}
        >
          Generate a new link
        </button>
      </div>
    </div>
  );
};

export default ExpiredToken;
