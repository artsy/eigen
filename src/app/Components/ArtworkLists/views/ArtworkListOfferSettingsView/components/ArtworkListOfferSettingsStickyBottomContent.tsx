import { Box, Button } from "@artsy/palette-mobile"
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useSaveArtworkListsOfferSettingsChanges } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/useSaveArtworkListsOfferSettingsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"

const STICKY_BOTTOM_CONTENT_HEIGHT = 100

export const ArtworkListOfferSettingsStickyBottomContent: React.FC<BottomSheetFooterProps> = ({
  animatedFooterPosition,
}) => {
  const {
    state: { hasUnsavedChanges },
  } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()

  const { save, inProgress } = useSaveArtworkListsOfferSettingsChanges({
    onCompleted: () => {
      dismiss(ArtworkListsViewName.ArtworkListOfferSettings)
    },
  })

  const handleSave = () => {
    if (hasUnsavedChanges) {
      save()
    } else {
      dismiss(ArtworkListsViewName.ArtworkListOfferSettings)
    }
  }

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="white100">
        <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} pt={2}>
          <Button width="100%" block loading={inProgress} onPress={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </BottomSheetFooter>
  )
}
