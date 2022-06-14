import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionWhySell_artwork$key } from "__generated__/MyCollectionWhySell_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { initializeSubmissionArtworkForm } from "app/Scenes/MyCollection/utils/initializeSubmissionArtworkForm"
import { Schema } from "app/utils/track"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface MyCollectionWhySellProps {
  artwork: MyCollectionWhySell_artwork$key
  contextModule: "insights" | "about" | "oldAbout"
}

export const MyCollectionWhySell: React.FC<MyCollectionWhySellProps> = (props) => {
  const { contextModule } = props
  const { trackEvent } = useTracking()
  const artwork = useFragment(artworkFragment, props.artwork)

  const isInProgress = artwork.consignmentSubmission?.inProgress
  const isSold = artwork.consignmentSubmission?.isSold

  const isP1Artist = artwork.artist?.targetSupply?.isP1

  if (isInProgress || isSold) {
    return null
  }
  let setContextModule = ContextModule.sellFooter
  let setContextScreen: Schema.PageNames
  if (contextModule === "insights") {
    setContextModule = ContextModule.myCollectionArtworkInsights
    setContextScreen = Schema.PageNames.MyCollectionArtworkInsights
  } else if (contextModule === "about") {
    setContextModule = ContextModule.myCollectionArtworkAbout
    setContextScreen = Schema.PageNames.MyCollectionArtworkAbout
  }

  return (
    <Flex>
      <Join separator={<Spacer my={3} />}>
        <Text variant="lg" textAlign="center" testID="SWA-banner-in-MC">
          Sell Art From Your Collection
        </Text>
      </Join>
      <Spacer mt={2} />
      <Text variant="xs" color="black60" textAlign="center">
        Submit an artwork and reach Artsy’s global network. Our specialists will guide you through
        creating a strategy and selling your work.
      </Text>
      <Spacer mb={3} />
      {isP1Artist ? (
        <>
          <Button
            size="large"
            variant="fillDark"
            block
            onPress={() => {
              trackEvent(
                tracks.tappedSellArtwork(
                  setContextModule,
                  artwork.internalID,
                  artwork.slug,
                  setContextScreen,
                  "Submit This Artwork to Sell"
                )
              )
              initializeSubmissionArtworkForm(artwork)
              navigate("/collections/my-collection/artworks/new/submissions/new")
            }}
            testID="submitArtworkToSellButton"
          >
            Submit This Artwork to Sell
          </Button>
          <Spacer mb={3} />
          <Text
            variant="xs"
            color="black60"
            textAlign="center"
            onPress={() => {
              navigate("/selling-with-artsy")
            }}
            testID="learnMoreLink"
          >
            Learn more about{" "}
            <Text variant="xs" underline>
              selling with Artsy.
            </Text>
          </Text>
        </>
      ) : (
        <Button
          size="large"
          variant="fillDark"
          block
          onPress={() => {
            if (contextModule === "oldAbout") {
              trackEvent(tracks.tappedShowMore(artwork.internalID, artwork.slug, "Learn More"))
            } else {
              trackEvent(
                tracks.tappedLearnMore(
                  artwork.internalID,
                  artwork.slug,
                  setContextModule,
                  setContextScreen,
                  "Learn More"
                )
              )
            }
            navigate("/sales")
          }}
          testID="learnMoreButton"
        >
          Learn More
        </Button>
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionWhySell_artwork on Artwork {
    internalID
    slug
    title
    date
    medium
    artist {
      internalID
      name
    }
    attributionClass {
      name
    }
    images {
      url: imageURL
    }
    editionNumber
    editionSize
    metric
    height
    width
    depth
    provenance
    artworkLocation
    consignmentSubmission {
      inProgress
      isSold
    }
    artist {
      targetSupply {
        isP1
      }
    }
  }
`
const tracks = {
  tappedSellArtwork: (
    module: ContextModule,
    internalID: string,
    slug: string,
    setContextScreen: Schema.PageNames,
    subject: string
  ) => ({
    action: ActionType.tappedSellArtwork,
    context_module: module,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    context_screen: setContextScreen,
    subject,
  }),
  tappedShowMore: (internalID: string, slug: string, subject: string) => ({
    action: ActionType.tappedShowMore,
    context_module: ContextModule.sellFooter,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject,
  }),
  tappedLearnMore: (
    internalID: string,
    slug: string,
    module: ContextModule,
    setContextScreen: Schema.PageNames,
    subject: string
  ) => ({
    action: ActionType.tappedLearnMore,
    context_module: module,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    context_screen: setContextScreen,
    subject,
  }),
}
