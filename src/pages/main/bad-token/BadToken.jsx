import React from "react";
import { useNavigate } from "react-router-dom";
import gigitise from "../../../assets/logo/gigitise.svg";

const BadToken = () => {
  const navigate = useNavigate();
  return (
    <div className="bad-token">
      <div className="token-box">
        <img className="logo-token" src={gigitise} alt="" />
        <article>Gigitise</article>
        <h1>Bad Link</h1>
        <article>The link you provided does not work</article>
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

export default BadToken;
