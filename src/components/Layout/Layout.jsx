import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />

    <section className="py-12 sm:pt-16 lg:pt-20 bg-slate-50 border-t border-slate-200">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white grid place-items-center font-black shadow-sm">
                RP
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Route <span className="text-blue-700">Posts</span>
                </p>
                <p className="text-xs text-slate-500">Social app • React + API</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 mt-6 max-w-md">
              Share posts, explore feeds, and connect with people. Built with React, React Query, and
              JWT authentication.
            </p>

            {/* Social */}
            <ul className="flex items-center space-x-3 mt-7">
              {[
                { label: "Twitter", href: "#", icon: "𝕏" },
                { label: "Facebook", href: "#", icon: "f" },
                { label: "Instagram", href: "#", icon: "◎" },
                { label: "GitHub", href: "#", icon: "</>" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    title={s.label}
                    className="
                      flex items-center justify-center
                      text-slate-700 transition-all duration-200
                      bg-white border border-slate-200
                      rounded-full w-9 h-9
                      hover:bg-blue-700 hover:text-white hover:border-blue-700
                      focus:bg-blue-700 focus:text-white focus:border-blue-700
                      shadow-sm
                    "
                  >
                    <span className="text-sm font-bold">{s.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Product
            </p>
            <ul className="mt-5 space-y-3">
              {["Home", "Feed", "Profile", "Create Post"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="flex text-sm text-slate-700 transition hover:text-blue-700"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Company
            </p>
            <ul className="mt-5 space-y-3">
              {["About Route Posts", "Roadmap", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="flex text-sm text-slate-700 transition hover:text-blue-700"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Stay in the loop
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Get product updates and new features announcements.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>

              <div className="flex gap-2">
                <input
                  type="email"
                  id="footer-email"
                  placeholder="Enter your email"
                  className="
                    w-full px-4 py-3 text-sm
                    bg-white border border-slate-200 rounded-xl
                    placeholder-slate-400 text-slate-900
                    focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                  "
                />

                <button
                  type="submit"
                  className="
                    px-5 py-3 rounded-xl text-sm font-semibold
                    bg-blue-700 text-white
                    hover:bg-blue-800 transition
                    shadow-sm
                    focus:outline-none focus:ring-4 focus:ring-blue-600/20
                  "
                >
                  Subscribe
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        <hr className="mt-12 mb-7 border-slate-200" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Route Posts — All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built by <span className="font-semibold text-slate-700">Steven Emad</span>
          </p>
        </div>
      </div>
    </section>
  );


    </>
  )
}

export default Layout
