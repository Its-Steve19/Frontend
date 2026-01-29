import Modal from "./modal";
import { useState, useCallback, useMemo } from "react";
import { IoStar } from "react-icons/io5";
import { useRef } from "react";
import { useAuthContext } from "../../../../providers/AuthProvider";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

const AddRating = ({
  showAddRatingModal,
  setShowAddRatingModal,
  orderId,
  setOrderContent,
}) => {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const messageRef = useRef();
  const { userToken } = useAuthContext();

  async function submitRating() {
    const message = messageRef.current.value;
    console.log(message);
    const ratingUrl = `${
      import.meta.env.VITE_API_URL
    }/orders/${orderId}/rating/`;
    const headers = {
      "content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    try {
      setSubmitting(true);
      const sendRating = await fetch(ratingUrl, {
        method: "post",
        headers,
        body: JSON.stringify({
          stars: rating,
          message: message,
        }),
      });

      if (sendRating.ok) {
        const response = await sendRating.json();
        setOrderContent(response);
        setShowAddRatingModal(false);
        console.log("Raating added");
        toast.success("Wohoo!, thank you for rating.");
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lets try that again!");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Modal showModal={showAddRatingModal} setShowModal={setShowAddRatingModal}>
      <div className=" py-6 flex flex-col justify-center sm:py-12">
        <div className="py-3 sm:max-w-lg sm:mx-auto">
          <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
            <div className="px-12 py-5">
              <h2 className="text-gray-800 text-3xl font-semibold">
                Your opinion matters to us!
              </h2>
            </div>
            <div className="bg-gray-200 w-full flex flex-col items-center">
              <div className="flex flex-col items-center py-6 space-y-3">
                <span className="text-lg text-gray-800">
                  How was the quality of work?
                </span>
                <div className="flex space-x-3">
                  {[...Array(5)].map((_, index) => {
                    return (
                      <span key={index} onClick={() => setRating(index)}>
                        <IoStar
                          style={{
                            cursor: "pointer",
                            color: index <= rating ? "orange" : "gray",
                          }}
                          size={25}
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="w-3/4 flex flex-col">
                <textarea
                  ref={messageRef}
                  rows="3"
                  className="p-4 text-gray-500 rounded-xl resize-none"
                  placeholder="Leave a message, if you want"
                  id="rating-input"
                ></textarea>
                <div
                  style={{
                    height: "5rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {submitting ? (
                    <PulseLoader color="#374151" />
                  ) : (
                    <button
                      onClick={submitRating}
                      className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
                    >
                      Rate now
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="h-20 flex items-center justify-center">
              <a href="#" className="text-gray-600 px-2 py-2 flex border ">
                Maybe later
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useAddRating(orderId, setOrderContent) {
  const [showAddRatingModal, setShowAddRatingModal] = useState(false);
  const AddRatingModalCallback = useCallback(() => {
    return (
      <AddRating
        showAddRatingModal={showAddRatingModal}
        setShowAddRatingModal={setShowAddRatingModal}
        orderId={orderId}
        setOrderContent={setOrderContent}
      />
    );
  }, [showAddRatingModal, setShowAddRatingModal]);

  return useMemo(
    () => ({ setShowAddRatingModal, AddRating: AddRatingModalCallback }),
    [setShowAddRatingModal, AddRatingModalCallback]
  );
}
