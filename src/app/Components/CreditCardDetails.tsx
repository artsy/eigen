import { bullet, CreditCardIcon, Text } from "@artsy/palette-mobile"
import { CreditCardDetails_card$data } from "__generated__/CreditCardDetails_card.graphql"
import { MenuItem } from "app/Components/MenuItem"
import { ActivityIndicator, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const CreditCardDetails = ({
  card: { brand, lastDigits, expirationMonth, expirationYear },
  onPress,
  isDeleting,
}: {
  card: CreditCardDetails_card$data
  onPress: (onPress) => void
  isDeleting?: boolean
}) => {
  const expirationDate = `Exp ${expirationMonth.toString().padStart(2, "0")}/${expirationYear
    .toString()
    .slice(-2)}`

  return (
    <MenuItem
      title={bullet.repeat(4) + " " + lastDigits}
      icon={<CreditCardIcon type={brand as any} width={30} height={20} />}
      subtitle={expirationDate}
      rightView={
        isDeleting ? (
          <ActivityIndicator size="small" />
        ) : (
          <TouchableOpacity
            onPress={onPress}
            hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
          >
            <Text variant="sm-display" color="red100">
              Remove
            </Text>
          </TouchableOpacity>
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
