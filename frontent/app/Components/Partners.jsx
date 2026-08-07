"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProfiles, searchProfiles } from "../redux/profileSlice";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";

const Partners = () => {
  const dispatch = useDispatch();
  const { profiles, loading, error } = useSelector((state) => state.profile);
  const router = useRouter();

  // 1. Search State
  const [searchTerm, setSearchTerm] = useState("");
  // 2. Debounce the search term (700ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // 3. Effect to handle initial load and debounced search
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
      //console.log("Debounce Api call start");
      dispatch(searchProfiles(debouncedSearchTerm));
    } else if (debouncedSearchTerm === "") {
      // profiles.length == 0 என்பதை மட்டும் ஆரம்ப லோடுக்கு செக் செய்யலாம்
      dispatch(getAllProfiles());
    }
  }, [dispatch, debouncedSearchTerm]); // searchTerm, profiles.length தேவையில்லை

  // Loader UI indication logic (Input-க்கு மட்டும்):
  // Redux loading true ஆக இருக்கும் போதும், user ஏதோ டைப் செய்திருந்தால் (searchTerm காலியாக இல்லை) Loader-ஐ காட்டு.
  const isTypingOrLoading = loading && searchTerm.trim() !== "";

  // Loader icon for input right side
  const InputRightIcon = isTypingOrLoading ? (
    <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
  ) : null;

  // 4. Handle Profile Click (same as before)
  const handleProfileClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const skeletonArray = Array.from({ length: 4 });

  // 5. Error and No Profile Found UI
  let content;

  // ✅ New Logic: Skeleton-ஐ எப்போது காட்ட வேண்டும்
  // 1. loading = true AND searchTerm காலியாக இல்லை (search API call நடக்கும்போது)
  const isSearchingAndLoading = loading && searchTerm.trim() !== "";

  // 2. loading = true AND profiles.length = 0 AND searchTerm காலியாக உள்ளது (Initial Load நடக்கும்போது)
  const isInitialLoading =
    loading && profiles.length === 0 && searchTerm.trim() === "";

  if (isSearchingAndLoading || isInitialLoading) {
    // Initial Load அல்லது Search Loading (Skeleton-ஐ காட்டவும்)
    content = skeletonArray.map((_, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
        {/* ... Skeleton UI ... */}
        <div className="p-3">
          <Card className="shadow-md border border-gray-200 rounded-2xl">
            <CardContent className="flex flex-col items-center">
              <Skeleton className="h-[200px] w-full md:h-[250px] lg:h-[220px] rounded-md mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ));
  } else if (error && profiles.length === 0) {
    // Error or Not Found
    content = (
      <div className="text-center w-full py-16 col-span-full">
        <h3 className="text-2xl font-bold text-red-600 mb-2">
          Search Result: {error}
        </h3>
        <p className="text-gray-600">
          Please try searching with a different Name or ID.
        </p>
      </div>
    );
  } else if (profiles.length === 0 && !loading) {
    // No data found after search (error is null/cleared)
    content = (
      <div className="text-center w-full py-16 col-span-full">
        <h3 className="text-2xl font-bold text-neutral-600 mb-2">
          No Profiles Available 😞
        </h3>
      </div>
    );
  } else {
    // Data found (Profiles List)
    content = profiles.map((profile) => (
      <CarouselItem key={profile.id} className="md:basis-1/2 lg:basis-1/4">
        <div className="p-3">
          <Card
            className="shadow-md hover:shadow-xl h-[350px] md:h-[400px] cursor-pointer lg:h-[400px] transition-all duration-300 border border-gray-200 rounded-2xl"
            onClick={() => handleProfileClick(profile.id)}
          >
            <CardContent className="">
              {/* Image Section */}
              {/* <img
                src={
                  profile.image
                    ? `${profile.image}`
                    : profile.gender === "Female"
                    ? "/default-girl.jpg"
                    : "/default-boy.jpg"
                }
                alt={profile.pname}
                className="h-[200px] w-full md:h-[250px] lg:h-[220px] p-2 rounded-md object-contain mb-4 border-4 border-gray-100 shadow-sm"
              /> */}

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
                className="h-[200px] w-full md:h-[250px] lg:h-[220px] p-2 rounded-md object-contain mb-4 border-4 border-gray-100 shadow-sm"
              />

              {/* ... Profile Details ... */}
              <div className="flex gap-5 items-center">
                <h3 className="text-lg font-semibold truncate text-gray-800">
                  {/* <strong className="text-black font-bold">Name : </strong> */}
                  {profile.pname}
                </h3>
                <p className="font-semibold  text-gray-800">
                  {/* <strong className="font-bold text-black">Educations : </strong> */}
                  <span className=" text-[14px]">{profile.age}</span>
                </p>
              </div>
              <p className="text-sm py-1 font-semibold truncate text-gray-800">
                {/* <strong className="font-bold text-black">Educations : </strong> */}
                <span className=" text-[12px]">{profile.education}</span>
              </p>
              <p className="text-sm py-1 font-semibold truncate text-gray-800">
                {/* <strong className="font-bold text-black">Educations : </strong> */}
                <span className=" text-[12px]">{profile.caste}</span>
              </p>

              {/* <p className="text-xs text-gray-500 mt-1">
                <strong className="text-black font-bold">Joined : </strong>{" "}
                {profile.created_day}-{profile.created_month}-
                {profile.created_year}
              </p> */}
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {/* <strong className="text-black font-bold">ID: </strong> */}
                {profile.id}
              </h3>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ));
  }

  return (
    <div className="max-w-6xl mx-auto pb-11">
      <div className="pt-5">
        <h1 className="cinzel_font text-center font-semibold text-2xl md:text-3xl lg:text-2xl text-[#C48C46]">
          Looking for Partner
        </h1>
        <div className="flex justify-center items-center space-x-2  relative">
          <img
            src="/leaf/l1.webp"
            className="w-30 h-30 object-contain rotate-180 animate-leaffly "
          />
          <img
            src="/leaf/l1.webp"
            className="w-30 h-30 object-contain animate-leaffly "
          />
        </div>
      </div>
      {/* Search Input with Loader */}
      <div className="mb-8 max-w-xl mx-auto">
        <InputGroup>
          <InputGroupInput
            className="border border-neutral-400 py-5 rounded-lg w-full"
            placeholder="Search by ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupText className="bg-white border border-neutral-400">
            {/* Loader/Icon */}
            {InputRightIcon}
          </InputGroupText>
        </InputGroup>
      </div>

      {/* Carousel or Error Message */}
      {error && profiles.length === 0 ? (
        // Error Message display
        content
      ) : (
        // Carousel display
        <Carousel
          plugins={[
            Autoplay({
              delay: 2500,
              stopOnInteraction: false,
            }),
          ]}
          opts={{
            align: "start",
            // Loop only if there's enough profiles to loop, or disable loop
            loop: profiles.length > 4 || true,
          }}
          className="w-full max-w-6xl mx-auto md:overflow-hidden lg:overflow-visible"
        >
          <CarouselContent
            // Skeleton-ஐ நடுவில் காட்ட வேண்டியதில்லை, data இல்லாவிட்டால் மட்டும் போதும்
            className={profiles.length === 0 ? "justify-center" : ""}
          >
            {content}
          </CarouselContent>

          {/* Show navigation only if profiles are available and loading is complete */}
          {profiles.length > 0 && !loading && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default Partners;
