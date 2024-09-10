import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { MyCollectionWhySell_artwork$key } from "__generated__/MyCollectionWhySell_artwork.graphql"
import { SubmitArtworkProps } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { fetchArtworkInformation } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation"
import { getInitialSubmissionFormValuesFromArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialSubmissionValuesFromArtwork"
import { navigate } from "app/system/navigation/navigate"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionWhySellProps {
  artwork: MyCollectionWhySell_artwork$key
  contextModule: "insights" | "about" | "oldAbout"
}

export const MyCollectionWhySell: React.FC<MyCollectionWhySellProps> = (props) => {
  const { contextModule } = props
  const { trackEvent } = useTracking()
  const artwork = useFragment(artworkFragment, props.artwork)

  const submissionId = artwork.submissionId

  if (submissionId || !artwork.artist?.targetSupply?.isTargetSupply) {
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
      <Text variant="sm-display" testID="SWA-banner-in-MC">
        Interested in Selling This Work?
      </Text>
      <Spacer y={0.5} />
      <Text variant="xs" color="black60" mb={2}>
        Let our experts find the best sales option for you.
      </Text>
      <>
        <Button
          size="large"
          variant="fillDark"
          mb={2}
          block
          onPress={async () => {
            trackEvent(
              tracks.tappedSellArtwork(
                setContextModule,
                artwork.internalID,
                artwork.slug,
                setContextScreen,
                "Submit This Artwork to Sell"
              )
            )
            const passProps: SubmitArtworkProps = {
              initialValues: {},
              initialStep: "StartFlow",
              hasStartedFlowFromMyCollection: true,
            }

            const artworkData = await fetchArtworkInformation(artwork.internalID)

            if (artworkData) {
              passProps.initialValues = getInitialSubmissionFormValuesFromArtwork(artworkData)
              passProps.initialStep = "AddTitle"
            }
            navigate("/sell/submissions/new", { passProps })
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
      </>

      <Separator my={4} borderColor="black10" />
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
    mediumType {
      name
    }
    artist {
      internalID
      name
      targetSupply {
        isTargetSupply
      }
    }
    attributionClass {
      name
    }
    collectorLocation {
      city
      country
      state
      postalCode
    }
    images(includeAll: true) {
      url: imageURL
    }
    editionNumber
    editionSize
    metric
    height
    width
    depth
    provenance
    collectorLocation {
      city
      state
      country
      countryCode
    }
    submissionId
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
