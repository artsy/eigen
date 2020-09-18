import {
  MyCollectionArtworkDetailMarketInsightsQuery,
  MyCollectionArtworkDetailMarketInsightsQueryResponse,
} from "__generated__/MyCollectionArtworkDetailMarketInsightsQuery.graphql"
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
import { Navigator } from "../../Components/Navigator"
import { MyCollectionArtworkInsightsFragmentContainer as ArtworkInsights } from "./Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer as ArtworkHeader } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer as ArtworkMeta } from "./Components/MyCollectionArtworkMeta"
import { WhySell } from "./Components/WhySell"

export interface MyCollectionArtworkDetailProps {
  artwork: NonNullable<MyCollectionArtworkDetailQueryResponse["artwork"]>
  marketPriceInsights: NonNullable<MyCollectionArtworkDetailMarketInsightsQueryResponse["marketPriceInsights"]>
}

const MyCollectionArtworkDetail: React.FC<MyCollectionArtworkDetailProps> = ({ artwork, marketPriceInsights }) => {
  const navActions = AppStore.actions.myCollection.navigation
  const artworkActions = AppStore.actions.myCollection.artwork

  return (
    <Navigator>
      <ScrollView>
        <FancyModalHeader
          leftButtonText=""
          rightButtonText="Edit"
          onRightButtonPress={() => {
            artworkActions.startEditingArtwork(artwork as any) // FIXME: remove `any` type
          }}
          hideBottomDivider
        />
        <Join separator={<Spacer my={1} />}>
          <ArtworkHeader artwork={artwork} />
          <ArtworkMeta artwork={artwork} />
          <ArtworkInsights artwork={artwork} marketPriceInsights={marketPriceInsights} />
          <WhySell />

          <ScreenMargin>
            <Button size="large" block onPress={() => navActions.navigateToConsign()}>
              Submit this work
            </Button>

            <Spacer my={0.5} />

            <Button size="large" variant="secondaryGray" block>
              Learn more
            </Button>
          </ScreenMargin>

          <Spacer my={2} />
        </Join>
      </ScrollView>
    </Navigator>
  )
}

export const MyCollectionArtworkDetailQueryRenderer: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  return (
    <QueryRenderer<MyCollectionArtworkDetailQuery>
      environment={defaultEnvironment}
      /**
       *  First fetch the artwork query to get props needed to fetch second query
       */
      query={graphql`
        query MyCollectionArtworkDetailQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            artist {
              internalID
            }
            medium

            ...MyCollectionArtworkHeader_artwork
            ...MyCollectionArtworkMeta_artwork
            ...MyCollectionArtworkInsights_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={renderWithPlaceholder({
        renderPlaceholder: LoadingSkeleton,
        Container: (props: MyCollectionArtworkDetailProps) => {
          return (
            <QueryRenderer<MyCollectionArtworkDetailMarketInsightsQuery>
              environment={defaultEnvironment}
              /**
               * Then, fetch market insights using results from artwork query as input variables
               */
              query={graphql`
                query MyCollectionArtworkDetailMarketInsightsQuery($artistID: ID!, $medium: String!) {
                  marketPriceInsights(artistId: $artistID, medium: $medium) {
                    ...MyCollectionArtworkInsights_marketPriceInsights
                  }
                }
              `}
              variables={{
                artistID: props!.artwork!.artist!.internalID!,
                medium: props!.artwork!.medium!,
              }}
              render={renderWithPlaceholder({
                initialProps: props,
                Container: MyCollectionArtworkDetail,
                renderPlaceholder: LoadingSkeleton,
              })}
            />
          )
        },
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
