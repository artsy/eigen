import { Flex, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { times } from "lodash"

export const PlaceholderList = () => (
  <Flex width="100%">
    {times(3).map((i) => (
      <Flex key={i} mb={4}>
        <Flex>
          <SkeletonBox key={i} width="100%" height={400} />
        </Flex>
        <Flex px={2}>
          <Spacer y={2} />
          <SkeletonText>David Hockey</SkeletonText>
          <Spacer y={0.5} />
          <SkeletonText>Mercy from the Virtues H9-13 </SkeletonText>
          <Spacer y={0.5} />
          <SkeletonText>Berg Contemporary</SkeletonText>
          <Spacer y={0.5} />
          <SkeletonText>£38,000</SkeletonText>
        </Flex>
      </Flex>
    ))}
  </Flex>
)
