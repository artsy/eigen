import { Flex, Text } from "@artsy/palette-mobile"
import { SellLocationFields_me$key } from "__generated__/SellLocationFields_me.graphql"
import { SellAddAddressSheet } from "app/Scenes/Sell/Components/SellAddAddressSheet"
import { SellSavedAddresses } from "app/Scenes/Sell/Components/SellSavedAddresses"
import { SellLocationStore, isSellableAddress } from "app/Scenes/Sell/State/SellLocationStore"
import { extractNodes } from "app/utils/extractNodes"
import { sortBy } from "lodash"
import { useEffect, useMemo, useState } from "react"
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
  const [adding, setAdding] = useState(false)
  const [savedAddressID, setSavedAddressID] = useState<string | null>(null)

  // Selects the default address on load, and a new address once it's back from the save
  useEffect(() => {
    const saved = addresses.find((address) => address.internalID === savedAddressID)
    const next = saved ?? (value ? null : addresses.find(isSellableAddress))

    if (saved) {
      setSavedAddressID(null)
    }
    if (next && next.internalID !== value?.internalID) {
      onChange(next)
    }
  }, [addresses, savedAddressID, value, onChange])

  return (
    <Flex gap={1}>
      <Text variant="sm">Where is the work located?</Text>
      <Text variant="xs" color="mono60">
        We use this to estimate shipping and arrange pickup.
      </Text>

      <SellSavedAddresses
        addresses={addresses}
        value={value}
        onChange={onChange}
        onAddNew={() => setAdding(true)}
      />

      <SellAddAddressSheet
        visible={adding}
        name={data.name}
        onDismiss={() => setAdding(false)}
        onSaved={setSavedAddressID}
      />
    </Flex>
  )
}

const sellLocationFieldsFragment = graphql`
  fragment SellLocationFields_me on Me {
    name
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
