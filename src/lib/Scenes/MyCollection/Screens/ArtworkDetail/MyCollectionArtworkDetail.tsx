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
import { MyCollectionArtworkHeaderFragmentContainer as MyCollectionArtworkHeader } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer as ArtworkMeta } from "./Components/MyCollectionArtworkMeta"
import { WhySell } from "./Components/WhySell"

export interface MyCollectionArtworkDetailProps {
  artwork: NonNullable<MyCollectionArtworkDetailQueryResponse["artwork"]>
}

const MyCollectionArtworkDetail: React.FC<MyCollectionArtworkDetailProps> = ({ artwork }) => {
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
        <MyCollectionArtworkHeader artwork={artwork} />
        <ArtworkMeta artwork={artwork} />
        <Separator />
        <ArtworkInsights artwork={artwork} />
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
      query={graphql`
        query MyCollectionArtworkDetailQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            internalID
            id
            artistNames
            artist {
              internalID
            }
            medium
            title
            date
            category

            # TODO / QUESTION: In the "Add Artwork" form we have a "metric" select menu; this is *only* used
            # to set the dimension for computing inches or cm values on back end. We can't return
            # the dimension used for initially setting, but we can grab both values here. Not sure
            # about the best way to set the edit screen select.
            dimensions {
              in
              cm
            }

            ...MyCollectionArtworkHeader_artwork
            ...MyCollectionArtworkMeta_artwork
            ...MyCollectionArtworkInsights_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      // TODO: Need to add <Skeleton> stuff
      render={renderWithLoadProgress(MyCollectionArtworkDetail)}
    />
  )
}
