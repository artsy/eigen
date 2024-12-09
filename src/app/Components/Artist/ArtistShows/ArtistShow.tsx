import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { Image, Touchable } from "@artsy/palette-mobile"
import { ArtistShow_show$data, ArtistShow_show$key } from "__generated__/ArtistShow_show.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { hrefForPartialShow } from "app/utils/router"
import { View, ViewStyle } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import Metadata from "./Metadata"

interface Props {
  show: ArtistShow_show$key
  styles?: {
    container?: ViewStyle
    metadata?: ViewStyle
    imageMargin?: ViewStyle
  }
  imageDimensions: { width: number; height: number }
  index: number
}

export const ArtistShow: React.FC<Props> = ({ styles, show, index, imageDimensions }) => {
  const tracking = useTracking()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const data = useFragment(query, show)

  if (!data) {
    return null
  }

  const handleTap = () => {
    tracking.trackEvent(tracks.tappedShowGroup(data, index))
    navigate(hrefForPartialShow(data))
  }

  const image = data.coverImage
  const imageURL = image && image.url

  return (
    <Touchable onPress={handleTap} haptic>
      <View style={[styles?.container]}>
        <View style={[styles?.imageMargin]}>
          {!!imageURL && (
            <Image
              src={imageURL}
              width={imageDimensions.width}
              height={imageDimensions.height}
              blurhash={showBlurhash ? image?.blurhash : undefined}
              style={[{ overflow: "hidden", borderRadius: 2, flex: 0 }]}
            />
          )}
        </View>
        {/* this wrapper required to make numberOfLines work when parent is a row */}
        <View style={{ flex: 1 }}>
          <Metadata show={data} style={!!styles && styles.metadata} />
        </View>
      </View>
    </Touchable>
  )
}

const query = graphql`
  fragment ArtistShow_show on Show {
    internalID
    slug
    href
    is_fair_booth: isFairBooth
    coverImage {
      url(version: "large")
      blurhash
    }
    ...Metadata_show
  }
`

const tracks = {
  tappedShowGroup: (show: ArtistShow_show$data, index: number): TappedShowGroup => ({
    action: ActionType.tappedShowGroup,
    context_module: ContextModule.currentShowsRail,
    context_screen_owner_type: OwnerType.artist,
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: show.internalID,
    destination_screen_owner_slug: show.slug,
    horizontal_slide_position: index + 1,
    type: "thumbnail",
  }),
}
