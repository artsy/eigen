import { ShowIcon } from "@artsy/icons/native"
import { Box, Button, Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { ViewingRoomArtworkQuery } from "__generated__/ViewingRoomArtworkQuery.graphql"
import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import { ViewingRoomArtwork_viewingRoomInfo$key } from "__generated__/ViewingRoomArtwork_viewingRoomInfo.graphql"
import { LargeCard } from "app/Components/Cards"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ImageCarousel } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { RouterLink } from "app/system/navigation/RouterLink"
import { cm2in } from "app/utils/conversions"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { drop } from "lodash"
import { Suspense, useEffect } from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import {
  graphql,
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay"
import { useTracking } from "react-tracking"

import { tagForStatus } from "./Components/ViewingRoomsListItem"

interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  viewingRoomInfo: ViewingRoomArtwork_viewingRoomInfo$key
}

interface ViewingRoomArtworkContainerProps {
  queryRef: PreloadedQuery<ViewingRoomArtworkQuery>
}

export const ViewingRoomArtwork: React.FC<ViewingRoomArtworkProps> = (props) => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const vrInfo = useFragment(viewingRoomInfoFragmentSpec, props.viewingRoomInfo)

  const { height: screenHeight } = useScreenDimensions()

  const { trackEvent } = useTracking()

  const viewInAR = () => {
    if (
      !!selectedArtwork.isHangable &&
      ((selectedArtwork.widthCm && selectedArtwork.heightCm) || selectedArtwork.diameterCm) &&
      !!selectedArtwork?.image?.url
    ) {
      const artworkWidth = (selectedArtwork.widthCm || selectedArtwork.diameterCm) as number
      const artworkHeight = (selectedArtwork.heightCm || selectedArtwork.diameterCm) as number

      const [widthIn, heightIn] = [artworkWidth, artworkHeight].map(cm2in)

      LegacyNativeModules.ARTNativeScreenPresenterModule.presentAugmentedRealityVIR(
        selectedArtwork.image.url,
        widthIn,
        heightIn,
        selectedArtwork.slug,
        selectedArtwork.id
      )
    }
  }

  const moreImages = drop(selectedArtwork.figures, 1)

  const tag = tagForStatus(vrInfo.status, vrInfo.distanceToOpen, vrInfo.distanceToClose)

  return (
    <ProvideScreenTracking
      info={tracks.screen(vrInfo.internalID, vrInfo.slug, selectedArtwork.id, selectedArtwork.slug)}
    >
      <ScrollView>
        <Flex>
          <ImageCarousel
            staticImages={[selectedArtwork.figures?.[0]] as any}
            cardHeight={screenHeight}
          />
          {!!(
            LegacyNativeModules.ARCocoaConstantsModule.AREnabled && selectedArtwork.isHangable
          ) && (
            <Flex
              position="absolute"
              bottom={1}
              right="1"
              backgroundColor="mono0"
              borderColor="mono5"
              borderWidth={1}
              borderRadius={2}
            >
              <TouchableWithoutFeedback accessibilityRole="button" onPress={viewInAR}>
                <Flex flexDirection="row" mx={1} height={24} alignItems="center">
                  <ShowIcon />
                  <Spacer x={0.5} />
                  <Text variant="xs">View on wall</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
          )}
        </Flex>
        <Box mt={2} mx={2}>
          <Text variant="sm-display" color="mono100">
            {selectedArtwork.artistNames}
          </Text>
          <Text variant="sm" color="mono60">
            {selectedArtwork.title}, {selectedArtwork.date}
          </Text>
          <Spacer y={2} />
          <Text variant="sm" color="mono100">
            {selectedArtwork.saleMessage}
          </Text>
          {!!selectedArtwork.additionalInformation && (
            <>
              <Spacer y={2} />
              <Text variant="sm">{selectedArtwork.additionalInformation}</Text>
            </>
          )}
          <Spacer y={4} />
          <RouterLink
            to={selectedArtwork.href}
            hasChildTouchable
            onPress={() => {
              if (!!selectedArtwork.href) {
                trackEvent(
                  tracks.tap(
                    vrInfo.internalID,
                    vrInfo.slug,
                    selectedArtwork.id,
                    selectedArtwork.slug
                  )
                )
              }
            }}
          >
            <Button variant="fillDark" block>
              View more details
            </Button>
          </RouterLink>
        </Box>

        {moreImages.length > 0 && (
          <>
            <Box mx={2}>
              <Spacer y={4} />
              <Separator />
              <Spacer y={4} />
              <Text variant="sm">More images</Text>
              <Spacer y={2} />
            </Box>
            <FlatList
              data={moreImages}
              keyExtractor={(_item, index) => `${index}`}
              renderItem={({ item }) => (
                <ImageCarousel staticImages={[item] as any} cardHeight={screenHeight} />
              )}
              ItemSeparatorComponent={() => <Spacer y={0.5} />}
            />
          </>
        )}

        <Box mx={2}>
          <Spacer y={4} />
          <Separator />
          <Spacer y={4} />
          <Text variant="sm">In viewing room</Text>
          <Spacer y={2} />
        </Box>
        <RouterLink to={vrInfo.slug ? `/viewing-room/${vrInfo.slug}` : undefined}>
          <LargeCard
            title={vrInfo.title}
            subtitle={vrInfo?.partner?.name ?? ""}
            image={vrInfo.heroImage?.imageURLs?.normalized ?? ""}
            tag={tag}
          />
        </RouterLink>
      </ScrollView>
    </ProvideScreenTracking>
  )
}

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkContainerProps> = ({
  queryRef,
}) => {
  const data = usePreloadedQuery<ViewingRoomArtworkQuery>(ViewingRoomArtworkScreenQuery, queryRef)

  if (!data.artwork || !data.viewingRoom) {
    return null
  }

  return <ViewingRoomArtwork selectedArtwork={data.artwork} viewingRoomInfo={data.viewingRoom} />
}

export const ViewingRoomArtworkScreenQuery = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      ...ViewingRoomArtwork_viewingRoomInfo
    }
  }
`

export const ViewingRoomArtworkScreen: React.FC<{
  viewingRoomID: string
  artwork_id: string
}> = ({ viewingRoomID, artwork_id: artworkID }) => {
  const [queryRef, loadQuery] = useQueryLoader<ViewingRoomArtworkQuery>(
    ViewingRoomArtworkScreenQuery
  )

  useEffect(() => {
    if (!queryRef) {
      loadQuery({ viewingRoomID, artworkID })
    }
  })

  if (!queryRef) {
    return null
  }

  return (
    <Suspense fallback={<Placeholder />}>
      <ViewingRoomArtworkContainer queryRef={queryRef} />
    </Suspense>
  )
}

export const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox width="100%" height="60%" />
    <Flex mt={2} ml={2} testID="viewing-room-artwork-placeholder">
      <PlaceholderText width={130 + Math.random() * 100} marginTop={10} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={8} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
    </Flex>
  </ProvidePlaceholderContext>
)

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
    diameterCm
    id
    figures {
      ...ImageCarousel_figures @relay(mask: false) # We need this because ImageCarousel uses regular react-relay and we have relay-hooks here.
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
