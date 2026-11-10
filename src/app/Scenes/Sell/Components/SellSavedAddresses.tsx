import { AddIcon } from "@artsy/icons/native"
import { Flex, RadioButton, Text, Touchable } from "@artsy/palette-mobile"
import { SellSavedAddress, isSellableAddress } from "app/Scenes/Sell/State/SellLocationStore"
import { useState } from "react"

const VISIBLE_COUNT = 3

interface SellSavedAddressesProps {
  addresses: readonly SellSavedAddress[]
  value: SellSavedAddress | null
  onChange: (address: SellSavedAddress) => void
  onAddNew: () => void
}

export const SellSavedAddresses: React.FC<SellSavedAddressesProps> = ({
  addresses,
  value,
  onChange,
  onAddNew,
}) => {
  const [showAll, setShowAll] = useState(false)
  const selectedIndex = addresses.findIndex((address) => address.internalID === value?.internalID)
  // A just-saved address can sort past the first three, so keep the selection visible
  const expanded = showAll || selectedIndex >= VISIBLE_COUNT
  const visibleAddresses = expanded ? addresses : addresses.slice(0, VISIBLE_COUNT)

  return (
    <Flex gap={2}>
      <Flex accessibilityRole="radiogroup">
        {visibleAddresses.map((address) => {
          const checked = address.internalID === value?.internalID
          const disabled = !isSellableAddress(address)
          const lines = addressLines(address)

          return (
            <Touchable
              key={address.internalID}
              accessibilityRole="radio"
              accessibilityState={{ checked, disabled }}
              accessibilityLabel={[address.name, ...lines].join(", ")}
              disabled={disabled}
              onPress={() => onChange(address)}
            >
              <Flex flexDirection="row" p={1} gap={1} bg={checked ? "mono5" : "mono0"}>
                {/* The row is the radio, so screen readers and taps skip the dot */}
                <Flex
                  pointerEvents="none"
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <RadioButton selected={checked} disabled={disabled} />
                </Flex>
                <Flex flex={1}>
                  <Text variant="sm" color={disabled ? "mono30" : checked ? "mono100" : "mono60"}>
                    {address.name}
                  </Text>
                  {lines.map((line) => (
                    <Text key={line} variant="sm" color={disabled ? "mono30" : "mono60"}>
                      {line}
                    </Text>
                  ))}
                </Flex>
              </Flex>
            </Touchable>
          )
        })}
      </Flex>

      {visibleAddresses.some((address) => !isSellableAddress(address)) && (
        <Text variant="xs" color="mono60">
          You can only sell works located in the US for now.
        </Text>
      )}

      {!expanded && addresses.length > VISIBLE_COUNT && (
        <Touchable accessibilityRole="button" onPress={() => setShowAll(true)}>
          <Text variant="sm" underline>
            Show all addresses ({addresses.length})
          </Text>
        </Touchable>
      )}

      <Touchable accessibilityRole="button" accessibilityLabel="Add new address" onPress={onAddNew}>
        <Flex flexDirection="row" alignItems="center" gap={0.5}>
          <AddIcon width={20} height={20} />
          <Text variant="sm">Add new address</Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}

const addressLines = (address: SellSavedAddress) =>
  [
    address.addressLine1,
    address.addressLine2,
    [address.city, address.region, address.postalCode, address.country].filter(Boolean).join(", "),
  ].filter((line): line is string => !!line)
