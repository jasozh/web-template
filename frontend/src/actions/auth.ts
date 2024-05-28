"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  SESSION_COOKIE_NAME,
} from "@/utils/constants";

export const createSession = async (value: string) => {
  cookies().set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    sameSite: "strict",
    path: "/",
  });
  redirect(HOME_ROUTE);
};

export const removeSession = async () => {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect(LOGIN_ROUTE);
};
