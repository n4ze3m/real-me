import { Group, Text, Button, Center } from "@mantine/core";
import { useRouter } from "next/router";

export const ErrorState = () => {
  const router = useRouter()
  return (
    <Group p="xl" mt="md" position="center">
      <div>
        <Text>
          To use Real Me, you need to have at least 2 cameras available on your
          device.
        </Text>
        <Center>
          <Button 
          onClick={() => router.push("/explore")}
          color="teal" mt="md">
            Go back
          </Button>
        </Center>
      </div>
    </Group>
  );
};
