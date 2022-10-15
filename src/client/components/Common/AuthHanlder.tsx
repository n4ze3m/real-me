import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAuthStore } from "~/client/store";
import { trpc } from "~/utils/trpc";

type IAuthHandlerProps = {
  children: React.ReactNode;
  callUser?: boolean;
};

export const AuthHandler = ({ children }: IAuthHandlerProps) => {
  const authStore = useAuthStore();

  const _ = trpc.user.me.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) {
        authStore.setUser(data);
      }
    },
    retry: 1,
  });

  return <React.Fragment>{children}</React.Fragment>;
};
