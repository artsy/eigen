import { Box, Button, color, EyeOpenedIcon, Flex, LargeCard, Sans, Separator, Serif, Spacer } from "@artsy/palette"
import { ViewingRoomArtwork_artworksList$key } from "__generated__/ViewingRoomArtwork_artworksList.graphql"
import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import { ViewingRoomArtwork_viewingRoomInfo$key } from "__generated__/ViewingRoomArtwork_viewingRoomInfo.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { cm2in } from "lib/utils/conversions"
import { extractNodes } from "lib/utils/extractNodes"
import { LoadingScreen } from "lib/utils/LoadingScreen"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef } from "react"
import { FlatList, NativeModules, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from "react-native"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { ImageCarousel } from "../Artwork/Components/ImageCarousel/ImageCarousel"
import { tagForStatus } from "./Components/ViewingRoomsListItem"

const Constants = NativeModules.ARCocoaConstantsModule
const ApiModule = NativeModules.ARTemporaryAPIModule

interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  artworksList: ViewingRoomArtwork_artworksList$key
  viewingRoomInfo: ViewingRoomArtwork_viewingRoomInfo$key
}

const selectedArtworkFragmentSpec = graphql`
  fragment ViewingRoomArtwork_selectedArtwork on Artwork {
    title
    artistNames
    date
    description
    saleMessage
    href
    slug
    image {
      url(version: "larger")
      aspectRatio
    }
    isHangable
    widthCm
    heightCm
    id
    images {
      ...ImageCarousel_images @relay(mask: false) # We need this because ImageCarousel uses regular react-relay and we have relay-hooks here.
    }
  }
`

const artworksListFragmentSpec = graphql`
  fragment ViewingRoomArtwork_artworksList on ViewingRoom {
    artworksConnection {
      edges {
        node {
          slug
          image {
            url(version: "larger")
            aspectRatio
          }
        }
      }
    }
  }
`

const viewingRoomInfoFragmentSpec = graphql`
  fragment ViewingRoomArtwork_viewingRoomInfo on ViewingRoom {
    title
    partner {
      name
    }
    heroImageURL
    status
    distanceToOpen
    distanceToClose
    slug
  }
`

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkProps> = props => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const artworksList = useFragment(artworksListFragmentSpec, props.artworksList)
  const artworks = extractNodes(artworksList.artworksConnection)
  const vrInfo = useFragment(viewingRoomInfoFragmentSpec, props.viewingRoomInfo)

  const navRef = useRef(null)
  const { height: screenHeight } = useScreenDimensions()

  const viewInAR = () => {
    const [widthIn, heightIn] = [selectedArtwork.widthCm!, selectedArtwork.heightCm!].map(cm2in)

    // @ts-ignore STRICTNESS_MIGRATION
    ApiModule.presentAugmentedRealityVIR(
      selectedArtwork.image?.url,
      widthIn,
      heightIn,
      selectedArtwork.slug,
      selectedArtwork.id
    )
  }

  const tag = tagForStatus(vrInfo.status, vrInfo.distanceToOpen, vrInfo.distanceToClose)

  return (
    <ScrollView ref={navRef}>
      <Flex>
        <ImageCarousel images={[selectedArtwork.images![0]] as any} cardHeight={screenHeight} />
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
      </Box>

      {artworks.length > 1 && (
        <>
          <Box mx="2">
            <Spacer mt="3" />
            <Separator />
            <Spacer mt="3" />
            <Sans size="4" weight="medium">
              More images
            </Sans>
            <Spacer mt="2" />
          </Box>
          <FlatList
            data={artworks}
            keyExtractor={item => item.slug}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                  onPress={() => {
                    SwitchBoard.presentNavigationViewController(
                      navRef.current!,
                      `/viewing-room/${vrInfo.slug}/${item.slug}`
                    )
                  }}
                  underlayColor={color("white100")}
                  activeOpacity={0.8}
                >
                  <OpaqueImageView imageURL={item.image?.url} aspectRatio={item.image!.aspectRatio} />
                </TouchableHighlight>
              )
            }}
            ItemSeparatorComponent={() => <Spacer mt={0.5} />}
          />
        </>
      )}

      <Box mx="2">
        <Spacer mt="3" />
        <Separator />
        <Spacer mt="3" />
        <Sans size="4" weight="medium">
          In viewing room
        </Sans>
        <Spacer mt="2" />
      </Box>
      <TouchableHighlight
        onPress={() =>
          void SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${vrInfo.slug!}`)
        }
        underlayColor={color("white100")}
        activeOpacity={0.8}
      >
        <LargeCard title={vrInfo.title} subtitle={vrInfo.partner!.name!} image={vrInfo.heroImageURL!} tag={tag} />
      </TouchableHighlight>
    </ScrollView>
  )
}

const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      ...ViewingRoomArtwork_artworksList
      ...ViewingRoomArtwork_viewingRoomInfo
    }
  }
`

export const ViewingRoomArtworkQueryRenderer: React.FC<{ id: string; artwork_id: string }> = ({
  id: viewingRoomID,
  artwork_id: artworkID,
}) => {
  const { props, error } = useQuery(query, { viewingRoomID, artworkID }, { networkCacheConfig: { force: true } })
  if (props) {
    return (
      <ViewingRoomArtworkContainer
        selectedArtwork={props.artwork}
        artworksList={props.viewingRoom}
        viewingRoomInfo={props.viewingRoom}
      />
    )
  }
  if (error) {
    throw error
  }

  return <LoadingScreen />
}
