import { Box, Button } from "@artsy/palette-mobile"
import { BottomSheetFooter, BottomSheetFooterProps } from "@gorhom/bottom-sheet"

const STICKY_BOTTOM_CONTENT_HEIGHT = 100

export const EditArtworkListsPrivacyStickyBottomContent: React.FC<BottomSheetFooterProps> = ({
  animatedFooterPosition,
}) => {
  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="white100">
        <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} pt={2}>
          <Button width="100%" block loading={false} onPress={() => {}}>
            Done
          </Button>
        </Box>
      </Box>
    </BottomSheetFooter>
  )
}
