"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  adminGetProfileById,
  adminUpdateProfile,
} from "@/app/redux/adminSlices/adminSlice";
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
import { CalendarIcon, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// 📅 Helper function to calculate age from DOB
const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : "";
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
    "Other",
  ],
  Rasi: [
    "மேஷம் (Aries)",
    "ரிஷபம் (Taurus)",
    "மிதுனம் (Gemini)",
    "கடகம் (Cancer)",
    "சிம்மம் (Leo)",
    "கன்னி (Virgo)",
    "துலாம் (Libra)",
    "விருச்சிகம் (Scorpio)",
    "தனுசு (Sagittarius)",
    "மகரம் (Capricorn)",
    "கும்பம் (Aquarius)",
    "மீனம் (Pisces)",
    "Other",
  ],
  Nakshatram: [
    "அஸ்வினி (Ashwini)",
    "பரணி (Bharani)",
    "கார்த்திகை (Krittika)",
    "ரோகிணி (Rohini)",
    "மிருகசீரிடம் (Mrigashira)",
    "திருவாதிரை (Ardra)",
    "புனர்பூசம் (Punarvasu)",
    "பூசம் (Pushya)",
    "ஆயில்யம் (Ashlesha)",
    "மகம் (Magha)",
    "பூரம் (Purva Phalguni)",
    "உத்திரம் (Uttara Phalguni)",
    "அஸ்தம் (Hasta)",
    "சித்திரை (Chitra)",
    "சுவாதி (Swati)",
    "விசாகம் (Vishakha)",
    "அனுசம் (Anuradha)",
    "கேட்டை (Jyeshtha)",
    "மூலம் (Moola)",
    "பூராடம் (Purva Ashadha)",
    "உத்திராடம் (Uttara Ashadha)",
    "திருவோணம் (Shravana)",
    "அவிட்டம் (Dhanishta)",
    "சதயம் (Shatabhisha)",
    "பூரட்டாதி (Purva Bhadrapada)",
    "உத்திரட்டாதி (Uttara Bhadrapada)",
    "ரேவதி (Revati)",
    "Other",
  ],
  Laknam: [
    "மேஷம் (Aries)",
    "ரிஷபம் (Taurus)",
    "மிதுனம் (Gemini)",
    "கடகம் (Cancer)",
    "சிம்மம் (Leo)",
    "கன்னி (Virgo)",
    "துலாம் (Libra)",
    "விருச்சிகம் (Scorpio)",
    "தனுசு (Sagittarius)",
    "மகரம் (Capricorn)",
    "கும்பம் (Aquarius)",
    "மீனம் (Pisces)",
    "Other",
  ],
  Color: ["Fair", "Black", "White", "Very Fair", "Other"],
  "Marital Status": [
    "UnMarried",
    "Divorced",
    "Widowed",
    "Separated",
    "Married",
    "Annulled",
    "Other",
  ],
  Gender: ["Male", "Female"],
  "Annual Income": [
    "0 - 1 Lakh",
    "1 - 2 Lakhs",
    "2 - 3 Lakhs",
    "3 - 4 Lakhs",
    "4 - 5 Lakhs",
    "5 - 6 Lakhs",
    "6 - 7 Lakhs",
    "7 - 8 Lakhs",
    "8 - 9 Lakhs",
    "9 - 10 Lakhs",
    "10 - 12 Lakhs",
    "12 - 14 Lakhs",
    "14 - 16 Lakhs",
    "16 - 18 Lakhs",
    "18 - 20 Lakhs",
    "20 - 25 Lakhs",
    "25 - 30 Lakhs",
    "30 - 35 Lakhs",
    "35 - 40 Lakhs",
    "40 - 45 Lakhs",
    "45 - 50 Lakhs",
    "50 - 60 Lakhs",
    "60 - 70 Lakhs",
    "70 - 80 Lakhs",
    "80 - 90 Lakhs",
    "90 Lakhs - 1 Crore",
    "1 Crore & Above",
    "Other",
  ],
  "Mother Tongue": [
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Hindi",
    "Marathi",
    "Bengali",
    "Gujarati",
    "Marwari",
    "Oriya",
    "Punjabi",
    "Sindhi",
    "Urdu",
    "Arunachali",
    "Assamese",
    "Awadhi",
    "Bhojpuri",
    "Brij",
    "Bihari",
    "Badaga",
    "Chatisgarhi",
    "Dogri",
    "English",
    "French",
    "Garhwali",
    "Garo",
    "Haryanvi",
    "Himachali/Pahari",
    "Kanauji",
    "Kashmiri",
    "Khandesi",
    "Khasi",
    "Konkani",
    "Koshali",
    "Kumaoni",
    "Kutchi",
    "Lepcha",
    "Ladacki",
    "Magahi",
    "Maithili",
    "Manipuri",
    "Miji",
    "Mizo",
    "Monpa",
    "Nicobarese",
    "Nepali",
    "Rajasthani",
    "Sanskrit",
    "Santhali",
    "Sourashtra",
    "Tripuri",
    "Tulu",
    "Angika",
    "Bagri Rajasthani",
    "Dhundhari/Jaipuri",
    "Gujari/Gojari",
    "Harauti",
    "Lambadi",
    "Malvi",
    "Mewari",
    "Mewati/Ahirwati",
    "Nimadi",
    "Shekhawati",
    "Wagdi",
    "Other",
  ],
  Religion: [
    "Hindu",
    "Christian",
    "Muslim",
    "Sikh",
    "Jain - Digambar",
    "Jain - Shwetambar",
    "Jain - Others",
    "Parsi",
    "Buddhis",
    "Inter-Religion",
    "Other",
  ],
  Caste: [
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
    "Other",
  ],
  Height: [
    "4ft 6in - 137cm",
    "4ft 7in - 139cm",
    "4ft 8in - 142cm",
    "4ft 9in - 144cm",
    "4ft 10in - 147cm",
    "4ft 11in - 149cm",
    "5ft - 152cm",
    "5ft 1in - 154cm",
    "5ft 2in - 157cm",
    "5ft 3in - 160cm",
    "5ft 4in - 162cm",
    "5ft 5in - 165cm",
    "5ft 6in - 167cm",
    "5ft 7in - 170cm",
    "5ft 8in - 172cm",
    "5ft 9in - 175cm",
    "5ft 10in - 177cm",
    "5ft 11in - 180cm",
    "6ft - 182cm",
    "6ft 1in - 185cm",
    "6ft 2in - 187cm",
    "6ft 3in - 190cm",
    "6ft 4in - 193cm",
    "6ft 5in - 195cm",
    "6ft 6in - 198cm",
    "6ft 7in - 200cm",
    "6ft 8in - 203cm",
    "6ft 9in - 205cm",
    "6ft 10in - 208cm",
    "6ft 11in - 210cm",
    "7ft - 213cm",
    "Other",
  ],
};

const dropdownFieldMap = {
  "Matrimony Profile for": "mprofile",
  Rasi: "rasi",
  Nakshatram: "nakshatram",
  Laknam: "laknam",
  Height: "height",
  Color: "color",
  "Marital Status": "maritalstatus",
  Gender: "gender",
  "Annual Income": "annualincome",
  "Mother Tongue": "mothertongue",
  Religion: "religion",
  Caste: "caste",
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
  { label: "Height", name: "height", type: "select" },
  { label: "Weight", name: "weight", type: "input" },
  { label: "Color", type: "select" },
  { label: "Marital Status", type: "select" },
  { label: "Gender", type: "select" },
  { label: "Education", name: "education", type: "input" },
  { label: "Occupation", name: "occupation", type: "input" },
  { label: "Annual Income", type: "select" },
  { label: "Mother Tongue", type: "select" },
  { label: "Religion", type: "select" },
  { label: "Caste", type: "select" },
  { label: "Subcaste", name: "subcaste", type: "input" },

  { label: "Family Details", type: "heading" },

  { label: "Father's Name", name: "fname", type: "input" },
  { label: "Father's Occupation", name: "foccupation", type: "input" },
  { label: "Mother's Name", name: "mname", type: "input" },
  { label: "Mother's Occupation", name: "moccupation", type: "input" },
  { label: "Sister", name: "sister", type: "input" },
  { label: "Brother", name: "brother", type: "input" },
  { label: "Children", name: "children", type: "input" },
  { label: "Residing Place", name: "rplace", type: "input" },

  { label: "Contact Details", type: "heading" },

  { label: "Whatsapp Number", name: "whatsappno", type: "input" },
  { label: "Email", name: "email", type: "input" },
  { label: "Address Details", name: "addressdetails", type: "textarea" },
  { label: "Phone Number", name: "phonenumber", type: "input" },
  { label: "Profile Image", name: "image", type: "file" },
];

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id;

  const { singleProfile, loading } = useSelector((state) => state.admin);

  const [dobDate, setDobDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image handling
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [formData, setFormData] = useState({
    mprofile: "",
    pname: "",
    dob: "",
    age: "",
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
    education: "",
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

  // Fetch profile on initial load
  useEffect(() => {
    if (profileId) {
      dispatch(adminGetProfileById(profileId));
    }
  }, [profileId, dispatch]);

  // Populate formData when singleProfile is fetched
  useEffect(() => {
    if (singleProfile) {
      const mapValue = (value) => {
        if (value === "N/A" || value === null || value === undefined) {
          return "";
        }
        return String(value);
      };

      setFormData({
        mprofile: mapValue(singleProfile.mprofile),
        pname: mapValue(singleProfile.pname),
        dob: mapValue(singleProfile.dob),
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
        education: Array.isArray(singleProfile.education)
          ? singleProfile.education.join(", ")
          : mapValue(singleProfile.education),
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
      });

      // Date of Birth
      if (singleProfile.dob && singleProfile.dob !== "N/A") {
        const d = new Date(singleProfile.dob);
        if (!isNaN(d.getTime())) {
          setDobDate(d);
        } else {
          setDobDate(null);
        }
      } else {
        setDobDate(null);
      }

      // Profile image
      const existingImg = singleProfile.image || singleProfile.profileImage;
      if (existingImg && existingImg !== "N/A" && existingImg !== "null") {
        setPreviewImage(existingImg);
      } else {
        setPreviewImage(null);
      }
      setProfileImageFile(null);
      setRemoveExistingImage(false);
    }
  }, [singleProfile]);

  // Input & Textarea change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "dob") {
      newFormData.age = calculateAge(value);
    }

    if (name === "phonenumber" || name === "whatsappno") {
      const cleaned = value.replace(/\D/g, "");
      newFormData[name] = cleaned.slice(0, 10);
    }

    setFormData(newFormData);
  };

  // Select change handler
  const handleSelectChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Date selection handler
  const handleDateSelect = (date) => {
    if (date) {
      setDobDate(date);
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData((prev) => ({
        ...prev,
        dob: formattedDate,
        age: calculateAge(formattedDate),
      }));
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

  // Image input change handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error("Image size must be less than 500KB.");
        e.target.value = "";
        return;
      }
      setProfileImageFile(file);
      setRemoveExistingImage(false);
      const localUrl = URL.createObjectURL(file);
      setPreviewImage(localUrl);
    }
  };

  // Remove existing or selected image
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setPreviewImage(null);
    setRemoveExistingImage(true);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = new FormData();

    for (const key in formData) {
      let value = formData[key];
      if (value === "" || value === null || value === undefined) {
        value = "N/A";
      }
      dataToSubmit.append(key, value);
    }

    if (profileImageFile) {
      dataToSubmit.append("image", profileImageFile);
    } else if (removeExistingImage) {
      dataToSubmit.append("image", "N/A");
    }

    try {
      const resultAction = await dispatch(
        adminUpdateProfile({ id: profileId, updateData: dataToSubmit })
      );

      if (adminUpdateProfile.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profiles");
      } else {
        const errorPayload = resultAction.payload;
        const errorMessage =
          errorPayload?.message || "An unknown error occurred.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit profile update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/profiles")}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white px-3 py-2 rounded-lg border border-neutral-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profiles
        </button>
      </div>

      <div className="lg:max-w-5xl lg:mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {loading && !singleProfile ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-600" />
            <p className="text-neutral-600 font-medium text-lg">
              Loading profile details...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="md:grid flex flex-col md:grid-cols-2 lg:flex lg:flex-col p-6 md:p-10 lg:w-full gap-4"
          >
            <div className="flex items-center justify-between bg-neutral-700 col-span-1 md:col-span-2 py-4 px-6 rounded-lg text-white">
              <h1 className="font-semibold text-2xl">
                Edit Profile {singleProfile?.id ? `(#${singleProfile.id})` : ""}
              </h1>
              {singleProfile?.pname && (
                <span className="text-sm bg-neutral-600 px-3 py-1 rounded-full font-medium">
                  {singleProfile.pname}
                </span>
              )}
            </div>

            {fieldOrder.map((field) => {
              const fieldName = dropdownFieldMap[field.label] || field.name;

              // Section Heading
              if (field.type === "heading") {
                return (
                  <h2
                    key={field.label}
                    className="col-span-full bg-neutral-600/80 font-semibold md:col-span-2 py-3 px-4 rounded-md text-xl text-white mt-4"
                  >
                    {field.label}
                  </h2>
                );
              }

              // Select Dropdown
              if (field.type === "select") {
                const options = dropdownData[field.label] || [];
                const currentValue = formData[fieldName] || "";
                const selectOptions =
                  currentValue && !options.includes(currentValue)
                    ? [currentValue, ...options]
                    : options;

                return (
                  <div key={field.label} className="flex flex-col">
                    <div className="lg:flex-row w-full lg:flex lg:items-center lg:gap-8">
                      <div className="w-full lg:w-1/3">
                        <Label className="text-sm font-medium py-2">
                          {field.label}
                        </Label>
                      </div>
                      <div className="w-full lg:w-2/3">
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(val) =>
                            handleSelectChange(fieldName, val)
                          }
                        >
                          <SelectTrigger className="w-full py-2.5">
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {selectOptions.map((opt, idx) => (
                              <SelectItem key={`${opt}-${idx}`} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              }

              // Date Picker
              if (field.type === "date") {
                return (
                  <div key={field.label} className="flex flex-col">
                    <div className="lg:flex-row w-full lg:flex lg:items-center lg:gap-8">
                      <div className="w-full lg:w-1/3">
                        <Label className="text-sm font-medium py-2">
                          {field.label}
                        </Label>
                      </div>
                      <div className="w-full lg:w-2/3">
                        <Popover
                          open={isCalendarOpen}
                          onOpenChange={setIsCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start py-2.5 text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dobDate
                                ? format(dobDate, "PPP")
                                : "Select Date of Birth"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              selected={dobDate}
                              onSelect={handleDateSelect}
                              mode="single"
                              captionLayout="dropdown"
                              fromYear={1950}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                );
              }

              // Textarea
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="flex flex-col md:col-span-2">
                    <div className="lg:flex-row w-full lg:flex lg:items-start lg:gap-8">
                      <div className="w-full lg:w-1/3 pt-2">
                        <Label className="text-sm font-medium py-2">
                          {field.label}
                        </Label>
                      </div>
                      <div className="w-full lg:w-2/3">
                        <Textarea
                          name={fieldName}
                          value={formData[fieldName] || ""}
                          placeholder={`Enter ${field.label}`}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              // File / Image Input
              if (field.type === "file") {
                return (
                  <div key={field.name} className="flex flex-col md:col-span-2">
                    <div className="lg:flex-row w-full lg:flex lg:items-start lg:gap-8">
                      <div className="w-full lg:w-1/3 pt-2">
                        <Label className="text-sm font-medium py-2">
                          {field.label}
                        </Label>
                      </div>
                      <div className="w-full lg:w-2/3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="py-1.5"
                        />
                        {previewImage && (
                          <div className="mt-3 flex items-center gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative">
                              <img
                                src={previewImage}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveImage}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular Text Input
              if (field.type === "input") {
                const isAgeField = field.name === "age";
                const isPhoneNumberField =
                  fieldName === "phonenumber" || fieldName === "whatsappno";
                const isEmailField = fieldName === "email";

                return (
                  <div key={field.name} className="flex flex-col">
                    <div className="lg:flex-row w-full lg:flex lg:items-center lg:gap-8">
                      <div className="w-full lg:w-1/3">
                        <Label className="text-sm font-medium py-2">
                          {field.label}
                        </Label>
                      </div>
                      <div className="w-full lg:w-2/3">
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
                          maxLength={isPhoneNumberField ? 10 : undefined}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            <div className="col-span-2 flex justify-center gap-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/profiles")}
                className="px-6 py-2.5 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="px-8 py-2.5 text-base bg-neutral-800 hover:bg-neutral-900 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
