import { Button, Center, Group, Text } from "@mantine/core";
import React from "react";
type PossibleCameraIndex = 0 | 1;
type RealPostState = "LOADING" | "SUCCESS" | "ERROR";

export const RealPostBody = () => {
  const [devices, setDevices] = React.useState([]);
  const [state, setState] = React.useState<RealPostState>("LOADING");
  const [cameraIndex, setCameraIndex] = React.useState<PossibleCameraIndex>(0);
  const [countdown, setCountdown] = React.useState(120);
  const [formatCountdown, setFormatCountdown] = React.useState("2:00");

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleDevices = React.useCallback(
    (mediaDevices: any) => {
      let possibleDevices = mediaDevices.filter(
        ({ kind }: any) => kind === "videoinput"
      );
      // check possibleDevices.length is less than 2
      if (possibleDevices.length < 2) {
        setState("ERROR");
        return;
      }
      setDevices(possibleDevices);
      setState("SUCCESS");
    },
    [setDevices]
  );
  React.useEffect(() => {
    if (typeof navigator.mediaDevices !== "undefined") {
      navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
        handleDevices(mediaDevices);
      });
    }
  }, [handleDevices]);

  React.useEffect(() => {
    if (state === "SUCCESS") {
      if (countdown === 0) {
        return;
      }
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setFormatCountdown(formatTime(countdown - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, state]);

  return (
    <>
      {state === "LOADING" && <div>loading..</div>}
      {state === "ERROR" && (
        <Group p="xl" mt="md" position="center">
          <div>
            <Text>
              To use Real Me, you need to have at least 2 cameras available on
              your device.
            </Text>
            <Center>
              <Button color="teal" mt="md">
                Go back
              </Button>
            </Center>
          </div>
        </Group>
      )}
      {state === "SUCCESS" && <div>
        {formatCountdown}
        </div>}
    </>
  );
};
