import { Image, Touchable } from "@artsy/palette-mobile"
import { ArtistShow_show$data } from "__generated__/ArtistShow_show.graphql"
import { navigate } from "app/system/navigation/navigate"
import { hrefForPartialShow } from "app/utils/router"
import { View, ViewStyle } from "react-native"
import { ImageStyle } from "react-native-fast-image"
import { createFragmentContainer, graphql } from "react-relay"
import Metadata from "./Metadata"

interface Props {
  show: ArtistShow_show$data
  imageDimensions: ImageDimensions
  styles?: {
    container?: ViewStyle
    imageStyle?: ImageStyle
    metadata?: ViewStyle
  }
}
export interface ImageDimensions {
  width: number
  height: number
}

const Show: React.FC<Props> = ({ styles, show, imageDimensions }) => {
  const handleTap = () => {
    navigate(hrefForPartialShow(show))
  }

  const image = show.cover_image
  const imageURL = image && image.url

  if (!imageURL) {
    return null
  }

  return (
    <Touchable onPress={handleTap} haptic>
      <View style={[styles?.container]}>
        <Image
          src={imageURL}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={[styles?.imageStyle ?? {}, { overflow: "hidden", borderRadius: 2, flex: 0 }]}
        />
        {/* this wrapper required to make numberOfLines work when parent is a row */}
        <View style={{ flex: 1 }}>
          <Metadata show={show} style={!!styles && styles.metadata} />
        </View>
      </View>
    </Touchable>
  )
}

export const ArtistShowFragmentContainer = createFragmentContainer(Show, {
  show: graphql`
    fragment ArtistShow_show on Show {
      slug
      href
      is_fair_booth: isFairBooth
      cover_image: coverImage {
        url(version: "large")
      }
      ...Metadata_show
    }
  `,
})
