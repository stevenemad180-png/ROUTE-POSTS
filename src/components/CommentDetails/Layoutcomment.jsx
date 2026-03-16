import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import Commentcreation from "../commentcreation/Commentcreation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { FiMoreHorizontal } from "react-icons/fi";
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

function CommentItem({ comment, userid, postId }) {
  const queryClient = useQueryClient();

  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
  } = useDisclosure();

  const creator = comment?.commentCreator || null;
  const creatorId = creator?._id || creator?.id;
  const isOwner = creatorId === userid;

  const commentId = comment?._id || null;
  const [editCommentBody, setEditCommentBody] = useState(comment?.content || "");

  useEffect(() => {
    setEditCommentBody(comment?.content || "");
  }, [comment?.content]);

  function handleDeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          token: localStorage.getItem("tkn"),
        },
      }
    );
  }

  const { mutate: deleteCommentMutate, isPending: isDeletingComment } =
    useMutation({
      mutationFn: handleDeleteComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["singlePost", postId] });
        queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
        toast.success("Comment deleted successfully");
      },
      onError: (error) => {
        console.log("delete comment error", error?.response?.data || error);
        toast.error("Failed to delete comment");
      },
    });

  function handleEditComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        content: editCommentBody,
      },
      {
        headers: {
          token: localStorage.getItem("tkn"),
        },
      }
    );
  }

  const { mutate: editCommentMutate, isPending: isEditingComment } = useMutation({
    mutationFn: handleEditComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singlePost", postId] });
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
      toast.success("Comment updated successfully");
      onClose();
    },
    onError: (error) => {
      console.log("edit comment error", error?.response?.data || error);
      toast.error("Failed to update comment");
    },
  });

  return (
    <>
      <div className="flex items-start gap-3">
        <img
          src={creator?.photo || "https://via.placeholder.com/40"}
          alt="comment user"
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
          loading="lazy"
        />

        <div className="flex-1">
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-900">
                    {creator?.name || "Unknown"}
                  </p>

                  <span className="h-1 w-1 rounded-full bg-slate-400" />

                  <p className="text-xs text-slate-500">
                    {comment?.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>

                <p className="text-sm text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                  {comment?.content || ""}
                </p>
              </div>

              {isOwner && (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button
                      className="h-8 w-8 grid place-items-center rounded-full text-slate-500 hover:bg-slate-200 transition-all duration-200 shrink-0"
                      aria-label="comment options"
                      type="button"
                    >
                      <FiMoreHorizontal className="text-lg" />
                    </button>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="comment actions"
                    itemClasses={{
                      base: "rounded-md data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
                    }}
                  >
                    <DropdownItem key="edit" onPress={onOpen}>
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
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
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
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => editCommentMutate()}
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

export default function Layoutcomment() {
  const { id } = useParams();
  const { userToken, userid } = useContext(AuthContext);

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        token: userToken,
      },
    });
  }

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          token: userToken,
        },
      }
    );
  }

  const postQuery = useQuery({
    queryKey: ["singlePost", id],
    queryFn: getSinglePost,
    enabled: !!id && !!userToken,
  });

  const commentsQuery = useQuery({
    queryKey: ["postComments", id],
    queryFn: getPostComments,
    enabled: !!id && !!userToken,
  });

  if (postQuery.isLoading || commentsQuery.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (postQuery.isError) {
    const err = postQuery.error;
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";
    return <div className="p-6 text-red-600">{msg}</div>;
  }

  if (commentsQuery.isError) {
    const err = commentsQuery.error;
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";
    return <div className="p-6 text-red-600">{msg}</div>;
  }

  const post = postQuery.data?.data?.data?.post;
  const comments = commentsQuery.data?.data?.data?.comments || [];
  const commentsArr = Array.isArray(comments) ? comments : [];
  const commentsCount = post?.commentsCount ?? commentsArr.length ?? 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Post</h1>
            <p className="text-sm text-slate-500">Comments & discussion</p>
          </div>

          <Link
            to="/home"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Back to feed
          </Link>
        </div>

        <article className="bg-white rounded-[26px] border border-slate-200 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.22)] overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-3">
              <img
                src={post?.user?.photo || "https://via.placeholder.com/48"}
                alt="user"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
                loading="lazy"
              />

              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 truncate">
                  {post?.user?.name || "User"}
                </h3>

                <p className="text-xs text-slate-500">
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>

            {post?.body ? (
              <p className="text-slate-800 mt-4 whitespace-pre-line leading-relaxed">
                {post.body}
              </p>
            ) : null}
          </div>

          {post?.image ? (
            <img
              src={post.image}
              alt="post"
              className="w-full max-h-[560px] object-cover bg-slate-100"
              loading="lazy"
            />
          ) : null}

          <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
            <span className="font-semibold">💬 {commentsCount} comments</span>
            <span className="text-xs text-slate-500">
              Join the conversation below
            </span>
          </div>
        </article>

        <div className="bg-white rounded-[26px] border border-slate-200 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.16)] p-5">
          <p className="text-sm font-bold text-slate-900 mb-3">Add a comment</p>

          <Commentcreation
            value={post}
            queryKeys={[["singlePost", id], ["postComments", id]]}
          />
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.16)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-slate-900">
              Comments <span className="text-slate-500">({commentsCount})</span>
            </h2>
          </div>

          {commentsArr.length ? (
            <div className="space-y-4">
              {commentsArr.map((comment) => (
                <CommentItem
                  key={comment?._id || comment?.id}
                  comment={comment}
                  userid={userid}
                  postId={id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}