import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionWhySell_artwork$key } from "__generated__/MyCollectionWhySell_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { initializeSubmissionArtworkForm } from "app/Scenes/MyCollection/utils/initializeSubmissionArtworkForm"
import { Schema } from "app/utils/track"
import { Button, Flex, Separator, Spacer, Text } from "palette"
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
      <Separator mb={2} />
      <Text variant="md" testID="SWA-banner-in-MC">
        Interested in Selling This Work?
      </Text>
      <Spacer mt={2} />
      <Text variant="xs" color="black60" mb={2}>
        Find the best sales option for your work with help from our experts.
      </Text>
      <>
        <Button
          size="large"
          variant="fillDark"
          mb={2}
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
          Submit for Sale
        </Button>
        <Text variant="xs" color="black60">
          Learn more about{" "}
          <Text
            variant="xs"
            underline
            onPress={() => {
              navigate("/selling-with-artsy")
            }}
            testID="learnMoreLink"
          >
            selling with Artsy.
          </Text>
        </Text>
        <Separator mt={2} />
      </>
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
