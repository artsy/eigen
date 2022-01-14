import React from "react"
import { ScrollView, View } from "react-native"
import { getArtwork } from "../../../utils/appClipFetch"
import { AppClipArtworkImage } from "./Image"
import { Separator } from "./styles"
import { AppClipArtworkTombstone } from "./Tombstone"
import { AppClipArtworkTransactional } from "./Transactional"

export const AppClipArtwork = ({artworkId}) => {
  const [artwork, setArtwork] = React.useState(null)
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    if (artworkId) {
      console.log('ArtworkId: '+ artworkId)
      getArtwork(artworkId)
        .then(artwork => {
          console.log('Artwork:' + artwork)
          setArtwork(artwork)
        })
        .catch((e) => console.log('Artwork Error: '+ e.message))
      return () => { mountedRef.current = false }
    }
  }, [])

  return artwork ?
    (
      <ScrollView>
        <AppClipArtworkImage url={artwork.images[0].image_urls.large} aspectRatio={artwork.images[0].aspect_ratio}/>
        <View style={{
          margin: 20,
          marginTop: 40
        }}>
          <AppClipArtworkTombstone artistName={artwork.artist.name} artwork={artwork} />
          <Separator />
          <AppClipArtworkTransactional artwork={artwork} />
        </View>
      </ScrollView>
    ) :
    <View />
}
