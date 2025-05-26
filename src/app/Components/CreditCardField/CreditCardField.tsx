import {
  Flex,
  INPUT_BORDER_RADIUS,
  INPUT_MIN_HEIGHT,
  InputState,
  InputVariant,
  Text,
  getInputState,
  getInputVariant,
  getInputVariants,
  useColor,
  useTextStyleForPalette,
  useTheme,
} from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import { CardField } from "@stripe/stripe-react-native"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
import { useAfterTransitionEnd } from "app/Scenes/MyAccount/utils/useFocusAfterTransitionEnd"
import { useMemo, useRef, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface CreditCardFieldProps {
  onCardChange?: (card: Details) => void
}

const STRIPE_CREDIT_CARD_ICON_CONTAINER_WIDTH = 60

export const CreditCardField: React.FC<CreditCardFieldProps> = ({ onCardChange }) => {
  const cardFieldRef = useRef<any>(null)

  const color = useColor()
  const { theme } = useTheme()
  const [cardDetails, setCardDetails] = useState<Details>()
  const [isFocused, setIsFocused] = useState(false)

  const textStyle = useTextStyleForPalette("sm")

  const variant: InputVariant = getInputVariant({ hasError: false, disabled: false })

  const animatedState = useSharedValue<InputState>(
    getInputState({ isFocused, value: cardDetails?.number })
  )

  animatedState.set(getInputState({ isFocused, value: cardDetails?.number }))

  useAfterTransitionEnd(() => {
    cardFieldRef.current?.focus()
  })

  const hasSelectedValue = useMemo(() => {
    return (
      cardDetails !== undefined &&
      (!!cardDetails.last4 ||
        cardDetails.validNumber !== "Incomplete" ||
        !!cardDetails.expiryMonth ||
        !!cardDetails.expiryYear)
    )
  }, [cardDetails])

  const inputVariants = getInputVariants(theme)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(inputVariants[variant][animatedState.get()].inputBorderColor),
    }
  })

  const labelStyles = useAnimatedStyle(() => {
    return {
      zIndex: 100,
      position: "absolute",
      left: withTiming(
        hasSelectedValue || isFocused ? 15 : STRIPE_CREDIT_CARD_ICON_CONTAINER_WIDTH
      ),
      paddingHorizontal: withTiming(hasSelectedValue || isFocused ? 5 : 0),
      color: withTiming(inputVariants[variant][animatedState.get()].labelColor),
      top: withTiming(hasSelectedValue || isFocused ? -INPUT_MIN_HEIGHT / 4 : 14),
      fontSize: withTiming(
        hasSelectedValue || isFocused
          ? parseInt(THEME.textVariants["xs"].fontSize, 10)
          : parseInt(THEME.textVariants["sm-display"].fontSize, 10)
      ),
    }
  })

  return (
    <Flex>
      <AnimatedFlex
        style={[
          { borderRadius: INPUT_BORDER_RADIUS, borderWidth: 1, alignItems: "center" },
          animatedStyles,
        ]}
        flexDirection="row"
      >
        <CardField
          ref={cardFieldRef}
          testID="credit-card-field"
          cardStyle={{
            borderWidth: 0, // avoid repeat border
            backgroundColor: color("background"),
            fontSize: textStyle.fontSize,
            fontFamily: textStyle.fontFamily,
            textColor: color("mono100"),
            placeholderColor: color("mono60"),
          }}
          style={{ width: "100%", height: INPUT_MIN_HEIGHT }}
          postalCodeEnabled={false}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails)
            onCardChange?.(cardDetails)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </AnimatedFlex>

      <Flex pointerEvents="none" style={{ position: "absolute" }}>
        <AnimatedText style={[{ backgroundColor: color("mono0") }, labelStyles]}>
          {hasSelectedValue || isFocused ? "Credit Card" : ""}
        </AnimatedText>
      </Flex>
    </Flex>
  )
}

const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedFlex = Animated.createAnimatedComponent(Flex)
