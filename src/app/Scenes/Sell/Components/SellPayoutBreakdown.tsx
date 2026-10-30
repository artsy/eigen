import { HelpIcon } from "@artsy/icons/native"
import { Flex, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { formatUSD, getListingPayout } from "app/Scenes/Sell/utils/getListingPayout"

const EMPTY_VALUE = "—"

interface SellPayoutBreakdownProps {
  askingPrice: number | null
  onFeeInfoPress: () => void
}

export const SellPayoutBreakdown: React.FC<SellPayoutBreakdownProps> = ({
  askingPrice,
  onFeeInfoPress,
}) => {
  const payout = askingPrice ? getListingPayout(askingPrice) : null

  return (
    <Flex gap={1}>
      <Separator />

      <Text variant="xs" color="mono60">
        PAYOUT BREAKDOWN
      </Text>

      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="sm" color="mono60">
          Your asking price
        </Text>
        <Text variant="sm">{askingPrice ? formatUSD(askingPrice) : EMPTY_VALUE}</Text>
      </Flex>

      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" gap={0.5}>
          <Text variant="sm" color="mono60">
            Artsy's fee
          </Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="About Artsy's fee"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onFeeInfoPress}
          >
            <HelpIcon fill="mono60" />
          </Touchable>
        </Flex>
        <Text variant="sm">{payout ? `−${formatUSD(payout.fee)}` : EMPTY_VALUE}</Text>
      </Flex>

      <Separator />

      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="sm-display" fontWeight="bold" color="green100">
          You'll receive
        </Text>
        <Text variant="sm-display" fontWeight="bold" color="green100">
          {payout ? formatUSD(payout.payout) : EMPTY_VALUE}
        </Text>
      </Flex>
    </Flex>
  )
}
