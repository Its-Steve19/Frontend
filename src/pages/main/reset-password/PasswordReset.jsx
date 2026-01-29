import React from "react";
import "./reset-password.css";
import { GrLinkNext } from "react-icons/gr";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { toast } from "react-toastify";

const PasswordReset = () => {
  const navigate = useNavigate();

  const [res, setRes] = useState();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [submittingOTP, setSubmitingOTP] = useState(false);
  const [emailSession, setEmailSession] = useState(
    sessionStorage.getItem("email-session")
  );
  console.log(emailSession);
  const emailRef = useRef();
  const [email, setEmail] = useState("");

  const sendResendEmail = async (email) => {
    try {
      setSendingEmail(true);
      const passwordResetUrl = `${
        import.meta.env.VITE_API_URL
      }/reset-password/`;
      const resetPasswordLink = await fetch(passwordResetUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (resetPasswordLink.ok) {
        toast.success("Reset link sent to your email");
        const msg = await resetPasswordLink.json();
        console.log(msg);
        setRes();
        // if ( emailRef.current.value != sessionStorage.getItem('email-session')){
        setEmailSession(email);
        sessionStorage.setItem("email-session", email);
        // }
      } else {
        const status = resetPasswordLink.status;
        console.log(status);
        if (status === 404) {
          setRes("No user with the provided email");
        } else {
          setRes("Error sending reset link");
        }
        toast.error(res);
      }
    } catch (error) {
      toast.error("Error resetting password");
    } finally {
      setSendingEmail(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setRes();
    sendResendEmail(email);
  };
  return (
    <div className="password-reset">
      <div>
        <h1>Reset your Gigitise password</h1>
        <article>
          We {emailSession ? "sent" : "will send"} a reset link to
          {emailSession ? (
            <>
              <span style={{ color: "#7fc2f5" }}>
                {" "}
                {sessionStorage.getItem("email-session")}{" "}
              </span>
              <br />
              <span>Use the link in your inbox to reset your password</span>
            </>
          ) : (
            <span> your email</span>
          )}
        </article>
        {
          <form className="reset-form" onSubmit={resetPassword}>
            <div>
              <MdOutlineMail
                className="username-icon"
                color="#7fc2f5"
                size={25}
              />
              <input
                required
                defaultValue={
                  emailSession && sessionStorage.getItem("email-session")
                }
                readOnly={false}
                type="email"
                id="email"
                placeholder="Registered email to receive link"
                ref={emailRef}
              />
            </div>
            <div className="submit-items-reset">
              {sendingEmail ? (
                <PulseLoader size={10} color="#7fc2f5" />
              ) : emailSession ? (
                <button
                  className="regenerate-link"
                  onClick={() => resetPassword}
                >
                  Resend Link
                </button>
              ) : (
                <button
                  className="regenerate-link"
                  onClick={() => resetPassword}
                >
                  Send Link
                </button>
              )}
            </div>
          </form>
        }
        {res && (
          <div className="res-error">
            <article>{res}</article>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
