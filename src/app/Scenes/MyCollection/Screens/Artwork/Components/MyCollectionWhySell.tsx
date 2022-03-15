import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionWhySell_artwork$key } from "__generated__/MyCollectionWhySell_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface MyCollectionWhySellProps {
  artwork: MyCollectionWhySell_artwork$key
}

export const MyCollectionWhySell: React.FC<MyCollectionWhySellProps> = (props) => {
  const { trackEvent } = useTracking()
  const artwork = useFragment<MyCollectionWhySell_artwork$key>(artworkFragment, props.artwork)

  const isInProgress = artwork.consignmentSubmission?.inProgress
  const isSold = artwork.consignmentSubmission?.isSold

  const isP1Artist = artwork.artist?.targetSupply?.isP1

  if (isInProgress || isSold) {
    return null
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
                tracks.tappedSubmit(artwork.internalID, artwork.slug, "Submit This Artwork to Sell")
              )
              // TODO: Populate form with artwork values
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
            trackEvent(tracks.tappedShowMore(artwork.internalID, artwork.slug, "Learn More"))
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

export const tests = {
  MyCollectionWhySell,
}

const artworkFragment = graphql`
  fragment MyCollectionWhySell_artwork on Artwork {
    slug
    internalID
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
  tappedSubmit: (internalID: string, slug: string, subject: string) => ({
    action: ActionType.tappedSell,
    context_module: ContextModule.sellFooter,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
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
}
