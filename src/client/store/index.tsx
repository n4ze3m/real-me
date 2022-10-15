import { Prisma } from "@prisma/client";
import store from "zustand";

export type IAuthStore = {
  user: Prisma.UserCreateInput | null;
  setUser: (user: Prisma.UserCreateInput) => void;
};

export const useAuthStore = store<IAuthStore>((set) => ({
  user: null,
  setUser: (user: Prisma.UserCreateInput) => set({ user }),
}));
