import {
  ActionType,
  ContextModule,
  editCollectedArtwork,
  OwnerType,
  tappedSell,
  TappedShowMore,
} from "@artsy/cohesion"
import {
  OldMyCollectionArtworkQuery,
  OldMyCollectionArtworkQueryResponse,
} from "__generated__/OldMyCollectionArtworkQuery.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { goBack, navigate, popToRoot } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { OldMyCollectionArtworkInsightsFragmentContainer } from "lib/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/OldMyCollectionArtworkInsights"
import { GlobalStore } from "lib/store/GlobalStore"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkHeaderFragmentContainer } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "./Components/MyCollectionArtworkMeta"
import { WhySell } from "./Components/WhySell"
import { MyCollectionArtworkScreenProps } from "./MyCollectionArtwork"

export interface MyCollectionArtworkProps {
  artwork: NonNullable<OldMyCollectionArtworkQueryResponse["artwork"]>
  marketPriceInsights: NonNullable<OldMyCollectionArtworkQueryResponse["marketPriceInsights"]>
}

export const MyCollectionArtwork: React.FC<MyCollectionArtworkProps> = ({
  artwork,
  marketPriceInsights,
}) => {
  const { trackEvent } = useTracking()
  const displayEditButton = !artwork.consignmentSubmission?.inProgress

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollectionArtwork,
        context_screen_owner_id: artwork.internalID,
        context_screen_owner_slug: artwork.slug,
      })}
    >
      <ScrollView>
        <FancyModalHeader
          onRightButtonPress={
            displayEditButton
              ? () => {
                  trackEvent(tracks.editCollectedArtwork(artwork.internalID, artwork.slug))
                  GlobalStore.actions.myCollection.artwork.startEditingArtwork(artwork as any)
                  navigate(`my-collection/artworks/${artwork.internalID}/edit`, {
                    passProps: {
                      mode: "edit",
                      artwork,
                      onSuccess: popToRoot,
                      onDelete: popToRoot,
                    },
                  })
                }
              : undefined
          }
          onLeftButtonPress={goBack}
          hideBottomDivider
          renderRightButton={() => (
            <Flex pt="2px">
              <Text>Edit</Text>
            </Flex>
          )}
        />
        <Join separator={<Spacer my={1} />}>
          <MyCollectionArtworkHeaderFragmentContainer artwork={artwork} />
          <MyCollectionArtworkMetaFragmentContainer artwork={artwork} />
          <OldMyCollectionArtworkInsightsFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
          <WhySell />

          <ScreenMargin>
            <Button
              size="large"
              variant="fillGray"
              block
              onPress={() => {
                trackEvent(tracks.tappedShowMore(artwork.internalID, artwork.slug, "Learn More"))
                navigate("/sales")
              }}
              testID="LearnMoreButton"
            >
              Learn more
            </Button>
          </ScreenMargin>

          <Spacer my={2} />
        </Join>
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

/**
 * * IMPORTANT *
 *
 * The following shared artwork fields are needed for initializing the edit
 * artwork view. This is also used for handling mutation view updates.
 *
 * When adding new fields this fragment needs to be updated.
 */
export const ArtworkMetaProps = graphql`
  fragment OldMyCollectionArtwork_sharedProps on Artwork {
    artist {
      internalID
      formattedNationalityAndBirthday
    }
    artistNames
    category
    pricePaid {
      display
      minor
      currencyCode
    }
    date
    depth
    editionSize
    editionNumber
    height
    attributionClass {
      name
    }
    id
    images {
      isDefault
      imageURL
      width
      height
      internalID
    }
    internalID
    isEdition
    medium
    metric
    artworkLocation
    provenance
    slug
    title
    width
    consignmentSubmission {
      inProgress
    }
  }
`

export const OldMyCollectionArtworkQueryRenderer: React.FC<MyCollectionArtworkScreenProps> = ({
  artworkSlug,
  artistInternalID,
  medium,
}) => {
  return (
    <QueryRenderer<OldMyCollectionArtworkQuery>
      environment={defaultEnvironment}
      query={graphql`
        query OldMyCollectionArtworkQuery(
          $artworkSlug: String!
          $artistInternalID: ID!
          $medium: String!
        ) {
          artwork(id: $artworkSlug) {
            ...OldMyCollectionArtwork_sharedProps @relay(mask: false)
            ...MyCollectionArtworkHeader_artwork
            ...MyCollectionArtworkMeta_artwork
            ...OldMyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
            ...OldMyCollectionArtworkInsights_marketPriceInsights
          }
        }
      `}
      variables={{
        artworkSlug,
        artistInternalID,
        medium,
      }}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: MyCollectionArtwork,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <ScreenMargin>
        <Spacer mb={6} />

        {/* Artist Name */}
        <PlaceholderBox width={300} height={30} />
        <Spacer mb={1} />

        {/* Artwork title, year */}
        <PlaceholderText width={100} />
        <Spacer mb={1} />
      </ScreenMargin>

      {/* Main image */}
      <PlaceholderBox width="100%" height={300} />
      <Spacer mb={3} />

      {/* Metadata stats  */}
      <ScreenMargin>
        <Flex flexDirection="column">
          <Join separator={<Spacer mb={1} />}>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <PlaceholderBox width={50} height={20} />
              <PlaceholderBox width={80} height={20} />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <PlaceholderBox width={30} height={20} />
              <PlaceholderBox width={100} height={20} />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <PlaceholderBox width={10} height={20} />
              <PlaceholderBox width={40} height={20} />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <PlaceholderBox width={30} height={20} />
              <PlaceholderBox width={70} height={20} />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <PlaceholderBox width={50} height={20} />
              <PlaceholderBox width={80} height={20} />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center" pt={1}>
              <PlaceholderText width={50} />
            </Flex>
          </Join>
        </Flex>

        {/* Price / Market insight info */}
        <Spacer mb={3} />
        <Divider />
        <Spacer mb={2} />
        <PlaceholderBox width={100} height={30} />
        <Spacer mb={1} />
        <PlaceholderText width={30} />
      </ScreenMargin>
    </>
  )
}

export const tests = {
  MyCollectionArtwork,
}

const tracks = {
  editCollectedArtwork: (internalID: string, slug: string) => {
    return editCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
  tappedSellArtwork: (internalID: string, slug: string, subject: string) => {
    return tappedSell({
      contextModule: ContextModule.sellFooter,
      contextScreenOwnerType: OwnerType.myCollectionArtwork,
      contextScreenOwnerId: internalID,
      contextScreenOwnerSlug: slug,
      subject,
    })
  },
  tappedShowMore: (internalID: string, slug: string, subject: string) => {
    const tappedShowMore: TappedShowMore = {
      action: ActionType.tappedShowMore,
      context_module: ContextModule.sellFooter,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      subject,
    }
    return tappedShowMore
  },
}
