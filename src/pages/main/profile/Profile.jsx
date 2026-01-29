import React, { useEffect } from "react";
import "./profile.css";
import { MdTaskAlt } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";
import { MdAccessTime, MdModeEdit } from "react-icons/md";
import { MdOutlineAddTask } from "react-icons/md";
import { useAuthContext } from "../../../providers/AuthProvider";
import { timeAgo } from "../../../utils/helpers/TimeAgo";
import { useOrderContext } from "../../../providers/OrderProvider";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { MdVerified } from "react-icons/md";
import Transaction from "../../../components/main/transactions/Transaction";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import ProfilePlaceholder from "../../../components/main/profile-placeholder/ProfilePlaceholder";

const Profile = () => {
  const {
    loadingUserProfile,
    loadedUserProfile,
    submitNewBio,
    uploadProfilePhoto,
    userToken,
  } = useAuthContext();

  const [userProfile, setUserProfile] = useState(loadedUserProfile);

  const { ordersCompleted, ordersInProgress } = useOrderContext();

  const [editBio, setEditBio] = useState(false);
  const [editedBio, setEditedBio] = useState(userProfile?.bio);

  const toggleEditBio = () => {
    setEditBio(userProfile?.bio);
    setEditBio(!editBio);
  };
  const submitEditedProfile = () => {
    if (userProfile.bio != editedBio) {
      submitNewBio(editedBio, userProfile?.id).then((response) => {
        const updatedProfile = {
          ...userProfile,
          bio: response.bio,
        };
        userProfile.bio = response.bio;
        setUserProfile(updatedProfile);
      });
    }
    setEditBio(false);
  };

  const iconSize = 25;
  console.log(loadedUserProfile);
  return (
    <div className="profile-main">
      <div className="profile-info">
        <ProfilePlaceholder
          uploadProfilePhoto={uploadProfilePhoto}
          userProfile={userProfile}
          loadingUserProfile={loadingUserProfile}
          setUserProfile={setUserProfile}
        />
        <div className="email-username">
          <article
            className={loadingUserProfile ? "username-skeleton" : ""}
            style={{
              fontWeight: "bold",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {userProfile?.username}
            {userProfile?.is_verified === "True" && (
              <MdVerified className="react-icon-verified" size={iconSize} />
            )}
          </article>
          <article
            style={{
              animation: loadingUserProfile
                ? `skeleton-loading 1s linear infinite alternate`
                : "",
            }}
          >
            {userProfile?.email}
          </article>
        </div>
      </div>
      <div className="address">
        <div className="address-element">
          {userProfile?.address.country ? (
            <>
              <article>{userProfile?.address.country}</article>
              <article>
                {getUnicodeFlagIcon(`${userProfile?.address.countryCode}`)}
              </article>
            </>
          ) : (
            <span>Loading Country</span>
          )}
        </div>
        <div className="address-element">
          <span>IP Address: </span>
          {userProfile?.address.ip ? (
            <article>{userProfile?.address.ip}</article>
          ) : (
            <span>-------</span>
          )}
        </div>
      </div>
      <div className="prof-summary">
        <div className="prof-element">
          <div>
            <MdTaskAlt className="react-icon" size={iconSize} />
            <article>Total Tasks</article>
          </div>
          <span>{userProfile?.orders_count}</span>
        </div>
        <div className="prof-element">
          <div>
            <MdPendingActions className="react-icon" size={iconSize} />
            <article>Pending Tasks</article>
          </div>
          <span>{ordersInProgress.orders.length}</span>
        </div>
        <div className="prof-element">
          <div>
            <MdOutlineAddTask className="react-icon" size={iconSize} />
            <article>Completed Tasks</article>
          </div>
          <span>{ordersCompleted?.orders.length}</span>
        </div>
        <div className="prof-element">
          <div>
            <MdAccessTime className="react-icon" size={iconSize} />
            <article>Last Login</article>
          </div>
          <article className="last-login">
            {userProfile ? timeAgo(userProfile?.last_login) : "---"}
          </article>
        </div>
        {userProfile?.is_verified === true && (
          <div className="prof-element">
            <div>
              <MdVerified className="react-icon" size={iconSize} />
              <article>Verified</article>
            </div>
          </div>
        )}
      </div>
      <div className="profile-view">
        <div className="helper-info">
          <strong>Manage your personal information</strong>
          <article>
            This is your Flexypro account
            <br />
            To learn more, check the Terms and Conditions or Privacy Policy
          </article>
        </div>
        <div className="bio">
          <strong style={{ display: "flex", gap: "1rem" }}>
            Bio
            {userProfile?.bio && (
              <MdModeEdit
                onClick={toggleEditBio}
                style={{ cursor: "pointer" }}
                size={20}
              />
            )}
          </strong>
          {editBio ? (
            <textarea
              name=""
              id=""
              rows="4"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              style={{
                resize: "none",
                border: "none",
                width: "100%",
                padding: "4px",
                outline: "none",
              }}
            />
          ) : userProfile?.bio ? (
            <article>{userProfile?.bio}</article>
          ) : (
            <article style={{ color: "orange", display: "flex", gap: "1rem" }}>
              Set your bio
              {
                <MdAdd
                  onClick={toggleEditBio}
                  style={{ cursor: "pointer" }}
                  size={iconSize}
                />
              }
            </article>
          )}
        </div>
      </div>
      <button className="save" onClick={submitEditedProfile} style={{}}>
        Save
      </button>

      <Transaction user={userProfile?.username} userToken={userToken} />
    </div>
  );
};

export default Profile;
