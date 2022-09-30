import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import { Fragment } from "react"
import Animated from "react-native-reanimated"

const ActivityItemPlaceholder = () => {
  return (
    <Box my={2}>
      <PlaceholderBox width={30} height={15} />
      <Spacer mt={0.5} />
      <PlaceholderBox width={130} height={15} />
      <Spacer mt={0.5} />
      <PlaceholderBox width={100} height={15} />
      <Spacer mt={1} />
      <Flex flexDirection="row">
        <PlaceholderBox width={58} height={60} marginRight={10} />
        <PlaceholderBox width={58} height={60} marginRight={10} />
        <PlaceholderBox width={58} height={60} />
      </Flex>
    </Box>
  )
}

export const ActivityTabPlaceholder = () => {
  const { staticHeaderHeight, stickyHeaderHeight } = useStickyTabPageContext()
  const headerHeight = Animated.add(staticHeaderHeight ?? 0, stickyHeaderHeight ?? 0)

  return (
    <Flex flex={1}>
      <Animated.View
        style={{
          height: headerHeight ?? 0,
        }}
      />
      <Flex flex={1} px={2}>
        {/* Subheader */}
        <Flex my={2}>
          <PlaceholderBox width={120} height={30} />
        </Flex>

        {times(3).map((index) => (
          <Fragment key={`placeholder-item-${index}`}>
            <ActivityItemPlaceholder />
            <Separator />
          </Fragment>
        ))}
      </Flex>
    </Flex>
  )
}
