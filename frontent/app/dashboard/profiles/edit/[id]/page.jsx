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
  // 🖼️ NEW: State to hold the URL for the displayed image (Backend URL or Local File Preview)
  const [displayImageUrl, setDisplayImageUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const router = useRouter();

  const [otherInputs, setOtherInputs] = useState({
    education: false,
    occupation: false,
    foccupation: false,
    moccupation: false,
    mprofile: false,
    rasi: false,
    nakshatram: false,
    laknam: false,
    maritalstatus: false,
    education: false,
    annualincome: false,
    mothertongue: false,
    religion: false,
    caste: false,
    height: false,
    color: false,
  });

  const [OtherValue, setOtherValue] = useState({
    education: "",
    occupation: "",
    foccupation: "",
    moccupation: "",
    mprofile: "",
    rasi: "",
    nakshatram: "",
    laknam: "",
    height: "",
    maritalstatus: "",
    education: "",
    annualincome: "",
    mothertongue: "",
    religion: "",
    caste: "",
    color: "",
  });

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
    "Manager",
    "Professor / Lecturer",
    "Officer",
    "Human Resources Professional",
    "Manager",
    "Supervisor",
    "Officer",
    "Administrative Professional",
    "Executive",
    "Clerk",
    "Human Resources Professional",
    "Secretary / Front Office",
    "Agriculture & Farming Professional",
    "Horticulturist",
    "Pilot",
    "Air Hostess / Flight Attendant",
    "Airline Professional",
    "Architect",
    "Interior Designer",
    "Chartered Accountant",
    "Company Secretary",
    "Accounts / Finance Professional",
    "Banking Professional",
    "Auditor",
    "Financial Accountant",
    "Financial Analyst / Planning",
    "Investment Professional",
    "Fashion Designer",
    "Beautician",
    "Hair Stylist",
    "Jewellery Designer",
    "Designer (Others)",
    "Makeup Artist",
    "BPO / KPO / ITES Professional",
    "Customer Service Professional",
    "Civil Services (IAS / IPS / IRS / IES / IFS)",
    "Analyst",
    "Consultant",
    "Corporate Communication",
    "Corporate Planning",
    "Marketing Professional",
    "Operations Management",
    "Sales Professional",
    "Senior Manager / Manager",
    "Subject Matter Expert",
    "Business Development Professional",
    "Content Writer",
    "Army",
    "Navy",
    "Defence Services (Others)",
    "Air Force",
    "Paramilitary",
    "Professor / Lecturer",
    "Teaching / Academician",
    "Education Professional",
    "Training Professional",
    "Research Assistant",
    "Research Scholar",
    "Civil Engineer",
    "Electronics / Telecom Engineer",
    "Mechanical / Production Engineer",
    "Quality Assurance Engineer - Non IT",
    "Engineer - Non IT",
    "Designer",
    "Product Manager - Non IT",
    "Project Manager - Non IT",
    "Hotel / Hospitality Professional",
    "Restaurant / Catering Professional",
    "Chef / Cook",
    "Software Professional",
    "Hardware Professional",
    "Product Manager",
    "Project Manager6",
    "Program Manager",
    "Animator",
    "Cyber / Network Security",
    "UI / UX Designer",
    "Web / Graphic Designer",
    "Software Consultant",
    "Data Analyst",
    "Data Scientist",
    "Network Engineer",
    "Quality Assurance Engineer",
    "Lawyer & Legal Professional",
    "Legal Assistant",
    "Law Enforcement Officer",
    "Police",
    "Healthcare Professional",
    "Paramedical Professional",
    "Nurse",
    "Pharmacist",
    "Physiotherapist",
    "Psychologist",
    "Therapist",
    "Medical Transcriptionist",
    "Dietician / Nutritionist",
    "Lab Technician",
    "Medical Representative",
    "Journalist",
    "Media Professional",
    "Entertainment Professional",
    "Event Management Professional",
    "Advertising / PR Professional",
    "Designer",
    "Actor / Model",
    "Artist",
    "Mariner / Merchant Navy",
    "Sailor",
    "Scientist / Researcher",
    "CXO / President, Director, Chairman",
    "VP / AVP / GM / DGM / AGM",
    "Technician",
    "Arts & Craftsman",
    "Student",
    "Librarian",
    "Business Owner / Entrepreneur",
    "Retired",
    "Transportation / Logistics Professional",
    "Agent / Broker / Trader",
    "Contractor",
    "Fitness Professional",
    "Security Professional",
    "Social Worker / Volunteer / NGO",
    "Sportsperson",
    "Travel Professional",
    "Singer",
    "Writer",
    "Politician",
    "Associate",
    "Builder",
    "Chemist",
    "CNC Operator",
    "Distributor",
    "Driver",
    "Freelancer",
    "Mechanic",
    "Musician",
    "Photo / Videographer",
    "Surveyor",
    "Tailor",
    "Others",
    "Doctor",
    "Dentist",
    "Surgeon",
    "Veterinary Doctor",
    "Courier",
    "bluedart",
    "Diploma catering",
    "Other",
  ];

  const uniqueOccupations = [...new Set(Occupations)];

  const FatherOccupations = [
    // Common occupations
    "Software Professional",
    "Teaching / Academician",
    "Executive",
    "Doctor",
    "Manager",
    "Professor / Lecturer",
    "Officer",
    "Human Resources Professional",

    // ADMINISTRATION
    "Manager",
    "Supervisor",
    "Officer",
    "Administrative Professional",
    "Executive",
    "Clerk",
    "Human Resources Professional",
    "Secretary / Front Office",

    // AGRICULTURE
    "Agriculture & Farming Professional",
    "Horticulturist",

    // AIRLINE
    "Pilot",
    "Air Hostess / Flight Attendant",
    "Airline Professional",

    // ARCHITECTURE & DESIGN
    "Architect",
    "Interior Designer",

    // BANKING & FINANCE
    "Chartered Accountant",
    "Company Secretary",
    "Accounts / Finance Professional",
    "Banking Professional",
    "Auditor",
    "Financial Accountant",
    "Financial Analyst / Planning",
    "Investment Professional",

    // BEAUTY & FASHION
    "Fashion Designer",
    "Beautician",
    "Hair Stylist",
    "Jewellery Designer",
    "Designer (Others)",
    "Makeup Artist",
    // BPO & CUSTOMER SERVICE
    "BPO / KPO / ITES Professional",
    "Customer Service Professional",

    // CIVIL SERVICES
    "Civil Services (IAS / IPS / IRS / IES / IFS)",

    // CORPORATE PROFESSIONALS
    "Analyst",
    "Consultant",
    "Corporate Communication",
    "Corporate Planning",
    "Marketing Professional",
    "Operations Management",
    "Sales Professional",
    "Senior Manager / Manager",
    "Subject Matter Expert",
    "Business Development Professional",
    "Content Writer",

    // DEFENCE
    "Army",
    "Navy",
    "Defence Services (Others)",
    "Air Force",
    "Paramilitary",

    // EDUCATION & TRAINING
    "Professor / Lecturer",
    "Teaching / Academician",
    "Education Professional",
    "Training Professional",
    "Research Assistant",
    "Research Scholar",

    // ENGINEERING
    "Civil Engineer",
    "Electronics / Telecom Engineer",
    "Mechanical / Production Engineer",
    "Quality Assurance Engineer - Non IT",
    "Engineer - Non IT",
    "Designer",
    "Product Manager - Non IT",
    "Project Manager - Non IT",

    // HOSPITALITY
    "Hotel / Hospitality Professional",
    "Restaurant / Catering Professional",
    "Chef / Cook",
    // IT & SOFTWARE
    "Software Professional",
    "Hardware Professional",
    "Product Manager",
    "Project Manager",
    "Program Manager",
    "Animator",
    "Cyber / Network Security",
    "UI / UX Designer",
    "Web / Graphic Designer",
    "Software Consultant",
    "Data Analyst",
    "Data Scientist",
    "Network Engineer",
    "Quality Assurance Engineer",

    // LEGAL
    "Lawyer & Legal Professional",
    "Legal Assistant",

    // POLICE / LAW ENFORCEMENT
    "Law Enforcement Officer",
    "Police",

    // MEDICAL & HEALTHCARE-OTHERS
    "Healthcare Professional",
    "Paramedical Professional",
    "Nurse",
    "Pharmacist",
    "Physiotherapist",
    "Psychologist",
    "Therapist",
    "Medical Transcriptionist",
    "Dietician / Nutritionist",
    "Lab Technician",
    "Medical Representative",

    // MEDIA & ENTERTAINMENT
    "Journalist",
    "Media Professional",
    "Entertainment Professional",
    "Event Management Professional",
    "Advertising / PR Professional",
    "Designer",
    "Actor / Model",
    "Artist",

    // MERCHANT NAVY
    "Mariner / Merchant Navy",
    "Sailor",

    // SCIENTIST
    "Scientist / Researcher",

    // SENIOR MANAGEMENT
    "CXO / President, Director, Chairman",
    "VP / AVP / GM / DGM / AGM",
    // OTHERS
    "Technician",
    "Arts & Craftsman",
    "Student",
    "Librarian",
    "Business Owner / Entrepreneur",
    "Retired",
    "Transportation / Logistics Professional",
    "Agent / Broker / Trader",
    "Contractor",
    "Fitness Professional",
    "Security Professional",
    "Social Worker / Volunteer / NGO",
    "Sportsperson",
    "Travel Professional",
    "Singer",
    "Writer",
    "Politician",
    "Associate",
    "Builder",
    "Chemist",
    "CNC Operator",
    "Distributor",
    "Driver",
    "Freelancer",
    "Mechanic",
    "Musician",
    "Photo / Videographer",
    "Surveyor",
    "Tailor",
    "Others",

    // DOCTOR
    "Doctor",
    "Dentist",
    "Surgeon",
    "Veterinary Doctor",
    "Other",
  ];

  const uniqueFatherOccupations = [...new Set(FatherOccupations)];

  const MotherOccupations = [
    "Software Professional",
    "Teaching / Academician",
    "Executive",
    "Doctor",
    "Manager",
    "Professor / Lecturer",
    "Officer",
    "Human Resources Professional",

    // ADMINISTRATION
    "Manager",
    "Supervisor",
    "Officer",
    "Administrative Professional",
    "Executive",
    "Clerk",
    "Human Resources Professional",
    "Secretary / Front Office",

    // AGRICULTURE
    "Agriculture & Farming Professional",
    "Horticulturist",

    // AIRLINE
    "Pilot",
    "Air Hostess / Flight Attendant",
    "Airline Professional",

    // ARCHITECTURE & DESIGN
    "Architect",
    "Interior Designer",

    // BANKING & FINANCE
    "Chartered Accountant",
    "Company Secretary",
    "Accounts / Finance Professional",
    "Banking Professional",
    "Auditor",
    "Financial Accountant",
    "Financial Analyst / Planning",
    "Investment Professional",

    // BEAUTY & FASHION
    "Fashion Designer",
    "Beautician",
    "Hair Stylist",
    "Jewellery Designer",
    "Designer (Others)",
    "Makeup Artist",

    // BPO & CUSTOMER SERVICE
    "BPO / KPO / ITES Professional",
    "Customer Service Professional",

    // CIVIL SERVICES
    "Civil Services (IAS / IPS / IRS / IES / IFS)",

    // CORPORATE PROFESSIONALS
    "Analyst",
    "Consultant",
    "Corporate Communication",
    "Corporate Planning",
    "Marketing Professional",
    "Operations Management",
    "Sales Professional",
    "Senior Manager / Manager",
    "Subject Matter Expert",
    "Business Development Professional",
    "Content Writer",
    // DEFENCE
    "Army",
    "Navy",
    "Defence Services (Others)",
    "Air Force",
    "Paramilitary",

    // EDUCATION & TRAINING
    "Professor / Lecturer",
    "Teaching / Academician",
    "Education Professional",
    "Training Professional",
    "Research Assistant",
    "Research Scholar",

    // ENGINEERING
    "Civil Engineer",
    "Electronics / Telecom Engineer",
    "Mechanical / Production Engineer",
    "Quality Assurance Engineer - Non IT",
    "Engineer - Non IT",
    "Designer",
    "Product Manager - Non IT",
    "Project Manager - Non IT",

    // HOSPITALITY
    "Hotel / Hospitality Professional",
    "Restaurant / Catering Professional",
    "Chef / Cook",

    // IT & SOFTWARE
    "Software Professional",
    "Hardware Professional",
    "Product Manager",
    "Project Manager",
    "Program Manager",
    "Animator",
    "Cyber / Network Security",
    "UI / UX Designer",
    "Web / Graphic Designer",
    "Software Consultant",
    "Data Analyst",
    "Data Scientist",
    "Network Engineer",
    "Quality Assurance Engineer",

    // LEGAL
    "Lawyer & Legal Professional",
    "Legal Assistant",

    // POLICE / LAW ENFORCEMENT
    "Law Enforcement Officer",
    "Police",

    // MEDICAL & HEALTHCARE-OTHERS
    "Healthcare Professional",
    "Paramedical Professional",
    "Nurse",
    "Pharmacist",
    "Physiotherapist",
    "Psychologist",
    "Therapist",
    "Medical Transcriptionist",
    "Dietician / Nutritionist",
    "Lab Technician",
    "Medical Representative",
    "Journalist",
    "Media Professional",
    "Entertainment Professional",
    "Event Management Professional",
    "Advertising / PR Professional",
    "Designer",
    "Actor / Model",
    "Artist",

    // MERCHANT NAVY
    "Mariner / Merchant Navy",
    "Sailor",

    // SCIENTIST
    "Scientist / Researcher",

    // SENIOR MANAGEMENT
    "CXO / President, Director, Chairman",
    "VP / AVP / GM / DGM / AGM",

    // OTHERS
    "Technician",
    "Arts & Craftsman",
    "Student",
    "Librarian",
    "Business Owner / Entrepreneur",
    "Retired",
    "Transportation / Logistics Professional",
    "Agent / Broker / Trader",
    "Contractor",
    "Fitness Professional",
    "Security Professional",
    "Social Worker / Volunteer / NGO",
    "Sportsperson",
    "Travel Professional",
    "Singer",
    "Writer",
    "Politician",
    "Associate",
    "Builder",
    "Chemist",
    "CNC Operator",
    "Distributor",
    "Driver",
    "Freelancer",
    "Mechanic",
    "Musician",
    "Photo / Videographer",
    "Surveyor",
    "Tailor",
    "Others",

    // DOCTOR
    "Doctor",
    "Dentist",
    "Surgeon",
    "Veterinary Doctor",
    "Other",
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
    //Education: "education",
    //Occupation: "occupation",
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
    ], // Note: First code-la irundha short list

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
    // Education: [
    //   "SSLC",
    //   "12th Higher Education",
    //   "Aeronautical Engineering",
    //   "B.Arch",
    //   "BCA",
    //   "BE",
    //   "B.Plan",
    //   "B.Sc IT/ Computer Science",
    //   "B.Tech.",
    //   "Other Bachelor Degree in Engineering / Computers",
    //   "B.S.(Engineering)",
    //   "M.Arch.",
    //   "MCA",
    //   "ME",
    //   "M.Sc. IT / Computer Science",
    //   "M.S.(Engg.)",
    //   "M.Tech.",
    //   "PGDCA",
    //   "Aviation Degree",
    //   "B.A.",
    //   "B.Com.",
    //   "B.Ed.",
    //   "BFA",
    //   "BFT",
    //   "BLIS",
    //   "B.M.M.",
    //   "B.Sc.",
    //   "B.S.W",
    //   "B.Phil.",
    //   "M.A.",
    //   "MCom",
    //   "M.Ed.",
    //   "MFA",
    //   "MLIS",
    //   "M.Sc.",
    //   "MSW",
    //   "M.Phil.",
    //   "BBA",
    //   "BFM (Financial Management)",
    //   "BHM (Hotel Management)",
    //   "Other Bachelor Degree in Management",
    //   "BHA / BHM (Hospital Administration)",
    //   "MBA",
    //   "MFM (Financial Management)",
    //   "MHM (Hotel Management)",
    //   "MHRM (Human Resource Management)",
    //   "PGDM",
    //   "Other Master Degree in Management",
    //   "MHA / MHM (Hospital Administration)",
    //   "B.A.M.S.",
    //   "BDS",
    //   "BHMS",
    //   "BSMS",
    //   "BUMS",
    //   "BVSc",
    //   "MBBS",
    //   "MDS",
    //   "MD / MS (Medical)",
    //   "MVSc",
    //   "MCh",
    //   "DNB",
    //   "BPharm",
    //   "BPT",
    //   "B.Sc. Nursing",
    //   "Other Bachelor Degree in Medicine",
    //   "M.Pharm",
    //   "MPT",
    //   "Other Master Degree in Medicine",
    //   "BGL",
    //   "B.L.",
    //   "LL.B.",
    //   "Other Bachelor Degree in Legal",
    //   "LL.M.",
    //   "M.L.",
    //   "Other Master Degree in Legal",
    //   "CA",
    //   "CFA (Chartered Financial Analyst)",
    //   "CS",
    //   "ICWA",
    //   "Other Degree in Finance",
    //   "IAS",
    //   "IES",
    //   "IFS",
    //   "IRS",
    //   "IPS",
    //   "Other Degree in Service",
    //   "Ph.D.",
    //   "DM",
    //   "Postdoctoral fellow",
    //   "Fellow of National Board (FNB)",
    //   "Diploma",
    //   "Polytechnic",
    //   "Trade School",
    //   "Others in Diploma",
    //   "Higher Secondary School / High School",
    //   "Diploma catering",
    //   "Other",
    // ], // Note: First code-la irundha short list

    // Occupation: uniqueOccupations,

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
      "Others",
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

    "Father's Occupation": uniqueFatherOccupations,
    "Mother's Occupation": uniqueMotherOccupations,
    Height: [
      // ✨ Practical Minimum
      "4ft 8in - 142cm",
      "4ft 9in - 144cm",
      "4ft 10in - 147cm",
      "4ft 11in - 149cm",
      "5ft - 152cm",
      "5ft 1in - 155cm",
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
      // ✨ Practical Maximum
      "7ft - 213cm",
      "Other",
    ],
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

  // 🎯 18 முதல் 60 வயது சரிபார்ப்புக்கு ஒரு புதிய ஃபங்ஷன்
  const isAgeValid = (dob, minAge = 18, maxAge = 60) => {
    if (!dob) return { valid: true };
    const calculatedAge = calculateAge(dob);
    if (!calculatedAge) return { valid: false, reason: "invalid" };
    const age = Number(calculatedAge);
    if (age < minAge) {
      return { valid: false, reason: "min", age };
    }
    if (age > maxAge) {
      return { valid: false, reason: "max", age };
    }
    return { valid: true, age };
  };

  // const handleDateSelect = (date) => {
  //   if (!isAgeValid(date, 18)) {
  //     toast.error("You must be at least 18 years old to register.");

  //     // 18 வயதுக்குக் குறைவாக இருந்தால், DOB, age state-களை செட் செய்யாமல், Calendar-ஐ மூடிவிடவும்.
  //     setDobDate(null);
  //     setFormData((prev) => ({
  //       ...prev,
  //       dob: "",
  //       age: "",
  //     }));

  //     setIsCalendarOpen(false);
  //     return;
  //   }

  //   setDobDate(date); // Date format for backend (as per first code)
  //   const formattedDate = format(date, "yyyy-MM-dd");

  //   // Calculate Age and update age in state (Required Update)
  //   const calculatedAge = calculateAge(date);

  //   setFormData((prev) => ({
  //     ...prev,
  //     dob: formattedDate,
  //     age: calculatedAge, // Age updated automatically
  //   }));
  //   setIsCalendarOpen(false);
  // };

  const handleDateSelect = (date) => {
    const ageCheck = isAgeValid(date, 18, 60);
    if (!ageCheck.valid) {
      if (ageCheck.reason === "min") {
        toast.error("You must be at least 18 years old to register.");
      } else if (ageCheck.reason === "max") {
        toast.error("The maximum age limit is 60 years for both male and female.");
      } else {
        toast.error("Please select a valid date of birth.");
      }

      setDobDate(null);
      setFormData((prev) => ({
        ...prev,
        dob: "",
        age: "",
      }));

      setIsCalendarOpen(false);
      return;
    }

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

  const handleDobManualChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      dob: value,
    }));

    if (!value) {
      setDobDate(null);
      setFormData((prev) => ({ ...prev, age: "" }));
      return;
    }

    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime()) && value.length >= 10) {
      const ageCheck = isAgeValid(parsedDate, 18, 60);
      if (ageCheck.valid) {
        setDobDate(parsedDate);
        setFormData((prev) => ({
          ...prev,
          dob: value,
          age: ageCheck.age ? ageCheck.age.toString() : calculateAge(parsedDate),
        }));
      } else {
        setDobDate(parsedDate);
        if (ageCheck.reason === "min") {
          toast.error("You must be at least 18 years old to register.");
        } else if (ageCheck.reason === "max") {
          toast.error("The maximum age limit is 60 years for both male and female.");
        }
      }
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
      setDisplayImageUrl(localImageUrl);
      // setFormData((prev) => ({ ...prev, image: localImageUrl }));
      // 🔴 NOTE: In a real scenario, you'd typically handle image upload (e.g., to Cloudinary)
      // in a separate step and store the resulting URL in formData.
    } else {
      setProfileImageFile(null);
      if (!e.target.value) {
        const originalImageUrl =
          singleProfile?.profileImage && singleProfile.profileImage !== "N/A"
            ? singleProfile.profileImage
            : null;
        setDisplayImageUrl(originalImageUrl);
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
        // education:
        //   singleProfile.education && singleProfile.education !== "N/A"
        //     ? singleProfile.education.split(",").map((e) => e.trim())
        //     : [],
        education: mapValue(singleProfile.education),
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
      if (imageUrl && imageUrl !== "N/A") {
        setDisplayImageUrl(imageUrl); // <--- ✅ Use the displayImageUrl state
      } else {
        setDisplayImageUrl(null);
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
      <div className="lg:max-w-3xl lg:mx-auto lg:bg-white lg:shadow-2xl lg:px-5 lg:pb-10 lg:gap-10 rounded-2xl lg:flex">
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
                        <SelectTrigger className="w-full py-[15px] border-black rounded">
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
              const currentYear = new Date().getFullYear();
              const minDateStr = `${currentYear - 60}-01-01`;
              const maxDateStr = `${currentYear - 18}-12-31`;

              return (
                <div key={field.label} className="flex flex-col lg:flex-row">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          name={fieldName}
                          min={minDateStr}
                          max={maxDateStr}
                          value={formData?.[fieldName] || ""}
                          onChange={handleDobManualChange}
                          className="w-full border-black rounded py-[15px] bg-white text-base"
                          placeholder="YYYY-MM-DD"
                        />
                        <Popover
                          open={isCalendarOpen}
                          onOpenChange={setIsCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="py-[15px] px-3 border-black rounded shrink-0"
                              title="Open Calendar"
                            >
                              <CalendarIcon className="h-5 w-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              selected={dobDate}
                              onSelect={handleDateSelect}
                              mode="single"
                              captionLayout="dropdown"
                              fromYear={currentYear - 65}
                              toYear={currentYear - 18}
                              startMonth={new Date(currentYear - 65, 0)}
                              endMonth={new Date(currentYear - 18, 11)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Type date directly (YYYY-MM-DD) or click calendar to pick. Age limit: 18 - 60 years.
                      </p>
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
                        className="border-black rounded"
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
                        className={`py-[8px] border-black rounded`}
                      />

                      {/* 🏞️ NEW: Display the image from backend/newly selected file */}
                      {displayImageUrl && (
                        <ImageDisplay imageUrl={profileImage} />
                      )}
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
                        className={`h-[32px] border-black rounded`}
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
