import React from "react";
import { NavLink } from "react-router-dom";

function CommentDetails({ post }) {

  if (!post?.commentsCount || post.commentsCount <= 1) return null;

  return (
    <div className="mt-2 px-2">
      <NavLink
        to={`/layoutcomment/${post._id}`}
        className="
          text-sm font-medium text-blue-600
          hover:text-blue-800
          transition
          cursor-pointer
        "
      >
        View all {post.commentsCount} comments
      </NavLink>
    </div>
  );
}

export default CommentDetails;