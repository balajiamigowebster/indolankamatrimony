"use client";

import {
  adminDeleteProfile,
  adminGetAllProfiles,
  resetAdminState,
} from "@/app/redux/adminSlices/adminSlice";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt, FaSearch, FaTimes } from "react-icons/fa";
import ProfileTableSkeleton from "../Components/ProfileTableSkeleton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LuZoomIn } from "react-icons/lu";
import { LuZoomOut } from "react-icons/lu";

// ----------------------------------------------------
// Dummy Data for Filter Options
// ----------------------------------------------------
const MARITAL_STATUS_OPTIONS = [
  "All",
  "UnMarried",
  "Divorced",
  "Widowed",
  "Separated",
  "Married",
  "Annulled",
];
const GENDER_OPTIONS = ["All", "Male", "Female"];

// ----------------------------------------------------
// 🌟 புதிய TABLE HEADERS ARRAY (TH மற்றும் TD-க்கான மதிப்புகள்)
// ----------------------------------------------------

const AllProfiles = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaritalStatus, setFilterMaritalStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");

  // 🌟 புதிய States: Image Modal-ஐக் கையாள
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🌟 புதிய States: Zoom மற்றும் Drag கையாள
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level 1 (100%)
  const constraintsRef = useRef(null); // Drag boundary-க்காக
  const imageRef = useRef(null); // Image size-ஐ அளக்க

  const router = useRouter();

  // Dummy Handlers (Uncomment the actual logic when implemented)

  const { profiles, loading, error, profileCount, deleteSuccess } = useSelector(
    (state) => state.admin
  );

  const handleImageClick = (imageUrl, profileName) => {
    if (!imageUrl || imageUrl === "null") return;
    setSelectedImage({
      url: imageUrl,
      name: profileName,
    });
    setZoomLevel(1); // Modal திறக்கும்போது zoom-ஐ reset செய்கிறது
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setZoomLevel(1); // Modal மூடும்போது zoom-ஐ reset செய்கிறது
  };

  // 🌟 புதிய Functions: Zoom In & Zoom Out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev - 0.2, 5)); // அதிகபட்சம் 5x வரை zoom
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1)); // குறைந்தபட்சம் 1x வரை zoom out
  };

  //console.log(profiles);

  // ----------------------------------------------------
  // 1. Data Fetching
  // ----------------------------------------------------
  const fetchProfiles = useCallback(
    (filters) => {
      dispatch(adminGetAllProfiles(filters));
    },
    [dispatch]
  );

  // Effect for initial load
  useEffect(() => {
    fetchProfiles({
      search: searchTerm,
      gender: filterGender,
      maritalStatus: filterMaritalStatus,
    });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProfiles({
        search: searchTerm,
        gender: filterGender,
        maritalStatus: filterMaritalStatus,
      });
    }, 500); // 500ms delay for search input

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterGender, filterMaritalStatus, fetchProfiles]);

  const handleEdit = (id) => {
    router.push(`/dashboard/profiles/edit/${id}`);
  };

  // const handleDelete = (id) => {
  //   const isConfirmed = window.confirm(
  //     `Are you sure you want to permanently delete profile ID: ${id}? This action cannot be undone.`
  //   );
  //   if (isConfirmed) {
  //     dispatch(adminDeleteProfile(id));
  //   }
  // };

  // Double Checkup delete confirmation

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelete = async (id) => {
    // 1. முதல் உறுதிப்படுத்தல் (First Confirmation)
    const isConfirmedFirst = window.confirm(
      `⚠️ Warning: Profile ID ${id} will be permanently deleted. Are you sure you want to continue?`
    );

    if (isConfirmedFirst) {
      // 2. Second / Final Confirmation

      toast.loading("Waiting final confirmation...");
      await delay(2000); // 👈 1000ms (1 second) தாமதம்
      toast.dismiss(); // Loading toast-ஐ அகற்ற

      const isConfirmedFinal = window.confirm(
        `🔥 FINAL WARNING! Are you absolutely sure you want to delete Profile ID ${id}? This action cannot be undone.`
      );

      if (isConfirmedFinal) {
        // Only dispatch if both confirmations are OK
        dispatch(adminDeleteProfile(id));
      } else {
        // Cancelled at second confirmation
        toast.info("Delete operation cancelled.");
      }
    } else {
      // Cancelled at first confirmation
      toast.info("Delete operation cancelled.");
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Profile deleted successfully!");
      dispatch(resetAdminState());
    }
  }, [deleteSuccess, dispatch]);

  const TABLE_HEADERS = [
    // key: profile ஆப்ஜெக்ட்டில் உள்ள key-ஐ குறிக்கிறது
    // header: தலைப்பு (TH)
    // render: (Optional) சிக்கலான உள்ளடக்கத்தை (Image, Custom Formatting) ரெண்டர் செய்ய பயன்படுத்தலாம்.
    {
      key: "index",
      header: "Joining",
      widthClass: "min-w-[120px]", // width-ஐ சற்று அதிகரிக்கப்பட்டுள்ளது
      render: (profile) => {
        // 7 நாட்களுக்கான மில்லிசெகண்ட்ஸ்
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        // உங்கள் Schema-வில் உள்ள Day, Month, Year-ஐப் பயன்படுத்தி Date Object-ஐ உருவாக்குதல்
        // ISO 8601 Format: YYYY-MM-DD (Date object-ஐ சரியாக உருவாக்க)
        const registrationDateStr = `${profile.created_year}-${profile.created_month}-${profile.created_day}`;
        const registrationDate = new Date(registrationDateStr);

        const now = new Date();
        const timeDiff = now.getTime() - registrationDate.getTime();

        // 7 நாட்களுக்கு குறைவாக இருந்தால் NEW
        const isNew = timeDiff <= SEVEN_DAYS_MS;

        return (
          <td
            key="index"
            className="px-4 py-3 text-sm text-gray-500 relative" // relative added here for absolute positioning inside
          >
            <span className="whitespace-nowrap">
              {`${profile.created_year}-${profile.created_month}-${profile.created_day}`}
            </span>
            {/* ✅ New Label UI with Absolute Positioning */}
            {isNew && (
              <span className="absolute top-0 transform rotate-[0deg] left-0 tracking-[1px] bg-green-100 text-green-800 text-[7px] font-bold px-1.5 py-0.5  whitespace-nowrap">
                ✨ NEW
              </span>
            )}
          </td>
        );
      },
    },
    { key: "id", header: "ID", widthClass: "min-w-[100px]" },
    {
      key: "mprofile",
      header: "Matrimony Profile",
      widthClass: "min-w-[100px]",
    },
    {
      key: "pname",
      header: "Name",
      widthClass: "min-w-[120px]",
      // render: (profile) => {
      //   // 7 நாட்களுக்கான மில்லிசெகண்ட்ஸ்
      //   const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      //   // உங்கள் Schema-வில் உள்ள Day, Month, Year-ஐப் பயன்படுத்தி Date Object-ஐ உருவாக்குதல்
      //   // ISO 8601 Format: YYYY-MM-DD (Date object-ஐ சரியாக உருவாக்க)
      //   const registrationDateStr = `${profile.created_year}-${profile.created_month}-${profile.created_day}`;
      //   const registrationDate = new Date(registrationDateStr);

      //   const now = new Date();
      //   const timeDiff = now.getTime() - registrationDate.getTime();

      //   // 7 நாட்களுக்கு குறைவாக இருந்தால் NEW
      //   const isNew = timeDiff <= SEVEN_DAYS_MS;

      //   return (
      //     <td
      //       key="pname"
      //       className="px-4 py-3 text-sm font-medium text-gray-900"
      //     >
      //       <div className="flex items-center gap-2">
      //         <span className="whitespace-nowrap">
      //           {profile.pname || "N/A"}
      //         </span>
      //         {/* ✅ New Label UI */}
      //         {isNew && (
      //           <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
      //             ✨ NEW
      //           </span>
      //         )}
      //       </div>
      //     </td>
      //   );
      // },
    },
    { key: "dob", header: "DOB", widthClass: "min-w-[100px]" },
    { key: "age", header: "Age", widthClass: "min-w-[60px]" },
    { key: "pbrith", header: "Place of Birth", widthClass: "min-w-[120px]" },
    { key: "tbrith", header: "Time of Birth", widthClass: "min-w-[120px]" },
    { key: "rasi", header: "Rasi", widthClass: "min-w-[100px]" },
    { key: "nakshatram", header: "Nakshatram", widthClass: "min-w-[100px]" },
    { key: "laknam", header: "Laknam", widthClass: "min-w-[100px]" },
    { key: "height", header: "Height", widthClass: "min-w-[80px]" },
    { key: "weight", header: "Weight", widthClass: "min-w-[80px]" },
    { key: "color", header: "Color", widthClass: "min-w-[80px]" },
    {
      key: "maritalstatus",
      header: "Marital Status",
      widthClass: "min-w-[120px]",
    },
    { key: "gender", header: "Gender", widthClass: "min-w-[80px]" },
    { key: "education", header: "Education", widthClass: "min-w-[150px]" },
    { key: "occupation", header: "Occupation", widthClass: "min-w-[150px]" },
    {
      key: "annualincome",
      header: "Annual Income",
      widthClass: "min-w-[120px]",
    },
    {
      key: "mothertongue",
      header: "Mother Tongue",
      widthClass: "min-w-[120px]",
    },
    { key: "religion", header: "Religion", widthClass: "min-w-[100px]" },
    { key: "caste", header: "Caste", widthClass: "min-w-[100px]" },
    { key: "subcaste", header: "Subcaste", widthClass: "min-w-[100px]" },
    { key: "fname", header: "Father's Name", widthClass: "min-w-[120px]" },
    {
      key: "foccupation",
      header: "Father's Occupation",
      widthClass: "min-w-[150px]",
    },
    { key: "mname", header: "Mother's Name", widthClass: "min-w-[120px]" },
    {
      key: "moccupation",
      header: "Mother's Occupation",
      widthClass: "min-w-[150px]",
    },
    { key: "sister", header: "Sister", widthClass: "min-w-[80px]" },
    { key: "brother", header: "Brother", widthClass: "min-w-[80px]" },
    { key: "children", header: "Children", widthClass: "min-w-[80px]" },
    { key: "rplace", header: "Residing Place", widthClass: "min-w-[120px]" },
    {
      key: "whatsappno",
      header: "Whatsapp Number",
      widthClass: "min-w-[120px]",
    },
    { key: "email", header: "Email", widthClass: "min-w-[200px]" },
    {
      key: "addressdetails",
      header: "Address Details",
      widthClass: "min-w-[200px]",
    }, // உங்கள் கோடில் address key இல்லை, profile.phonenumber-ஐ இங்கே காண்பித்துள்ளீர்கள். நான் அதை address என்றே வைத்திருக்கிறேன்.
    { key: "phonenumber", header: "Phone Number", widthClass: "min-w-[120px]" },

    // Custom Render Function உள்ள Header
    {
      key: "image",
      header: "Profile Image",
      widthClass: "min-w-[100px]",
      render: (profile) => (
        <td key="image" className="px-4 py-3 text-sm text-gray-500">
          {(profile.image && profile.image === "null") || !profile.image ? (
            "N/A"
          ) : (
            // கவனிக்க: profile.name-க்கு பதிலாக profile.pname உபயோகிக்கப்பட்டுள்ளது.
            <img
              src={profile.image}
              alt={profile.pname || "Profile Image"}
              onClick={() => handleImageClick(profile.image, profile.pname)}
              className="h-10 w-10 rounded-md cursor-pointer hover:shadow-lg transition duration-200"
            />
          )}
        </td>
      ),
    },

    // Actions-க்கான Custom Render Function உள்ள Header
    {
      key: "actions",
      header: "Actions",
      widthClass: "min-w-[100px] sticky  right-0 bg-gray-100", // Actions column-ஐ sticky ஆக வைக்கலாம்
      thClass: "sticky right-0 bg-gray-100", // TH-க்கு மட்டும் sticky class
      render: (profile) => (
        <td
          key="actions"
          className="px-4 py-3 text-sm font-medium sticky right-0 bg-white"
        >
          {/* Note: handleEdit மற்றும் handleDelete functions உங்கள் கோடில் இல்லை.
            வேலை செய்ய, இந்த ஃபங்க்ஷன்களை நீங்கள் component-இல் உருவாக்க வேண்டும். 
        */}
          <button
            // onClick={() => handleEdit(profile.id)} // Function is missing, uncomment when implemented
            className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 cursor-pointer"
            title="Edit Profile"
          >
            <FaEdit
              onClick={() => handleEdit(profile.id)}
              className="w-4 h-4"
            />
          </button>
          <button
            onClick={() => handleDelete(profile.id)} // Function is missing, uncomment when implemented
            className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
            title="Delete Profile"
          >
            <FaTrashAlt className="w-4 h-4 " />
          </button>
        </td>
      ),
    },
  ];

  return (
    <div className="lg:p-5">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        👥 Profiles List
      </h1>

      <div className="lg:flex  lg:justify-between lg:items-center">
        {/* Search Input */}
        {/* ... Search Input section is unchanged ... */}
        <div className="lg:flex lg:gap-5 lg:items-center">
          <label className="block text-sm font-bold text-black mb-1">
            Search (ID, Name) :
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              className="w-full md:w-full lg:w-full  min-w-0 block px-3 py-2  border border-gray-700 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-black sm:text-sm"
              placeholder="Start typing to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none flex items-center">
            <FaSearch className="mr-1" /> Search
          </button> */}
          </div>
        </div>

        <div className="lg:flex lg:gap-5 lg:items-center ">
          {/* Marital Status Filter */}
          {/* ... Marital Status Filter section is unchanged ... */}
          <div className=" lg:flex mt-5 lg:items-center lg:gap-3">
            <label
              htmlFor="marital-status"
              className="block text-sm  font-bold text-black mb-1"
            >
              M.Status:
            </label>
            <select
              id="marital-status"
              value={filterMaritalStatus}
              onChange={(e) => setFilterMaritalStatus(e.target.value)}
              className="block w-full md:w-1/2 lg:w-full  px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          {/* ... Gender Filter section is unchanged ... */}
          <div className="min-w-[150px] lg:flex lg:items-center lg:gap-3 mt-5">
            <label
              htmlFor="gender"
              className="block text-sm font-bold text-black mb-1"
            >
              Gender:
            </label>
            <select
              id="gender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="block w-full md:w-1/2 lg:w-full  px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Profile Counts Section */}
      {/* ... Profile Counts section is unchanged ... */}
      <div className="mb-4 text-sm  mt-5 font-bold text-black">
        {loading ? (
          <span className="text-indigo-600">Fetching results...</span>
        ) : (
          <>
            Total Profiles Found:
            <span className="text-indigo-600 font-bold">{profileCount}</span>
            {searchTerm ||
            filterGender !== "All" ||
            filterMaritalStatus !== "All" ? (
              <span className="ml-4 text-gray-500">
                (Showing filtered results)
              </span>
            ) : (
              <span className="ml-4 font-semibold text-black">
                (Total profiles in DB)
              </span>
            )}
          </>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && <ProfileTableSkeleton rows={10} />}

      {error && !loading && (
        <p className="p-4 text-red-500 bg-red-100 border border-red-400 rounded-lg">
          Error: {error}
        </p>
      )}

      {/* 🌟 Profiles Data Table - MAP செய்யப்பட்ட பகுதி */}
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg w-full mt-6">
          {profiles.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              No profiles found matching the criteria. 🔎
            </p>
          ) : (
            <div className="relative w-full overflow-x-auto rounded-lg border border-gray-200">
              <div className="max-h-[600px] overflow-y-auto">
                {/* min-w-[6000px] நீக்கப்பட்டுள்ளது. அதற்கு பதிலாக, ஒவ்வொரு TH/TD-க்கும் widthClass கொடுக்கப்பட்டுள்ளது.
                    அதிக காலம்ஸ் இருப்பதால், min-w-[2800px] போன்ற ஒரு பெரிய மதிப்பைத் தேர்வு செய்துள்ளேன். */}
                <table className="min-w-[6800px] divide-y divide-gray-500">
                  <thead className="bg-gray-100 sticky top-0 border-gray-700 z-10">
                    <tr>
                      {/* TH-களை MAP செய்கிறோம் */}
                      {TABLE_HEADERS.map((col) => (
                        <th
                          key={col.key}
                          className={`px-4 py-3 text-left text-xs border-gray-700  text-black font-bold uppercase tracking-wider ${
                            col.widthClass
                          } ${col.thClass || ""}`}
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y  divide-gray-700">
                    {profiles.map((profile, index) => (
                      <tr key={profile.id} className="hover:bg-gray-50 ">
                        {/* TD-களை MAP செய்கிறோம் */}
                        {TABLE_HEADERS.map((col) => {
                          // index-ஐ மட்டும் தனியாக கையாளுகிறோம்
                          if (col.key === "index") {
                            // return (
                            //   <td
                            //     key={col.key}
                            //     className="px-4 py-3 text-sm text-gray-500"
                            //   >
                            //     {`${profile.created_year}-${profile.created_month}-${profile.created_day}`}
                            //   </td>
                            // );
                            return col.render(profile);
                          }

                          // render function இருந்தால், அதை call செய்கிறோம் (Actions, Image)
                          if (col.render) {
                            return col.render(profile);
                          }

                          // சாதாரண டேட்டா மதிப்புகளை ரெண்டர் செய்கிறோம்
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-3 text-sm text-black"
                            >
                              {/* Address-க்கு உங்கள் பழைய கோடில் phone number இருந்தது, 
                                  இப்போது அது profile ஆப்ஜெக்டில் உள்ள `address` என்ற key-ஐ பொறுத்து மாறும். 
                                  உங்கள் back-end data-வுக்கு ஏற்ப profile.[col.key] என்று எடுத்துக்கொள்ளும்.
                              */}
                              {profile[col.key] || "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && selectedImage && (
          // Modal Background Overlay
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-[9999] bg-black/80 flex justify-center items-center p-4 cursor-pointer"
          >
            {/* 🌟 Constraints Container: Drag-ஐ கட்டுப்படுத்த */}
            <div
              ref={constraintsRef}
              className="w-full h-full relative flex justify-center items-center"
            >
              {/* Modal Content / Image Container */}
              <motion.div
                ref={imageRef} // Image container-ஐ ரெஃபர் செய்ய
                className="relative max-w-full max-h-full cursor-grab"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  title="Close Image"
                  onClick={handleCloseModal}
                  className="absolute top-[-40px] right-0 md:top-[-30px] md:right-[-50px] p-2 bg-white rounded-full text-gray-800 hover:text-red-500 transition shadow-lg z-50"
                >
                  <FaTimes className="w-6 h-6" />
                </button>

                {/* 🌟 Zoom Controls - Modal-ன் மேலே/பக்கத்தில் வைக்கவும் */}
                {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex space-x-2 p-2 rounded-lg bg-gray-800 bg-opacity-70 z-50">
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 5}
                    className="p-2 text-white bg-indigo-600 rounded-full disabled:bg-gray-500"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <span className="text-white p-2 font-mono text-sm">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-2 text-white bg-indigo-600 rounded-full disabled:bg-gray-500"
                    title="Zoom Out"
                  >
                    -
                  </button>
                </div> */}

                {/* 🌟 Dragable Image Wrapper */}
                <motion.div
                  drag={zoomLevel > 1 ? true : false} // Zoom 1-க்கு மேல் இருந்தால் மட்டுமே Drag செய்ய முடியும்
                  dragConstraints={constraintsRef}
                  dragElastic={0.1}
                  className="relative"
                  // Zoom level-ஐ Scale property-க்கு மாற்றுகிறது
                  style={{ scale: zoomLevel }}
                  animate={{ scale: zoomLevel }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  // Drag செய்யும்போது cursor-ஐ மாற்றுவதற்கு
                  onDragStart={(e) => {
                    if (zoomLevel > 1) {
                      e.currentTarget.style.cursor = "grabbing";
                    }
                  }}
                  onDragEnd={(e) => {
                    if (zoomLevel > 1) {
                      e.currentTarget.style.cursor = "grab";
                    }
                  }}
                >
                  {/* Displayed Image */}
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name || "Expanded Profile Image"}
                    className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-transform duration-300"
                  />
                </motion.div>
                {/* Optional: Profile Name Caption */}
                <p className="mt-2 text-center text-white text-lg font-semibold">
                  {selectedImage.name}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProfiles;
