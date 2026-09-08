import { Flex, Text } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ShowPartnerLocation_show$key } from "__generated__/ShowPartnerLocation_show.graphql"
import { tappedOnMap } from "app/Components/LocationMap/LocationMap"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

interface Props {
  show: ShowPartnerLocation_show$key
}

/**
 * The gallery name and its address, on the grey band the designs put directly under the
 * install-shot carousel. The address is underlined because it is tappable: it opens the same
 * "which maps app?" sheet the location map at the bottom of the screen already uses, rather
 * than introducing a second way to get directions.
 */
export const ShowPartnerLocation: FC<Props> = ({ show: showProp }) => {
  const show = useFragment(showFragment, showProp)
  const { showActionSheetWithOptions } = useActionSheet()

  const partnerName = show.partner?.name
  // A show at a fair carries the fair's location rather than its own.
  const location = show.location ?? show.fair?.location
  const address = location?.display ?? location?.address

  // Nothing to show without a name, and no band at all without an address — an empty grey
  // strip under the carousel reads as a rendering fault.
  if (!partnerName || !address) {
    return null
  }

  const openDirections = () => {
    showActionSheetWithOptions(
      ...tappedOnMap(
        location?.coordinates?.lat,
        location?.coordinates?.lng,
        location?.address,
        location?.summary,
        partnerName,
        location?.city,
        location?.postalCode
      )
    )
  }

  return (
    <Flex backgroundColor="mono5" px={2} py={1}>
      <Text variant="sm" weight="medium">
        {partnerName}
      </Text>

      <TouchableOpacity
        testID="show-partner-location-address"
        accessibilityRole="link"
        accessibilityLabel={`Get directions to ${address}`}
        onPress={openDirections}
      >
        <Text variant="sm" underline>
          {address}
        </Text>
      </TouchableOpacity>
    </Flex>
  )
}

const showFragment = graphql`
  fragment ShowPartnerLocation_show on Show {
    partner {
      ... on Partner {
        name
      }
      ... on ExternalPartner {
        name
      }
    }
    location {
      display
      address
      summary
      city
      postalCode
      coordinates {
        lat
        lng
      }
    }
    fair {
      location {
        display
        address
        summary
        city
        postalCode
        coordinates {
          lat
          lng
        }
      }
    }
  }
`
