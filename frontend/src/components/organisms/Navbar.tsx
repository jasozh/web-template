import React from "react";
import { Appbar, Toast } from "@/components";
import { useSignOut } from "react-firebase-hooks/auth";
import auth from "@/utils/firebase";
import { useToast } from "@/utils/hooks";

const Navbar = () => {
  /** Handles user sign out */
  const handleSignOut = async () => {
    await signOut();
  };

  /** Firebase hooks */
  const [signOut, loading, error] = useSignOut(auth);

  /** Toast visibility hooks */
  const { open, closeToast } = useToast(error);

  const navs = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Profile", link: "/users/asdf" },
  ];
  const actions = [{ label: "Log Out", onClick: handleSignOut }];

  return (
    <div>
      <Toast open={open} onClose={closeToast}>
        {error?.message}
      </Toast>
      <Appbar navs={navs} actions={actions} />
    </div>
  );
};

export default Navbar;
