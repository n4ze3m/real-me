import { Group, Text, Button, Center } from "@mantine/core";

export const ErrorState = () => {
  return (
    <Group p="xl" mt="md" position="center">
      <div>
        <Text>
          To use Real Me, you need to have at least 2 cameras available on your
          device.
        </Text>
        <Center>
          <Button color="teal" mt="md">
            Go back
          </Button>
        </Center>
      </div>
    </Group>
  );
};
