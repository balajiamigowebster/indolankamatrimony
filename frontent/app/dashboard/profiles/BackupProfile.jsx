"use client";

import {
  adminGetProfileById,
  adminUpdateProfile,
} from "@/app/redux/adminSlices/adminSlice";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
// import { toast } from "sonner"; // Not used in the provided logic, keeping it commented
// import { useRouter } from "next/navigation"; // Not used in the provided logic, keeping it commented
import Image from "next/image"; // 🏞️ NEW: Import Image component for displaying the profile image
import { toast } from "sonner";

// 📅 Helper function to calculate age from DOB
const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

const EditProfile = () => {
  const dispatch = useDispatch();
  // 📅 State for the calendar picker
  const [dobDate, setDobDate] = useState(null);
  // 🏞️ State to hold the profile image file or URL for display
  const [profileImage, setProfileImage] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const router = useRouter();

  // singleProfile state-la irukkaa nu paakaam
  const { singleProfile, loading, error } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    mprofile: "",
    pname: "",
    dob: "",
    age: "", // auto-calculated
    pbrith: "",
    tbrith: "",
    rasi: "",
    nakshatram: "",
    laknam: "",
    height: "",
    weight: "",
    color: "",
    maritalstatus: "",
    gender: "",
    education: [],
    occupation: "",
    annualincome: "",
    mothertongue: "",
    religion: "",
    caste: "",
    subcaste: "",
    fname: "",
    foccupation: "",
    mname: "",
    moccupation: "",
    sister: "",
    brother: "",
    children: "",
    rplace: "",
    whatsappno: "",
    email: "",
    addressdetails: "",
    phonenumber: "",
  });

  // console.log(formData);

  const params = useParams();
  const profileId = params.id; // Edit page route: dashboard/profiles/edit/[id]

  // ... (Occupations, FatherOccupations, MotherOccupations, dropdownFieldMap, dropdownData, and fieldOrder remain the same)
  // 📚 NOTE: The provided dropdown data and fieldOrder are long, I'm keeping the original ones in the final code but removing them here for brevity to focus on the changes.

  const Occupations = [
    "Software Professional",
    "Teaching / Academician",
    "Executive",
    "Automobile",
    "own business",
    "Doctor",
  ];

  const uniqueOccupations = [...new Set(Occupations)];

  const FatherOccupations = [
    // Common occupations
    "Software Professional",
    "Teaching / Academician",
    "Executive",
    "Doctor",
    "Manager",
  ];

  const uniqueFatherOccupations = [...new Set(FatherOccupations)];

  const MotherOccupations = [
    "Software Professional",
    "Teaching / Academician",
    "Executive",
    "Doctor",
    "Manager",
    "Professor / Lecturer",
  ];

  const uniqueMotherOccupations = [...new Set(MotherOccupations)];

  const dropdownFieldMap = {
    "Matrimony Profile for": "mprofile",
    Rasi: "rasi",
    Nakshatram: "nakshatram",
    Laknam: "laknam",
    Color: "color",
    "Marital Status": "maritalstatus",
    Gender: "gender",
    Education: "education",
    Occupation: "occupation",
    "Annual Income": "annualincome",
    "Mother Tongue": "mothertongue",
    Religion: "religion",
    Caste: "caste",
    "Father's Occupation": "foccupation",
    "Mother's Occupation": "moccupation",
  };

  const dropdownData = {
    "Matrimony Profile for": [
      "Myself",
      "Son",
      "Daugther",
      "Brother",
      "Sister",
      "Friends",
      "Relative",
    ],
    Rasi: [
      "மேஷம் (Aries)",
      "ரிஷபம் (Taurus)",
      "மிதுனம் (Gemini)",
      "கடகம் (Cancer)",
    ],

    Nakshatram: [
      "அஸ்வினி (Ashwini)",
      "பரணி (Bharani)",
      "கார்த்திகை (Krittika)",
      "ரோகிணி (Rohini)",
      "மிருகசீரிடம் (Mrigashira)",
      "திருவாதிரை (Ardra)",
    ],

    Laknam: [
      "மேஷம் (Aries)",
      "ரிஷபம் (Taurus)",
      "மிதுனம் (Gemini)",
      "கடகம் (Cancer)",
    ], // Note: First code-la irundha short list

    Color: ["Fair", "Black", "White", "Very Fair"],
    "Marital Status": [
      "UnMarried",
      "Divorced",
      "Widowed",
      "Separated",
      "Married",
      "Annulled",
    ],

    Gender: ["Male", "Female"],
    Education: [
      "SSLC",
      "12th Higher Education",
      "Aeronautical Engineering",
      "B.Arch",
      "BCA",
    ], // Note: First code-la irundha short list

    Occupation: uniqueOccupations,

    "Annual Income": [
      "0 - 1 Lakh",
      "1 - 2 Lakhs",
      "2 - 3 Lakhs",
      "3 - 4 Lakhs",
      "4 - 5 Lakhs",
      "5 - 6 Lakhs",
    ],

    "Mother Tongue": ["Tamil", "Telugu", "Malayalam", "Kannada", "Hindi"],

    Religion: ["Hindu", "Christian", "Muslim", "Sikh"],

    Caste: [
      "24 Manai Telugu Chettiar",
      "Aaru Nattu Vellala",
      "Achirapakkam Chettiar",
      "Adi Dravidar",
      "Agamudayar / Arcot / Thuluva Vellala",
      "Agaram Vellan Chettiar",
      "Ahirwar",
      "Arunthathiyar",
    ],

    "Father's Occupation": uniqueFatherOccupations,
    "Mother's Occupation": uniqueMotherOccupations,
  };

  const fieldOrder = [
    { label: "Matrimony Profile for", type: "select" },
    { label: "Name", name: "pname", type: "input" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Age", name: "age", type: "input" },
    { label: "Place of Birth", name: "pbrith", type: "input" },
    { label: "Time of Birth", name: "tbrith", type: "input" },
    { label: "Rasi", type: "select" },
    { label: "Nakshatram", type: "select" },
    { label: "Laknam", type: "select" },
    { label: "Height", name: "height", type: "input" },
    { label: "Weight", name: "weight", type: "input" },
    { label: "Color", type: "select" },
    { label: "Marital Status", type: "select" },
    { label: "Gender", type: "select" },
    { label: "Education", type: "select" },
    { label: "Occupation", type: "select" },
    { label: "Annual Income", type: "select" },
    { label: "Mother Tongue", type: "select" },
    { label: "Religion", type: "select" },
    { label: "Caste", type: "select" },
    { label: "Subcaste", name: "subcaste", type: "input" }, // --- FAMILY DETAILS HEADING ADDED ---

    { label: "Family Details", type: "heading" },

    { label: "Father's Name", name: "fname", type: "input" },
    { label: "Father's Occupation", type: "select" },
    { label: "Mother's Name", name: "mname", type: "input" },
    { label: "Mother's Occupation", type: "select" },
    { label: "Sister", name: "sister", type: "input" },
    { label: "Brother", name: "brother", type: "input" },
    { label: "Children", name: "children", type: "input" },
    { label: "Residing Place", name: "rplace", type: "input" }, // --- CONTACT DETAILS HEADING ADDED ---
    { label: "Contact Details", type: "heading" },

    { label: "Whatsapp Number", name: "whatsappno", type: "input" }, // Order changed
    { label: "Email", name: "email", type: "input" },
    { label: "Address Details", name: "addressdetails", type: "textarea" },
    { label: "Phone Number", name: "phonenumber", type: "input" },
    { label: "Profile Image", name: "image", type: "file" },
  ];
  // ---------------------------------------------------------------------------------------------------

  // 📝 Universal Change Handler for Input and Textarea fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // 📅 Age Auto-Calculation: If DOB changes, recalculate age
    if (name === "dob") {
      newFormData.age = calculateAge(value);
    }

    // 📞 Phone/Whatsapp: Allow only numbers (optional, but good practice for 'tel' type fields)
    if (name === "phonenumber" || name === "whatsappno") {
      const cleanedValue = value.replace(/\D/g, ""); // Remove all non-digit characters
      newFormData[name] = cleanedValue.slice(0, 10); // Limit to 10 characters
    }

    setFormData(newFormData);
  };

  // ⬇️ Universal Change Handler for Select fields (Shadcn/ui Select)
  const handleSelectChange = (name, value) => {
    if (name === "education") {
      // 🟢 Logic for multi-select (add/remove value from array)
      setFormData((prev) => ({
        ...prev,
        education: prev.education.includes(value)
          ? prev.education.filter((v) => v !== value) // Remove if already exists
          : [...prev.education, value], // Add if it doesn't exist
      }));
    } else {
      // Logic for standard single-select fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 🔴 Validation error Clear state (Uncomment if you add the validation state)
    // if (validation[name]) {
    //   setValidation((prev) => ({ ...prev, [name]: false }));
    // }
  };

  // 📅 Date Select Handler
  const handleDateSelect = (date) => {
    if (date) {
      // 1. Update calendar state
      setDobDate(date);
      // 2. Format date for backend (ISO string is robust, or you can use "yyyy-MM-dd")
      const formattedDate = format(date, "yyyy-MM-dd");

      // 3. Update formData
      setFormData((prev) => ({
        ...prev,
        dob: formattedDate,
        // 4. Update age field automatically
        age: calculateAge(formattedDate),
      }));
      // 5. Close the calendar
      setIsCalendarOpen(false);
    } else {
      setDobDate(null);
      setFormData((prev) => ({
        ...prev,
        dob: "",
        age: "",
      }));
    }
  };

  // 🏞️ Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the file object for potential upload
      setProfileImageFile(file);
      // Create a local URL to display the newly selected image immediately
      const localImageUrl = URL.createObjectURL(file);
      setProfileImageUrl(localImageUrl);
      // setFormData((prev) => ({ ...prev, image: localImageUrl }));
      // 🔴 NOTE: In a real scenario, you'd typically handle image upload (e.g., to Cloudinary)
      // in a separate step and store the resulting URL in formData.
    } else {
      setProfileImageFile(null);
      if (!e.target.value) {
        setProfileImageUrl(singleProfile?.profileImage || null);
      }
    }
  };

  // 🔄 Initial Data Fetch Effect (Unchanged)
  useEffect(() => {
    if (profileId) {
      dispatch(adminGetProfileById(profileId));
    }
  }, [profileId, dispatch]);

  // ⚙️ Populate Form Data Effect when singleProfile is available
  useEffect(() => {
    if (singleProfile) {
      const mapValue = (value, type) => {
        if (value === "N/A" || value === null || value === undefined) {
          if (type === "array") return [];
          if (type === "date") return "";
          return "";
        }
        return value;
      };

      const initialFormData = {
        mprofile: mapValue(singleProfile.mprofile),
        pname: mapValue(singleProfile.pname),
        dob: mapValue(singleProfile.dob, "date"),
        age: mapValue(singleProfile.age),
        pbrith: mapValue(singleProfile.pbrith),
        tbrith: mapValue(singleProfile.tbrith),
        rasi: mapValue(singleProfile.rasi),
        nakshatram: mapValue(singleProfile.nakshatram),
        laknam: mapValue(singleProfile.laknam),
        height: mapValue(singleProfile.height),
        weight: mapValue(singleProfile.weight),
        color: mapValue(singleProfile.color),
        maritalstatus: mapValue(singleProfile.maritalstatus),
        gender: mapValue(singleProfile.gender),
        education:
          singleProfile.education && singleProfile.education !== "N/A"
            ? singleProfile.education.split(",").map((e) => e.trim())
            : [],
        occupation: mapValue(singleProfile.occupation),
        annualincome: mapValue(singleProfile.annualincome),
        mothertongue: mapValue(singleProfile.mothertongue),
        religion: mapValue(singleProfile.religion),
        caste: mapValue(singleProfile.caste),
        subcaste: mapValue(singleProfile.subcaste),
        fname: mapValue(singleProfile.fname),
        foccupation: mapValue(singleProfile.foccupation),
        mname: mapValue(singleProfile.mname),
        moccupation: mapValue(singleProfile.moccupation),
        sister: mapValue(singleProfile.sister),
        brother: mapValue(singleProfile.brother),
        children: mapValue(singleProfile.children),
        rplace: mapValue(singleProfile.rplace),
        whatsappno: mapValue(singleProfile.whatsappno),
        email: mapValue(singleProfile.email),
        addressdetails: mapValue(singleProfile.addressdetails),
        phonenumber: mapValue(singleProfile.phonenumber),
      };

      setFormData(initialFormData);

      // 📅 Set calendar date if valid
      if (initialFormData.dob) {
        // Ensure the dob string is in a format Date constructor understands (e.g., "YYYY-MM-DD")
        setDobDate(new Date(initialFormData.dob));
      } else {
        setDobDate(null);
      }

      // 🏞️ Set the Cloudinary URL for display
      // Assuming singleProfile.profileImage holds the Cloudinary URL (or a field like it)
      const imageUrl = mapValue(singleProfile.profileImage); // Use a new field from the backend
      if (imageUrl) {
        setProfileImage(imageUrl);
      }
    }
  }, [singleProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare data for backend
    const dataToSubmit = new FormData();

    // 2. Iterate through formData and append to FormData object
    for (const key in formData) {
      let value = formData[key];

      // a. Handle Education array: convert to comma-separated string
      if (key === "education" && Array.isArray(value)) {
        value = value.join(", ");
      }

      // b. Handle N/A logic: if value is empty/null, send "N/A" (or another desired placeholder)
      if (
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        value = "N/A";
      }

      // c. Append to FormData
      dataToSubmit.append(key, value);
    }

    // 3. Handle the image file separately
    if (profileImageFile) {
      // Append the actual file object. The backend will handle the upload.
      dataToSubmit.append("image", profileImageFile);
    }

    // 3. Handle the image file separately
    try {
      const resultAction = await dispatch(
        adminUpdateProfile({ id: profileId, updateData: dataToSubmit })
      );

      if (adminUpdateProfile.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profiles");
      } else {
        // Handle error from the thunk
        const errorPayload = resultAction.payload;
        const errorMessage =
          errorPayload.message || "An unknown error occurred.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit profile update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------------------------------
  // 🖼️ Helper component to render the image
  const ImageDisplay = ({ imageUrl }) => {
    if (!imageUrl) return null;
    return (
      <div className="mt-2 w-20 h-20 rounded-full overflow-hidden border border-gray-300">
        <Image
          src={imageUrl}
          alt="Profile"
          width={80} // Small size for view
          height={80} // Small size for view
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
    );
  };
  // ---------------------------------------------------------------------------------------------------

  return (
    <div className="max-w-8xl mx-auto shadow-lg rounded-2xl">
      <div className="lg:max-w-5xl lg:mx-auto lg:bg-white lg:shadow-2xl lg:px-3 lg:pb-10 lg:gap-10 rounded-2xl lg:flex">
        <form
          onSubmit={handleSubmit}
          className="md:grid flex flex-col md:grid-cols-2 lg:flex lg:flex-col pt-10 md:pt-15 lg:pt-5 lg:w-[670px] lg:grid-cols-1 gap-2 md:gap-3 lg:gap-2"
        >
          <h1 className="bg-neutral-600/70 col-span-1 font-semibold md:col-span-2 py-3 px-2 text-2xl text-white">
            Profile details
          </h1>
          {fieldOrder.map((field, index) => {
            const fieldName = dropdownFieldMap[field.label] || field.name;

            if (field.type === "heading") {
              return (
                <h2
                  key={field.label}
                  className="col-span-full bg-neutral-600/70 font-semibold md:col-span-2 py-3 px-2 text-2xl text-white"
                >
                  {field.label}
                </h2>
              );
            }

            // 1. SELECT FIELD (UPDATED with value and onChange)
            if (field.type === "select") {
              const options = dropdownData[field.label];
              if (!options) return null;

              const currentValue = Array.isArray(formData[fieldName])
                ? formData[fieldName][0] || "" // Handle multi-select value for display
                : formData[fieldName] || "";

              return (
                <div key={field.label} className="flex flex-col">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <Select
                        value={currentValue}
                        onValueChange={(val) =>
                          handleSelectChange(fieldName, val)
                        }
                      >
                        <SelectTrigger className="w-full py-[15px]">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((opt, index) => (
                            <SelectItem key={`${opt}-${index}`} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* ... Existing multi-select display logic for education (kept for structure) */}
                  {fieldName === "education" && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.education.length > 0 &&
                        formData.education.map((item, index) => (
                          <span
                            key={index}
                            className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded-full text-[10px] flex items-center gap-1"
                          >
                            {item}
                            <X
                              className="cursor-pointer h-3 w-3 text-neutral-600 hover:text-red-500" // சின்ன சைஸ் h-3 w-3
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectChange(fieldName, item); // Toggles/removes the item
                              }}
                            />
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              );
            }

            // 2. DATE PICKER (UPDATED with value and onChange)
            if (field.type === "date") {
              return (
                <div key={field.label} className="flex flex-col lg:flex-row">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen} // Toggle calendar open state
                        className=""
                      >
                        <PopoverTrigger className="w-full" asChild>
                          <Button
                            variant="outline"
                            className="justify-start py-[15px]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {/* 📅 Display selected/backend date */}
                            {dobDate
                              ? format(dobDate, "PPP")
                              : "Select Date of Birth"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            selected={dobDate} // Pass current date
                            onSelect={handleDateSelect} // Handle date selection
                            mode="single"
                            captionLayout="dropdown"
                            fromYear={1950}
                            toYear={new Date().getFullYear()} // Set to current year
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              );
            }

            // 3. TEXTAREA (UPDATED with value and onChange)
            if (field.type === "textarea") {
              return (
                <div key={field.name} className="flex flex-col md:col-span-2">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <Textarea
                        name={fieldName}
                        value={formData[fieldName] || ""}
                        placeholder={`Enter ${field.label}`}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // 4. FILE INPUT (UPDATED with onChange and NEW Image Display)
            if (field.type === "file") {
              return (
                <div key={field.name} className="flex flex-col">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>

                    <div className="lg:w-[900px]">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`py-[8px]`}
                      />

                      {/* 🏞️ NEW: Display the image from backend/newly selected file */}
                      {profileImage && <ImageDisplay imageUrl={profileImage} />}
                    </div>
                  </div>
                </div>
              );
            }

            // 5. REGULAR TEXT INPUT (UPDATED with value and onChange)
            if (field.type === "input") {
              const isAgeField = field.name === "age";
              const isPhoneNumberField =
                fieldName === "phonenumber" || fieldName === "whatsappno";
              const isEmailField = fieldName === "email";

              return (
                <div key={field.name} className="flex flex-col">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <Input
                        type={
                          isAgeField
                            ? "number"
                            : isPhoneNumberField
                            ? "tel"
                            : isEmailField
                            ? "email"
                            : "text"
                        }
                        name={fieldName}
                        value={formData[fieldName] || ""}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        readOnly={isAgeField}
                        disabled={isAgeField && formData.age === ""}
                        maxLength={isPhoneNumberField ? 10 : undefined}
                        className={`h-[32px]`}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return null; // For safety
          })}
          <div className="col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-8 py-5 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Please wait...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
