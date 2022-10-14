import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import React from "react";
import { trpc } from "~/utils/trpc";

type AuthStateType = "SEND" | "VALIDATE" | "REGISTER";

export const AuthBody = () => {
  const {
    mutateAsync: sendEmailOtp,
    isLoading: isSendingEmailOtp,
    isSuccess: isOtpSuccess,
  } = trpc.auth.sendOtp.useMutation({});

  const [authState, setAuthState] = React.useState<AuthStateType>("SEND");

  switch (authState) {

    case "VALIDATE":
        return (
            <div>
                Currently validating
            </div>
        )
    case "REGISTER":
        return (
            <div>
                Currently registering
            </div>
        )

    default:
      return (
        <Container size={420} my={40}>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Let's start exploring!
          </Title>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput label="Email" placeholder="you@mantine.dev" required />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />
            <Group position="apart" mt="md">
              <Checkbox label="Remember me" />
              <Anchor<"a">
                onClick={(event) => event.preventDefault()}
                href="#"
                size="sm"
              >
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl">
              Sign in
            </Button>
          </Paper>
        </Container>
      );
  }
};
