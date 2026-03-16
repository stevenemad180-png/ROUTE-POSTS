import axios from "axios";
import React from "react";
import Postcard from "../postcard/Postcard";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import Commentcreation from "../commentcreation/Commentcreation";
import Createpost from "../createpost/Createpost";

function Home() {   
  function getAllPosts() {
    const tkn = localStorage.getItem("tkn");
return axios.get(
  "https://route-posts.routemisr.com/posts/",
  { headers: { Authorization: `Bearer ${tkn}`, token: tkn } }
);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,

    
  });

  if (isLoading) {
    return (
     <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
  <Oval
    height={80}
    width={80}
    color="#4fa94d"
    visible
    ariaLabel="oval-loading"
    secondaryColor="#4fa94d"
    strokeWidth={2}
    strokeWidthSecondary={2}
  />
</div>
    );
  }

  console.log("sevoerror",error)
  if (isError) {
    const msg =

      error.message;

    return <div className="p-6 text-red-600">{msg}</div>;
  }
  
  // console.log("sevodata", data.data?.data?.posts)
  
  const postsRaw =
  data.data?.data?.posts||
  [];
  
  const posts = Array.isArray(postsRaw) ? postsRaw : [];
  // console.log("FULL_RESPONSE:", data?.data?.data);
return (
  <div className="bg-slate-50 min-h-screen py-8">
    <div className="max-w-[900px] mx-auto px-4 space-y-6">
      <Createpost />

      {posts.map((post) => (
        <Postcard key={post._id} post={post} />
      ))}
    </div>
  </div>
);
}

export default Home;