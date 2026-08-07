"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProfiles, searchProfiles } from "../redux/profileSlice";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ import Skeleton
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import useDebounce from "../hooks/useDebounce";

const Partners = () => {
  const dispatch = useDispatch();
  //  Search State
  const [searchTerm, setSearchTerm] = useState("");
  // 2. Debounce the search term (700ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const { profiles, loading, error } = useSelector((state) => state.profile);
  const router = useRouter();

  console.log(profiles);

  // useEffect(() => {
  //   if (profiles.length === 0) {
  //     dispatch(getAllProfiles());
  //   }
  // }, [dispatch, profiles.length]);

  // 👈 New click change to profile handler function

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "") {
      dispatch(searchProfiles(debouncedSearchTerm));
    } else if (profiles.length === 0 || searchTerm === "") {
      dispatch(getAllProfiles());
    }
  }, [dispatch, debouncedSearchTerm]); // Trigger on debounced term change

  // Loader UI indication logic:
  // Show loader only if Redux loading is true AND user has typed something (searchTerm)

  const isTypingOrLoading = loading && searchTerm.trim() !== "";

  // Loader icon for input right side
  const InputRightIcon = isTypingOrLoading ? (
    <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
  ) : null;

  const handleProfileClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const skeletonArray = Array.from({ length: 4 }); // number of skeleton cards

  // Error and No Profile Found UI

  let content;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Matrimony Profiles
      </h2>

      <div className="mb-8  max-w-6xl mx-auto">
        <InputGroup>
          <InputGroupInput
            className="border border-neutral-400 py-5 rounded-lg w-full"
            placeholder="Search by ID or Name"
          />
        </InputGroup>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto md:overflow-hidden lg:overflow-visible"
      >
        <CarouselContent>
          {loading
            ? skeletonArray.map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
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
              ))
            : profiles?.map((profile) => (
                <CarouselItem
                  key={profile.id}
                  className="md:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-3">
                    <Card
                      className="shadow-md hover:shadow-xl h-[350px] md:h-[400px] cursor-pointer lg:h-[400px] transition-all duration-300 border border-gray-200 rounded-2xl"
                      onClick={() => handleProfileClick(profile.id)}
                    >
                      <CardContent className="">
                        <img
                          src={
                            profile.image
                              ? `${process.env.NEXT_PUBLIC_API_URL_PRODUCTION}/${profile.image}`
                              : profile.gender === "Male"
                              ? "/default-boy.jpg"
                              : profile.gender === "Female"
                              ? "/default-girl.jpg"
                              : "/default-boy.jpg"
                          }
                          alt={profile.pname}
                          className="h-[200px] w-full md:h-[250px] lg:h-[220px] rounded-md object-cover mb-4 border-4 border-gray-100 shadow-sm"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          <strong className="text-black font-bold">
                            Name :{" "}
                          </strong>
                          {profile.pname}
                        </h3>
                        <p className="text-sm py-2 text-gray-600">
                          <strong className="font-bold  text-black">
                            Educations :{" "}
                          </strong>
                          <span className=" text-[12px]">
                            {" "}
                            {profile.education}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <strong className="text-black font-bold">
                            Joined :{" "}
                          </strong>{" "}
                          {profile.created_day}-{profile.created_month}-
                          {profile.created_year}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default Partners;
