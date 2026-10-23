import { Button, Flex, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { BOTTOM_TABS_HEIGHT } from "@artsy/palette-mobile/dist/elements/Screen/StickySubHeader"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"

/**
 * Shown when tapping "Sell" in My Collection, before continuing to the sell flow.
 */
export const MyCollectionBottomSheetModalSell: React.FC<{ isVisible: boolean }> = ({
  isVisible,
}) => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)

  const space = useSpace()
  const color = useColor()

  return (
    <AutomountedBottomSheetModal
      sentryName="MyCollectionBottomSheetModalSell"
      visible={isVisible}
      backgroundStyle={{
        backgroundColor: color("mono0"),
      }}
      onDismiss={() => {
        setViewKind({ viewKind: null })
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: space(2),
          paddingBottom: BOTTOM_TABS_HEIGHT,
        }}
      >
        <Flex pt={1} gap={2}>
          <Flex
            alignSelf="flex-start"
            backgroundColor="blue10"
            borderRadius={15}
            px={1}
            py={0.5}
            testID="sell-beta-pill"
          >
            <Text variant="xs" color="blue100">
              Beta
            </Text>
          </Flex>

          <Text variant="lg-display">Sell with Artsy is new</Text>

          <Flex gap={2}>
            <Text variant="sm" color="mono60">
              This program is in beta, so works you submit won’t go up for sale right away. We’re
              looking for collectors to work with us as part of this early initiative — they’ll
              become preferred sellers once we launch more broadly.
            </Text>

            <Text variant="sm" color="mono60">
              Eligible works will be supported by our Auction team, or listed on Artsy as “available
              soon”. We can then share data with you on demand for your works, such as how many
              people have viewed or saved them.
            </Text>
          </Flex>

          <Button
            block
            haptic
            variant="fillDark"
            onPress={() => {
              setViewKind({ viewKind: null })
              navigate("/sell")
            }}
          >
            Continue
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
