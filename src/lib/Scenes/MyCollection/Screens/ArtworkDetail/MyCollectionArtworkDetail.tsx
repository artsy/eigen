import {
  MyCollectionArtworkDetailQuery,
  MyCollectionArtworkDetailQueryResponse,
} from "__generated__/MyCollectionArtworkDetailQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { MyCollectionArtworkInsightsFragmentContainer as ArtworkInsights } from "./Components/MyCollectionArtworkInsights"
import { MyCollectionArtworkMetaFragmentContainer as ArtworkMeta } from "./Components/MyCollectionArtworkMeta"
import { WhySellStep } from "./Components/WhySell"

export interface MyCollectionArtworkDetailProps {
  artwork: NonNullable<MyCollectionArtworkDetailQueryResponse["artwork"]>
}

const MyCollectionArtworkDetail: React.FC<MyCollectionArtworkDetailProps> = ({ artwork }) => {
  const dimensions = useScreenDimensions()
  const navActions = AppStore.actions.myCollection.navigation
  const artworkActions = AppStore.actions.myCollection.artwork

  // FIXME: UI fill in props
  const artworkProps = {
    demand: "Strong demand",
    estimate: "$4,500 - $445,000",
    image: {
      url: "",
    },
    ...artwork,
  }

  const formattedTitleAndYear = [artworkProps.title, artworkProps.date].filter(Boolean).join(", ")

  return (
    <ScrollView>
      <FancyModalHeader
        leftButtonText=""
        rightButtonText="Edit"
        onRightButtonPress={() => {
          artworkActions.startEditingArtwork(artworkProps as any) // FIXME: remove `any` type
        }}
        hideBottomDivider
      />
      <Join separator={<Spacer my={1} />}>
        <ScreenMargin>
          <Text variant="largeTitle">{artwork?.artistNames}</Text>
          <Text variant="subtitle" color="black60">
            {formattedTitleAndYear}
          </Text>
        </ScreenMargin>

        <OpaqueImageView
          // TODO: figure out if "normalized" is the correct version
          imageURL={artworkProps?.image?.url?.replace(":version", "normalized")}
          height={300}
          width={dimensions.width}
        />

        <ArtworkMeta artwork={artwork} />

        <Separator />

        <ArtworkInsights artwork={artwork} />

        <Separator />

        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Text variant="title">Interested in selling this work?</Text>
            <WhySellStep
              step={1}
              title="Simple Steps"
              description="Submit your work once, pick the best offer, and ship the work when it sells."
            />
            <WhySellStep
              step={2}
              title="Industry Expertise"
              description="Receive virtual valuation and expert guidance on the best sales strategies."
            />
            <WhySellStep
              step={3}
              title="Global Reach"
              description="Your work will reach the world's collectors, galleries, and auction houses."
            />
          </Join>
        </ScreenMargin>

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
