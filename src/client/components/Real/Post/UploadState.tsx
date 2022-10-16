import { Button, Checkbox, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import { useRouter } from "next/router";
import { useAuthStore } from "~/client/store";
import { supabase } from "~/utils/supabase";
import { trpc } from "~/utils/trpc";
import { RealImage } from "../../Common/RealImage";

type IUploadStateProps = {
  picture1: string;
  picture2: string;
};

export const UploadState = ({ picture1, picture2 }: IUploadStateProps) => {
  const form = useForm({
    initialValues: {
      explore: true,
      location: false,
    },
  });
  const prepareBase64DataUrl = (base64: string) =>
    base64
      .replace("data:image/jpeg;", "data:image/jpeg;charset=utf-8;")
      .replace(/^.+,/, "");
  const authStore = useAuthStore();

  const router = useRouter();

  const uploadBase64Images = async () => {
    let result = [];
    let pendingImages = [picture1, picture2];
    for (let i = 0; i < pendingImages.length; i++) {
      const currentTimestamp = Date.now().toString();
      const fileName = `${authStore?.user?.id}-${authStore?.user?.username}-${currentTimestamp}-${i}.png`;
      const path = `${authStore?.user?.id}/${fileName}`;
      const { data, error } = await supabase.storage
        .from("reals")
        .upload(path, decode(prepareBase64DataUrl(pendingImages[i])), {
          contentType: "image/png",
        });
      if (data) {
        result.push(data.path);
      } else {
        showNotification({
          title: "Error",
          message: error.message,
        });
      }
    }
    return result;
  };

  const { mutateAsync: createReal } = trpc.reals.createReal.useMutation();

  const onSubmit = async (values: any) => {
    const images = await uploadBase64Images();
    if (images.length === 2) {
      const realInfo = router.query.id as string;
      await createReal({
        ...values,
        pic1: images[0],
        pic2: images[1],
        realInfo: realInfo,
      });
    }
  };

  const { mutate: uploadReal, isLoading: isUploading } = useMutation(onSubmit, {
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: "Real uploaded successfully",
      });
      router.push("/explore");
    },
  });

  return (
    <div>
      <RealImage picture1={picture1} picture2={picture2} />
      <form onSubmit={form.onSubmit((values) => uploadReal(values))}>
        <Checkbox
          mt="md"
          label="Show on explore"
          {...form.getInputProps("explore", {
            type: "checkbox",
          })}
        />
        <Divider my="md" />
        <Checkbox
          label="Show my location"
          {...form.getInputProps("location", {
            type: "checkbox",
          })}
        />
        <Button
          loading={isUploading}
          color="teal"
          mt="md"
          type="submit"
          fullWidth
        >
          Upload
        </Button>
      </form>
    </div>
  );
};
