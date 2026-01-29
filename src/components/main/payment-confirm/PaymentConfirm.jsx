import { useEffect, useState } from "react";
import "./payment-stripe.css";

const PaymentConfirm = () => {
  const [details, setDetails] = useState({
    email: null,
    status: "Waiting",
    amount: null,
    time: null,
  });

  const getPaymentStatus = async (session) => {
    const stripeCheckoutUrl = `${
      import.meta.env.VITE_API_URL
    }/check-stripe-status?session_id=${session}`;
    const getCheckoutStatus = await fetch(stripeCheckoutUrl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (getCheckoutStatus.ok) {
      const checkOutStatus = await getCheckoutStatus.json();
      console.log(checkOutStatus);
      setDetails({
        email: checkOutStatus?.email,
        status: checkOutStatus?.status,
        amount: checkOutStatus?.amount,
        time: checkOutStatus?.time,
      });
    }
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");
    const orderId = urlParams.get("order_id");

    getPaymentStatus(sessionId, orderId);
  }, []);
  return (
    <div className="stripe-payment">
      <div>
        <h1>Stripe Payment</h1>
        <div className="details">
          <span>
            Transaction Status: {details.status ? details.status : "---"}{" "}
          </span>
          <span>Peformed by {details.email ? details.email : "---"}</span>
          <span className="amount">
            ${details.amount ? details.amount : "---"}
          </span>
        </div>
        <button className="home-btn" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirm;
