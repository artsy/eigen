import { Flex } from "@artsy/palette-mobile"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkListOfferSettings } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettings"
import { ArtworkListOfferSettingsHeader } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettingsHeader"
import {
  ArtworkListOfferSettingsStickyBottomContent,
  StickyBottomContentPlaceholder,
} from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettingsStickyBottomContent"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"

const SNAP_POINTS = ["50%", "95%"]

export const ArtworkListOfferSettingsView = () => {
  const reset = ArtworkListsStore.useStoreActions((actions) => actions.reset)

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.ArtworkListOfferSettings}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      onDismiss={reset}
      footerComponent={ArtworkListOfferSettingsStickyBottomContent}
    >
      <ArtworkListOfferSettingsHeader />

      <Flex flex={1} overflow="hidden">
        <ArtworkListOfferSettings />
      </Flex>

      <StickyBottomContentPlaceholder />
    </AutomountedBottomSheetModal>
  )
}
