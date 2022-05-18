import { CreateAlertButton_artwork } from "__generated__/CreateAlertButton_artwork.graphql"
import { Box, Button, Spacer, Text } from "palette"
import { FC } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

interface CreateAlertButtonProps {
  artwork: CreateAlertButton_artwork
}

const CreateAlertButton: FC<CreateAlertButtonProps> = ({ artwork }) => {
  const { isInquireable } = artwork

  return (
    <Box>
      <Text variant="lg">Sold</Text>
      <Text variant="xs" color="black60">
        Be notified when a similar piece is available
      </Text>

      <Spacer mt={2} />

      <Button block onPress={() => console.log("[debug] CreateAlertButton")}>
        Create Alert
      </Button>

      {!!isInquireable && (
        <InquiryButtonsFragmentContainer artwork={artwork} variant="outline" mt={2} block />
      )}
    </Box>
  )
}

export const CreateAlertButtonFragmentContainer = createFragmentContainer(CreateAlertButton, {
  artwork: graphql`
    fragment CreateAlertButton_artwork on Artwork {
      isInquireable
      ...InquiryButtons_artwork
    }
  `,
})
