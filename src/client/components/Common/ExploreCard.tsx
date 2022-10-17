import { Avatar, Card, Group, Text } from "@mantine/core";
import { Real, RealInfo, User } from "@prisma/client";
import { RealImage } from "./RealImage";

export const ExploreCard = (
  real: Real & {
    author: User;
    realInfo: RealInfo;
  },
  isProfile?: boolean
) => {
  return (
    <Card withBorder shadow="sm" mb="md" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Group>
            <Avatar
              src={`https://avatars.dicebear.com/api/jdenticon/${real.author.id}.svg?background=%230000ff`}
              radius="xl"
              size={30}
              mr="sm"
            />
            <div>
              <Text color="dimmed">
                {`@${real.author.username}`}
              </Text>
            </div>
          </Group>
        </Group>
      </Card.Section>
      <Card.Section>
        <RealImage
          picture1={`https://xlhrytnztcpfrysksost.supabase.co/storage/v1/object/public/reals/${real.picOne}`}
          picture2={`https://xlhrytnztcpfrysksost.supabase.co/storage/v1/object/public/reals/${real.picTwo}`}
        />
      </Card.Section>
    </Card>
  );
};
