import { useQueryClient } from "@tanstack/react-query";
import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";

import React from "react";
import { useAuthStore } from "~/client/store";
import { trpc } from "~/utils/trpc";

type IAuthHandlerProps = {
  children: React.ReactNode;
};

export const AuthHandler = (props: IAuthHandlerProps) => {
  const authStore = useAuthStore();

  const _ = trpc.user.me.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) {
        authStore.setUser(data.user);
        authStore.setCourierHash(data.courierHash);
        authStore.setPendingNotification(data.hasPendingRequests);
      }
    },
    retry: 1,
  });

  return (
    <>
      <React.Fragment>
        {authStore.user ? (
          <>
            {/* @ts-ignore */}
            <CourierProvider
              userId={authStore?.user?.id}
              userSignature={authStore?.courierHash!}
              clientKey={process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY}
            >
              <Toast />
              {props.children}
            </CourierProvider>
          </>
        ) : (
          <> {props.children}</>
        )}
      </React.Fragment>
    </>
  );
};
