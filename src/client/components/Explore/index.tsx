import React from "react";
import { Tabs } from "@mantine/core";
import { Friends, Planet } from "tabler-icons-react";
import { Buddies } from "./Buddies";
export const ExploreBody = () => {
  return (
    <Tabs mt="md" color="green" variant="outline" defaultValue="friends">
      <Tabs.List grow>
        <Tabs.Tab value="friends" icon={<Friends size={14} />}>
          Buddies
        </Tabs.Tab>
        <Tabs.Tab value="explore" icon={<Planet size={14} />}>
          Explore
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="friends" pt="xs">
        <Buddies />
      </Tabs.Panel>

      <Tabs.Panel value="explore" pt="xs">
        explore tab content
      </Tabs.Panel>
    </Tabs>
  );
};
