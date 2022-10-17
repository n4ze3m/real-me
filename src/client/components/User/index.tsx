import {
  Avatar,
  Button,
  Center,
  createStyles,
  Divider,
  Group,
  Modal,
  Paper,
  Skeleton,
  Text,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Real } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { Lock, Trash } from "tabler-icons-react";
import { trpc } from "~/utils/trpc";
import { RealImage } from "../Common/RealImage";

type UserErrorState = "NOT_FOUND" | "OK" | "LOADING";
const useStyles = createStyles((theme) => ({
  outside: {
    opacity: 0,
  },

  weekend: {
    color: `${theme.colors.white} !important`,
  },
}));

export const UserBody = () => {
  const router = useRouter();
  const [userError, setUserError] = React.useState<UserErrorState>("OK");
  const client = trpc.useContext();
  const { classes, cx } = useStyles();
  const { width } = useViewportSize();
  const { data, status } = trpc.user.findUserByUsername.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
      onSuccess: (data) => {
        if (data.error) {
          setUserError("NOT_FOUND");
        } else {
          setUserError("OK");
        }
      },
    }
  );

  const { mutate: followUser } = trpc.user.followOrUnfollowBuddy.useMutation({
    onSuccess: () => {
      client.user.findUserByUsername.refetch({
        username: router.query.username as string,
      });

      showNotification({
        title: "Success",
        message: "Followed user",
      });
    },
  });

  const button = (state: string) => {
    switch (state) {
      case "SAME_USER":
        return (
          <Button size="sm" color="teal" variant="outline">
            Edit Profile
          </Button>
        );

      case "FOLLOWING":
        return (
          <Button
            size="sm"
            color="teal"
            onClick={() => followUser({ followingId: data?.user?.id || "" })}
          >
            Following
          </Button>
        );
      case "NOT_FOLLOWING":
        return (
          <Button
            size="sm"
            variant="outline"
            color="teal"
            onClick={() => followUser({ followingId: data?.user?.id || "" })}
          >
            Follow
          </Button>
        );
      case "REQUESTED":
        return (
          <Button
            variant="outline"
            size="sm"
            color="teal"
            onClick={() => followUser({ followingId: data?.user?.id || "" })}
          >
            Requested
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            color="teal"
            variant="outline"
            onClick={() => router.push("/auth")}
          >
            Follow
          </Button>
        );
    }
  };
  const [opened, setOpened] = React.useState(false);

  const { mutate: deleteReal, isLoading: deleteRealLoading } =
    trpc.reals.deleteReal.useMutation({
      onSuccess: () => {
        client.user.findUserByUsername.refetch({
          username: router.query.username as string,
        });

        setOpened(false);

        showNotification({
          title: "Success",
          color: "red",
          message: "Deleted real",
        });
      },
    });

  const [real, setReal] = React.useState<Real | null>();

  const reals = (state: string) => {
    if (state === "SAME_USER") {
      return (
        <Group position="center" mt="md">
          <Modal
            title={`${moment(real?.createdAt).format("MMMM Do YYYY")}`}
            opened={opened}
            onClose={() => setOpened(false)}
          >
            {real && (
              <React.Fragment>
                <RealImage
                  picture1={`https://xlhrytnztcpfrysksost.supabase.co/storage/v1/object/public/reals/${real.picOne}`}
                  picture2={`https://xlhrytnztcpfrysksost.supabase.co/storage/v1/object/public/reals/${real.picTwo}`}
                />
                <Button
                  loading={deleteRealLoading}
                  onClick={() =>
                    deleteReal({
                      id: real.id,
                    })
                  }
                  fullWidth
                  leftIcon={<Trash />}
                  color="red"
                >
                  Delete Real
                </Button>
              </React.Fragment>
            )}
          </Modal>
          <Calendar
            size={width > 600 ? "xl" : "md"}
            value={new Date()}
            dayClassName={(date, modifiers) =>
              cx({
                [classes.outside]: modifiers.outside,
                [classes.weekend]: modifiers.weekend,
              })
            }
            disableOutsideEvents
            styles={(theme) => ({
              day: {
                borderRadius: 0,
                height: 70,
                fontSize: theme.fontSizes.lg,
              },
              weekday: { fontSize: theme.fontSizes.lg },
            })}
            onChange={(date) => {
              if (date) {
                const fullDate = date.toISOString();

                let realDate = data?.user?.reals?.filter((real) => {
                  return (
                    moment(real.createdAt).format("YYYY-MM-DD") ===
                    moment(fullDate).format("YYYY-MM-DD")
                  );
                });

                if (realDate && realDate.length > 0) {
                  setReal(realDate[0]);
                  setOpened(true);
                }
              }
            }}
            renderDay={(day) => {
              const date = day.getDate();
              const fullDate = day.toISOString();

              let realDate = data?.user?.reals?.filter((real) => {
                return (
                  moment(real.createdAt).format("YYYY-MM-DD") ===
                  moment(fullDate).format("YYYY-MM-DD")
                );
              });

              if (realDate && realDate.length > 0) {
                return (
                  <div
                    style={{
                      backgroundImage: `url(https://xlhrytnztcpfrysksost.supabase.co/storage/v1/object/public/reals/${realDate[0].picTwo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {date}
                  </div>
                );
              }

              return <div>{date}</div>;
            }}
          />
        </Group>
      );
    }

    if (data?.user?.realsCount === 0) {
      return (
        <Group position="center" mt="md">
          <div>
            <Text align="center" size="xl" color="dimmed">
              Nothing to see here!
            </Text>
          </div>
        </Group>
      );
    }

    return <div>Latest reals tha</div>;
  };

  if (status === "loading") {
    return <Skeleton />;
  }

  if (status === "error") {
    return <Text>Error</Text>;
  }

  return (
    <>
      {userError === "NOT_FOUND" && (
        <Group position="center" mt="md">
          <div>
            <Text align="center" size="xl" color="dimmed">
              I'm sorry, but we couldn't find that user. Please try again
            </Text>
            <Center>
              <Button
                color="teal"
                mt="md"
                onClick={() => router.push("/explore")}
              >
                Go Home
              </Button>
            </Center>
          </div>
        </Group>
      )}
      {userError === "OK" && (
        <div>
          <Group position="center" mt="md">
            <Group>
              <Avatar
                src={`https://avatars.dicebear.com/api/jdenticon/${data?.user?.id}.svg?background=%230000ff`}
                radius="xl"
                size="lg"
              />
              <div style={{ flex: 1 }}>
                <Text size="xl" weight={500}>
                  {data?.user?.name}
                </Text>
                <Text color="dimmed" size="md">
                  @{data?.user?.username}
                </Text>
              </div>
              <div>{button(data?.code)}</div>
            </Group>
          </Group>
          <Divider my="md" />
          {data.user?.showReal ? (
            reals(data?.code)
          ) : (
            <Paper mt="md" p="xl">
              <Group position="center">
                <div>
                  <Center>
                    <Lock size={32} />
                  </Center>
                  <Text mt="md" align="center">
                    Start following this {data?.user?.username} to see their
                    reals
                  </Text>
                </div>
              </Group>
            </Paper>
          )}
        </div>
      )}
      {userError === "LOADING" && <Skeleton />}
    </>
  );
};
