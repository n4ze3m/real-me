import store from "zustand";

export type IUser = {
    id: string;
    name: string;
    email: string;
}


export type IAuthStore = {
    user: IUser | null;
}

export const useAuthStore = store<IAuthStore>((set) => ({
    user: null,
    setUser: (user: IUser) => set({ user }),
}))
