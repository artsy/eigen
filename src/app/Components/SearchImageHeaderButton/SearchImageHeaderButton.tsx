import { ActionType, OwnerType, TappedReverseImageSearch } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
import { ReverseImageOwner } from "app/Scenes/ReverseImage/types"
import { useFeatureFlag } from "app/store/GlobalStore"
import { AddIcon } from "palette"
import { useTracking } from "react-tracking"
import { HeaderButton } from "../HeaderButton"

const CAMERA_ICON_SIZE = 20

export interface SearchImageHeaderButtonProps {
  isImageSearchButtonVisible: boolean
  owner: ReverseImageOwner
}

export const SearchImageHeaderButton: React.FC<SearchImageHeaderButtonProps> = ({
  isImageSearchButtonVisible,
  owner,
}) => {
  const tracking = useTracking()
  const isImageSearchEnabled = useFeatureFlag("AREnableImageSearch")

  const handleSearchPress = () => {
    tracking.trackEvent(tracks.tappedReverseImageSearch(owner))
    navigate("/reverse-image", {
      passProps: {
        owner,
      },
    })
  }

  return (
    <HeaderButton
      accessibilityLabel="Search by image"
      shouldHide={!isImageSearchButtonVisible || !isImageSearchEnabled}
      position="right"
      onPress={handleSearchPress}
    >
      <AddIcon width={CAMERA_ICON_SIZE} height={CAMERA_ICON_SIZE} />
    </HeaderButton>
  )
}

const tracks = {
  tappedReverseImageSearch: (owner: ReverseImageOwner): TappedReverseImageSearch => ({
    action: ActionType.tappedReverseImageSearch,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
  }),
}
