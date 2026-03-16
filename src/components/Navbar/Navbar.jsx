import React, { useContext, useMemo } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Tabs,
  Tab,
} from "@heroui/react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Contexttoken";

// React Icons (iOS-ish style)
import { FiHome, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Mynav() {
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
  const navigate = useNavigate();
  const location = useLocation();

  const { userToken, saveToken } = useContext(AuthContext);
  const isUserLogin = !!userToken;

  function handlelog() {
    saveToken(null);
    navigate("/login");
  }

  const isAuthPage = useMemo(() => {
    const p = location.pathname.toLowerCase();
    return p.includes("/login") || p.includes("/register");
  }, [location.pathname]);

  const selectedKey = useMemo(() => {
    const p = location.pathname.toLowerCase();

    if (p.startsWith("/profile")) return "profile";
    if (p.startsWith("/notifications")) return "notifications";
    return "home";
  }, [location.pathname]);

  const showOnlyLogo = !isUserLogin || isAuthPage;

  return (
    <Navbar
      maxWidth="xl"
      className="
        sticky top-0 z-50
        bg-white/85 backdrop-blur-xl
        border-b border-slate-200
        shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]
      "
    >
      {/* Brand */}
      <NavbarBrand className="gap-2">
        <div className="grid place-items-center w-10 h-10 rounded-2xl bg-blue-700 text-white shadow-sm">
          <AcmeLogo />
        </div>

        <NavLink
          to={isUserLogin ? "/home" : "/login"}
          className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg"
        >
          Route <span className="text-blue-700">Posts</span>
        </NavLink>
      </NavbarBrand>

     
      {showOnlyLogo ? null : (
        <>
          {/* Mobile toggle */}
          <NavbarContent className="sm:hidden" justify="end">
            <NavbarMenuToggle className="text-slate-800" />
          </NavbarContent>

          {/* Center: Tabs (Desktop) */}
          <NavbarContent className="hidden sm:flex" justify="center">
            <Tabs
              aria-label="Navigation Tabs"
              selectedKey={selectedKey}
              onSelectionChange={(key) => {
                if (key === "home") navigate("/home");
                if (key === "profile") navigate("/profile");
                 if (key === "Changepassword") navigate("/ChangePassord");

              }}
              variant="bordered"
              color="primary"
              classNames={{
                 base: "bg-white/70 rounded-2xl  border-slate-800 p-1 shadow-sm",
    tabList: "gap-1",
    tab: `
      h-10 px-5 rounded-xl
      transition-all duration-200
      text-slate-900
      data-[hover=true]:bg-blue-500
      data-[hover=true]:text-blue-700
      data-[selected=true]:text-blue-700
    `,
    tabContent: "font-semibold",
    cursor: "rounded-xl bg-blue-700 shadow-sm",
  
              }}
            >
              <Tab
                key="home"
                title={
                  <div className="flex items-center gap-2">
                    <FiHome className="text-lg" />
                    <span>Home</span>
                  </div>
                }
              />
              <Tab
                key="profile"
                title={
                  <div className="flex items-center gap-2">
                    <FiUser className="text-lg" />
                    <span>Profile</span>
                  </div>
                }
              />
            </Tabs>
          </NavbarContent>

          {/* Right: Avatar dropdown (Desktop) */}
          <NavbarContent as="div" justify="end" className="hidden sm:flex">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="outline-none">
                  <Avatar
                    isBordered
                    as="div"
                    className="transition-transform duration-200 hover:scale-[1.03] ring-2 ring-slate-200"
                    color="primary"
                    name="User"
                    size="sm"
                    src={userPhoto ||
                      "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                  />
                </button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="bg-white border border-slate-200 shadow-xl"
                itemClasses={{
                  base: "text-slate-800 data-[hover=true]:bg-slate-50 rounded-xl",
                }}
              >
                <DropdownItem key="profile" onClick={() => navigate("/profile")}>
                  Profile
                </DropdownItem>
                 <DropdownItem key="chagePassword" onClick={() => navigate("/ChangePassword")}>
                  change password
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handlelog}
                  className="text-rose-600 data-[hover=true]:bg-rose-50"
                  startContent={<FiLogOut />}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>

          {/* Mobile menu */}
          <NavbarMenu className="bg-white border-t border-slate-200">
            <NavbarMenuItem>
              <button
                onClick={() => navigate("/home")}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-2"
              >
                <FiHome /> Home
              </button>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <button
                onClick={() => navigate("/notifications")}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-2"
              >
                <FiBell /> Notifications
              </button>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-2"
              >
                <FiUser /> Profile
              </button>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <button
                onClick={handlelog}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
              >
                <FiLogOut /> Log Out
              </button>
            </NavbarMenuItem>
          </NavbarMenu>
        </>
      )}
    </Navbar>
  );
}