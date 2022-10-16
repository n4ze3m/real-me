import { Container, Skeleton } from "@mantine/core";

export const LoadingState = () => {
  return (
    <div>
      <Container>
        <Skeleton height={300} />
      </Container>
      <Skeleton my="md" />
    </div>
  );
};
