"use client";

import { create } from "zustand";
import type { DecodeTokenResponse } from "@/actions/authActions";
import { devtools } from "zustand/middleware";

export type UserService = DecodeTokenResponse;

type UserServicesState = {
  userServices: UserService[];
  setUserServices: (userServices: UserService[]) => void;
  clearUserServices: () => void;
};

export const useUserServicesStore = create<UserServicesState>()(
  devtools(
    (set) => ({
      userServices: [],
      setUserServices: (userServices) =>
        set({ userServices }, false, "userServices/set"),
      clearUserServices: () =>
        set({ userServices: [] }, false, "userServices/clear"),
    }),
    {
      name: "UserServicesStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
