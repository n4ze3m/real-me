import { Paper, Text, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { Logout } from "tabler-icons-react";

export const SettingsBody = () => {
  const router = useRouter();
  return (
    <div>
      <Paper p="xl" mt="md">
        <Text color="dimmed">Are you sure you want to log out?</Text>
        <Button
          color="red"
          mt="md"
          leftIcon={<Logout />}
          onClick={() => router.push(`/api/auth/logout`)}
        >
          Log Out
        </Button>
      </Paper>
    </div>
  );
};
