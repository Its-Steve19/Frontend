import "./payment.css";
import { IoIosClose } from "react-icons/io";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const PaypalPayment = ({ show, orderId, getOrder }) => {
  const createOrder = async () => {
    console.log("Creating order checkout...");
    const orderCreateUrl = `${import.meta.env.VITE_API_URL}/create-order/`;
    try {
      return fetch(orderCreateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
        }),
      })
        .then((response) => response.json())
        .then((order) => order.id);
    } catch (error) {
      toast.error("Error processing transaction, please try again", {
        autoClose: 2000,
      });
    }
  };

  const onApprove = async (data) => {
    console.log("Order approved...");
    console.log("Data: ", data);
    const capturePaymentUrl = `${
      import.meta.env.VITE_API_URL
    }/capture-payment/`;
    try {
      return fetch(capturePaymentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paypalId: data.orderID,
          orderId: orderId,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          toast.success(
            "Transaction completed.\nProceed to complete order now",
            {
              autoClose: 2000,
              position: "top-right",
            }
          );
          show(false);
          getOrder(orderId);
        });
    } catch (error) {
      toast.error("Transaction error, please try again", {
        autoClose: 2000,
      });
    }
  };

  const paypalOptions = {
    "client-id": `AXTNDnVO8iNy8GgqF6gRHGHLptXoDhMIWAyCQZK-jytA5gmPBGBlk_cUsA9n38Go06bvwkKGCGI7gKpe`,
    // "client-id":`${import.meta.env.CLIENT_ID_PAYPAL}`,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="paypal-payment-modal">
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          style={{
            position: "relative",
            layout: "horizontal",
            color: "gold",
            height: 36,
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalPayment;
