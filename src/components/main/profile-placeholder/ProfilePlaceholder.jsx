import { MdModeEditOutline } from "react-icons/md";
import { useRef } from "react";
import { toast } from "react-toastify";

const ProfilePlaceholder = ({
  uploadProfilePhoto,
  userProfile,
  loadingUserProfile,
  setUserProfile,
}) => {
  const fileInputRef = useRef(null);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProfilePhoto = (e) => {
    const profilePhoto = e.target.files[0];

    if (profilePhoto) {
      if (profilePhoto.size <= 5 * 1024 * 1024) {
        uploadProfilePhoto(profilePhoto, userProfile?.id).then((json) => {
          const updateProfile = {
            ...userProfile,
            profile_photo: json.profile_photo,
          };

          userProfile.profile_photo = json.profile_photo;
          setUserProfile(updateProfile);
        });
      } else {
        toast.warn("Select lower resolution image");
      }
    } else {
      toast.warn("Select correct img format");
    }
  };

  return (
    <section className="profile-placeholder" onClick={openFileDialog}>
      <div className="edit-profile-icon">
        <MdModeEditOutline size={22} />
      </div>
      {userProfile?.profile_photo ? (
        <div className="prof-img">
          <img
            style={{
              animation: loadingUserProfile
                ? `skeleton-loading 1s linear infinite alternate`
                : "",
            }}
            className="pic"
            src={userProfile?.profile_photo}
            alt="profile cover"
          />
        </div>
      ) : (
        <label
          style={{
            animation: loadingUserProfile
              ? `skeleton-loading 1s linear infinite alternate`
              : "",
          }}
          htmlFor="upload-profile"
          className="img-placeholder-profile"
        >
          {userProfile &&
            `${
              userProfile?.username?.charAt(0)?.toUpperCase() +
              userProfile?.username.slice(1).slice(0, 1)
            }`}
        </label>
      )}
      <input
        id="upload-profile"
        onChange={updateProfilePhoto}
        ref={fileInputRef}
        style={{ display: "none" }}
        size={5 * 1024 * 1024}
        accept="image/*"
        type="file"
      />
    </section>
  );
};

export default ProfilePlaceholder;
