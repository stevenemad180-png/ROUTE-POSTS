import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const registerschema = zod
  .object({
    name: zod
      .string()
      .nonempty("enter name")
      .min(3, "user name at least 3")
      .max(20, "user name at max 20"),
    email: zod.string().email("email is not in format"),
    password: zod.string(),
    rePassword: zod.string(),
    gender: zod.enum(["male", "female"], { message: "choose gender" }),
    dateOfBirth: zod
      .string()
      .nonempty("choose birth date")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), "invalid date")
      .refine((v) => {
        const d = new Date(v);
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
        return age >= 18;
      }, "you must be at least 18"),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    path: ["rePassword"],
    message: "your password not match",
  });

function Register() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "",
      dateOfBirth: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(registerschema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  async function handleRegister(values) {
    setLoading(true);

    try {
      await axios.post("https://route-posts.routemisr.com/users/signup", values);

      toast.success("Account created successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error?.response?.data?.error || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const errClass = "mt-1.5 text-xs text-rose-200/90";

  const fieldWrap =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 transition " +
    "focus-within:border-white/20 focus-within:bg-white/7";

  const inputBase =
    "w-full bg-transparent text-white placeholder-white/35 outline-none text-sm";

  const labelBase =
    "text-[11px] tracking-wide text-white/60 mb-1 flex items-center gap-2";

  const Icon = ({ children }) => (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white/80">
      {children}
    </span>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* background */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.05),transparent_40%)]" />

        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">
            {/* LEFT PANEL */}
            <div className="hidden lg:block rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="p-10 h-full flex flex-col justify-between relative">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/15 blur-2xl" />

                <div>
                  {/* HERO TEXT like the image */}
                  <h1 className="text-5xl font-extrabold text-white tracking-tight">
                    Route <span className="text-cyan-200">Posts</span>
                  </h1>
                  <p className="mt-3 text-white/70 text-base max-w-md">
                    Connect with friends and the world around you on Route Posts.
                  </p>

                  {/* ABOUT CARD like the image */}
                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <p className="text-[12px] tracking-[0.2em] text-white/70 font-semibold">
                      ABOUT ROUTE ACADEMY
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      Egypt&apos;s Leading IT Training Center Since 2012
                    </h3>

                    <p className="mt-3 text-sm text-white/60 leading-relaxed">
                      Route Academy is one of Egypt’s leading IT training centers, established in 2012.
                      We focus on building real-world skills in programming, web development, and application development.
                      Our approach blends structured learning with hands-on projects to help you learn faster and build stronger.
                    </p>

                    {/* STATS like the image */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        { n: "2012", t: "FOUNDED" },
                        { n: "40K+", t: "GRADUATES" },
                        { n: "50+", t: "PARTNER COMPANIES" },
                        { n: "5", t: "BRANCHES" },
                        { n: "20", t: "DIPLOMAS AVAILABLE" },
                      ].map((x, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <p className="text-white font-bold">{x.n}</p>
                          <p className="text-[10px] tracking-wide text-white/60 font-semibold">
                            {x.t}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/50 text-xs">
                    Join now and start sharing your moments.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT FORM CARD */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300" />

              <div className="p-7 sm:p-9">
                {/* Tabs like the image */}
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                  <Link
                    to="/login"
                    className="text-center py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
                  >
                    Login
                  </Link>
                  <span className="text-center py-2 rounded-xl text-sm font-semibold bg-white text-slate-950">
                    Register
                  </span>
                </div>

                <div className="mt-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Create your Route Posts account
                  </h1>
                  <p className="text-sm text-white/60 mt-1">
                    Sign up and start your social journey.
                  </p>
                </div>

                <form onSubmit={handleSubmit(handleRegister)} className="mt-7 space-y-4">
                  <div className={fieldWrap}>
                    <div className={labelBase}>
                      <Icon>*</Icon> <span>FULL NAME</span>
                    </div>
                    <input
                      type="text"
                      {...register("name")}
                      id="name"
                      className={inputBase}
                      placeholder="Full name..."
                    />
                    {errors.name && <p className={errClass}>{errors.name.message}</p>}
                  </div>

                  <div className={fieldWrap}>
                    <div className={labelBase}>
                      <Icon>@</Icon> <span>EMAIL</span>
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      id="email"
                      className={inputBase}
                      placeholder="Email..."
                    />
                    {errors.email && <p className={errClass}>{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={fieldWrap}>
                      <div className={labelBase}>
                        <Icon>#</Icon> <span>PASSWORD</span>
                      </div>
                      <input
                        type="password"
                        {...register("password")}
                        id="password"
                        className={inputBase}
                        placeholder="Password"
                      />
                      {errors.password && <p className={errClass}>{errors.password.message}</p>}
                    </div>

                    <div className={fieldWrap}>
                      <div className={labelBase}>
                        <Icon>+</Icon> <span>CONFIRM</span>
                      </div>
                      <input
                        type="password"
                        {...register("rePassword")}
                        id="repassword"
                        className={inputBase}
                        placeholder="Confirm password"
                      />
                      {errors.rePassword && <p className={errClass}>{errors.rePassword.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={fieldWrap}>
                      <div className={labelBase}>
                        <Icon>=</Icon> <span>GENDER</span>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                          <input
                            type="radio"
                            {...register("gender")}
                            value="male"
                            className="accent-cyan-300"
                          />
                          Male
                        </label>
                        <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                          <input
                            type="radio"
                            {...register("gender")}
                            value="female"
                            className="accent-cyan-300"
                          />
                          Female
                        </label>
                      </div>
                      {errors.gender && <p className={errClass}>{errors.gender.message}</p>}
                    </div>

                    <div className={fieldWrap}>
                      <div className={labelBase}>
                        <Icon>^</Icon> <span>DATE OF BIRTH</span>
                      </div>
                      <input
                        type="date"
                        {...register("dateOfBirth")}
                        id="dateOfBirth"
                        className={
                          "w-full bg-transparent text-white outline-none text-sm " +
                          "[color-scheme:dark]"
                        }
                      />
                      {errors.dateOfBirth && (
                        <p className={errClass}>{errors.dateOfBirth.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full rounded-2xl py-3 font-semibold text-slate-950
                    bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300
                    hover:brightness-110 active:brightness-95 transition
                    shadow-lg shadow-cyan-400/10 disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Oval
                        height={20}
                        width={20}
                        color="#0f172a"
                        secondaryColor="#0f172a"
                        strokeWidth={5}
                        strokeWidthSecondary={5}
                        ariaLabel="loading"
                        visible={true}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <p className="text-center text-xs text-white/50 pt-2">
                    By continuing, you agree to our Terms & Privacy.
                  </p>

                  <p className="text-center text-sm text-white/70">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-200 hover:text-cyan-100 underline underline-offset-4">
                      Log in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;