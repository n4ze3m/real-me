import {
  Avatar,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Skeleton,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { Lock } from "tabler-icons-react";
import { trpc } from "~/utils/trpc";

type UserErrorState = "NOT_FOUND" | "OK" | "LOADING";

export const UserBody = () => {
  const router = useRouter();
  const [userError, setUserError] = React.useState<UserErrorState>("OK");

  const { data, status } = trpc.user.findUserByUsername.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
      onSuccess: (data) => {
        if (data.error) {
          setUserError("NOT_FOUND");
        } else {
          setUserError("OK");
        }
      },
    }
  );

  const button = (state: string) => {
    switch (state) {
      case "SAME_USER":
        return (
          <Button size="sm" color="teal" variant="outline">
            Edit Profile
          </Button>
        );

      case "FOLLOWING":
        return (
          <Button size="sm" color="teal">
            Following
          </Button>
        );
      case "NOT_FOLLOWING":
        return (
          <Button size="sm" variant="outline" color="teal">
            Follow
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            color="teal"
            variant="outline"
            onClick={() => router.push("/auth")}
          >
            Follow
          </Button>
        );
    }
  };

  const reals = (state: string) => {
    if (state === "SAME_USER" && data?.user?.realsCount === 0) {
      return (
        <Group position="center" mt="md">
          <div>
            <Text align="center" size="xl" color="dimmed">
              Hmm, Post a real to get started!
            </Text>
            <Center>
              <Button
                color="teal"
                mt="md"
                onClick={() => router.push("/explore")}
              >
                Post a Real
              </Button>
            </Center>
          </div>
        </Group>
      );
    }

    if (data?.user?.realsCount === 0) {
      return (
        <Group position="center" mt="md">
          <div>
            <Text align="center" size="xl" color="dimmed">
              Nothing to see here!
            </Text>
          </div>
        </Group>
      );
    }

    return <div>data</div>;
  };

  if (status === "loading") {
    return <Skeleton />;
  }

  if (status === "error") {
    return <Text>Error</Text>;
  }

  return (
    <>
      {userError === "NOT_FOUND" && (
        <Group position="center" mt="md">
          <div>
            <Text align="center" size="xl" color="dimmed">
              I'm sorry, but we couldn't find that user. Please try again
            </Text>
            <Center>
              <Button
                color="teal"
                mt="md"
                onClick={() => router.push("/explore")}
              >
                Go Home
              </Button>
            </Center>
          </div>
        </Group>
      )}
      {userError === "OK" && (
        <div>
          <Group position="center" mt="md">
            <Group>
              <Avatar
                src={`https://avatars.dicebear.com/api/jdenticon/${data?.user?.id}.svg?background=%230000ff`}
                radius="xl"
                size="lg"
              />
              <div style={{ flex: 1 }}>
                <Text size="xl" weight={500}>
                  {data?.user?.name}
                </Text>
                <Text color="dimmed" size="md">
                  @{data?.user?.username}
                </Text>
              </div>
              <div>{button(data?.code)}</div>
            </Group>
          </Group>
          <Divider my="md" />
          {data.user?.showReal ? (
            reals(data?.code)
          ) : (
            <Paper mt="md" p="xl">
              <Group position="center">
                <div>
                  <Center>
                    <Lock size={32} />
                  </Center>
                  <Text mt="md" align="center">
                    Start following this {data?.user?.username} to see their
                    reals
                  </Text>
                </div>
              </Group>
            </Paper>
          )}
        </div>
      )}
      {userError === "LOADING" && <Skeleton />}
    </>
  );
};
