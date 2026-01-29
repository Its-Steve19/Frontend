import React from "react";
import { useRef, useState } from "react";
import "./activate-account.css";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthContext } from "../../../../../providers/AuthProvider";
import { toast } from "react-toastify";

const ActivateAccount = ({ token, email }) => {
  const otpRef = useRef();
  const [error, setError] = useState();
  const [ok, setOk] = useState();
  const [loading, setLoading] = useState(false);
  const { getUserProfile } = useAuthContext();

  const submitOTP = async (otp) => {
    setLoading(true);
    setError();
    const otpURL = `${import.meta.env.VITE_API_URL}/verify-account/`;
    console.log("submitting otp");
    try {
      const otpSubmit = await fetch(otpURL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp: otp,
        }),
      });

      if (otpSubmit.ok) {
        toast.success("Account activated successfully");
        const res = await otpSubmit.json();
        getUserProfile();
      } else {
        const res = await otpSubmit.json();
        setError(res.error);
        console.log(res);
      }
    } catch (error) {
      console.error(error);
      if (error) {
        setError("Error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    console.log("Resending otp");
    const otpURL = `${import.meta.env.VITE_API_URL}/resend-otp/`;
    setLoading(true);
    setOk();
    try {
      const resendOTP = await fetch(otpURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resendOTP.ok) {
        setOk("OTP Resend successful");
        toast.success("OTP resend successfully");
      } else {
        const res = await resendOTP.json();
        setError(res);
        toast.error("Error sending OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const listenOTP = () => {
    const otp = otpRef.current.value;
    setError();
    if (otp.length === 6) {
      submitOTP(otp);
    }
  };
  return (
    <>
      <div className="activate-account">
        <h1>Activate your Gigitise account</h1>
        <article>
          We have sent an OTP to your email,{" "}
          <span style={{ color: "#7fc2f5" }}>{email}</span>
        </article>
        <input
          ref={otpRef}
          className="otp-input"
          type="text"
          maxLength={6}
          onChange={listenOTP}
        />
        {loading && <PulseLoader size={10} color="#7fc2f5" />}
        {ok && <article>{ok}</article>}

        <div className="error-box">
          {!loading && (
            <button className="regenerate-otp" onClick={resendOTP}>
              Resend OTP
            </button>
          )}
          {error && <article style={{ color: "orange" }}>{error}</article>}
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default ActivateAccount;
