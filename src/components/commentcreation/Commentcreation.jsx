import React, { useMemo, useState } from "react";
import { Input } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdArrowCircleRight } from "react-icons/md";
import { toast } from "react-toastify";

function Commentcreation({ value, queryKeys = [] }) {
  const Postid = value?._id;

  const [commentvalue, setcommentvalue] = useState("");

  const trimmed = useMemo(() => commentvalue.trim(), [commentvalue]);
  const canSend = !!Postid && trimmed.length > 0;

  const clientquery = useQueryClient();

  function Handlecreate() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${Postid}/comments`,
      { content: trimmed },
      {
        headers: {
          token: localStorage.getItem("tkn"),
        },
      }
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: Handlecreate,

    onMutate: () => {
    },

    onSuccess: () => {


      queryKeys.forEach((key) => {
        clientquery.invalidateQueries({ queryKey: key });
      });

      setcommentvalue("");
    },

    onError: (e) => {
      const msg = e?.response?.data?.error || e?.message || "Failed to add comment";
      toast.error(msg);
    },
  });

  function send() {
    if (!canSend || isPending) return;
    mutate();
  }

  return (
    <div
      className="
        mt-2
        flex items-center gap-3
        rounded-2xl border border-slate-200 bg-white
        px-3 py-2
        shadow-[0_8px_20px_-18px_rgba(15,23,42,0.35)]
      "
    >
      {/* Input */}
      <div className="flex-1">
        <Input
          variant="underlined"
          labelPlacement="outside"
          placeholder="Write a comment..."
          type="text"
          value={commentvalue}
          onChange={(e) => setcommentvalue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          classNames={{
            inputWrapper: "shadow-none",
            input: "text-slate-900 placeholder:text-slate-400",
          }}
        />
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={send}
        disabled={!canSend || isPending}
        className={[
          "h-11 w-11 rounded-full grid place-items-center transition",
          "border",
          canSend && !isPending
            ? "bg-blue-700 border-blue-700 text-white hover:bg-blue-800"
            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
        ].join(" ")}
        aria-label="Send comment"
        title={canSend ? "Send" : "Write something first"}
      >
        <MdArrowCircleRight className="text-2xl" />
      </button>
    </div>
  );
}

export default Commentcreation;