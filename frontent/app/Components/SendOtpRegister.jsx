"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TiTick } from "react-icons/ti";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import { CalendarIcon, Check, Loader2, X, RotateCcw } from "lucide-react"; // Added RotateCcw for resend icon
import { format } from "date-fns";
import React, { useEffect, useState, useCallback, useMemo } from "react"; // Added useCallback, useMemo
import { useDispatch, useSelector } from "react-redux";
import {
  registerProfile,
  sendOtp,
  verifyOtpAndRegister,
} from "../redux/profileSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- START: Data Definitions (Unchanged) ---
// Note: 'otp' field is removed from REQUIRED_FIELDS for initial submission (Step 1)
// It will be validated in Step 2.
const REQUIRED_FIELDS = [
  "phonenumber",
  "gender",
  "mprofile",
  "email",
  "whatsappno",
  "pname",
  // "otp", // REMOVED: OTP is validated in the second step
];

const Occupations = [
  "Other",
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
];

const uniqueOccupations = [...new Set(Occupations)];

const FatherOccupations = [
  "Other",
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

  // DOCTOR
  "Doctor",
  "Dentist",
  "Surgeon",
  "Veterinary Doctor",
];

const uniqueFatherOccupations = [...new Set(FatherOccupations)];

const MotherOccupations = [
  "Other",
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

  // DOCTOR
  "Doctor",
  "Dentist",
  "Surgeon",
  "Veterinary Doctor",
];

const uniqueMotherOccupations = [...new Set(MotherOccupations)];

const dropdownData = {
  "Matrimony Profile for": [
    "Other",
    "Myself",
    "Son",
    "Daugther",
    "Brother",
    "Sister",
    "Friends",
    "Relative",
  ],
  Rasi: [
    "Other",
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
  ],

  Nakshatram: [
    "Other",
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
  ],

  Laknam: [
    "Other",
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
  ], // Note: First code-la irundha short list

  Color: ["Other", "Fair", "Black", "White", "Very Fair"],
  "Marital Status": [
    "Other",
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
    "BE",
    "B.Plan",
    "B.Sc IT/ Computer Science",
    "B.Tech.",
    "Other Bachelor Degree in Engineering / Computers",
    "B.S.(Engineering)",
    "M.Arch.",
    "MCA",
    "ME",
    "M.Sc. IT / Computer Science",
    "M.S.(Engg.)",
    "M.Tech.",
    "PGDCA",
    "Aviation Degree",
    "B.A.",
    "B.Com.",
    "B.Ed.",
    "BFA",
    "BFT",
    "BLIS",
    "B.M.M.",
    "B.Sc.",
    "B.S.W",
    "B.Phil.",
    "M.A.",
    "MCom",
    "M.Ed.",
    "MFA",
    "MLIS",
    "M.Sc.",
    "MSW",
    "M.Phil.",
    "BBA",
    "BFM (Financial Management)",
    "BHM (Hotel Management)",
    "Other Bachelor Degree in Management",
    "BHA / BHM (Hospital Administration)",
    "MBA",
    "MFM (Financial Management)",
    "MHM (Hotel Management)",
    "MHRM (Human Resource Management)",
    "PGDM",
    "Other Master Degree in Management",
    "MHA / MHM (Hospital Administration)",
    "B.A.M.S.",
    "BDS",
    "BHMS",
    "BSMS",
    "BUMS",
    "BVSc",
    "MBBS",
    "MDS",
    "MD / MS (Medical)",
    "MVSc",
    "MCh",
    "DNB",
    "BPharm",
    "BPT",
    "B.Sc. Nursing",
    // "Other Bachelor Degree in Medicine",
    "M.Pharm",
    "MPT",
    // "Other Master Degree in Medicine",
    "BGL",
    "B.L.",
    "LL.B.",
    // "Other Bachelor Degree in Legal",
    "LL.M.",
    "M.L.",
    // "Other Master Degree in Legal",
    "CA",
    "CFA (Chartered Financial Analyst)",
    "CS",
    "ICWA",
    // "Other Degree in Finance",
    "IAS",
    "IES",
    "IFS",
    "IRS",
    "IPS",
    // "Other Degree in Service",
    "Ph.D.",
    "DM",
    "Postdoctoral fellow",
    "Fellow of National Board (FNB)",
    "Diploma",
    "Polytechnic",
    "Trade School",
    // "Others in Diploma",
    "Higher Secondary School / High School",
    "Diploma catering",
    //"Other",
  ], // Note: First code-la irundha short list

  Occupation: uniqueOccupations,

  "Annual Income": [
    "Other",
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
  ],

  "Mother Tongue": [
    "Other",
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
  ],

  Religion: [
    "Other",
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
  ],

  Caste: [
    "Other",
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
  ],

  "Father's Occupation": uniqueFatherOccupations,
  "Mother's Occupation": uniqueMotherOccupations,
  Height: [
    "Other",
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
  ],
};

// 🔁 Dropdown field mapping (First code base-la update aagirukku)
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

// Removed OTP field from fieldOrder since it's now a separate step/component
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

const calculateAge = (dob) => {
  if (!dob) return "";
  const today = new Date();
  console.log("Today", today);
  const birthDate = new Date(dob);
  console.log("birthDate", birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if birthday has passed this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age.toString() : "";
};
// --- END: Data Definitions (Unchanged) ---

// --------------------------------------------------------------------------------
// 🌟 NEW OTP FORM COMPONENT
// --------------------------------------------------------------------------------

// NOTE: Since I can't import `InputOTP` directly, this simulates the OTP field
const OtpVerificationForm = ({
  otpVerification,
  setOtpVerification,
  resendTimer,
  handleResendOTP,
  handleVerifyAndRegister,
  isOTPSending,
  isOTPVerifying,
  userEmail,
  validation,
  setCurrentStep,
  setValidation,
}) => {
  const isResendEnabled = resendTimer === 0;
  const otpError = validation.otp;

  return (
    <div className="md:col-span-2 lg:col-span-1 p-6 space-y-6 border border-gray-200 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-center text-green-700">
        Verify Your Profile 🔐
      </h2>
      <p className="text-center text-sm text-gray-600">
        A 6-digit OTP has been sent to your email address:{" "}
        <span className="font-semibold text-gray-800 break-all">
          {userEmail} {/* Email address-a direct-a display pannalaam */}
        </span>
        <br />
        <span className="text-xs text-red-500 font-medium">
          (Please check your Inbox and Spam folder)
        </span>
      </p>

      {/* ⚠️ Simulated InputOTP Component */}
      <div className="flex flex-col items-center space-y-2">
        <Label htmlFor="otp" className="text-lg font-medium">
          Enter 6-Digit OTP
        </Label>
        <Input
          id="otp"
          name="otp"
          type="number"
          maxLength={6}
          placeholder="e.g. 123456"
          value={otpVerification}
          onChange={(e) => {
            const val = e.target.value;
            // Only allow numbers and max 6 digits
            if (val.length <= 6 && /^[0-9]*$/.test(val)) {
              setOtpVerification(val);
            }
          }}
          className={`w-full max-w-[200px] text-center text-xl tracking-[10px] focus:tracking-[5px] transition-all duration-300 py-6 border-2 ${
            otpError ? "border-red-500 ring-red-500" : ""
          }`}
        />
        {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="button"
          onClick={handleVerifyAndRegister}
          disabled={otpVerification.length !== 6 || isOTPVerifying}
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
        >
          {isOTPVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TiTick size={20} className="mr-1" />
          )}
          Verify & Register Profile
        </Button>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <Button
            variant="link"
            type="button"
            onClick={handleResendOTP}
            disabled={!isResendEnabled || isOTPSending}
            className={`p-0 h-auto ${
              !isResendEnabled ? "cursor-not-allowed opacity-50" : ""
            } flex items-center`}
          >
            {isOTPSending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-1 h-4 w-4" />
            )}
            Resend OTP
          </Button>
          {resendTimer > 0 && (
            <p className="font-medium text-gray-600">
              Resend in {resendTimer}s
            </p>
          )}
          {isResendEnabled && !isOTPSending && (
            <p className="font-medium text-green-600">Ready to Resend</p>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          setOtpVerification("");
          setValidation({});
          // Go back to the main form
          setCurrentStep(1); // Optional: If you want to let them edit the phone number
        }}
        className="w-full mt-4 text-red-500 border-red-300 hover:bg-red-50/50"
      >
        Change Details / Go Back
      </Button>
    </div>
  );
};

// --------------------------------------------------------------------------------
// 🏠 MAIN REGISTER PROFILE COMPONENT (Updated)
// --------------------------------------------------------------------------------

export default function SendOtpRegister() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.profile);

  // 🔴 CORE NEW STATES FOR OTP FLOW
  const [currentStep, setCurrentStep] = useState(1); // 1: Main Form, 2: OTP Form
  const [otpVerification, setOtpVerification] = useState("");
  const [isOTPVerifying, setIsOTPVerifying] = useState(false);
  // OTP Simulation: In a real app, this would come from the server after sending.
  const [expectedOTP, setExpectedOTP] = useState("123456");
  const [otpValidationStatus, setOtpValidationStatus] = useState({
    success: false,
    message: "",
  });

  // Error Tracking State
  const [validation, setValidation] = useState({});
  const PHONE_NUMBER_REGEX = /^[0-9]{10}$/; // Added $ for end of string
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB * 1024 bytes/KB

  // 🌟 NEW: State to manage which 'Other' input is active
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

  // 🌟 NEW: State to manage the value of the 'Other' custom input
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

  // Resend OTP Timer
  const RESEND_TIME_LIMIT = 60;
  const [resendTimer, setResendTimer] = useState(0); // Starts at 0, ready to send
  const [isOTPSending, setIsOTPSending] = useState(false); // To show loading state on Resend OTP

  // Timer Logic
  useEffect(() => {
    let timerId;
    if (currentStep === 2 && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [currentStep, resendTimer]);

  // Form Data State
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

  const [image, setImage] = useState(null);
  const [dobDate, setDobDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 2. Browser Leave Confirmation Logic (Updated to check currentStep)
  const handleBeforeUnload = useCallback(
    (event) => {
      // Check if user is on the OTP step
      if (currentStep === 2 && otpVerification.length < 6) {
        const message =
          "The verification is not complete. Are you sure you want to leave and lose your progress?";
        event.returnValue = message;
        return message;
      }
    },
    [currentStep, otpVerification.length]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // --- Utility Functions ---

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🌟 NEW: Custom Input Field value update logic (Indha logic-a confirm seiyungal)
    if (name in OtherValue) {
      setOtherValue((prev) => ({ ...prev, [name]: value })); // ✅ Idhu OtherValue state-a update seithal dhaan custom value anuppa mudiyum.
      // Custom input field-kku mattrum dhaan OtherValue-a update seiyum.
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validation error Clear state
    if (validation[name]) {
      setValidation((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (validation.image) {
      setValidation((prev) => ({ ...prev, image: undefined }));
    }

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setImage(null);
        setValidation((prev) => ({
          ...prev,
          image: "Image size must be less than 500KB.",
        }));
        e.target.value = "";
      } else {
        setImage(file);
        setValidation((prev) => ({ ...prev, image: undefined }));
      }
    } else {
      setImage(null);
    }
  };

  const handleSelectChange = (name, value) => {
    console.log("handleSelectChange called with:", name, value);
    // 🌟 CORE LOGIC: "Other" Selection Handling

    const isOtherSelected = value === "Other";

    // 🛑 FIX 1: education field-a single select 'Other' fields-ilirundhu pirithal.
    const isSingleSelectOtherField =
      name in otherInputs && name !== "education";

    if (isSingleSelectOtherField) {
      if (isOtherSelected) {
        // Single Select "Other" is selected
        setOtherInputs((prev) => ({ ...prev, [name]: true }));
        setFormData((prev) => ({ ...prev, [name]: "" }));
        setOtherValue((prev) => ({ ...prev, [name]: "" }));
      } else {
        // Single Select Standard option selected
        setOtherInputs((prev) => ({ ...prev, [name]: false }));
        setOtherValue((prev) => ({ ...prev, [name]: "" }));
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    // ✅ Education Multi-select Logic
    else if (name === "education") {
      console.log("Eduction true - Multi-select Logic Activated!");

      // 🛑 FIX 3: setFormData callback-kku ulla prev state-a use panni update seithal.
      setFormData((prev) => {
        // Safety check for array: String-aah irundhalum, empty array-aah maatri kollum.
        const prevEducation = Array.isArray(prev.education)
          ? prev.education
          : [];
        let updatedEducation;

        if (value === "Other") {
          const isCurrentlyOther = prevEducation.includes("Other");

          if (isCurrentlyOther) {
            // 1. Deselect 'Other': remove 'Other', disable custom input
            setOtherInputs((p) => ({ ...p, education: false }));
            setOtherValue((p) => ({ ...p, education: "" }));
            updatedEducation = prevEducation.filter((v) => v !== "Other");
          } else {
            // 2. ✅ Select 'Other': Clear existing tags and enable input
            setOtherInputs((p) => ({ ...p, education: true }));
            setOtherValue((p) => ({ ...p, education: "" })); // Clear custom value
            updatedEducation = ["Other"]; // Clear all previous selections and only keep 'Other'
          }
        } else {
          // 3. Standard Education option (e.g., BCA): Toggle selection logic

          // 🛑 NEW LOGIC: Standard option-a select (or deselect) pannum bodhu,
          // 'Other' input field-a disable seiya vendum.
          setOtherInputs((p) => ({ ...p, education: false }));
          setOtherValue((p) => ({ ...p, education: "" })); // Custom input value-a clear seithu vidungal

          updatedEducation = prevEducation.includes(value)
            ? prevEducation.filter((v) => v !== value) // Deselect
            : [...prevEducation, value]; // Select

          // If 'Other' was previously selected, remove it when a standard option is chosen.
          // Note: 'Other' logic in step 2 already clears other tags when 'Other' is selected.
          // But if the user deselects 'Other' using the tag, the logic in step 1 handles it.
          // If the user selects a standard option when 'Other' is present, the logic needs to clear 'Other'.

          updatedEducation = updatedEducation.filter((v) => v !== "Other");
        }

        // Return the updated state
        return {
          ...prev,
          education: updatedEducation, // Guaranteed to be an Array
        };
      });
    } else {
      // Standard Select fields (not "Other" enabled and not 'education')
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validation error Clear state
    if (validation[name]) {
      setValidation((prev) => ({ ...prev, [name]: false }));
    }
  };

  // 🎯 புதுப்பிப்பு 1: 18 வயது சரிபார்ப்புக்கு ஒரு புதிய ஃபங்ஷன்
  const isAgeValid = (dob, minAge = 18) => {
    if (!dob) return true;
    const now = new Date();
    const birthDate = new Date(dob);

    // 18 வயது ஆவதற்குத் தேவையான தேதி
    const requiredDate = new Date(
      birthDate.getFullYear() + minAge,
      birthDate.getMonth(),
      birthDate.getDate()
    );

    //console.log(requiredDate);
    //console.log(now);

    // தேவையான தேதி, இன்றைய தேதியை விட குறைவாகவோ அல்லது சமமாகவோ இருக்க வேண்டும்.
    return requiredDate <= now;
  };

  const handleDateSelect = (date) => {
    if (!isAgeValid(date, 18)) {
      toast.error("You must be at least 18 years old to register.");

      // 18 வயதுக்குக் குறைவாக இருந்தால், DOB, age state-களை செட் செய்யாமல், Calendar-ஐ மூடிவிடவும்.
      setDobDate(null);
      setFormData((prev) => ({
        ...prev,
        dob: "",
        age: "",
      }));

      setIsCalendarOpen(false);
      return;
    }

    setDobDate(date); // Date format for backend (as per first code)
    const formattedDate = format(date, "yyyy-MM-dd");

    // Calculate Age and update age in state (Required Update)
    const calculatedAge = calculateAge(date);

    setFormData((prev) => ({
      ...prev,
      dob: formattedDate,
      age: calculatedAge, // Age updated automatically
    }));
    setIsCalendarOpen(false);
  };

  // 🔴 CORE UPDATE: Validation Logic for Step 1
  const validateForm = () => {
    let isValid = true;
    const newValidation = {};

    REQUIRED_FIELDS.forEach((field) => {
      let value = formData[field];
      const isCustomInputActive = otherInputs[field];

      // Use Custom Input value if 'Other' is selected and custom input is visible/used
      if (isCustomInputActive) {
        value = OtherValue[field];
      }

      const isMissing =
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "");

      if (isMissing) {
        // Special check for Education Multi-select with 'Other'
        if (field === "education" && isCustomInputActive) {
          if (OtherValue.education.trim() === "") {
            newValidation[field] = "Please enter your custom education.";
            isValid = false;
          }
        } else if (field === "education" && !isCustomInputActive) {
          if (
            Array.isArray(formData.education) &&
            formData.education.length === 0
          ) {
            newValidation[field] = "This field is required.";
            isValid = false;
          }
        } else {
          newValidation[field] = "This field is required.";
          isValid = false;
        }

        return;
      }

      // ✅ NEW: Phone Number & Whatsapp Number Validation (10 Digits Only)
      if (field === "phonenumber" || field === "whatsappno") {
        if (!PHONE_NUMBER_REGEX.test(value)) {
          newValidation[field] = "Must be exactly 10 digits (numbers only).";
          isValid = false;
        }
      }

      // ✅ NEW: Email Validation (Using Regex)
      if (field === "email") {
        if (!EMAIL_REGEX.test(value)) {
          newValidation[field] =
            "Please enter a valid email address (e.g., user@gmail.com).";
          isValid = false;
        }
      }
    });
    setValidation(newValidation);
    return isValid;
  };

  // --------------------------------------------------------------------------------
  // 🚀 CORE STEP HANDLERS
  // --------------------------------------------------------------------------------

  // Function to simulate sending OTP
  // ... (RegisterProfile

  // Timer Logic

  // --------------------------------------------------------------------------------
  // 🚀 CORE STEP HANDLERS (API Calls)
  // --------------------------------------------------------------------------------

  const sendOTP = async () => {
    setIsOTPSending(true);
    setValidation({});

    let updated = { ...formData };

    // 🌟 1. CORE LOGIC: Final value check for Single Select "Other" fields (Occupation etc.)
    for (let key in otherInputs) {
      if (otherInputs[key] && OtherValue[key].trim() !== "") {
        // If 'Other' input is active and has a value, use it for the field
        updated[key] = OtherValue[key].trim();
      } else if (otherInputs[key] && OtherValue[key].trim() === "") {
        // If custom field is visible but empty, treat as missing/N/A
        updated[key] = "N/A";
      }
    }

    // 🌟 2. Handle general empty fields (excluding 'education')
    for (let key in updated) {
      // Education field-a skip seithu, adhai appuram handle seiyalam
      if (key === "education") continue;

      if (
        !updated[key] ||
        (typeof updated[key] === "string" && updated[key].length === 0)
      ) {
        updated[key] = "N/A"; // Handle other empty fields
      }
    }

    // Prepare FormData for API call
    const form = new FormData();

    // 🌟 3. Append fields to FormData with Special education handling
    for (let key in updated) {
      if (key === "education") {
        // Handle multi-select education field
        if (Array.isArray(updated.education) && updated.education.length > 0) {
          let educationValues = updated.education;

          // ✅ FIX CHECK: Replace 'Other' placeholder with custom value if present and enabled
          if (otherInputs.education && OtherValue.education.trim() !== "") {
            // Remove the 'Other' placeholder from the array
            educationValues = educationValues.filter((v) => v !== "Other");
            // Add the custom user input value
            educationValues.push(OtherValue.education.trim());
          } else if (
            otherInputs.education &&
            educationValues.includes("Other")
          ) {
            // If 'Other' selected but custom input empty, remove 'Other' placeholder before sending "N/A"
            educationValues = educationValues.filter((v) => v !== "Other");
          }

          if (educationValues.length === 0) {
            form.append(key, "N/A"); // Sends N/A if array is empty after cleanup
          } else {
            // Send as multiple fields (e.g., education[]=B.Tech&education[]=Custom)
            educationValues.forEach((e) => form.append("education[]", e)); // ✅ Indha loop dhaan custom value-a anuppum.
          }
        } else {
          // Case: updated.education is an empty array. Send "N/A".
          form.append(key, "N/A");
        }
      } else {
        // Other fields
        form.append(key, updated[key]);
      }
    }

    if (image) form.append("image", image);

    // API Call: sendOtp Dispatch
    const result = await dispatch(sendOtp(form));

    setIsOTPSending(false);

    if (sendOtp.fulfilled.match(result)) {
      // success response-ல் emailSent: true வருகிறது
      toast.success("OTP sent to your email successfully! Please check.", {
        icon: <Check size={20} className="text-green-500" />,
        duration: 5000,
      });
      setResendTimer(RESEND_TIME_LIMIT);
      window.scrollTo({
        top: 100,
        left: 0,
        behavior: "smooth",
      });
      return true;
    } else {
      // RejectWithValue- error
      const error = result.payload || {
        message: "Failed to send OTP. Server error.",
      };
      toast.error(error.message, {
        icon: <X className="text-red-600 bg-red-200 rounded p-0.5" size={18} />,
        duration: 5000,
      });
      //
      setCurrentStep(1);
      return false;
    }
  };

  // ... ()

  // Step 1: Handle "Confirm Profile" button click
  const handleConfirmProfile = async (e) => {
    e.preventDefault();

    // 1. Validation (excluding OTP)
    if (!validateForm(REQUIRED_FIELDS)) {
      toast.error("Please fill all mandatory fields.", {
        icon: <X className="text-red-600 bg-red-200 rounded p-0.5" size={18} />,
        duration: 4000,
      });
      return;
    }

    if (validation.image) {
      toast.error(validation.image);
      return;
    }

    // 2. Move to OTP Step & Send OTP
    setValidation({}); // Clear all previous form errors
    setOtpVerification(""); // Clear any previous OTP

    // 🎯 புதுப்பிப்பு: sendOTP-ஐ அழைக்கவும், அது வெற்றியடைந்தால் மட்டுமே step 2-க்குச் செல்லவும்
    const success = await sendOTP();

    if (success) {
      setCurrentStep(2);
    }
  };

  // Handler for Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer === 0 && !isOTPSending) {
      setOtpVerification(""); // Clear OTP on resend
      setValidation({}); // Clear OTP error

      // 🎯
      await sendOTP();
    }
  };

  // Step 2: Handle "Verify & Register Profile" button click
  const handleVerifyAndRegister = async () => {
    setIsOTPVerifying(true);

    if (otpVerification.length !== 6) {
      setValidation((prev) => ({
        ...prev,
        otp: "Please enter the 6-digit OTP.",
      }));
      setIsOTPVerifying(false);
      return;
    }

    setValidation({}); // OTP

    const otpData = {
      email: formData.email, // Step 1-ல்  email
      otp: otpVerification, // OTP
    };

    // 2. Dispatch: verifyOtpAndRegister API Call
    const result = await dispatch(verifyOtpAndRegister(otpData));
    setIsOTPVerifying(false); // Stop loading

    if (verifyOtpAndRegister.fulfilled.match(result)) {
      const { data } = result.payload;
      toast.success("Profile Verified and Registered Successfully! ✅", {
        icon: (
          <Check
            className="text-green-500 bg-green-200 rounded p-1"
            size={20}
          />
        ),
        duration: 5000,
      });

      // Reset states
      //setFormData({});
      setDobDate(null);
      setImage(null);
      setCurrentStep(1); // Reset to step 1
      setOtpVerification("");
      setResendTimer(0);

      // Success page-க்கு Redirect
      sessionStorage.setItem(
        "registrationSuccess",
        JSON.stringify({ id: data.id, name: data.pname })
      );
      router.push("/success");
    } else {
      // Invalid OTP, Expired OTP, DB Error etc.
      const error = result.payload || { message: "Verification failed." };

      setValidation((prev) => ({
        ...prev,
        otp: error.message, // API-ல் இருந்து வரும் பிழைச் செய்தியை OTP field-க்குக் காட்டவும்
      }));

      toast.error(error.message, {
        icon: <X className="text-red-500 bg-red-200 rounded p-1" size={20} />,
        duration: 5000,
      });
    }
  };

  // Handler for Resend OTP
  // const handleResendOTP = async () => {
  //   if (resendTimer === 0 && !isOTPSending) {
  //     setOtpVerification(""); // Clear OTP on resend
  //     setValidation({}); // Clear OTP error
  //     await sendOTP();
  //   }
  // };

  // Final Registration Function (Extracted from old handleSubmit)
  // const registerUser = async () => {
  //   const updated = { ...formData };
  //   for (let key in updated) {
  //     if (!updated[key] || updated[key].length === 0) {
  //       updated[key] = "N/A";
  //     }
  //   }

  //   if (Array.isArray(updated.education) && updated.education.length === 0) {
  //     updated.education = "N/A";
  //   }

  //   const form = new FormData();
  //   for (let key in updated) {
  //     if (key === "education") {
  //       if (Array.isArray(updated.education) && updated.education.length > 0) {
  //         updated.education.forEach((e) => form.append("education[]", e));
  //       } else {
  //         form.append(key, updated[key]);
  //       }
  //     } else {
  //       form.append(key, updated[key]);
  //     }
  //   }

  //   if (image) form.append("image", image);
  //   // Add OTP to form data for backend log/record (optional)
  //   form.append("otp", otpVerification);

  //   const result = await dispatch(registerProfile(form));
  //   setIsOTPVerifying(false); // Stop loading

  //   if (registerProfile.fulfilled.match(result)) {
  //     const { data } = result.payload;
  //     toast.success("Profile Registered Successfully", {
  //       icon: (
  //         <Check
  //           className="text-green-500 bg-green-200 rounded p-1"
  //           size={20}
  //         />
  //       ),
  //       duration: 5000,
  //     });
  //     // Reset states
  //     setFormData({
  //       mprofile: "",
  //       pname: "",
  //       dob: "",
  //       age: "",
  //       pbrith: "",
  //       tbrith: "",
  //       rasi: "",
  //       // ... (rest of the form reset logic)
  //     });
  //     setDobDate(null);
  //     setImage(null);
  //     setCurrentStep(1); // Reset to step 1
  //     setOtpVerification("");
  //     setResendTimer(0);

  //     sessionStorage.setItem(
  //       "registrationSuccess",
  //       JSON.stringify({ id: data.id, name: data.pname })
  //     );
  //     router.push("/success");
  //   } else {
  //     toast.error(result.payload?.message || "Profile Registration Failed", {
  //       icon: <X className="text-red-500 bg-red-200 rounded p-1" size={20} />,
  //       duration: 5000,
  //     });
  //     // Option: Keep user on OTP page or redirect to main form on critical error
  //   }
  // };

  const renderSelectWithOther = (field, fieldName, options) => {
    const isInValid = validation[fieldName];
    const isOtherField = fieldName in otherInputs;
    const showCustomInput = isOtherField && otherInputs[fieldName];
    const isEducation = fieldName === "education";

    // ✅ FIX: Education kku innum simple aana array-check, error varaadhu
    const educationArray = Array.isArray(formData.education)
      ? formData.education
      : [];

    return (
      <div key={field.label} className="flex flex-col">
        <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
          <div className="w-full">
            <Label className="text-sm py-2">{field.label}</Label>
          </div>
          <div className="lg:w-[900px]">
            {/* 1. Select Component */}
            <Select
              value={
                isEducation
                  ? ""
                  : formData[fieldName] === "" && showCustomInput
                  ? "Other"
                  : formData[fieldName]
              }
              onValueChange={(val) => handleSelectChange(fieldName, val)}
              //disabled={showCustomInput && !isEducation}
            >
              <SelectTrigger
                className={`w-full py-[15px] border-black rounded ${
                  isInValid
                    ? "border-red-500 ring-red-500 focus:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue
                  placeholder={
                    isEducation
                      ? // ✅ FIX HERE: Array check. String-aah irundhaalum, error varaadhu.
                        educationArray.length > 0
                        ? educationArray.join(", ")
                        : `Select ${field.label}`
                      : `Select ${field.label}`
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {options.map((opt, index) => (
                  <SelectItem
                    key={`${opt}-${index}`}
                    value={opt}
                    // Multi-select education: visually mark selected items
                    className={
                      isEducation && educationArray.includes(opt)
                        ? "bg-neutral-100 text-neutral-900 font-semibold"
                        : ""
                    }
                  >
                    {opt}
                    {isEducation && educationArray.includes(opt) && (
                      <TiTick className="float-right h-5 w-5 text-green-500" />
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Custom Input Field (Enabled/Displayed only if 'Other' is selected) */}
            {showCustomInput && (
              <div className="flex items-center gap-2 mt-2">
                {/* 🛑 NEW: Identifier label for the custom input */}
                <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">
                  Custom:
                </span>

                <Input
                  type="text"
                  name={fieldName} // Use fieldName for the input
                  value={OtherValue[fieldName]}
                  onChange={handleChange}
                  placeholder={`Please specify your ${field.label}`}
                  className={`h-[32px] border-black rounded w-full ${
                    // Changed class for flex layout
                    isInValid
                      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  //disabled={isEducation && !educationArray.includes("Other")}
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. Multi-Select Tags for Education */}
        {isEducation && (
          <div className="flex flex-wrap gap-1 mt-2 md:col-span-2">
            {/* ... (Education Tags Logic remains the same) ... */}
            {educationArray.length > 0 &&
              educationArray.map((item, index) => {
                const displayItem =
                  item === "Other" && OtherValue.education.trim() !== ""
                    ? OtherValue.education.trim()
                    : item;
                if (item === "Other" && OtherValue.education.trim() === "")
                  return null; // Hide 'Other' tag if input is empty
                return (
                  <span
                    key={index}
                    className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded-full text-[10px] flex items-center gap-1"
                  >
                    {displayItem}

                    <X
                      className="cursor-pointer h-10 w-3 text-neutral-600 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectChange(fieldName, item);
                      }}
                    />
                  </span>
                );
              })}
          </div>
        )}

        {/* 4. Validation Message */}
        {isInValid && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {validation[fieldName] || "This field is required."}
          </p>
        )}
      </div>
    );
  };

  const isFormLoading = loading || isOTPSending || isOTPVerifying;

  return (
    <div className="max-w-8xl mx-auto  shadow-lg rounded-2xl px-4 md:p-5 lg:p-0">
      {/* <h1 className="text-3xl font-bold text-center mb-10 text-[#4a2f1c]">
        Matrimony Profile Registration
      </h1> */}

      <div className="lg:max-w-5xl lg:mx-auto lg:bg-white lg:shadow-2xl lg:px-3 lg:pt-3 lg:pb-10 lg:gap-10 rounded-2xl lg:flex">
        <div className="hidden md:hidden lg:block">
          {/* Image remains for aesthetics */}
          <img
            src="/register/r1.jpg"
            alt="Love"
            className="h-[300px] lg:pt-5"
          />
        </div>
        {/* Step 1: Main Form */}
        {currentStep === 1 && (
          <form
            onSubmit={handleConfirmProfile}
            className="md:grid flex flex-col md:grid-cols-2 lg:flex lg:flex-col pt-10 md:pt-15 lg:pt-5 lg:w-[670px] lg:grid-cols-1 gap-2 md:gap-3 lg:gap-2"
          >
            <h1 className="bg-neutral-600/70 col-span-1 font-semibold md:col-span-2 py-3 px-2 text-2xl text-white">
              Profile details
            </h1>
            {fieldOrder.map((field) => {
              const fieldName = dropdownFieldMap[field.label] || field.name;
              const isInValid = validation[fieldName];

              // ... (Unchanged rendering logic for heading, select, date, textarea, file)
              // (Keep the existing map logic for fieldOrder items)

              // 0. HEADING FIELD
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

              // 1. SELECT FIELD (Education Multi-select)
              if (field.type === "select") {
                const options = dropdownData[field.label];
                if (!options) return null;
                return renderSelectWithOther(field, fieldName, options);
              }

              // 1. SELECT FIELD (Standard)
              // if (field.type === "select") {
              //   const options = dropdownData[field.label];
              //   if (!options) return null;

              //   return (
              //     <div key={field.label} className="flex flex-col">
              //       <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
              //         <div className="w-full">
              //           <Label className="text-sm py-2">{field.label}</Label>
              //         </div>
              //         <div className="lg:w-[900px]">
              //           <Select
              //             value={formData?.[fieldName]}
              //             onValueChange={(val) =>
              //               handleSelectChange(fieldName, val)
              //             }
              //           >
              //             <SelectTrigger
              //               className={`w-full py-[15px] ${
              //                 isInValid
              //                   ? "border-red-500 ring-red-500 focus:ring-red-500"
              //                   : ""
              //               }`}
              //             >
              //               <SelectValue
              //                 placeholder={`Select ${field.label}`}
              //               />
              //             </SelectTrigger>
              //             <SelectContent>
              //               {options.map((opt, index) => (
              //                 <SelectItem key={`${opt}-${index}`} value={opt}>
              //                   {opt}
              //                 </SelectItem>
              //               ))}
              //             </SelectContent>
              //           </Select>
              //         </div>
              //       </div>
              //       {isInValid && (
              //         <p className="text-red-500 text-xs mt-1">
              //           This field is required.
              //         </p>
              //       )}
              //     </div>
              //   );
              // }

              // 2. DATE PICKER
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
                          onOpenChange={setIsCalendarOpen}
                          className=""
                        >
                          <PopoverTrigger
                            className="w-full border-black rounded"
                            asChild
                          >
                            <Button
                              variant="outline"
                              className="justify-start py-[15px]"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dobDate
                                ? format(dobDate, "PPP")
                                : "Select Date of Birth"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 " align="start">
                            <Calendar
                              selected={dobDate}
                              onSelect={handleDateSelect}
                              mode="single"
                              captionLayout="dropdown"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. TEXTAREA
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
                          value={formData?.[fieldName]}
                          placeholder={`Enter ${field.label}`}
                          onChange={handleChange}
                          className="border-black rounded"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              // 4. FILE INPUT
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
                          className="border-black rounded"
                        />
                      </div>
                    </div>
                    {validation.image && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {validation.image}
                      </p>
                    )}
                  </div>
                );
              }

              // 5. REGULAR INPUT (DEFAULT)
              return (
                <div key={field.name} className="flex flex-col">
                  <div className="lg:flex-row w-full lg:flex lg:center lg:gap-10">
                    <div className="w-full">
                      <Label className="text-sm py-2">{field.label}</Label>
                    </div>
                    <div className="lg:w-[900px]">
                      <Input
                        name={fieldName}
                        type={
                          fieldName === "email"
                            ? "email"
                            : ["phonenumber", "whatsappno", "age"].includes(
                                fieldName
                              )
                            ? "number"
                            : "text"
                        }
                        value={formData?.[fieldName]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        //disabled={fieldName === "age"} // Age is auto-calculated
                        readOnly={fieldName === "age"}
                        className={`border-black rounded${
                          isInValid
                            ? "border-red-500 ring-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {isInValid && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validation[fieldName] || "This field is required."}
                    </p>
                  )}
                </div>
              );
            })}
            {/* 🔴 Step 1 Submission Button (Updated to Confirm Profile) */}
            <div className="col-span-2 flex justify-center mt-6">
              <Button
                type="submit"
                disabled={isFormLoading}
                className="px-8 py-5 text-lg"
              >
                {isFormLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* Step 2: OTP Verification Form */}
        {/* -------------------------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="lg:w-[670px] pt-10 md:pt-15 lg:pt-5">
            <OtpVerificationForm
              otpVerification={otpVerification}
              setOtpVerification={setOtpVerification}
              resendTimer={resendTimer}
              handleResendOTP={handleResendOTP}
              handleVerifyAndRegister={handleVerifyAndRegister}
              isOTPSending={isOTPSending}
              isOTPVerifying={isOTPVerifying}
              userEmail={formData.email}
              validation={validation}
              setCurrentStep={setCurrentStep}
              setValidation={setValidation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
