import { bullet, DEFAULT_HIT_SLOP, Text, Touchable } from "@artsy/palette-mobile"
import { CreditCardDetails_card$data } from "__generated__/CreditCardDetails_card.graphql"
import { BrandCreditCardIcon } from "app/Components/BrandCreditCardIcon/BrandCreditCardIcon"
import { MenuItem } from "app/Components/MenuItem"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { DateTime } from "luxon"
import { ActivityIndicator } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const CreditCardDetails = ({
  card: { brand, lastDigits, expirationMonth, expirationYear },
  onPress,
  isDeleting,
}: {
  card: CreditCardDetails_card$data
  onPress: () => void
  isDeleting?: boolean
}) => {
  const formattedExpirationDate = DateTime.fromObject({
    month: expirationMonth,
    year: expirationYear,
  }).toFormat("MM/yy")

  return (
    <MenuItem
      title={bullet.repeat(4) + " " + lastDigits}
      icon={
        <BrandCreditCardIcon
          type={brand}
          width={ACCESSIBLE_DEFAULT_ICON_SIZE}
          height={ACCESSIBLE_DEFAULT_ICON_SIZE}
        />
      }
      subtitle={formattedExpirationDate}
      rightView={
        isDeleting ? (
          <ActivityIndicator size="small" />
        ) : (
          <Touchable accessibilityRole="button" onPress={onPress} hitSlop={DEFAULT_HIT_SLOP}>
            <Text variant="sm-display" color="red100">
              Remove
            </Text>
          </Touchable>
        )
      }
      px={0}
    />
  )
}

export const CreditCardDetailsContainer = createFragmentContainer(CreditCardDetails, {
  card: graphql`
    fragment CreditCardDetails_card on CreditCard {
      brand
      lastDigits
      expirationMonth
      expirationYear
    }
  `,
})
