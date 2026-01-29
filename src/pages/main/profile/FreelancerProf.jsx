import {
  MdVerified,
  MdPendingActions,
  MdOutlineAddTask,
  MdTaskAlt,
} from "react-icons/md";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import RatingOrderView from "../../../components/main/rating-order-view/RatingOrderView";

const FreelancerProf = () => {
  const { freelancerParam } = useParams();
  const { userToken } = useAuthContext();

  const [freelancerData, setFreelancerData] = useState();

  const headers = {
    "content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getViewProfile = async (freelancer) => {
    const profileUrl = `${
      import.meta.env.VITE_API_URL
    }/profile/?user=${freelancer}`;

    try {
      const viewProfile = await fetch(profileUrl, {
        headers,
      });

      if (viewProfile.ok) {
        const response = await viewProfile.json();
        setFreelancerData(response[0]);
      } else {
        toast.error(`Error occured while fetching ${freelancer}'s profile`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    freelancerParam && getViewProfile(freelancerParam);
  }, [freelancerParam]);

  const iconSize = 20;

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <div className="p-4 my-4">
          <div className="flex gap-3 items-center">
            {freelancerData?.profile_photo ? (
              <img
                className="rounded-full w-16 h-16 overflow-hidden"
                src={freelancerData?.profile_photo}
                alt="profile-cover"
              />
            ) : (
              <label className="bg-sky-300 rounded-full w-16 p-4 text-center text-white text-2xl">
                {freelancerData &&
                  `${
                    freelancerData?.username.charAt(0).toUpperCase() +
                    freelancerData?.username.slice(1).slice(0, 1)
                  }`}
              </label>
            )}
            <div className="space-y-1 text-gray-600">
              <article
                className=""
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  color: "#f7fafc",
                }}
              >
                {freelancerData?.username}
                {freelancerData?.is_verified === "True" && (
                  <MdVerified className="text-sky-300" size={iconSize} />
                )}
              </article>
              <article className="text-white">
                {freelancerData?.first_name} {freelancerData?.last_name}
              </article>
            </div>
          </div>
          <div className="address text-white">
            <div className="address-element">
              {freelancerData?.address.country ? (
                <>
                  <article>{freelancerData?.address.country}</article>
                  <article>
                    {getUnicodeFlagIcon(
                      `${freelancerData?.address.countryCode}`
                    )}
                  </article>
                </>
              ) : (
                <span>Loading Country</span>
              )}
            </div>
            <div className="address-element">
              <span>Time Zone: </span>
              {freelancerData?.address.timezone}
            </div>
          </div>
          <div className="prof-summary w-full items-center mt-4">
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdTaskAlt className="text-white" size={iconSize} />
                <article className="text-white">Total Orders</article>
              </div>
              <span className="">{freelancerData?.orders_count}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdPendingActions className="text-white" size={iconSize} />
                <article className="text-white">Orders in Progress</article>
              </div>
              <span className="">{freelancerData?.in_progress}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdOutlineAddTask className="text-white" size={iconSize} />
                <article className="text-white">Orders completed</article>
              </div>
              <span className="">{freelancerData?.completed}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col space-y-2 mb-4">
            <div className="bio-v text-white">
              <strong>Bio</strong>
              <article>{freelancerData?.bio}</article>
            </div>
          </div>
          <div className="f-review">
            <h1>Reviews and rating</h1>
            <div className="review-box">
              {freelancerData?.orders.map((order, key) => {
                return (
                  order.rating && <RatingOrderView order={order} key={key} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProf;
