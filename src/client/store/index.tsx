import { Prisma } from "@prisma/client";
import store from "zustand";

export type IAuthStore = {
  user: Prisma.UserCreateInput | null;
  setUser: (user: Prisma.UserCreateInput) => void;
  courierHash: string | null;
  setCourierHash: (courierHash: string) => void;
  pendingNotification: boolean;
  setPendingNotification: (pendingNotification: boolean) => void;
};

export const useAuthStore = store<IAuthStore>((set) => ({
  user: null,
  setUser: (user: Prisma.UserCreateInput) => set({ user }),
  courierHash: null,
  setCourierHash: (courierHash: string) => set({ courierHash }),
  pendingNotification: false,
  setPendingNotification: (pendingNotification: boolean) => set({ pendingNotification }),
}));
