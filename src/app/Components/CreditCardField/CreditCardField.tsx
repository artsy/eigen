import { INPUT_MIN_HEIGHT, useColor } from "@artsy/palette-mobile"
import { CardField } from "@stripe/stripe-react-native"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
import { MotiView } from "moti"
import { useState } from "react"
import { StyleSheet } from "react-native"

interface CreditCardFieldProps {
  onCardChange?: (card: Details) => void
}

export const CreditCardField: React.FC<CreditCardFieldProps> = ({ onCardChange }) => {
  const color = useColor()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <MotiView
      from={{
        borderColor: color("black30"),
      }}
      animate={{
        borderColor: isFocused ? color("blue100") : color("black30"),
      }}
      transition={{
        type: "timing",
        duration: 300,
      }}
      style={[
        styles.cardFieldContainer,
        { borderColor: isFocused ? color("blue100") : color("black30") },
      ]}
    >
      <CardField
        autofocus
        cardStyle={{
          borderWidth: 0,
          backgroundColor: "#FFFFFF",
          fontSize: 14,
          fontFamily: "Unica77LL-Regular",
          placeholderColor: color("black60"),
        }}
        style={{
          width: "100%",
          height: INPUT_MIN_HEIGHT,
        }}
        postalCodeEnabled={false}
        onCardChange={(cardDetails) => {
          onCardChange?.(cardDetails)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </MotiView>
  )
}

const styles = StyleSheet.create({
  cardFieldContainer: {
    borderWidth: 1,
    borderRadius: 4,
  },
})
