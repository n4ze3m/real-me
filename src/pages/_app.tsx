import "../../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "~/utils/trpc";
import { MantineProvider } from "@mantine/core";
import { CookiesProvider } from "react-cookie";
import { NotificationsProvider } from "@mantine/notifications";
import { AuthHandler } from "~/client/components/Common/AuthHanlder";

// update AppType propTypes by adding callUser

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <CookiesProvider>
      <AuthHandler>
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
      </AuthHandler>
    </CookiesProvider>
  );
};
export default trpc.withTRPC(MyApp);
