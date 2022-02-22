import React from "react"
import { View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import Metadata from "./Metadata"

import { ArtistShow_show } from "__generated__/ArtistShow_show.graphql"
import { navigate } from "app/navigation/navigate"
import { hrefForPartialShow } from "app/utils/router"
import { Touchable } from "palette"

interface Props {
  show: ArtistShow_show
  styles?: {
    container?: ViewStyle
    image?: ViewStyle
    metadata?: ViewStyle
  }
}

const Show: React.FC<Props> = ({ styles, show }) => {
  const handleTap = () => {
    navigate(hrefForPartialShow(show))
  }

  const image = show.cover_image
  const imageURL = image && image.url

  return (
    <Touchable onPress={handleTap} haptic>
      <View style={[styles?.container]}>
        <OpaqueImageView
          imageURL={imageURL}
          style={[styles?.image, { overflow: "hidden", borderRadius: 2, flex: 0 }]}
        />
        {/* this wrapper required to make numberOfLines work when parent is a row */}
        <View style={{ flex: 1 }}>
          <Metadata show={show} style={styles && styles.metadata} />
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
