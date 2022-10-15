import "../../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "~/utils/trpc";
import { MantineProvider } from "@mantine/core";
import { CookiesProvider } from "react-cookie";
import { NotificationsProvider } from "@mantine/notifications";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <CookiesProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          fontFamily: "Poppins",
        }}
      >
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </CookiesProvider>
  );
};
export default trpc.withTRPC(MyApp,)
