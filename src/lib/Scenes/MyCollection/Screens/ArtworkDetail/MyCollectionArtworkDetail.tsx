import {
  MyCollectionArtworkDetailMarketInsightsQuery,
  MyCollectionArtworkDetailMarketInsightsQueryResponse,
} from "__generated__/MyCollectionArtworkDetailMarketInsightsQuery.graphql"
import {
  MyCollectionArtworkDetailQuery,
  MyCollectionArtworkDetailQueryResponse,
} from "__generated__/MyCollectionArtworkDetailQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Button, Join, Separator, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
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
        <Separator />
        <ArtworkInsights artwork={artwork} marketPriceInsights={marketPriceInsights} />
        <Separator />
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
  )
}

export const MyCollectionArtworkDetailQueryRenderer: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  return (
    <QueryRenderer<MyCollectionArtworkDetailQuery>
      environment={defaultEnvironment}
      // TODO: Need to add <Skeleton> stuff
      // First fetch the artwork query to get props needed to fetch second query
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
      // Then fetch market insights using results from artwork query as input variables
      render={renderWithLoadProgress((props: MyCollectionArtworkDetailQueryResponse) => {
        return (
          <QueryRenderer<MyCollectionArtworkDetailMarketInsightsQuery>
            environment={defaultEnvironment}
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
            // TODO: Need to add <Skeleton> stuff
            render={renderWithLoadProgress(MyCollectionArtworkDetail, props)}
          />
        )
      })}
    />
  )
}
