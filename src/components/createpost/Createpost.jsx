/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import {
  Avatar,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Spinner,
} from "@heroui/react";
import { MdClear, MdOutlineAddPhotoAlternate } from "react-icons/md";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RxShare2 } from "react-icons/rx";
export default function Createpost() {
  function getdataprofile() {
  return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
    headers: { token: localStorage.getItem("tkn") }
  });
}

const { data } = useQuery({
  queryKey: ["getprofile"],
  queryFn: getdataprofile,
});
  const userPhoto = data?.data?.data?.user?.photo;
  const imginput = useRef(null);
  const textinput = useRef(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imgpreview, setimgpreview] = useState(null);

  const qc = useQueryClient();

  function Hanldecreatepost() {
    const postdata = new FormData();

    const body = textinput.current?.value?.trim();
    if (body) postdata.append("body", body);

    const file = imginput.current?.files?.[0];
    if (file) postdata.append("image", file);

    return axios.post(`https://route-posts.routemisr.com/posts`, postdata, {
      headers: { token: localStorage.getItem("tkn") },
    });
  }

  function Handleclearimge() {
    if (imgpreview) URL.revokeObjectURL(imgpreview);
    setimgpreview(null);
    if (imginput.current) imginput.current.value = "";
  }

  function resetAll() {
    Handleclearimge();
    if (textinput.current) textinput.current.value = "";
  }

  const { isPending, mutate } = useMutation({
    mutationFn: Hanldecreatepost,

    onMutate: () => {
      toast.loading("Posting...", { toastId: "createPost" });
    },

    onSuccess: () => {
      toast.update("createPost", {
        render: "Post created successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });

      // close modal
      onOpenChange(false);

      // reset
      resetAll();

      // refetch
      qc.invalidateQueries({ queryKey: ["getPosts"] });
    },

    onError: (e) => {
      toast.update("createPost", {
        render: e?.response?.data?.error || e?.message || "Failed to create post",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
      });
    },
  });

  function Handlechangeimg(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imgpreview) URL.revokeObjectURL(imgpreview);
    setimgpreview(URL.createObjectURL(file));
  }

  return (
    <>
      <div
        className="
          bg-white rounded-[26px] border border-slate-200
          shadow-[0_10px_30px_-20px_rgba(15,23,42,0.22)]
          px-4 py-4
        "
      >
        <div className="flex items-center gap-3">
          <Avatar
            isBordered
            color="default"
            className="shrink-0"
            src={userPhoto}
          />

          <div className="flex-1">
            <button
              type="button"
              onClick={onOpen}
              className="
                w-full text-left
                px-4 py-3 rounded-full
                bg-slate-100 hover:bg-slate-200
                text-slate-600
                transition
              "
            >
              What&apos;s on your mind?
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-slate-200" />

        {/* Action row */}
        <div className="flex items-center justify-between gap-3">
          <label
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              hover:bg-slate-100 transition
              cursor-pointer text-slate-700 font-semibold text-sm
            "
            onClick={onOpen} // open modal when click
          >
            <MdOutlineAddPhotoAlternate className="text-blue-700 text-xl" />
            Photo
          </label>

          <Button
            color="primary"
            className="font-semibold rounded-xl"
            onPress={onOpen}
            startContent={<RxShare2 />}
          >
            Create Post
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            // keep text? you can resetAll() if you prefer
            // resetAll();
          }
          onOpenChange(open);
        }}
        size="lg"
        backdrop="blur"
      >
        <ModalContent>
          {(modalOnClose) => (
            <>
              <ModalHeader className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-slate-900 font-extrabold">Create post</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Share something with your friends
                  </p>
                </div>


              </ModalHeader>

              <ModalBody className="gap-4">
                {/* user row */}
                <div className="flex items-center gap-3">
                  <Avatar
                    isBordered
                    color="default"
                    className="shrink-0"
                    src={userPhoto}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 leading-5">You</p>
                    <p className="text-xs text-slate-500">Public</p>
                  </div>
                </div>

                {/* textarea */}
                <textarea
                  ref={textinput}
                  placeholder="What do you want to talk about?"
                  rows={4}
                  className="
                    w-full rounded-2xl border border-slate-200 bg-white
                    px-4 py-3 text-slate-900 placeholder-slate-400
                    outline-none
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                  "
                />

                {/* image preview */}
                {imgpreview && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-700">Image preview</p>
                      <button
                        type="button"
                        onClick={Handleclearimge}
                        className="h-9 w-9 rounded-xl hover:bg-white grid place-items-center text-slate-600"
                        title="Remove image"
                      >
                        <MdClear className="text-xl" />
                      </button>
                    </div>

                    <Image
                      alt="preview"
                      src={imgpreview}
                      className="rounded-2xl max-h-[420px] object-cover"
                      width="100%"
                    />
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="flex items-center justify-between gap-3">
                {/* Upload */}
                <label
                  className="
                    flex items-center gap-2
                    px-4 py-2 rounded-xl
                    border border-slate-200 bg-white
                    hover:bg-slate-50 transition
                    cursor-pointer text-slate-700 font-semibold text-sm
                  "
                >
                  <input
                    type="file"
                    ref={imginput}
                    hidden
                    accept="image/*"
                    onChange={Handlechangeimg}
                  />
                  <MdOutlineAddPhotoAlternate className="text-blue-700 text-xl" />
                  Add photo
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={() => {
                      if (!isPending) {
                        resetAll();
                        modalOnClose();
                      }
                    }}
                    className="rounded-xl"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    onPress={mutate}
                    disabled={isPending}
                    className="rounded-xl font-semibold"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" color="white" />
                        Posting...
                      </div>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}