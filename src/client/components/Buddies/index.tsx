import { Container, Skeleton, Tabs } from "@mantine/core";
import { Friends, UserPlus } from "tabler-icons-react";
import { trpc } from "~/utils/trpc";
import { BuddieCard } from "./BuddieCard";

export const BuddiesBody = () => {
  const { status, data } = trpc.user.buddies.useQuery();

  if (status === "loading") {
    return <Skeleton height={300} />;
  }

  if (status === "error") {
    return <div> error </div>;
  }

  return (
    <div>
      <Tabs mt="md" color="green" variant="outline" defaultValue="pending">
        <Tabs.List grow>
          <Tabs.Tab value="pending" icon={<UserPlus size={14} />}>
            Explore
          </Tabs.Tab>
          <Tabs.Tab value="friends" icon={<Friends size={14} />}>
            Buddies
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="xs">
          <Container size={450} mt="md">
            {data.buddies.pending.map((buddy) => (
              <BuddieCard user={buddy.follower} isPending={true} />
            ))}
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="friends" pt="xs">
          s
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
