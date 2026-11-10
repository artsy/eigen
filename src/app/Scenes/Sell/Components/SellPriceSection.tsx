import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { MoneyInput } from "app/Components/Input/MoneyInput/MoneyInput"
import { SellFeeInfoBottomSheet } from "app/Scenes/Sell/Components/SellFeeInfoBottomSheet"
import { SellPayoutBreakdown } from "app/Scenes/Sell/Components/SellPayoutBreakdown"
import { useState } from "react"
import { Alert } from "react-native"

// Placeholder until price insights reach the sell flow
const RECOMMENDED_PRICE_RANGE = "US$3,000–3,400"
// Under US$1B, and well inside what Number holds exactly
const MAX_PRICE_LENGTH = "999,999,999".length
// Palette's default unit slot fits one or two characters and wraps "US$"
const UNIT_WIDTH = 70

interface SellPriceSectionProps {
  artistNames: string | null | undefined
  /** Whole US dollars as digits, or "" when nothing is entered */
  askingPrice: string
  onAskingPriceChange: (askingPrice: string) => void
  disabled: boolean
}

export const SellPriceSection: React.FC<SellPriceSectionProps> = ({
  artistNames,
  askingPrice,
  onAskingPriceChange,
  disabled,
}) => {
  const [showFeeInfo, setShowFeeInfo] = useState(false)

  return (
    <Flex gap={2}>
      <Flex gap={0.5}>
        <Text variant="md">Price</Text>
        {!!disabled && (
          <Text variant="xs" color="mono60">
            Pick a condition to set your price.
          </Text>
        )}
      </Flex>

      <Flex gap={2} opacity={disabled ? 0.3 : 1} pointerEvents={disabled ? "none" : "auto"}>
        <Flex gap={1}>
          <Flex bg="mono5" p={2} gap={0.5}>
            <Text variant="xs" color="mono60">
              Recommended price range
            </Text>
            <Text variant="lg-display" color="blue100">
              {RECOMMENDED_PRICE_RANGE}
            </Text>
            {!!artistNames && (
              <Text variant="xs" color="mono60">
                Based on comparable sales by {artistNames}
              </Text>
            )}
          </Flex>

          <Flex alignItems="flex-end">
            <Touchable
              accessibilityRole="link"
              disabled={disabled}
              onPress={() => Alert.alert("See more Insights", "Not yet implemented.")}
            >
              <Text variant="xs" color="blue100" underline>
                See more Insights {">"}
              </Text>
            </Touchable>
          </Flex>
        </Flex>

        <Flex gap={1}>
          <Text variant="sm">What’s your asking price?</Text>
          <MoneyInput
            currency="USD"
            allowCents={false}
            unit="US$"
            leftComponentWidth={UNIT_WIDTH}
            accessibilityLabel="Asking price"
            disabled={disabled}
            initialValues={{ amount: askingPrice }}
            maxLength={MAX_PRICE_LENGTH}
            onChange={({ amount }) => onAskingPriceChange(amount?.replace(/^0+/, "") ?? "")}
          />
        </Flex>

        <SellPayoutBreakdown
          askingPrice={askingPrice ? Number(askingPrice) : null}
          onFeeInfoPress={() => setShowFeeInfo(true)}
        />
      </Flex>

      <SellFeeInfoBottomSheet visible={showFeeInfo} onDismiss={() => setShowFeeInfo(false)} />
    </Flex>
  )
}
