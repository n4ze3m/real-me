import { Image, createStyles } from "@mantine/core";
import React from "react";

type IRealImageProps = {
  picture1: string;
  picture2: string;
};

const useStyles = createStyles(() => ({
  mainDiv: {
    position: "relative",
    display: "inline-block",
  },
  smallDiv: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    width: "25%",
    height: "25%",
  },
  mainImage: {
    display: "block",
  },
}));

export const RealImage = ({ picture1, picture2 }: IRealImageProps) => {
  const { classes } = useStyles();

  const [image1, setImage1] = React.useState(picture2);
  const [image2, setImage2] = React.useState(picture1);


  const switchImage = () => {
    let temp = image1;
    setImage1(image2);
    setImage2(temp);
  }

  return (
    <div className={classes.mainDiv}>
      <Image src={image1} alt="Main image" className={classes.mainImage} />
      <div className={classes.smallDiv}>
        <Image src={image2} radius="lg"   alt="Small image" onClick={switchImage} />
      </div>
    </div>
  );
};
