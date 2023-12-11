import {
  BackButton,
  Box,
  Flex,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"

export const EditSavedSearchFormPlaceholder = () => {
  return (
    <PageWithSimpleHeader
      title="Edit your Alert"
      titleWeight="regular"
      noSeparator
      left={<BackButton onPress={goBack} />}
    >
      <Skeleton>
        <Flex px={2}>
          <Join separator={<Spacer y={4} />}>
            {/* Filter pills */}
            <Box mt={2}>
              <SkeletonText variant="sm-display">We'll send you alerts for</SkeletonText>
              <Spacer y={1} />
              <Flex flexDirection="row" flexWrap="wrap" mx={-0.5}>
                {times(3).map((i) => (
                  <Box mx={0.5} key={i}>
                    <PlaceholderText width={50 + Math.random() * 80} height={34} />
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Suggested filters */}
            <Box>
              <SkeletonText variant="sm-display">Add Filters</SkeletonText>
              <Spacer y={1} />
              <Flex flexDirection="row" flexWrap="wrap">
                <SkeletonBox mr={1} mb={1} width={80} height={30} borderRadius={17} />
                <SkeletonBox mr={1} mb={1} width={120} height={30} borderRadius={17} />
                <SkeletonBox mr={1} mb={1} width={90} height={30} borderRadius={17} />
                <SkeletonBox mr={1} mb={1} width={140} height={30} borderRadius={17} />
              </Flex>
            </Box>

            {/* What you're looking for */}
            <Box>
              <SkeletonText variant="sm-display">
                Tell us more about what you’re looking for
              </SkeletonText>
              <Spacer y={1} />
              <SkeletonBox height={100} />
            </Box>

            {/* Notification Preference */}
            <Box>
              <SkeletonBox width="100%" height={30} />
              <Spacer y={2} />
              <SkeletonBox width="100%" height={30} />
              <Spacer y={0.5} />
              <SkeletonText variant="xs">Update email preferences</SkeletonText>
            </Box>
          </Join>
        </Flex>
      </Skeleton>
    </PageWithSimpleHeader>
  )
}
