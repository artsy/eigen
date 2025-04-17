import { Box, Text } from "@artsy/palette-mobile"
import { PendingOfferSection_order$key } from "__generated__/PendingOfferSection_order.graphql"
import { graphql, useFragment } from "react-relay"

interface Props {
  order: PendingOfferSection_order$key
}

export const PendingOfferSection: React.FC<Props> = ({ order }) => {
  const { stateExpiresAt } = useFragment(fragment, order)

  if (!stateExpiresAt) {
    return null
  }

  return (
    <Box mt={2} p={2} bg="mono5">
      <Text color="mono60">
        The seller will respond to your offer by {stateExpiresAt}. Keep in mind making an offer
        doesn’t guarantee you the work.
      </Text>
    </Box>
  )
}

const fragment = graphql`
  fragment PendingOfferSection_order on CommerceOrder {
    stateExpiresAt(format: "MMM D")
  }
`
