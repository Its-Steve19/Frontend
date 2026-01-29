import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OnJZVD7SHURfEfZXTSV7LPklbHVBSTLwp0svGLgt62sAm6z1pAVGVGCkPvsFyBz9Z2E6t3PDLVAsuFXYmg0uu0b00UapULd5m"
);

const StripeCheckoutForm = ({ clientSecret }) => {
  return (
    <section className="checkout stripe-form">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </section>
  );
};

export default StripeCheckoutForm;
