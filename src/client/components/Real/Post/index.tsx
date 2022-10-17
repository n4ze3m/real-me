import {
  Button,
  Divider,
  Group,
  Text,
  UnstyledButton,
  LoadingOverlay,
  createStyles,
} from "@mantine/core";
import React from "react";
import Webcam from "react-webcam";
import { Circle, SwitchHorizontal } from "tabler-icons-react";
import { useCameraStore } from "~/client/store";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { UploadState } from "./UploadState";

type RealPostState = "LOADING" | "SUCCESS" | "ERROR" | "UPLOAD";

const useStyles = createStyles(() => ({
  camContainer: {
    position: "relative",
    display: "inline-block",
  },
  camText: {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
  },
  cam: {
    display: "block",
  },
}));

export const RealPostBody = () => {
  const [devices, setDevices] = React.useState([]);
  const [state, setState] = React.useState<RealPostState>("LOADING");
  const { cameraIndex, setCameraIndex, setTakeAuto, takeAuto } =
    useCameraStore();
  const [countdown, setCountdown] = React.useState(120);
  const [formatCountdown, setFormatCountdown] = React.useState("2:00");
  const [loadOverlay, setLoadOverlay] = React.useState(false);
  const { classes } = useStyles();

  const switchCamera = () => {
    setCameraIndex((cameraIndex + 1) % 2);
  };

  const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [takenPicture, setTakenPicture] = React.useState({
    pic0: "",
    pic1: "",
  });

  const webcamRef = React.useRef(null);
  const autoCapture = React.useCallback(async () => {
    await sleep(5000);
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setTakenPicture((prev) => {
        return {
          ...prev,
          [`pic${cameraIndex}`]: imageSrc,
        };
      });
      setState("UPLOAD");
    }
  }, [webcamRef, cameraIndex, sleep]);
  React.useEffect(() => {
    if (takeAuto) {
      autoCapture();
    }
  }, [cameraIndex]);
  const capture = React.useCallback(async () => {
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setTakenPicture((prev) => {
        return {
          ...prev,
          [`pic${cameraIndex}`]: imageSrc,
        };
      });
    }
  }, [webcamRef, cameraIndex]);

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
      {state === "LOADING" && <LoadingState />}
      {state === "ERROR" && <ErrorState />}
      {state === "SUCCESS" && (
        <div>
          <LoadingOverlay
            visible={loadOverlay}
            title={`Don't move! Keep smiling!`}
          />
          <div className={classes.camContainer}>
            <div className={classes.camText}>
              <Text
                color="white"
                size="lg"
                styles={{
                  textShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
              >
                {formatCountdown}
              </Text>
            </div>
            <Webcam
              audio={false}
              width="100%"
              ref={webcamRef}
              className={classes.cam}
              // @ts-ignore
              videoConstraints={{ deviceId: devices[cameraIndex]?.deviceId! }}
            />
          </div>
          <Divider my="md" />
          <Group position="apart" p="xl">
            <div />
            <div>
              <Button
                onClick={async () => {
                  setTakeAuto(true);
                  await Promise.all([capture(), sleep(1000)]);
                  setCameraIndex((cameraIndex + 1) % 2);
                  setLoadOverlay(true);
                }}
                radius="xl"
                variant="outline"
                size="xl"
                color="teal"
              >
                <Circle size={45} />
              </Button>
            </div>
            <div>
              <UnstyledButton onClick={switchCamera}>
                <SwitchHorizontal />
              </UnstyledButton>
            </div>
          </Group>
        </div>
      )}
      {state === "UPLOAD" && (
        <UploadState
          picture1={takenPicture.pic0}
          picture2={takenPicture.pic1}
        />
      )}
    </>
  );
};
