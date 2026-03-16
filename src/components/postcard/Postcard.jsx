import React, { useContext, useEffect, useState } from "react";
import CommentDetails from "../CommentDetails/CommentDetails";
import Commentcreation from "../commentcreation/Commentcreation";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiGlobe,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { AuthContext } from "../../Context/Contexttoken";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  useDisclosure,
} from "@heroui/react";

function Postcard({ post }) {
  const { userid, userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    isOpen: isPostModalOpen,
    onOpen: onPostModalOpen,
    onOpenChange: onPostModalChange,
    onClose: onPostModalClose,
  } = useDisclosure();

  const {
    isOpen: isCommentModalOpen,
    onOpen: onCommentModalOpen,
    onOpenChange: onCommentModalChange,
    onClose: onCommentModalClose,
  } = useDisclosure();

  const postID = post?._id;
  const top = post?.topComment || null;
  const commentId = top?._id || null;
  const creator = top?.commentCreator || null;

  const commentsCount = post?.commentsCount ?? 0;
  const likesCount = post?.likesCount ?? 0;

  const userPhoto = post?.user?.photo || "https://via.placeholder.com/48";
  const userName = post?.user?.name || "User";
  const createdAtText = post?.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "";

  const postOwnerId = post?.user?._id || post?.user?.id;
  const topCommentOwnerId = creator?._id || creator?.id;

  const isMyPost = postOwnerId === userid;
  const isMyTopComment = topCommentOwnerId === userid;

  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);

  const [editPostBody, setEditPostBody] = useState(post?.body || "");
  const [editCommentBody, setEditCommentBody] = useState(top?.content || "");

  useEffect(() => {
    setEditPostBody(post?.body || "");
  }, [post?.body]);

  useEffect(() => {
    setEditCommentBody(top?.content || "");
  }, [top?.content]);

  function handleLikeRequest() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postID}/like`,
      {},
      {
        headers: {
          token: userToken,
        },
      }
    );
  }

  const { mutate: likeMutate, isPending: isLiking } = useMutation({
    mutationFn: handleLikeRequest,
    onMutate: async () => {
      setLiked((prevLiked) => {
        setLocalLikes((prevLikes) =>
          prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1
        );
        return !prevLiked;
      });
    },
    onError: () => {
      setLiked(false);
      setLocalLikes(likesCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${postID}`, {
      headers: { token: userToken },
    });
  }

  const { mutate: deletePostMutate, isPending: isDeletingPost } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.log("delete post error", error?.response?.data || error);
      toast.error("Failed to delete post");
    },
  });

  function handleEditPost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postID}`,
      { body: editPostBody },
      {
        headers: { token: userToken },
      }
    );
  }

  const { mutate: editPostMutate, isPending: isEditingPost } = useMutation({
    mutationFn: handleEditPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Post updated successfully");
      onPostModalClose();
    },
    onError: (error) => {
      console.log("edit post error", error?.response?.data || error);
      toast.error("Failed to update post");
    },
  });

  function handleDeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postID}/comments/${commentId}`,
      {
        headers: { token: userToken },
      }
    );
  }

  const { mutate: deleteCommentMutate, isPending: isDeletingComment } =
    useMutation({
      mutationFn: handleDeleteComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getPosts"] });
        toast.success("Comment deleted successfully");
      },
      onError: (error) => {
        console.log("delete comment error", error?.response?.data || error);
        toast.error("Failed to delete comment");
      },
    });

  function handleEditTopComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postID}/comments/${commentId}`,
      { content: editCommentBody },
      {
        headers: { token: userToken },
      }
    );
  }

  const { mutate: editTopCommentMutate, isPending: isEditingComment } =
    useMutation({
      mutationFn: handleEditTopComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getPosts"] });
        toast.success("Comment updated successfully");
        onCommentModalClose();
      },
      onError: (error) => {
        console.log("edit comment error", error?.response?.data || error);
        toast.error("Failed to update comment");
      },
    });

  const actionBtn =
    "group flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition text-slate-700 hover:bg-slate-100 active:bg-slate-200";

  return (
    <>
      <article
        className="
          bg-white rounded-3xl border border-slate-200
          shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]
          overflow-hidden
        "
      >
        <header className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={userPhoto}
                alt="user"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
                loading="lazy"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 truncate">
                    {userName}
                  </h3>

                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Member
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="truncate">{createdAtText}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-1">
                    <FiGlobe className="text-slate-400" />
                    Public
                  </span>
                </div>
              </div>
            </div>

            {isMyPost && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button
                    className="
                      h-9 w-9 grid place-items-center rounded-xl
                      hover:bg-slate-100 transition text-slate-500
                    "
                    aria-label="Post options"
                    type="button"
                  >
                    <FiMoreHorizontal className="text-xl" />
                  </button>
                </DropdownTrigger>

                <DropdownMenu aria-label="Post actions">
                  <DropdownItem key="edit" onPress={onPostModalOpen}>
                    Edit Post
                  </DropdownItem>

                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={() => deletePostMutate()}
                  >
                    {isDeletingPost ? "Deleting..." : "Delete Post"}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </header>

        <div className="px-5 pt-4">
          {post?.body ? (
            <p className="text-slate-800 leading-relaxed whitespace-pre-line">
              {post.body}
            </p>
          ) : null}
        </div>

        {post?.image ? (
          <div className="mt-4">
            <div className="relative w-full bg-slate-100">
              <img
                src={post.image}
                alt="post"
                className="w-full max-h-[520px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : null}

        <div className="px-5 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => likeMutate()}
              disabled={isLiking}
              className="inline-flex items-center gap-2 hover:text-slate-700 transition disabled:opacity-60"
              title="Like"
            >
              <span
                className={[
                  "inline-flex items-center justify-center h-6 w-6 rounded-full border transition",
                  liked
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-slate-50 border-slate-200 text-slate-500",
                ].join(" ")}
              >
                <FiHeart className={liked ? "fill-current" : ""} />
              </span>

              <span className="hover:underline">{localLikes} Likes</span>
            </button>

            <button
              type="button"
              className="hover:underline hover:text-slate-700 transition"
            >
              {commentsCount} comments
            </button>
          </div>
        </div>

        <div className="px-3 mt-3">
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
            <button
              type="button"
              onClick={() => likeMutate()}
              disabled={isLiking}
              className="
                group flex items-center justify-center gap-2
                py-2.5 px-4 rounded-2xl text-sm font-semibold
                transition-all duration-200 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                hover:bg-rose-50
              "
            >
              <FiHeart
                className={[
                  "text-lg transition-all duration-200 group-hover:scale-110",
                  liked
                    ? "text-rose-600 fill-rose-600"
                    : "text-slate-600 group-hover:text-rose-600",
                ].join(" ")}
              />
              <span
                className={
                  liked
                    ? "text-rose-600"
                    : "text-slate-700 group-hover:text-rose-600"
                }
              >
                Like
              </span>
            </button>

            <button type="button" className={actionBtn}>
              <FiMessageCircle className="text-lg transition group-hover:scale-110" />
              Comment
              <span className="text-slate-500 font-medium">
                ({commentsCount})
              </span>
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <Commentcreation value={post} queryKeys={[["getPosts"]]} />
        </div>

        {top ? (
          <div className="px-5 pt-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <p className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                  <FiMessageCircle className="text-sm" />
                  Top Comment
                </p>

                {isMyTopComment && (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <button
                        className="
                          h-8 w-8 grid place-items-center rounded-full
                          text-slate-500 hover:bg-slate-200
                          transition-all duration-200
                        "
                        aria-label="Top comment options"
                        type="button"
                      >
                        <FiMoreHorizontal className="text-lg" />
                      </button>
                    </DropdownTrigger>

                    <DropdownMenu
                      aria-label="Top comment actions"
                      itemClasses={{
                        base: "rounded-md data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
                      }}
                    >
                      <DropdownItem key="edit" onPress={onCommentModalOpen}>
                        Edit
                      </DropdownItem>

                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={() => deleteCommentMutate()}
                      >
                        {isDeletingComment ? "Deleting..." : "Delete"}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>

              <div className="flex items-start gap-3">
                <img
                  src={creator?.photo || "https://via.placeholder.com/32"}
                  alt="comment creator"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  loading="lazy"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {creator?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mt-0.5">
                    {top?.content || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="px-5 py-4">
          <CommentDetails post={post} />
        </div>
      </article>

      <Modal
        isOpen={isPostModalOpen}
        onOpenChange={onPostModalChange}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalBody>
            <Textarea
              minRows={5}
              value={editPostBody}
              onChange={(e) => setEditPostBody(e.target.value)}
              placeholder="Update your post..."
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPostModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => editPostMutate()}
              isLoading={isEditingPost}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isCommentModalOpen}
        onOpenChange={onCommentModalChange}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Edit Comment</ModalHeader>
          <ModalBody>
            <Textarea
              minRows={4}
              value={editCommentBody}
              onChange={(e) => setEditCommentBody(e.target.value)}
              placeholder="Update your comment..."
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCommentModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => editTopCommentMutate()}
              isLoading={isEditingComment}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Postcard;