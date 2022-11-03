import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { PlaceholderBox } from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Separator, Spacer } from "palette"
import { Fragment } from "react"
import Animated from "react-native-reanimated"

const ActivityItemPlaceholder = () => {
  return (
    <Box my={2}>
      <PlaceholderBox width={30} height={20} />
      <Spacer mt={0.5} />
      <PlaceholderBox width={130} height={15} />
      <Spacer mt={0.5} />
      <PlaceholderBox width={100} height={15} />
      <Spacer mt={1} />
      <Flex flexDirection="row">
        <PlaceholderBox width={55} height={55} marginRight={10} />
        <PlaceholderBox width={55} height={55} marginRight={10} />
        <PlaceholderBox width={55} height={55} />
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

      {/* Subheader */}
      <Flex
        py={1}
        px={2}
        height={50}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <PlaceholderBox width={120} height={25} />
        <PlaceholderBox width={125} height={30} borderRadius={15} />
      </Flex>
      <Separator />

      <Box mx={2}>
        {times(3).map((index) => (
          <Fragment key={`placeholder-item-${index}`}>
            <ActivityItemPlaceholder />
            <Separator />
          </Fragment>
        ))}
      </Box>
    </Flex>
  )
}
