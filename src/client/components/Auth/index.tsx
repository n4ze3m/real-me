import {
  Paper,
  createStyles,
  TextInput,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "~/utils/trpc";

type AuthStateType = "SEND" | "VALIDATE" | "REGISTER";
const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100%",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=100)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 0,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
      height: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export const AuthBody = () => {
  const [authState, setAuthState] = React.useState<AuthStateType>("SEND");
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const { classes } = useStyles();
  const sendForm = useForm({
    initialValues: {
      email: "",
    },
  });

  const verifyForm = useForm({
    initialValues: {
      otp: "",
    },
  });

  const registerForm = useForm({
    initialValues: {
      name: "",
      username: "",
    },
  });

  // create 30 second timer
  const [timer, setTimer] = React.useState<number>(0);
  React.useEffect(() => {
    const interval: any = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { mutateAsync: sendEmailOtp, isLoading: isSendingEmailOtp } =
    trpc.auth.sendOtp.useMutation({
      onSuccess: () => {
        setEmail(sendForm.values.email);
        setAuthState("VALIDATE");
        setTimer(30);
      },
    });

  const { mutateAsync: validateEmailOtp, isLoading: isValidateEmailOtp } =
    trpc.auth.verifyOtp.useMutation({
      onSuccess: (data) => {
        if (!data.success) {
          if (data.code === "UNREGISTERED_USER") {
            setAuthState("REGISTER");
          } else if (data.code === "MISSING_OTP") {
            console.log("missing otp");
            verifyForm.setFieldError("otp", "Invalid OTP");
          }
        } else {
          showNotification({
            color: "green",
            message: "Welcome back!",
          });
          router.push("/explore");
        }
      },
    });

  const { mutateAsync: registerUser, isLoading: isRegisteringUser } =
    trpc.auth.register.useMutation({
      onSuccess: (data) => {
        if (!data.success) {
          if (data.code === "EMAIL_EXISTS") {
            registerForm.setFieldError("email", "Email already exists");
          } else if (data.code === "USERNAME_EXISTS") {
            registerForm.setFieldError("username", "Username taken");
          }
        } else {
          showNotification({
            color: "green",
            message: "Welcome to the community!",
          });
          router.push("/explore");
        }
      },
    });

  return (
    <div className={classes.wrapper}>
      {authState === "SEND" && (
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
          >
            Ready to start exploring?
          </Title>
          <form onSubmit={sendForm.onSubmit((values) => sendEmailOtp(values))}>
            <TextInput
              {...sendForm.getInputProps("email")}
              label="Email"
              placeholder="you@example.com"
              required
            />
            <Button
              color="teal"
              loading={isSendingEmailOtp}
              type="submit"
              fullWidth
              mt="xl"
            >
              Send OTP
            </Button>
          </form>
        </Paper>
      )}
      {authState === "VALIDATE" && (
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
          >
            Login to your account
          </Title>
          <form
            onSubmit={verifyForm.onSubmit((values) =>
              validateEmailOtp({
                email,
                otp: values.otp,
              })
            )}
          >
            <TextInput
              disabled
              value={email}
              label="Email"
              placeholder="you@example.com"
              required
            />
            <TextInput
              {...verifyForm.getInputProps("otp")}
              label="OTP"
              placeholder="1234"
              required
            />
            <Button
              loading={isValidateEmailOtp}
              color="teal"
              type="submit"
              fullWidth
              mt="xl"
            >
              Log Me In
            </Button>
          </form>
          {timer > 0 ? (
            <Text align="center" mt="xl">
              Resend OTP in {timer}
            </Text>
          ) : (
            <Text align="center" mt="xl">
              <Anchor
                onClick={() => {
                  sendEmailOtp({ email });
                  setTimer(30);
                }}
              >
                Resend OTP
              </Anchor>
            </Text>
          )}
        </Paper>
      )}
      {authState === "REGISTER" && (
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
          >
            {"Oh Wait! You don't have an account yet."}
          </Title>
          <form
            onSubmit={registerForm.onSubmit((values) =>
              registerUser({
                email,
                ...values,
              })
            )}
          >
            <TextInput
              {...registerForm.getInputProps("name")}
              label="Name"
              placeholder="John Doe"
              required
            />
            <TextInput
              disabled
              value={email}
              label="Email"
              placeholder="you@example.com"
              required
            />
            <TextInput
              {...registerForm.getInputProps("username")}
              label="Username"
              placeholder="johndoe"
              required
            />
            <Button
              type="submit"
              loading={isRegisteringUser}
              color="teal"
              fullWidth
              mt="xl"
            >
              Register
            </Button>
          </form>
        </Paper>
      )}
    </div>
  );
};
