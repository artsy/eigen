import { Flex, Spinner } from "@artsy/palette-mobile"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

export const StickyTabPagePlaceholder: React.FC = () => {
  return (
    <StickyTabPageScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      scrollEnabled={false}
    >
      <Flex alignItems="center">
        <Spinner />
      </Flex>
    </StickyTabPageScrollView>
  )
}
