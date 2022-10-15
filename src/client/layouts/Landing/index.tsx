import {
  AppShell,
  Group,
  Header,
  Text,
  createStyles,
  Container,
  Indicator,
  Button,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useAuthStore } from "~/client/store";

const HEADER_HEIGHT = 65;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
  curosrPointer: {
    cursor: "pointer",
  },
}));

type Props = {
  children: React.ReactNode;
};

function LandingLayout({ children }: Props) {
  const { classes } = useStyles();
  const router = useRouter();
  const authStore = useAuthStore();

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
              padding: 0,
              paddingRight: `0 !important`,
              paddingTop: `30px !important`,
        },
      })}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
          <Container className={classes.inner} fluid>
            <Group>
              <Indicator inline label="pre-alpha" offset={-4} size={12}>
                <Text
                  className={classes.curosrPointer}
                  onClick={() => router.push("/")}
                  weight="bold"
                  size="lg"
                >
                  Real Me
                </Text>
              </Indicator>
            </Group>
            {authStore.user ? (
              <Button
                onClick={() => router.push("/explore")}
                color="teal"
                radius="xl"
                sx={{ height: 30 }}
              >
                Back to Explore
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/auth")}
                color="teal"
                radius="xl"
                sx={{ height: 30 }}
              >
                Login
              </Button>
            )}
          </Container>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

export default LandingLayout;
