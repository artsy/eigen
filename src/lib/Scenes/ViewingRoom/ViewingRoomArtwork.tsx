import { Box, Button, EyeOpenedIcon, Flex, Sans, Separator, Serif, Spacer } from "@artsy/palette"
import { ViewingRoomArtwork_artworksList$key } from "__generated__/ViewingRoomArtwork_artworksList.graphql"
import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { cm2in } from "lib/utils/conversions"
import { LoadingScreen } from "lib/utils/LoadingScreen"
import React, { useRef } from "react"
import { NativeModules, ScrollView, TouchableWithoutFeedback, View } from "react-native"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { ImageCarousel } from "../Artwork/Components/ImageCarousel/ImageCarousel"

const Constants = NativeModules.ARCocoaConstantsModule
const ApiModule = NativeModules.ARTemporaryAPIModule


interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  artworksList: ViewingRoomArtwork_artworksList$key
}

const selectedArtworkFragmentSpec = graphql`
  fragment ViewingRoomArtwork_selectedArtwork on Artwork {
    title
    artistNames
    date
    description
    saleMessage
    href
    image {
      url(version: "larger")
      aspectRatio
    }
    isHangable
    widthCm
    heightCm
    id
  }
`

const artworksListFragmentSpec = graphql`
  fragment ViewingRoomArtwork_artworksList on ViewingRoom {
    artworksConnection(first: 1) {
      edges {
        node {
          # ...ImageCarousel_images
          title
          artistNames
          date
          description
          saleMessage
          image {
            url(version: "larger")
            aspectRatio
          }
        }
      }
    }
  }
`

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkProps> = props => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const artworksList = useFragment(artworksListFragmentSpec, props.artworksList)

  const navRef = useRef(null)

  const viewInAR = () => {
    const [widthIn, heightIn] = [selectedArtwork.widthCm, selectedArtwork.heightCm].map(cm2in)

    ApiModule.presentAugmentedRealityVIR(
      selectedArtwork.image?.url,
      widthIn,
      heightIn,
      selectedArtwork.slug,
      selectedArtwork.id
    )
  }

  // {/* click for full view */}
  //  {/* <ImageCarousel images={artworks} /> */}
  return (
    <ScrollView ref={navRef}>
      <Flex>
        <ImageView imageURL={selectedArtwork.image?.url} aspectRatio={selectedArtwork.image!.aspectRatio} />
        {!!(Constants.AREnabled && selectedArtwork.isHangable) && (
          <Flex
            position="absolute"
            bottom="1"
            right="1"
            backgroundColor="white100"
            borderColor="black5"
            borderWidth={1}
            borderRadius={2}
          >
            <TouchableWithoutFeedback onPress={viewInAR}>
              <Flex flexDirection="row" mx="1" height={24} alignItems="center">
                <EyeOpenedIcon />
                <Spacer ml={5} />
                <Sans size="2">View on wall</Sans>
              </Flex>
            </TouchableWithoutFeedback>
          </Flex>
        )}
      </Flex>
      <Box mt="2" mx="2">
        <Sans size="5t" color="black100" weight="medium">
          {selectedArtwork.artistNames}
        </Sans>
        <Sans size="4t" color="black60">
          {selectedArtwork.title}, {selectedArtwork.date}
        </Sans>
        <Spacer mt="2" />
        <Sans size="4t" color="black100">
          {selectedArtwork.saleMessage}
        </Sans>
        {!!selectedArtwork.description && (
          <>
            <Spacer mt="2" />
            <Serif size="4t">{selectedArtwork.description}</Serif>
          </>
        )}
        <Spacer mt="4" />
        <Button
          variant="primaryBlack"
          size="medium"
          block
          onPress={() => void SwitchBoard.presentNavigationViewController(navRef.current!, selectedArtwork.href!)}
        >
          View more details
        </Button>
        <Spacer mt="3" />
        <Separator />
        <Spacer mt="3" />
      </Box>
    </ScrollView>
  )
}

const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      title
      ...ViewingRoomArtwork_artworksList
    }
  }
`

export const ViewingRoomArtworkQueryRenderer: React.FC<{ viewingRoomID: string; artworkID: string }> = ({
  viewingRoomID,
  artworkID,
}) => {
  const { props, error } = useQuery(query, { viewingRoomID, artworkID }, { networkCacheConfig: { force: true } })
  if (props) {
    return <ViewingRoomArtworkContainer selectedArtwork={props.artwork} artworksList={props.viewingRoom} />
  }
  if (error) {
    throw error
  }

  return <LoadingScreen />
}
