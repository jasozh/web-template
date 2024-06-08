"use client";

import React, { ReactNode, createContext, useState } from "react";
import { useUserSession } from "@/utils/hooks";
import auth from "@/utils/firebase";
import { User } from "firebase/auth";

interface AuthContextValues {
  session: User | null;
}

interface AuthProviderProps {
  session: string | null;
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValues>({
  session: null,
});

const AuthProvider = ({ session, children }: AuthProviderProps) => {
  const userSession = useUserSession(auth, session);

  return (
    <AuthContext.Provider value={{ session: userSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
