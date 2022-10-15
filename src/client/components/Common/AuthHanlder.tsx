import { useQueryClient } from "@tanstack/react-query";
import React from "react";

type IAuthHandlerProps = {
  children: React.ReactNode;
};

export const AuthHandler = ({ children }: IAuthHandlerProps) => {
  const queryClient = useQueryClient();
  

  return <React.Fragment>{children}</React.Fragment>;
};
