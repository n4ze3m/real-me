import { Paper, Text, Button, Group } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { useAuthStore } from "~/client/store";

export const RealInfo = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  return (
    <React.Fragment>
      <Paper mb="md" p="xl" hidden={authStore.userPosted}>
        <Text size="lg" align="center" color="dimmed">
          Hey, Don't forget to post a real today!
        </Text>
        <Group my="md" position="center">
          <Button
            color="teal"
            onClick={() => router.push(authStore?.realPath || "/reals/post")}
          >
            Post a real
          </Button>
        </Group>
      </Paper>
    </React.Fragment>
  );
};
