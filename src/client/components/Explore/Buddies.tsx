import {
  Container,
  Group,
  Paper,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "~/utils/trpc";
import { ExploreCard } from "../Common/ExploreCard";


export const Buddies = () => {
  const router = useRouter();

  const { data: buddies, status } = trpc.user.buddiesTimeline.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.error) {
        if (data.code === "UNAUTHORIZED") {
          router.push("/auth");
        }
      }
    },
  });

  if(status === "loading") {
    return <Text>Loading...</Text>
  }

  if(status === "error") {
    return <Text>Error</Text>
  }

  return (
    <div>
      {buddies.code === "LOADING" && <p>Loading...</p>}
      {buddies.code === "NO_BUDDIES" && (
        <Paper mt="md" p="xl">
          <Group position="center">
            <div>
              <Text size="lg">
                {"It's lonely here. Add some buddies to see their posts."}
              </Text>
            </div>
          </Group>
        </Paper>
      )}
      {buddies.code === "OK" && (
        <Container size={800} mt="md" p="0">
          {buddies && buddies.reals && buddies.reals.length === 0 && (
            <div>
              <Text size="lg" align="center" color="dimmed">
                No Reals from your buddies yet.
              </Text>
            </div>
          )}
          <SimpleGrid
            cols={2}
            spacing="md"
            breakpoints={[
              { maxWidth: 980, cols: 2, spacing: "md" },
              { maxWidth: 755, cols: 2, spacing: "sm" },
              { maxWidth: 600, cols: 1, spacing: "sm" },
            ]}
          >
            {buddies &&
              buddies.reals &&
              buddies.reals.map((real, index) => (
                <div key={index}>
                  <ExploreCard {...real} />
                </div>
              ))}
          </SimpleGrid>
        </Container>
      )}
    </div>
  );
};
