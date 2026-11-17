import { Flex, Text } from "@artsy/palette-mobile"
import { SellLocationFields_me$key } from "__generated__/SellLocationFields_me.graphql"
import { SellSavedAddresses } from "app/Scenes/Sell/Components/SellSavedAddresses"
import { SellLocationStore, isSellableAddress } from "app/Scenes/Sell/State/SellLocationStore"
import { extractNodes } from "app/utils/extractNodes"
import { sortBy } from "lodash"
import { useEffect, useMemo } from "react"
import { graphql, useFragment } from "react-relay"

interface SellLocationFieldsProps {
  me: SellLocationFields_me$key
}

export const SellLocationFields: React.FC<SellLocationFieldsProps> = ({ me }) => {
  const data = useFragment(sellLocationFieldsFragment, me)
  const value = SellLocationStore.useStoreState((state) => state.address)
  const onChange = SellLocationStore.useStoreActions((actions) => actions.setAddress)
  const addresses = useMemo(
    () =>
      sortBy(extractNodes(data.addressConnection), [
        (address) => !isSellableAddress(address),
        (address) => !address.isDefault,
      ]),
    [data.addressConnection]
  )
  // Selects the first address the user can sell from on load
  useEffect(() => {
    const next = value ? null : addresses.find(isSellableAddress)
    if (next) {
      onChange(next)
    }
  }, [addresses, value, onChange])

  return (
    <Flex gap={1}>
      <Text variant="sm">Where is the work located?</Text>
      <Text variant="xs" color="mono60">
        We use this to estimate shipping and arrange pickup.
      </Text>

      <SellSavedAddresses addresses={addresses} value={value} onChange={onChange} />
    </Flex>
  )
}

const sellLocationFieldsFragment = graphql`
  fragment SellLocationFields_me on Me {
    addressConnection(first: 20) {
      edges {
        node {
          internalID
          name
          addressLine1
          addressLine2
          city
          region
          postalCode
          country
          isDefault
          phoneNumber
        }
      }
    }
  }
`
