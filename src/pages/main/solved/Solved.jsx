import React from "react";
import "./solved.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../providers/AuthProvider";
// import OrderComponent from '../../../components/main/order-component/OrderComponent';
const Solved = () => {
  const addToWaitList = async (email) => {
    const subURL = `${import.meta.env.VITE_API_URL}/subscribe-letter/`;
    console.log(email);
    try {
      const add = await fetch(subURL, {
        method: "post",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (add.ok) {
        toast.success("We added you to the wait list");
      } else {
        toast.warn("We failed to add you. Check again later!");
      }
    } catch (error) {
      toast.error("Failed to add you to list. Try again later!");
    }
  };

  const { loadedUserProfile } = useAuthContext();

  return (
    <div className="solved">
      <div className="coming-soon">
        <article>Coming soon</article>
        <div>
          <div>
            <IoCloudDownloadOutline size={60} />
          </div>
          <article>
            You will be able to download custom solved essays & assignments
            published by our expert freelancers
          </article>
        </div>
        <button onClick={() => addToWaitList(loadedUserProfile.email)}>
          Join Wait List
        </button>
      </div>
    </div>
  );
};

export default Solved;
