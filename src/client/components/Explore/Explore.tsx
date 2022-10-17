import { Container, SimpleGrid, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "~/utils/trpc";
import { ExploreCard } from "../Common/ExploreCard";

export const Explore = () => {
  const router = useRouter();

  const { data: explore, status } = trpc.reals.exploreReals.useQuery();

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}

      {status === "success" && (
        <Container size={800} mt="md" p="0">
          {explore.reals.length === 0 && (
            <Text size="lg" align="center" color="dimmed">
              No global reals yet.
            </Text>
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
            {explore.reals.map((real, index) => (
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
