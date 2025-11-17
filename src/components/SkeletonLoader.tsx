import { Stack, Skeleton, SkeletonText } from "@chakra-ui/react";

type Props = {
  lines?: number;
  height?: string;
};

export default function SkeletonLoader({ lines = 3, height = "200px" }: Props) {
  return (
    <Stack shadow="md" borderRadius="xl" p="1rem" bg="white" gap={4}>
      <Skeleton height={height} borderRadius="lg" />
      <Skeleton height="25px" width="70%" />
      <SkeletonText noOfLines={lines} gap="3" />
    </Stack>
  );
}

