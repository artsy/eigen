import {
  Flex,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { CHOICES_PER_ROUND } from "app/Scenes/ArtworkArtistGame/utils/buildRounds"

export const ArtworkArtistGamePlayPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()
  const imageSize = width - 40

  return (
    <Skeleton>
      <Flex flex={1} px={2}>
        <Spacer y={1} />
        <SkeletonText variant="sm">1 / 10</SkeletonText>
        <Spacer y={1} />
        <SkeletonText variant="lg-display">Who made this artwork?</SkeletonText>
        <Spacer y={2} />

        <Flex alignItems="center">
          <SkeletonBox width={imageSize} height={imageSize} />
        </Flex>

        <Spacer y={2} />

        <Flex gap={1}>
          {Array.from({ length: CHOICES_PER_ROUND }).map((_, index) => (
            <SkeletonBox key={index} height={52} borderRadius={5} />
          ))}
        </Flex>
      </Flex>
    </Skeleton>
  )
}
