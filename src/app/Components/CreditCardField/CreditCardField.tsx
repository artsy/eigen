import { INPUT_MIN_HEIGHT, useColor } from "@artsy/palette-mobile"
import { CardField } from "@stripe/stripe-react-native"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
// import { StyleSheet } from "react-native"
// import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

interface CreditCardFieldProps {
  onCardChange?: (card: Details) => void
}

export const CreditCardField: React.FC<CreditCardFieldProps> = ({ onCardChange }) => {
  // const borderColor = useSharedValue(0)
  const color = useColor()

  // const handleFocus = () => {
  //   borderColor.value = withTiming(1, { duration: 300 })
  // }

  // const handleBlur = () => {
  //   borderColor.value = withTiming(0, { duration: 300 })
  // }

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     borderColor: withTiming(borderColor.value ? color("blue100") : color("black30")),
  //   }
  // })

  return (
    // <Animated.View style={[styles.cardFieldContainer, animatedStyle]}>
    <CardField
      autofocus
      cardStyle={{
        borderWidth: 1,
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
      // onFocus={handleFocus}
      // onBlur={handleBlur}
    />
    // </Animated.View>
  )
}

// const styles = StyleSheet.create({
//   cardFieldContainer: {
//     borderWidth: 1,
//     borderRadius: 4,
//   },
// })
