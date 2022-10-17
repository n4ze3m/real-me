import {
  Col,
  Container,
  createStyles,
  Grid,
  Title,
  Text,
  Card,
  Group,
  Avatar,
} from "@mantine/core";
import { RealImage } from "../Common/RealImage";
const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "#f5f5f5",

  },
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  featureTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));
export const Features = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.main}>
    <Container className={classes.wrapper}>
      <Title className={classes.title}>
        {`Capture a real moment of your life`}
      </Title>
      <Grid mt="xl" gutter={80}>
        <Col span={12} md={5}>
          <Card withBorder shadow="sm" mb="md" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Group>
                  <Avatar
                    src={`https://avatars.dicebear.com/api/jdenticon/random.svg?background=%230000ff`}
                    radius="xl"
                    size={30}
                    mr="sm"
                  />
                  <div>
                    <Text color="dimmed">{`@scoob`}</Text>
                  </div>
                </Group>
              </Group>
            </Card.Section>
            <Card.Section>
              <RealImage
                picture1={`https://i.imgur.com/KeEF83P.png`}
                picture2={`https://i.imgur.com/qXTHkdv.png`}
              />
            </Card.Section>
          </Card>
        </Col>
        <Col span={12} md={7}>
          <Title className={classes.featureTitle} order={2}>
            A new Real
          </Title>
          <Text>
            A new Real is a new way to capture a real moment of your life. It
            could be a photo without any filters, effects, or edits. It will be
            available for 24 hours.
          </Text>
        </Col>
      </Grid>
    </Container>
    </div>
  );
};
