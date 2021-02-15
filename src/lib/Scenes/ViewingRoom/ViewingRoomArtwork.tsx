import { LoadFailureView } from "lib/Components/LoadFailureView"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { navigate } from "lib/navigation/navigate"
import { cm2in } from "lib/utils/conversions"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import _ from "lodash"
import { Box, Button, EyeOpenedIcon, Flex, LargeCard, Sans, Separator, Spacer, Text, Touchable } from "palette"
import React from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment, useQuery } from "relay-hooks"

import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import { ViewingRoomArtwork_viewingRoomInfo$key } from "__generated__/ViewingRoomArtwork_viewingRoomInfo.graphql"
import { ViewingRoomArtworkQuery } from "__generated__/ViewingRoomArtworkQuery.graphql"
import { ImageCarousel } from "../Artwork/Components/ImageCarousel/ImageCarousel"
import { tagForStatus } from "./Components/ViewingRoomsListItem"

interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  viewingRoomInfo: ViewingRoomArtwork_viewingRoomInfo$key
}

const selectedArtworkFragmentSpec = graphql`
  fragment ViewingRoomArtwork_selectedArtwork on Artwork {
    title
    artistNames
    date
    additionalInformation
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

const viewingRoomInfoFragmentSpec = graphql`
  fragment ViewingRoomArtwork_viewingRoomInfo on ViewingRoom {
    title
    partner {
      name
    }
    heroImage: image {
      imageURLs {
        normalized
      }
    }
    status
    distanceToOpen
    distanceToClose
    internalID
    slug
  }
`

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkProps> = (props) => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const vrInfo = useFragment(viewingRoomInfoFragmentSpec, props.viewingRoomInfo)

  const { height: screenHeight } = useScreenDimensions()

  const { trackEvent } = useTracking()

  const viewInAR = () => {
    const [widthIn, heightIn] = [selectedArtwork.widthCm!, selectedArtwork.heightCm!].map(cm2in)

    LegacyNativeModules.ARScreenPresenterModule.presentAugmentedRealityVIR(
      selectedArtwork.image!.url!,
      widthIn,
      heightIn,
      selectedArtwork.slug,
      selectedArtwork.id
    )
  }

  const moreImages = _.drop(selectedArtwork.images!, 1)

  const tag = tagForStatus(vrInfo.status, vrInfo.distanceToOpen, vrInfo.distanceToClose)

  return (
    <ProvideScreenTracking
      info={tracks.screen(vrInfo.internalID, vrInfo.slug, selectedArtwork.id, selectedArtwork.slug)}
    >
      <ScrollView>
        <Flex>
          <ImageCarousel images={[selectedArtwork.images![0]] as any} cardHeight={screenHeight} />
          {!!(LegacyNativeModules.ARCocoaConstantsModule.AREnabled && selectedArtwork.isHangable) && (
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
                  <Spacer ml="5" />
                  <Sans size="2">View on wall</Sans>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
          )}
        </Flex>
        <Box mt="2" mx="2">
          <Text variant="title" color="black100">
            {selectedArtwork.artistNames}
          </Text>
          <Text variant="text" color="black60">
            {selectedArtwork.title}, {selectedArtwork.date}
          </Text>
          <Spacer mt="2" />
          <Text variant="text" color="black100">
            {selectedArtwork.saleMessage}
          </Text>
          {!!selectedArtwork.additionalInformation && (
            <>
              <Spacer mt="2" />
              <Text variant="text">{selectedArtwork.additionalInformation}</Text>
            </>
          )}
          <Spacer mt="4" />
          <Button
            variant="primaryBlack"
            size="medium"
            block
            onPress={() => {
              trackEvent(tracks.tap(vrInfo.internalID, vrInfo.slug, selectedArtwork.id, selectedArtwork.slug))
              navigate(selectedArtwork.href!)
            }}
          >
            View more details
          </Button>
        </Box>

        {moreImages.length > 0 && (
          <>
            <Box mx="2">
              <Spacer mt="3" />
              <Separator />
              <Spacer mt="3" />
              <Text variant="mediumText">More images</Text>
              <Spacer mt="2" />
            </Box>
            <FlatList
              data={moreImages}
              keyExtractor={(_item, index) => `${index}`}
              renderItem={({ item }) => <ImageCarousel images={[item] as any} cardHeight={screenHeight} />}
              ItemSeparatorComponent={() => <Spacer mt="0.5" />}
            />
          </>
        )}

        <Box mx="2">
          <Spacer mt="3" />
          <Separator />
          <Spacer mt="3" />
          <Text variant="mediumText">In viewing room</Text>
          <Spacer mt="2" />
        </Box>
        <Touchable onPress={() => navigate(`/viewing-room/${vrInfo.slug!}`)}>
          <LargeCard
            title={vrInfo.title}
            subtitle={vrInfo.partner!.name!}
            image={vrInfo.heroImage?.imageURLs?.normalized ?? ""}
            tag={tag}
          />
        </Touchable>
      </ScrollView>
    </ProvideScreenTracking>
  )
}

const tracks = {
  screen: (vrId: string, vrSlug: string, artworkId: string, artworkSlug: string) => ({
    screen: Schema.PageNames.ViewingRoomArtworkPage,
    context_screen: Schema.PageNames.ViewingRoomArtworkPage,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: vrId,
    context_screen_owner_slug: vrSlug,
    artwork_id: artworkId,
    artwork_slug: artworkSlug,
  }),
  tap: (vrId: string, vrSlug: string, artworkId: string, artworkSlug: string) => ({
    action: Schema.ActionNames.TappedViewMoreDetails,
    context_screen: Schema.PageNames.ViewingRoomArtworkPage,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: vrId,
    context_screen_owner_slug: vrSlug,
    destination_screen: Schema.PageNames.ArtworkPage,
    destination_screen_owner_id: artworkId,
    destination_screen_owner_slug: artworkSlug,
  }),
}

const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      ...ViewingRoomArtwork_viewingRoomInfo
    }
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox width="100%" height="60%" />
    <Flex mt="2" ml="2">
      <PlaceholderText width={130 + Math.random() * 100} marginTop={10} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={8} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomArtworkQueryRenderer: React.FC<{ viewing_room_id: string; artwork_id: string }> = ({
  viewing_room_id: viewingRoomID,
  artwork_id: artworkID,
}) => {
  const { props, error, retry } = useQuery<ViewingRoomArtworkQuery>(
    query,
    { viewingRoomID, artworkID },
    { networkCacheConfig: { force: true } }
  )
  if (props) {
    return <ViewingRoomArtworkContainer selectedArtwork={props.artwork!} viewingRoomInfo={props.viewingRoom!} />
  }
  if (error) {
    console.error(error)
    return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
  }

  return <Placeholder />
}
