import { Button, Center, Group, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "~/utils/trpc";

type BuddiesState = "OK" | "UNAUTHORIZED" | "NO_BUDDIES" | "LOADING";

export const Buddies = () => {
  const router = useRouter();
  const [buddiesState, setBuddiesState] =
    React.useState<BuddiesState>("LOADING");

  const { data: buddies, status } = trpc.user.buddiesTimeline.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        if (data.error) {
          if (data.code === "UNAUTHORIZED") {
            router.push("/auth");
          }
        } else {
          if (data.code === "NO_BUDDIES") {
            setBuddiesState("NO_BUDDIES");
          } else {
            setBuddiesState("OK");
          }
        }
      },
    }
  );

  return (
    <div>
      {buddiesState === "LOADING" && <p>Loading...</p>}
      {buddiesState === "NO_BUDDIES" && (
        <Paper mt="md" p="xl">
          <Group position="center">
            <div>
              <Text size="lg">
                It's lonely here. Add some buddies to see their posts. Start
                posting reals to get
              </Text>
              <Center>
                <Button
                  mt="md"
                  color="teal"
                  onClick={() => router.push("/post")}
                >
                  Post a real
                </Button>
              </Center>
            </div>
          </Group>
        </Paper>
      )}
    </div>
  );
};
