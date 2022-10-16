import {
  AppShell,
  Group,
  Header,
  MediaQuery,
  Text,
  createStyles,
  Container,
  Avatar,
  Indicator,
  UnstyledButton,
} from "@mantine/core";
import { Inbox } from "@trycourier/react-inbox";

import { useRouter } from "next/router";
import React from "react";
import { ChevronRight, Friends } from "tabler-icons-react";
import { useAuthStore } from "~/client/store";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  userMenu: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tabControl: {
    fontWeight: 500,
    height: 38,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
  },

  tabControlActive: {
    borderColor: `${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    } !important`,
  },
}));

type Props = {
  children: React.ReactNode;
};

function ExploreLayout({ children }: Props) {
  const { user, pendingNotification } = useAuthStore();

  const router = useRouter();
  const { classes } = useStyles();

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={
        <Header height={70} p="md">
          <Container className={classes.mainSection}>
            <Group position="apart">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Indicator inline label="pre-alpha" offset={-4} size={12}>
                  <Text size="lg" onClick={() => router.push("/explore")}>
                    Real Me
                  </Text>
                </Indicator>
              </div>
              <Group position="right">
                {user && (
                  <>
                    <UnstyledButton
                      onClick={() => router.push("/explore/buddies")}
                    >
                      <Indicator color="teal" disabled={pendingNotification}>
                        <Friends />
                      </Indicator>
                    </UnstyledButton>
                    <Inbox />
                  </>
                )}
                <Group spacing={7}>
                  <Avatar
                    src={
                      user
                        ? `https://avatars.dicebear.com/api/jdenticon/${user?.id}.svg?background=%230000ff`
                        : "https://avatars.dicebear.com/api/jdenticon/xdsds-sdsdsds-dsdsds.svg?background=%230000ff"
                    }
                    radius="xl"
                    size={30}
                    mr="sm"
                  />
                  <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                    <div>
                      <Text>{user ? user.name : "..."}</Text>
                      <Text size="sm" color="dimmed">
                        {user && `@${user.username}`}
                      </Text>
                    </div>
                  </MediaQuery>
                  <ChevronRight size={12} />
                </Group>
              </Group>
            </Group>
          </Container>
        </Header>
      }
    >
      <Container>{children}</Container>
    </AppShell>
  );
}

export default ExploreLayout;
