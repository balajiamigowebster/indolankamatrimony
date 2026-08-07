"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProfiles } from "../redux/profileSlice";

export default function AllProfilesPage() {
  const dispatch = useDispatch();
  const { profiles, loading, error } = useSelector((state) => state.profile);

  console.log(profiles);

  useEffect(() => {
    dispatch(getAllProfiles());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* <h1>All Profiles</h1>
      {profiles.length === 0 ? (
        <p>No profiles found</p>
      ) : (
        <ul>
          {profiles.map((p) => (
            <li key={p.id}>
              {p.pname} — {p.email}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
