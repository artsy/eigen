import { Flex, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { usePlaceholderView } from "app/utils/masonryHelpers/viewOptionHelpers"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { times } from "lodash"

export const NewWorksFromGalleriesYouFollowPlaceholder: React.FC = () => {
  const placeholderView = usePlaceholderView("onyx_new_works_for_you_feed")

  return (
    <Skeleton>
      <Flex my={2} testID="NewWorksFromGalleriesYouFollowPlaceholder">
        {placeholderView === "grid" ? (
          <PlaceholderGrid />
        ) : (
          <Flex width="100%">
            {times(3).map((i) => (
              <Flex key={i}>
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
        )}
      </Flex>
    </Skeleton>
  )
}
