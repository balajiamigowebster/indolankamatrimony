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
// ✅ NEW: Import InputOTP Components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
import { CalendarIcon, Check, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { registerProfile } from "../redux/profileSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

console.log(Occupations.length);

const REQUIRED_FIELDS = [
  "phonenumber",
  "gender",
  "mprofile", // "Matrimony Profile for"
  "email",
  "whatsappno",
  "pname",

  "otp",
];

// 🧾 Dropdown data (First code base-la update aagirukku)
const dropdownData = {
  "Matrimony Profile for": ["Bride", "Groom", "Relative", "Friend", "Self"],
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
    "Other Bachelor Degree in Medicine",
    "M.Pharm",
    "MPT",
    "Other Master Degree in Medicine",
    "BGL",
    "B.L.",
    "LL.B.",
    "Other Bachelor Degree in Legal",
    "LL.M.",
    "M.L.",
    "Other Master Degree in Legal",
    "CA",
    "CFA (Chartered Financial Analyst)",
    "CS",
    "ICWA",
    "Other Degree in Finance",
    "IAS",
    "IES",
    "IFS",
    "IRS",
    "IPS",
    "Other Degree in Service",
    "Ph.D.",
    "DM",
    "Postdoctoral fellow",
    "Fellow of National Board (FNB)",
    "Diploma",
    "Polytechnic",
    "Trade School",
    "Others in Diploma",
    "Higher Secondary School / High School",
  ], // Note: First code-la irundha short list
  Occupations: [
    "Software Professional",
    "Teaching / Academician",
    "Executive",
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
  ],
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
  ],

  "Father's Occupation": [
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
  ],
  "Mother's Occupation": [
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

// 📄 Field order - HEADINGS AND FIELDS ADDED/ARRANGED HERE
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
  // 🔴 UPDATED FIELD: 'phonenumber' is now the standard input
  { label: "Phone Number", name: "phonenumber", type: "input" },
  { label: "Profile Image", name: "image", type: "file" },
  // ✅ NEW FIELD: To display the OTP field
  { label: "OTP Verification", name: "otp", type: "otp" },
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

export default function SendOtpRegisterProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.profile);
  // Error Tracking State
  const [validation, setValidation] = useState({});
  // ✅ NEW: Regex for Validation
  const PHONE_NUMBER_REGEX = /^[0-9]{10}/;
  // Standard email format: user@domain.tld, allows letters, numbers, dots, and hyphens.
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // ✅ NEW: Max file size (500 KB in bytes)
  const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB * 1024 bytes/KB

  // ✅ NEW STATE: Resend OTP Timer
  const RESEND_TIME_LIMIT = 60; // 60 seconds
  const [resendTimer, setResendTimer] = useState(RESEND_TIME_LIMIT);

  // 🔴 MODIFIED STATE: isOTPSent -> isOTPInputEnabled
  // isOTPSent: OTP button ah click pannitanga.
  // isOTPInputEnabled: OTP successful-ah send aagiduchu, ippo input field use pannalam.
  const [isOTPSent, setIsOTPSent] = useState(false); // Indicates OTP send has been *attempted* (for timer logic)
  const [isOTPInputEnabled, setIsOTPInputEnabled] = useState(false); // 🔴 CORE NEW STATE: Controls OTP Input field `disabled` attribute
  const [isOTPSending, setIsOTPSending] = useState(false); // To show loading state on Send OTP button

  // console.log(validation);

  // 1. Resend Mail Logic (Timer)

  useEffect(() => {
    let timerId;
    if (isOTPInputEnabled && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [isOTPInputEnabled, resendTimer]); // Use isOTPInputEnabled

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
    //  NEW: State for OTP
    otp: "",
  });

  const [image, setImage] = useState(null);
  const [dobDate, setDobDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validation error Clear state
    if (validation[name]) {
      setValidation((prev) => ({ ...prev, [name]: false }));
    }
  };

  // ✅ NEW: Image file handle function

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Reset Image validation error state
    if (validation.image) {
      setValidation((prev) => ({ ...prev, image: undefined }));
    }

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        // Error: File size exceeds 500KB
        setImage(null);
        setValidation((prev) => ({
          ...prev,
          image: "Image size must be less than 500KB.",
        }));
        e.target.value = ""; // Clear the file input field
      } else {
        // Success: Set the file and clear any previous image error
        setImage(file);
        setValidation((prev) => ({ ...prev, image: undefined }));
      }
    } else {
      // No file selected (e.g., user cancels)
      setImage(null);
    }
  };

  //  Browser Leave Confirmation Logic

  const handleBeforeUnload = useCallback(
    (event) => {
      // Check if the OTP field is *enabled* and *visible*
      if (isOTPInputEnabled && formData.otp.length < 6) {
        const message =
          "The registration is not complete. Are you sure you want to leave and lose your progress?";
        event.returnValue = message; // Standard for most browsers
        return message;
      }
    },
    [isOTPInputEnabled, formData.otp.length]
  ); // Use isOTPInputEnabled

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  const handleSelectChange = (name, value) => {
    if (name === "education") {
      // Logic for multi-select (as per first code)
      setFormData((prev) => ({
        ...prev,
        education: prev.education.includes(value)
          ? prev.education.filter((v) => v !== value)
          : [...prev.education, value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validation error Clear state
    if (validation[name]) {
      setValidation((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleDateSelect = (date) => {
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

  // 🔴 CORE UPDATE: Validation Logic
  const validateForm = () => {
    let isValid = true;
    const newValidation = {};

    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field];
      const isMissing =
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "");

      if (isMissing) {
        newValidation[field] = "This field is required.";
        isValid = false;
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // 🔴 Validation

  //   if (!validateForm()) {
  //     toast.error("Some required fields are mandatory.", {
  //       icon: <X className="text-red-600 bg-red-200 rounded p-0.5" size={18} />,
  //       //description: "Please fill the highlighted fields.",
  //       duration: 4000,
  //       classNames: {
  //         title: "text-red-900 font-bold",
  //         description: "text-red-800 font-medium",
  //       },
  //       style: {
  //         "--sonner-progress-bar": "rgb(239 68 68)", // Red-500
  //       },
  //       className: "bg-red-50 border border-red-400 shadow-lg",
  //     });
  //     return; // Validation failed, stop submission
  //   }

  //   if (validation.image) {
  //     toast.error(validation.image, {
  //       // Show the specific image error message
  //       icon: <X className="text-red-600 bg-red-200 rounded p-0.5" size={18} />,
  //       duration: 4000, // ... (rest of the toast settings)
  //     });
  //     return; // 🛑 Stop submission immediately if there is an image size error
  //   }

  //   const updated = { ...formData };
  //   for (let key in updated) {
  //     if (!updated[key] || updated[key].length === 0) {
  //       updated[key] = "N/A"; // Handle empty fields
  //     }
  //   }

  //   if (Array.isArray(updated.education) && updated.education.length === 0) {
  //     updated.education = "N/A";
  //   } // Prepare FormData for API call

  //   const form = new FormData();
  //   for (let key in updated) {
  //     if (key === "education") {
  //       // Handle multi-select education field
  //       if (Array.isArray(updated.education) && updated.education.length > 0) {
  //         updated.education.forEach((e) => form.append("education[]", e));
  //       } else {
  //         form.append(key, updated[key]); // Append "N/A" or empty array if needed
  //       }
  //     } else {
  //       form.append(key, updated[key]);
  //     }
  //   }

  //   if (image) form.append("image", image);

  //   const result = await dispatch(registerProfile(form));
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
  //       descriptionClassName: "text-green-700",
  //       // description: "Please check your profile for details.",
  //     });
  //     setFormData({
  //       // Reset form after success
  //       mprofile: "",
  //       pname: "",
  //       dob: "",
  //       age: "",
  //       pbrith: "",
  //       tbrith: "",
  //       rasi: "",
  //       nakshatram: "",
  //       laknam: "",
  //       height: "",
  //       weight: "",
  //       color: "",
  //       maritalstatus: "",
  //       gender: "Male",
  //       education: [],
  //       occupation: "",
  //       annualincome: "",
  //       mothertongue: "",
  //       religion: "",
  //       caste: "",
  //       subcaste: "",
  //       fname: "",
  //       foccupation: "",
  //       mname: "",
  //       moccupation: "",
  //       sister: "",
  //       brother: "",
  //       children: "",
  //       rplace: "",
  //       whatsappno: "",
  //       email: "",
  //       addressdetails: "",
  //       phonenumber: "",
  //     });
  //     setDobDate(null);
  //     setImage(null);
  //     sessionStorage.setItem(
  //       "registrationSuccess",
  //       JSON.stringify({ id: data.id, name: data.pname })
  //     );
  //     router.push("/success");
  //   } else {
  //     // Use result.payload?.message if available, otherwise a generic error
  //     toast.error(result.payload?.message || "Profile Registered Failed", {
  //       icon: <X className="text-red-500 bg-red-200 rounded p-1" size={20} />,
  //       duration: 5000,
  //       // description: "Please check your profile for details.",
  //     });
  //   }
  // };

  return (
    <div className="max-w-7xl mx-auto pt-10 md:pt-15 lg:pt-15 shadow-lg rounded-2xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#4a2f1c]">
        Matrimony Profile Registration
      </h1>

      <div className="lg:max-w-4xl lg:mx-auto lg:bg-white lg:shadow-2xl lg:px-3 lg:pt-3 lg:pb-10 lg:gap-10 rounded-2xl lg:flex">
        <div className="hidden md:hidden lg:block">
          <img
            src="/register/r1.jpg"
            alt="Love"
            className="h-[400px] lg:pt-5"
          />
        </div>

        <form
          // onSubmit={handleSubmit} // grid-cols-1 added for mobile/default view
          className="md:grid   flex flex-col md:grid-cols-2 lg:flex lg:flex-col pt-10 md:pt-15 lg:pt-5 lg:w-[370px] lg:grid-cols-1 gap-2 md:gap-6 lg:gap-2"
        >
          {fieldOrder.map((field, index) => {
            const fieldName = dropdownFieldMap[field.label] || field.name; // 0. HEADING FIELD (New Logic)
            // 🔴 Validation check for dynamic class
            const isInValid = validation[fieldName];

            if (field.type === "heading") {
              return (
                // col-span-full is used to make the heading span the full width (1 column on mobile, 2 on MD)
                <h2
                  key={field.label}
                  className="col-span-full text-center font-semibold mt-4 mb-2 text-2xl border-b pb-1"
                >
                  {field.label}
                </h2>
              );
            } // 1. SELECT FIELD

            if (field.type === "select") {
              const options = dropdownData[field.label];
              if (!options) return null; // Special handling for multi-select Education

              // Standard Select field (Includes mprofile, gender)

              if (fieldName === "education") {
                return (
                  <div key={field.label} className="flex flex-col">
                    <Label className="text-sm py-2">{field.label}</Label>
                    <Select
                      onValueChange={(val) =>
                        handleSelectChange(fieldName, val)
                      }
                    >
                      {/* 🔴 Select Trigger Border Update */}
                      <SelectTrigger className={`w-full py-5   `}>
                        <div className="flex flex-wrap gap-1">
                          {formData.education.length === 0
                            ? "Select Education"
                            : formData.education.map((item) => (
                                <span
                                  key={item}
                                  className="bg-gray-200 px-2 py-1 rounded-full text-xs"
                                >
                                  {item}
                                </span>
                              ))}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.education.length > 0 &&
                        formData.education.map((item) => (
                          <span
                            key={`chip-${item}`}
                            className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded-full text-[10px] flex items-center gap-1"
                          >
                            {item}

                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectChange(fieldName, item);
                              }}
                              className="cursor-pointer text-neutral-600 font-bold"
                            ></span>
                          </span>
                        ))}
                    </div>
                  </div>
                );
              } // Standard Select field

              return (
                <div key={field.label} className="flex flex-col">
                  <Label className="text-sm py-2">{field.label}</Label>{" "}
                  <Select
                    value={formData[fieldName]}
                    onValueChange={(val) => handleSelectChange(fieldName, val)}
                  >
                    <SelectTrigger
                      className={`w-full py-5 ${
                        isInValid
                          ? "border-red-500 ring-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>

                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInValid && (
                    <p className="text-red-500 text-xs mt-1">
                      This field is required.
                    </p>
                  )}
                </div>
              );
            } // 2. DATE PICKER (acts as an input field in the flow)

            if (field.type === "date") {
              return (
                <div key={field.label} className="flex flex-col">
                  <Label className="text-sm py-2">{field.label}</Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start py-5">
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
                        toYear={2025}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            } // 3. TEXTAREA (a type of input)

            if (field.type === "textarea") {
              return (
                // col-span-full makes the textarea span 2 columns on medium screens
                <div key={field.name} className="flex flex-col md:col-span-2">
                  <Label className="text-sm py-2">{field.label}</Label>
                  <Textarea
                    name={fieldName}
                    value={formData[fieldName]}
                    placeholder={`Enter ${field.label}`}
                    onChange={handleChange}
                  />
                </div>
              );
            } // 4. FILE INPUT

            if (field.type === "file") {
              return (
                <div key={field.name} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm py-2">{field.label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {/* AlertCircle: '!' icon-க்கு */}
                          <AlertCircle className="h-4 w-4 text-gray-500 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white p-2 text-xs">
                          <p>Image size must be less than 500KB.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`${
                      validation.image
                        ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {/* 🔴 NEW: Display Image Size Error Message */}

                  {validation.image && (
                    <p className="text-red-500 text-xs mt-1">
                      {validation.image}
                    </p>
                  )}
                </div>
              );
            } // 5. REGULAR TEXT INPUT

            if (field.type === "input") {
              // Required Update: Age field is readOnly
              const isAgeField = field.name === "age";
              const isPhoneNumberField =
                fieldName === "phonenumber" || fieldName === "whatsappno";
              const isEmailField = fieldName === "email";

              return (
                <div key={field.name} className="flex flex-col">
                  <Label className="text-sm py-2">{field.label}</Label>
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
                    value={formData[fieldName]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label}`}
                    readOnly={isAgeField}
                    disabled={isAgeField && formData.age === ""}
                    // ✅ NEW: MaxLength for Phone/Whatsapp
                    maxLength={isPhoneNumberField ? 10 : undefined}
                    // 🔴 Input Border Update
                    className={`py-5 ${
                      isInValid
                        ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {isInValid && (
                    <p className="text-red-500 text-xs mt-1">
                      {validation[fieldName]}
                    </p>
                  )}
                </div>
              );
            }

            return null; // For safety
          })}
          <div className="col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-5 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Please wait...
                </div>
              ) : (
                "Register Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
