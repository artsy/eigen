import { ActionType, OwnerType, TappedReverseImageSearch } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { AddIcon, Box } from "palette"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"

const CAMERA_ICON_CONTAINER_SIZE = 40
const CAMERA_ICON_SIZE = 20

export interface SearchImageHeaderButtonOwner {
  id: string
  slug: string
  type: OwnerType
}

export interface SearchImageHeaderButtonProps {
  isImageSearchButtonVisible: boolean
  owner: SearchImageHeaderButtonOwner
}

export const SearchImageHeaderButton: React.FC<SearchImageHeaderButtonProps> = ({
  isImageSearchButtonVisible,
  owner,
}) => {
  const tracking = useTracking()
  const isImageSearchEnabled = useFeatureFlag("AREnableImageSearch")

  if (!isImageSearchButtonVisible || !isImageSearchEnabled) {
    return null
  }

  const handleSearchPress = () => {
    const event: TappedReverseImageSearch = {
      action: ActionType.tappedReverseImageSearch,
      context_screen_owner_type: OwnerType.reverseImageSearch,
      owner_type: owner.type,
      owner_id: owner.id,
      owner_slug: owner.slug,
    }

    tracking.trackEvent(event)
    navigate("/reverse-image", {
      passProps: {
        owner,
      },
    })
  }

  return (
    <TouchableOpacity
      accessibilityLabel="Search by image"
      style={{
        position: "absolute",
        // the margin top here is the exact same as src/app/navigation/BackButton
        // in order to align the back button with the search button
        top: 13 + useScreenDimensions().safeAreaInsets.top,
        right: 12,
      }}
      onPress={handleSearchPress}
    >
      <Box
        width={CAMERA_ICON_CONTAINER_SIZE}
        height={CAMERA_ICON_CONTAINER_SIZE}
        borderRadius={CAMERA_ICON_CONTAINER_SIZE / 2}
        bg="white"
        justifyContent="center"
        alignItems="center"
      >
        <AddIcon width={CAMERA_ICON_SIZE} height={CAMERA_ICON_SIZE} />
      </Box>
    </TouchableOpacity>
  )
}
