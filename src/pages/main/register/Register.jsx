import React from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { useAuthContext } from "../../../providers/AuthProvider";
import PulseLoader from "react-spinners/PulseLoader";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// import
const Register = () => {
  const iconSize = 30;
  const passwordRef1 = useRef();
  const passwordRef2 = useRef();

  const { loadingReg, handleRegister, successRegister, registerError } =
    useAuthContext();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [visible, setVisible] = useState(false);

  const togglePassword = () => {
    setVisible(!visible);
  };

  return (
    <div className="register">
      <div className="register-info">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
          }}
        >
          Let's get you started!
        </h1>
        <h1 style={{ fontSize: "1.5rem" }}>
          Create your Gigitise account and get access to,
        </h1>
        <div className="items-register">
          <li>
            {" "}
            <span>
              <IoMdCheckmarkCircleOutline size={30} />
            </span>{" "}
            Unlimited pool of freelancers and writers
          </li>
          <li>
            {" "}
            <span>
              <IoMdCheckmarkCircleOutline size={30} />
            </span>{" "}
            Original zero plagiarism work
          </li>
          <li>
            {" "}
            <span>
              <IoMdCheckmarkCircleOutline size={30} />
            </span>{" "}
            Unlock new talents from our global experts
          </li>
          <li>
            {" "}
            <span>
              <IoMdCheckmarkCircleOutline size={30} />
            </span>{" "}
            Access 50+ different gig categories handles by our professional
            freelancers, both technical and non-technical
          </li>
          <li>
            {" "}
            <span>
              <IoMdCheckmarkCircleOutline size={30} />
            </span>{" "}
            Access our archive of different tasks completed by our verified
            freelancers
          </li>
        </div>
      </div>
      <div className="register-wrapper">
        <div className="register-box">
          <h1>
            Gigitise
            <br />
            Account Registration
          </h1>
          <form onSubmit={handleRegister} className="register-form">
            {registerError &&
              registerError.map((error) => {
                console.log(error);
                return error.map((e) => {
                  return (
                    <li
                      style={{
                        color: "orange",
                      }}
                    >
                      {e}
                    </li>
                  );
                });
              })}
            <div className="register-content">
              <FiUser className="username-icon-r" size={iconSize} />
              <input
                required
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="register-content">
              <MdOutlineMail className="username-icon-r" size={iconSize} />
              <input required id="email" type="email" placeholder="email" />
            </div>
            <div className="register-content">
              <MdLock className="password-icon-r" size={iconSize} />
              <input
                required
                id="password1"
                ref={passwordRef1}
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                type={visible ? "text" : "password"}
                placeholder="Password"
              />
            </div>
            <div className="register-content">
              <MdLock className="password-icon-r" size={iconSize} />
              <input
                required
                id="password2"
                ref={passwordRef2}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type={visible ? "text" : "password"}
                placeholder="Confirm password"
              />
              {visible ? (
                <IoEye
                  title="Hide password"
                  onClick={togglePassword}
                  className="password-icon-eye-r"
                  size={20}
                />
              ) : (
                <IoEyeOff
                  title="See password"
                  onClick={togglePassword}
                  className="password-icon-eye-r"
                  size={20}
                />
              )}
            </div>
            <div className="submit-credentials">
              <button>
                {loadingReg ? (
                  <PulseLoader color="#fff" size={10} />
                ) : (
                  "R E G I S T E R"
                )}
              </button>
              {/* <button>
                            G O O G L E
                        </button> */}
            </div>
            <div className="register-prompt">
              <article>
                Already have an account?
                <span>
                  <Link to="/login"> Login</Link>
                </span>
              </article>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
