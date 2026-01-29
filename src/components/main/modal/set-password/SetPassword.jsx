import React from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import "./modal-password.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";

const SetPassword = () => {
  const navigate = useNavigate();

  const { uidb64, token } = useParams();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resErr, setResErr] = useState();

  const togglePassword = () => {
    setVisible(!visible);
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const password1 = e.target.password1.value;
    const password2 = e.target.password2.value;

    setLoading(true);

    try {
      const passwordResetUrl = `${
        import.meta.env.VITE_API_URL
      }/password-reset-complete/`;

      const resetPassword = await fetch(passwordResetUrl, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password_1: password1,
          password_2: password2,
          uidb64: uidb64,
          token: token,
        }),
      });

      if (resetPassword.ok) {
        toast.success("Password reset successfully");
        setResErr();
        sessionStorage.removeItem("email-session");
        navigate("/");
      } else {
        const resErr = await resetPassword.json();
        console.log(resErr);
        setResErr(Object.values(resErr));
        console.log(resErr);
      }
    } catch (error) {
      toast.error("Error resetting your password");
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-div">
      <div>
        <h1>Lets set your password again</h1>
        {resErr && (
          <div>
            {resErr?.map((error, index) => {
              return (
                <li key={index} style={{ color: "orange" }}>
                  {error[0]}
                </li>
              );
            })}
          </div>
        )}
        <form className="password-reset-form" onSubmit={submitPassword}>
          <div className="password-div">
            <MdLock className="password-icon-reset" size={20} />
            <input
              required
              id="password1"
              type={visible ? "text" : "password"}
              placeholder="Password"
            />
          </div>
          <div className="password-div">
            <MdLock className="password-icon-reset" size={20} />
            <input
              required
              id="password2"
              placeholder="Confirm password"
              type={visible ? "text" : "password"}
            />
            {visible ? (
              <IoEye
                onClick={togglePassword}
                className="password-icon-eye-reset"
                size={20}
              />
            ) : (
              <IoEyeOff
                onClick={togglePassword}
                className="password-icon-eye-reset"
                size={20}
              />
            )}
          </div>
          <div className="submit-items">
            {loading ? (
              <PulseLoader size={10} color="#7fc2f5" />
            ) : (
              <button type="submit">Set Password</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
