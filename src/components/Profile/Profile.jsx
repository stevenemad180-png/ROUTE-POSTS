import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Oval } from "react-loader-spinner";

function Profile() {

  function getdataprofile() {
    return axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: localStorage.getItem("tkn"),
        },
      }
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: getdataprofile,
    queryKey: ["getprofile"],
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30">
        <Oval height={80} width={80} color="#4fa94d" visible />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600 p-6">{error.message}</div>;
  }

  const user = data?.data?.data?.user;

  const name = user?.name;
  const email = user?.email;
  const photo = user?.photo || "https://via.placeholder.com/150";

return (
  <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white py-10 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.22)] border border-slate-200">
        
        {/* Cover */}
        <div className="relative h-72 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 right-4 text-white/80 text-sm font-medium">
            My Profile
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 md:px-10 pb-10">
          
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-20">
            <div className="rounded-full p-1.5 bg-white shadow-xl">
              <img
                src={photo}
                alt={name || "user"}
                className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-100"
              />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-800 uppercase">
              {name}
            </h2>

            <p className="mt-1 text-slate-500 text-base">{email}</p>

            <span className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-100">
              Welcome back 👋
            </span>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center hover:shadow-md transition">
              <p className="text-3xl font-extrabold text-slate-800">
                {user?.followersCount || 0}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">Followers</p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center hover:shadow-md transition">
              <p className="text-3xl font-extrabold text-slate-800">
                {user?.followingCount || 0}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">Following</p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center hover:shadow-md transition">
              <p className="text-3xl font-extrabold text-slate-800">
                {user?.bookmarksCount || 0}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">Bookmarks</p>
            </div>
          </div>

          {/* Extra details */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Profile Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-slate-400 mb-1">Username</p>
                <p className="font-semibold text-slate-800">
                  {user?.username || "Not available"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-slate-400 mb-1">Gender</p>
                <p className="font-semibold text-slate-800">
                  {user?.gender || "Not available"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-slate-400 mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-800">
                  {user?.dateOfBirth || "Not available"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-slate-400 mb-1">Email</p>
                <p className="font-semibold text-slate-800 break-all">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition">
              Edit Profile
            </button>

            <button className="px-8 py-3 rounded-2xl bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Profile;