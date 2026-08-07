"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react"; // ✅ useState added
import { useDispatch, useSelector } from "react-redux";
import { getAllProfiles } from "../redux/profileSlice";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_PRODUCTION;

// 🔑 Session Storage Keys
const SESSION_KEYS = {
  SEARCH: "profileSearch",
  GENDER: "profileGender",
  MARITAL_STATUS: "profileMaritalStatus",
  CASTE: "profileCaste",

  // 💡 NEW: Profile Details Page-க்குச் செல்லும் போது cleanup-ஐ தவிர்க்கும் flag
  NAVIGATING_TO_DETAILS: "isNavigatingToDetails",
};

// 🔥 Helper function to get initial state from Session Storage
const getInitialState = (key, defaultValue) => {
  // Client side rendering-la mattum session storage access panna mudiyum
  if (typeof window !== "undefined" && window.sessionStorage.getItem(key)) {
    return window.sessionStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// 🔥 Helper function to update state and Session Storage
const updateStateAndSession = (key, value, setter) => {
  setter(value);
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, value);
  }
};

const ProfileGallery = () => {
  const dispatch = useDispatch();
  const { profiles, loading, error } = useSelector((state) => state.profile);
  const router = useRouter();

  // ✅ State initialization: Session Storage-la irundhu value-ai load seigirōm.
  const [search, setSearch] = useState(
    getInitialState(SESSION_KEYS.SEARCH, "")
  );
  const [gender, setGender] = useState(
    getInitialState(SESSION_KEYS.GENDER, "All")
  );
  const [maritalStatus, setMaritalStatus] = useState(
    getInitialState(SESSION_KEYS.MARITAL_STATUS, "All")
  );
  const [caste, setCaste] = useState(
    getInitialState(SESSION_KEYS.CASTE, "All")
  );

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Helper function to check if a filter value is the "All" default
  const getFilterValue = (value) => (value !== "All" ? value : "");

  // Debounce Utility Function (unchanged)
  const debounce = (func, delay) => {
    let timeoutId;
    const debounced = function (...args) {
      // Add debounced reference for cleanup
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        debounced.__timeoutId = null; // Clear ID after execution
      }, delay);
      debounced.__timeoutId = timeoutId; // Store ID
    };
    return debounced;
  };

  // --- Filter Options (Unchanged) ---
  const genderOptions = ["All", "Male", "Female"];
  const maritalOptions = [
    "All",
    "UnMarried",
    "Divorced",
    "Widowed",
    "Separated",
    "Married",
    "Annulled",
  ];
  const casteOptions = [
    "All",
    "24 Manai Telugu Chettiar",
    "Aaru Nattu Vellala",
    "Achirapakkam Chettiar",
    "Adi Dravidar",
    "Agamudayar / Arcot / Thuluva Vellala",
    "Agaram Vellan Chettiar",
    "Ahirwar",
    "Arunthathiyar",
    "Ayira Vysya",
    "Badaga",
    "Bairwa",
    "Balai",
    "Beri Chettiar",
    "Boyar",
    "Brahmin - Anaviln Desai",
    "Brahmin - Baidhiki/Vaidhiki",
    "Brahmin - Bardai",
    "Brahmin - Bhargav",
    "Brahmin - Gurukkal",
    "Brahmin - Iyengar",
    "Brahmin - Iyer",
    "Brahmin - Khadayata",
    "Brahmin - Khedaval",
    "Brahmin - Mevada",
    "Brahmin - Others",
    "Brahmin - Rajgor",
    "Brahmin - Rarhi/Radhi",
    "Brahmin - Sarua",
    "Brahmin - Shri Gaud",
    "Brahmin - Tapodhan",
    "Brahmin - Valam",
    "Brahmin - Zalora",
    "Chattada Sri Vaishnava",
    "Cherakula Vellalar",
    "Chettiar",
    "Dasapalanjika / Kannada Saineegar",
    "Desikar",
    "Desikar Thanjavur",
    "Devandra Kula Vellalar",
    "Devanga Chettiar",
    "Devar/Thevar/Mukkulathor",
    "Dhanak",
    "Elur Chetty",
    "Gandla / Ganiga",
    "Gounder",
    "Gounder - Kongu Vellala Gounder",
    "Gounder - Nattu Gounder",
    "Gounder - Others",
    "Gounder - Urali Gounder",
    "Gounder - Vanniya Kula Kshatriyar",
    "Gounder - Vettuva Gounder",
    "Gramani",
    "Gurukkal Brahmin",
    "Illaththu Pillai",
    "Intercaste",
    "Isai Vellalar",
    "Iyengar Brahmin",
    "Iyer Brahmin",
    "Julaha",
    "Kamma Naidu",
    "Kanakkan Padanna",
    "Kandara",
    "Karkathar",
    "Karuneegar",
    "Kasukara",
    "Kerala Mudali",
    "Khatik",
    "Kodikal Pillai",
    "Kongu Chettiar",
    "Kongu Nadar",
    "Kongu Vellala Gounder",
    "Kori/Koli",
    "Krishnavaka",
    "Kshatriya Raju",
    "Kulalar",
    "Kuravan",
    "Kuruhini Chetty",
    "Kurumbar",
    "Kuruva",
    "Manjapudur Chettiar",
    "Mannan / Velan / Vannan",
    "Maruthuvar",
    "Meenavar",
    "Meghwal",
    "Mudaliyar",
    "Mukkulathor",
    "Muthuraja / Mutharaiyar",
    "Nadar",
    "Naicker",
    "Naicker - Others",
    "Naicker - Vanniya Kula Kshatriyar",
    "Naidu",
    "Nanjil Mudali",
    "Nanjil Nattu Vellalar",
    "Nanjil Vellalar",
    "Nanjil pillai",
    "Nankudi Vellalar",
    "Nattu Gounder",
    "Nattukottai Chettiar",
    "Othuvaar",
    "Padmashali",
    "Pallan / Devandra Kula Vellalan",
    "Panan",
    "Pandaram",
    "Pandiya Vellalar",
    "Pannirandam Chettiar",
    "Paravan / Bharatar",
    "Parkavakulam / Udayar",
    "Parvatha Rajakulam",
    "Paswan / Dusadh",
    "Pattinavar",
    "Pattusali",
    "Pillai",
    "Poundra",
    "Pulaya / Cheruman",
    "Reddy",
    "Rohit / Chamar",
    "SC",
    "ST",
    "Sadhu Chetty",
    "Saiva Pillai Thanjavur",
    "Saiva Pillai Tirunelveli",
    "Saiva Vellan chettiar",
    "Saliyar",
    "Samagar",
    "Sambava",
    "Satnami",
    "Senai Thalaivar",
    "Senguntha Mudaliyar",
    "Sengunthar/Kaikolar",
    "Shilpkar",
    "Sonkar",
    "Sourashtra",
    "Sozhia Chetty",
    "Sozhiya Vellalar",
    "Telugupatti",
    "Thandan",
    "Thondai Mandala Vellalar",
    "Urali Gounder",
    "Vadambar",
    "Vadugan",
    "Valluvan",
    "Vaniya Chettiar",
    "Vannar",
    "Vannia Kula Kshatriyar",
    "Veera Saivam",
    "Veerakodi Vellala",
    "Vellalar",
    "Vellan Chettiars",
    "Vettuva Gounder",
    "Vishwakarma",
    "Vokkaliga",
    "Yadav",
    "Yadava Naidu",
  ];
  // --- End Filter Options ---

  // API Fetch Logic (Unchanged)
  const fetchProfiles = useCallback(
    (currentSearch) => {
      const filters = {
        // currentSearch debounce-kku, illati state-la irukkaradhu
        search: currentSearch || search,
        gender: getFilterValue(gender),
        maritalStatus: getFilterValue(maritalStatus),
        caste: getFilterValue(caste),
      };
      dispatch(getAllProfiles(filters));
    },
    [dispatch, search, gender, maritalStatus, caste]
  );

  // Debounced Search Handler
  const debouncedFetchProfiles = useMemo(
    () => debounce((currentSearch) => fetchProfiles(currentSearch), 150),
    [fetchProfiles]
  );

  // Add a cancel method to the debounced function for cleanup
  useMemo(() => {
    debouncedFetchProfiles.cancel = () =>
      clearTimeout(debouncedFetchProfiles.__timeoutId);
  }, [debouncedFetchProfiles]);

  // 🔑 Search Input Change Handler (Updates State & Session Storage)
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    // setSearch(newSearch); // Direct state change is replaced by the helper
    updateStateAndSession(SESSION_KEYS.SEARCH, newSearch, setSearch);
    debouncedFetchProfiles(newSearch);
  };

  // 🔑 Select Filter Change Handler (Updates State & Session Storage)
  const handleSelectChange = (key, value, setter) => {
    updateStateAndSession(key, value, setter);
    // debouncedFetchProfiles is NOT needed here, as the useEffect below handles the API call
  };

  // Effect for Non-Search Filters (Gender, Status, Caste)
  useEffect(() => {
    // Session Storage-la irukkum values state-kku set aana udan, data fetch seiya.
    if (isInitialLoadComplete) {
      fetchProfiles();
    }
    // Clean-up the debounced function on unmount
    return () =>
      debouncedFetchProfiles.cancel && debouncedFetchProfiles.cancel();
  }, [gender, maritalStatus, caste, isInitialLoadComplete, fetchProfiles]);

  // Initial Load Effect
  useEffect(() => {
    if (!isInitialLoadComplete) {
      // 💡 FIX 2: Initial Load-ல் Search Value காலியாக இருந்தால், Session Storage-ஐ Clear செய்துவிட்டு API call செய்கிறோம்.
      const initialSearch = getInitialState(SESSION_KEYS.SEARCH, "");

      if (initialSearch.trim() === "") {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(SESSION_KEYS.SEARCH);
        }
        // State-ம் Empty-ஆ இருந்தா, profiles load ஆக வேண்டும்.
        setSearch("");
      }

      // First load, fetch with initial state (from Session Storage)
      fetchProfiles();
      setIsInitialLoadComplete(true);
    }
  }, [isInitialLoadComplete, fetchProfiles]);

  // 💡 MODIFIED: Component Unmount (Route change) ஆகும் போது Session Storage-ஐ Clear செய்யும் Effect
  useEffect(() => {
    // Component Mount ஆகும் போது, profile details page-ல் இருந்து back வந்திருந்தால் flag-ஐ clear செய்ய வேண்டும்
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_KEYS.NAVIGATING_TO_DETAILS);
    }

    return () => {
      // Component Unmount ஆகும் போது (வேறு route-க்கு செல்லும் போது)
      if (typeof window !== "undefined") {
        const isNavigatingToDetails = window.sessionStorage.getItem(
          SESSION_KEYS.NAVIGATING_TO_DETAILS
        );

        if (isNavigatingToDetails === "true") {
          // Profile Details-க்கு போனால், Session-ஐ clear செய்ய வேண்டாம்.
          console.log(
            "Skipping session cleanup: Navigating to Profile Details page."
          );
          // Flag-ஐ உடனடியாக நீக்க வேண்டாம், ஏனெனில் Details page-இல் இருந்து திரும்பும்போது அது தேவைப்படும்.
          // Details page-ஐ விட்டு வெளியேறும்போது அது Clear ஆகிவிடும்.
        } else {
          // Home, Service, Contact, About போன்ற வேறு எந்த route-க்குச் சென்றாலும் clean up செய்ய வேண்டும்.
          console.log(
            "Clearing Profile Gallery Session Filters on navigation away."
          );
          window.sessionStorage.removeItem(SESSION_KEYS.SEARCH);
          window.sessionStorage.removeItem(SESSION_KEYS.GENDER);
          window.sessionStorage.removeItem(SESSION_KEYS.MARITAL_STATUS);
          window.sessionStorage.removeItem(SESSION_KEYS.CASTE);
        }
      }
    };
  }, []); // Empty dependency array means this runs only on mount and cleanup on unmount

  // 💡 MODIFIED: Handle click on a profile card
  const handleProfileClick = (id) => {
    // Profile Details page-க்கு செல்லும் முன் flag-ஐ செட் செய்கிறோம்.
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEYS.NAVIGATING_TO_DETAILS, "true");
    }
    router.push(`/profile/${id}`);
  };

  const skeletonArray = Array.from({ length: 8 });

  // --- UI Content Logic ---
  let content;

  // 1. Loading State (Initial load aagum bodhum, data varum bodhum Skeleton kaatanum)
  // isInitialLoadComplete mudhal murai false-a irundha, loading kaatanum
  if (loading || !isInitialLoadComplete) {
    content = skeletonArray.map((_, index) => (
      <div key={index} className="p-2">
        <Card className="shadow-md border border-gray-200 rounded-lg h-full">
          <CardContent className="flex flex-col items-center p-4">
            <Skeleton className="h-48 w-full rounded-md mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      </div>
    ));
  } else if (error) {
    // 2. Error State (API call fail aanaal)
    content = (
      <div className="col-span-full text-center py-16">
        {/* <h3 className="text-2xl font-bold text-red-600 mb-2">
          Data Fetch Error
        </h3> */}
        <p className="text-gray-600">{error} - Please try again later.</p>
      </div>
    );
  } else if (profiles.length === 0 && isInitialLoadComplete) {
    // 3. ✅ FIX: No Profiles Found State
    // Initial load mudinjadhuku apuram, profiles zero-va irundha mattum kaatanum.
    content = (
      <div className="col-span-full text-center py-16">
        <h3 className="text-2xl font-bold text-neutral-600 mb-2">
          No Profiles Available
        </h3>
        <p className="text-gray-500">
          It looks like no profiles have been registered yet.
        </p>
      </div>
    );
  } else {
    // 4. Data Found State (Profile Cards)
    content = profiles.map((profile) => (
      <div key={profile.id} className="">
        <Card
          className="shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-200 rounded-lg h-full"
          onClick={() => handleProfileClick(profile.id)}
        >
          {/* {console.log(profile.image)} */}
          <CardContent className="flex flex-col">
            {/* Image Section */}
            <div className="h-64 w-full mb-4">
              <img
                src={
                  profile.image
                    ? profile.image === "null"
                      ? profile.gender === "Female"
                        ? "/default-girl.jpg"
                        : "/default-boy.jpg"
                      : `${profile.image}`
                    : profile.gender === "Female"
                    ? "/default-girl.jpg"
                    : "/default-boy.jpg"
                }
                alt={profile.pname}
                //className="h-full w-full rounded-md object-contain py-1 border-4 border-gray-100 shadow-sm"
                className="h-full w-full  object-contain rounded-md py-1 shadow-sm border-gray-100/15 "
              />
            </div>

            <div className=" text-center py-3 md:pt-12 lg:pt-5 ">
              {/* Profile Details */}
              <h3 className="text-xl font-bold  text-gray-800 truncate">
                {profile.pname}
              </h3>
              <p className="text-lg font-semibold  py-1 text-gray-600">
                {/* <strong className="font-bold text-black">Education: </strong> */}
                <span className="text-[12px]">{profile.education}</span>
              </p>
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {/* <strong className="text-black font-bold">ID: </strong> */}
                {profile.id}
              </h3>

              {/* <p className="text-xs text-gray-500 mt-1">
              <strong className="text-black font-bold">Joined: </strong>
              {profile.created_day}-{profile.created_month}-
              {profile.created_year}
            </p> */}
            </div>
          </CardContent>
        </Card>
      </div>
    ));
  }

  return (
    <div className="max-w-7xl mx-auto pt-10 px-4 mb-5 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
        Matrimony Profiles
      </h2>

      {/* <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col md:flex-row lg:flex-row justify-between md:justify-between lg:justify-between gap-5 w-full">
          <div className="flex md:items-center lg:items-center w-full ">
            <Label className="hidden">Search by ID, Name, Email..</Label>
            <Input
              type="text"
              placeholder="Search by ID, Name, Email.."
              value={search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 justify-center">
            <div className="flex gap-2 items-center">
              <Label className="text-[12px] md:text-[12px] lg:text-[13px]">
                Gender:
              </Label>
              <Select
                value={gender}
                onValueChange={(value) =>
                  handleSelectChange(SESSION_KEYS.GENDER, value, setGender)
                }
              >
                <SelectTrigger className="w-full md:w-[100px] py-5 ">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Label className="text-[12px] md:text-[12px] lg:text-[13px]">
                M.Status:
              </Label>
              <Select
                value={maritalStatus}
                onValueChange={(value) =>
                  handleSelectChange(
                    SESSION_KEYS.MARITAL_STATUS,
                    value,
                    setMaritalStatus
                  )
                }
              >
                <SelectTrigger className="w-full md:w-[100px] py-5 ">
                  <SelectValue placeholder="Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Label className="text-[12px] md:text-[12px] lg:text-[13px]">
                Caste:
              </Label>
              <Select
                value={caste}
                onValueChange={(value) =>
                  handleSelectChange(SESSION_KEYS.CASTE, value, setCaste)
                }
              >
                <SelectTrigger className="w-full md:w-[100px] py-5">
                  <SelectValue placeholder="Caste" />
                </SelectTrigger>
                <SelectContent>
                  {casteOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div> */}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-y-10 lg:gap-x-4">
        {content}
      </div>
    </div>
  );
};

export default ProfileGallery;
