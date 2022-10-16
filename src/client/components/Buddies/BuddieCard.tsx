import {
  Avatar,
  createStyles,
  Group,
  Paper,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { User } from "@prisma/client";
import { Plus, X } from "tabler-icons-react";
import { trpc } from "~/utils/trpc";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));
export const BuddieCard = ({
  user,
  isPending,
}: {
  user: User;

  isPending: boolean;
}) => {
  const client = trpc.useContext();

  const { mutate: addBuddy } = trpc.user.acceptBuddy.useMutation({
    onSuccess: () => {
      client.user.buddies.invalidate();
    },
  });
  return (
    <Paper mb="md" withBorder p="xl">
      <Group position="apart">
        <Group>
          <Avatar
            src={`https://avatars.dicebear.com/api/jdenticon/${user?.id}.svg?background=%230000ff`}
            radius="xl"
            size={30}
            mr="sm"
          />
          <div>
            <Text>{user.name}</Text>
            <Text size="sm" color="dimmed">
              {`@${user.username}`}
            </Text>
          </div>
        </Group>
        <Group>
          {/* <UnstyledButton>
            <ThemeIcon color="red">
              <X />
            </ThemeIcon>
          </UnstyledButton> */}
          {isPending && (
            <UnstyledButton
              onClick={() =>
                addBuddy({
                  followingId: user.id,
                })
              }
            >
              <ThemeIcon color="green">
                <Plus />
              </ThemeIcon>
            </UnstyledButton>
          )}
        </Group>
      </Group>
    </Paper>
  );
};
