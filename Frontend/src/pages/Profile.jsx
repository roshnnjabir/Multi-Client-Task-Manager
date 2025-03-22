import { useSelector, useDispatch } from "react-redux";
import { logout, updateUserProfile } from "../slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [playSuccessSound] = useSound("/sounds/completed.mp3", { volume: 0.5 });
  const [playErrorSound] = useSound("/sounds/error1.mp3", { volume: 0.5 });


  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile.", {onOpen:() => playErrorSound(), onClose: () => navigate("/login", { replace: true })});
    }
  }, [isAuthenticated, navigate])


  const API_BASE_URL = "http://localhost:8000/api";
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmImageChange, setConfirmImageChange] = useState(null);
  const message = location.state?.message;

  useEffect(() => {
    if(message){
      toast.info(message, {onOpen:() =>playErrorSound()})
    }
  }, [navigate])

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    navigate("/login");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    setConfirmImageChange(false);
    setShowModal(true);
  };

  const handleConfirmUpload = async () => {
    if (!image) return;
    
    setShowModal(false);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profile_image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_profile_image/`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateUserProfile({ profile_image: data.profile_image }));
        toast.success("Image updated Successfully", {onOpen:() => playSuccessSound(), onClose:() => setConfirmImageChange(null)})
      } else {
        toast.error("Error uploading image", {onOpen:() =>playErrorSound(), onClose:() => setConfirmImageChange(null)})
        console.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ToastContainer limit={1}/>
        <p className="text-xl text-gray-600">No user logged in</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ToastContainer limit={2}/>
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeft size={22} /> <span className="font-semibold">Back</span>
      </button>

      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center flex flex-col justify-between h-[420px]">
        <div className="user-profile">
          <div className="profile-image-wrapper w-24 h-24 mb-10 rounded-full mx-auto border-4 border-gray-300 overflow-hidden">
            <img
              src={
                user.profile_image 
                  ? `${API_BASE_URL}${user.profile_image}` 
                  : "https://i.pravatar.cc/150?img=2"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
            
          <div className="user-info space-y-4">
            <div className="info-row flex justify-between text-black font-semibold">
              <span>Name:</span>
              <span className="font-normal">{user.name}</span>
            </div>
            <div className="info-row flex justify-between text-black font-semibold">
              <span>Email:</span>
              <span className="font-normal">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {confirmImageChange === null ? (
            <div className="pt-5 text-gray-700">
              Change Profile Image? 
              <button className="p-2 font-semibold cursor-pointer hover:underline text-blue-600" onClick={() => setConfirmImageChange(true)}>Yes</button>
              <button className="p-2 font-semibold cursor-pointer hover:underline text-red-600" onClick={() => setConfirmImageChange(false)}>No</button>
            </div>
          ) : null}

          {confirmImageChange && (
            <div className="flex flex-col items-start mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="font-semibold mb-2">Change Image Here:</p>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              {isUploading && <p className="text-blue-500 mt-2">Uploading...</p>}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Image Upload</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to update your profile image?</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Yes, Upload
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};

export default ProfilePage;
