import React from "react";
import "./login.css";
import { useAuthContext } from "../../../providers/AuthProvider";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import gigitise from "../../../assets/logo/gigitise.svg";
// import { IoMdEye } from "react-icons/md";
// import { IoMdEyeOff } from "react-icons/md";
import { toast } from "react-toastify";

const Login = () => {
  const iconSize = 30;
  const { loginError, handleLogin, loading } = useAuthContext();
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const [password, setPassword] = useState("");

  const togglePassword = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (loginError.error) {
      setPassword("");
      console.log("Error");
      toast.error(loginError.error);
    }
  }, [loginError]);

  return (
    <div className="login">
      <div className="login-box">
        <img src={gigitise} style={{ width: "8rem" }} alt="logo" />
        <h1 className="heading">Gigitise</h1>
        <article>Welcome back!</article>
        <form onSubmit={handleLogin} className="login-form">
          {loginError.error && (
            <span
              style={{
                color: "orange",
              }}
            >
              {loginError.error}
            </span>
          )}
          <div className="login-content">
            <FiUser className="username-icon" size={iconSize} />
            <input required id="username" type="text" placeholder="Username" />
          </div>
          <div className="login-content">
            <MdLock className="password-icon" size={iconSize} />
            <input
              required
              id="password"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={visible ? "text" : "password"}
              placeholder="Password"
            />
            {visible ? (
              <IoEye
                title="Hide password"
                onClick={togglePassword}
                className="password-icon-eye"
                size={20}
              />
            ) : (
              <IoEyeOff
                title="See password"
                onClick={togglePassword}
                className="password-icon-eye"
                size={20}
              />
            )}
          </div>
          <div className="submit-credentials">
            <button>
              {loading ? <PulseLoader color="#fff" size={10} /> : "E N T E R"}
            </button>
          </div>
          <div className="register-prompt">
            <article>
              Do not have an account?
              <span>
                <Link to="/register"> Register</Link>
              </span>
            </article>
            <article className="reset-password">
              <Link to="/reset-password">Forgot password</Link>
            </article>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
