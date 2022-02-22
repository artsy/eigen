import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionWhySell_artwork$key } from "__generated__/MyCollectionWhySell_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, Join, Spacer, Text } from "palette"
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

  return (
    <Flex>
      <Join separator={<Spacer my={1} />}>
        <Text variant="md">Interested in selling this work?</Text>

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

      <Spacer mb={3} />

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
    </Flex>
  )
}

const WhySellStep: React.FC<{ step: number; title: string; description: string }> = ({
  step,
  title,
  description,
}) => {
  return (
    <Flex flexDirection="row">
      <Box mr={2}>
        <Text>{step}</Text>
      </Box>
      <Box mr={2}>
        <Text>{title}</Text>
        <Text color="black60">{description}</Text>
      </Box>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionWhySell_artwork on Artwork {
    slug
    internalID
  }
`

const tracks = {
  tappedShowMore: (internalID: string, slug: string, subject: string) => ({
    action: ActionType.tappedShowMore,
    context_module: ContextModule.sellFooter,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject,
  }),
}
