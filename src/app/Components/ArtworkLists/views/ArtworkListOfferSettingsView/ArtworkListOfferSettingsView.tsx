import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListOfferSettings } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettings"
import { ArtworkListOfferSettingsHeader } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettingsHeader"
import { ArtworkListOfferSettingsStickyBottomContent } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/components/ArtworkListOfferSettingsStickyBottomContent"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"

const SNAP_POINTS = ["50%", "95%"]

export const ArtworkListOfferSettingsView = () => {
  const { reset } = useArtworkListsContext()

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.ArtworkListOfferSettings}
      snapPoints={SNAP_POINTS}
      onDismiss={reset}
      footerComponent={ArtworkListOfferSettingsStickyBottomContent}
    >
      <ArtworkListOfferSettingsHeader />

      <Flex flex={1} overflow="hidden">
        <ArtworkListOfferSettings />
      </Flex>
    </AutomountedBottomSheetModal>
  )
}
