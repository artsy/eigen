import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { ArtistShow_show$data, ArtistShow_show$key } from "__generated__/ArtistShow_show.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { RouterLink } from "app/system/navigation/RouterLink"
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
  const data = useFragment(query, show)

  if (!data) {
    return null
  }

  const handleTap = () => {
    tracking.trackEvent(tracks.tappedShowGroup(data, index))
  }

  const image = data.coverImage
  const imageURL = image && image.url

  return (
    <RouterLink haptic onPress={handleTap} to={hrefForPartialShow(data)}>
      <View style={[styles?.container]}>
        <View style={[styles?.imageMargin]}>
          <ImageWithFallback
            src={imageURL}
            width={imageDimensions.width}
            height={imageDimensions.height}
            blurhash={image?.blurhash}
            style={[{ overflow: "hidden", borderRadius: 2, flex: 0 }]}
          />
        </View>
        {/* this wrapper required to make numberOfLines work when parent is a row */}
        <View style={{ flex: 1 }}>
          <Metadata show={data} style={!!styles && styles.metadata} />
        </View>
      </View>
    </RouterLink>
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
