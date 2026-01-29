import React, { useState } from "react";
import "./payment.css";
import StripeCheckoutForm from "../../../components/main/checkout/StripeCheckout";
import { useAuthContext } from "../../../providers/AuthProvider";

const StripePayment = ({ showPaypal, order_id }) => {
  const [clientSecret, setClientSecret] = useState();
  const { userToken } = useAuthContext();
  const stripeCheckoutUrl = `${import.meta.env.VITE_API_URL}/order-checkout/`;
  const [loadingForm, setLoadingForm] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getCheckoutSession = async (order_id) => {
    setLoadingForm(true);
    showPaypal(false);
    try {
      const getCheckoutSession = await fetch(stripeCheckoutUrl, {
        method: "post",
        headers,
        body: JSON.stringify({
          order_id: order_id,
        }),
      });

      if (getCheckoutSession.ok) {
        const checkOutSession = await getCheckoutSession.json();
        console.log(checkOutSession);
        setClientSecret(checkOutSession.client_secret);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForm(false);
    }
  };
  return (
    <>
      <section>
        {!clientSecret && (
          <div className="stripe-button">
            <button onClick={() => getCheckoutSession(order_id)}>
              Pay With Stripe
            </button>
          </div>
        )}
      </section>
      {loadingForm ? (
        <span>Loading...</span>
      ) : (
        <>
          {clientSecret && (
            <>
              <StripeCheckoutForm clientSecret={clientSecret} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default StripePayment;
