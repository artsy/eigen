import { Spinner } from "@artsy/palette-mobile"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import {
  MyCollectionArtistsPrompt,
  MyCollectionArtistsPromptProps,
} from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPrompt"
import { Suspense } from "react"
import { Dimensions } from "react-native"

interface MyCollectionBottomSheetModalArtistsPromptProps extends MyCollectionArtistsPromptProps {
  visible: boolean
  onDismiss: () => void
}

export const MyCollectionBottomSheetModalArtistsPrompt: React.FC<
  MyCollectionBottomSheetModalArtistsPromptProps
> = ({ visible, onDismiss, ...rest }) => {
  return (
    <AutomountedBottomSheetModal
      visible={visible}
      snapPoints={SNAP_POINTS}
      enableOverDrag={false}
      onDismiss={onDismiss}
    >
      <Suspense fallback={<Spinner />}>
        <MyCollectionArtistsPrompt {...rest} />
      </Suspense>
    </AutomountedBottomSheetModal>
  )
}

const { height } = Dimensions.get("screen")

export const SNAP_POINTS = [height * 0.65, height * 0.9]
