import {
  MyCollectionArtworkDetailQuery,
  MyCollectionArtworkDetailQueryResponse,
} from "__generated__/MyCollectionArtworkDetailQuery.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Button, Flex, Join, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { MyCollectionArtworkInsightsFragmentContainer } from "./Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "./Components/MyCollectionArtworkMeta"
import { WhySell } from "./Components/WhySell"

export interface MyCollectionArtworkDetailProps {
  artwork: NonNullable<MyCollectionArtworkDetailQueryResponse["artwork"]>
  marketPriceInsights: NonNullable<MyCollectionArtworkDetailQueryResponse["marketPriceInsights"]>
}

const MyCollectionArtworkDetail: React.FC<MyCollectionArtworkDetailProps> = ({ artwork, marketPriceInsights }) => {
  const navActions = AppStore.actions.myCollection.navigation
  const artworkActions = AppStore.actions.myCollection.artwork

  return (
    <ScrollView>
      <FancyModalHeader
        onLeftButtonPress={() => navActions.goBack()}
        rightButtonText="Edit"
        onRightButtonPress={() => {
          artworkActions.startEditingArtwork(artwork as any) // FIXME: remove `any` type
        }}
        hideBottomDivider
      />
      <Join separator={<Spacer my={1} />}>
        <MyCollectionArtworkHeaderFragmentContainer artwork={artwork} />
        <MyCollectionArtworkMetaFragmentContainer artwork={artwork} />
        <MyCollectionArtworkInsightsFragmentContainer artwork={artwork} marketPriceInsights={marketPriceInsights} />
        <WhySell />

        <ScreenMargin>
          <Button
            size="large"
            block
            onPress={() => navActions.navigateToConsignSubmission()}
            data-test-id="SubmitButton"
          >
            Submit this work
          </Button>

          <Spacer my={0.5} />

          <Button
            size="large"
            variant="secondaryGray"
            block
            onPress={() => navActions.navigateToConsignLearnMore()}
            data-test-id="LearnMoreButton"
          >
            Learn more
          </Button>
        </ScreenMargin>

        <Spacer my={2} />
      </Join>
    </ScrollView>
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
  fragment MyCollectionArtworkDetail_sharedProps on Artwork {
    artist {
      internalID
    }
    artistNames
    category
    costMinor
    costCurrencyCode
    date
    depth
    editionSize
    editionNumber
    height
    id
    image {
      url
    }
    internalID
    medium
    metric
    slug
    title
    width
  }
`

export const MyCollectionArtworkDetailQueryRenderer: React.FC<{
  artworkSlug: string
  artistInternalID: string
  medium: string
}> = ({ artworkSlug, artistInternalID, medium }) => {
  return (
    <QueryRenderer<MyCollectionArtworkDetailQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkDetailQuery($artworkSlug: String!, $artistInternalID: ID!, $medium: String!) {
          artwork(id: $artworkSlug) {
            ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
            ...MyCollectionArtworkHeader_artwork
            ...MyCollectionArtworkMeta_artwork
            ...MyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
            ...MyCollectionArtworkInsights_marketPriceInsights
          }
        }
      `}
      variables={{
        artworkSlug,
        artistInternalID,
        medium,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionArtworkDetail,
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
  MyCollectionArtworkDetail,
}
