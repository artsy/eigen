import React from "react"
import { View } from "react-native"
import { getArtwork } from "../../../utils/appClipFetch"
import { AppClipArtworkImage } from "./Image"
import { AppClipArtworkTombstone } from "./Tombstone"

export const AppClipArtwork = ({artworkId}) => {
  const [artwork, setArtwork] = React.useState(null)
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    getArtwork(artworkId)
      .then(setArtwork)
      .catch((e) => console.log(e.message))
    return () => { mountedRef.current = false }
  }, [])

  return artwork ?
    (
      <View>
        <AppClipArtworkImage url={artwork.images[0].image_urls.large} aspectRatio={artwork.images[0].aspect_ratio}/>
        <AppClipArtworkTombstone artistName={artwork.artist.name} />
      </View>
    ) :
    <View />
}
