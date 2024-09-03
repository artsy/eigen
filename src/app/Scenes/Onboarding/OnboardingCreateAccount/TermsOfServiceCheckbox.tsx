import { Flex, Text, Touchable, Checkbox } from "@artsy/palette-mobile"
import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

interface TermsOfServiceCheckboxProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  error: boolean
  navigation: StackNavigationProp<ParamListBase>
}

export const TermsOfServiceCheckbox: React.FC<TermsOfServiceCheckboxProps> = ({
  setChecked,
  checked,
  error,
  navigation,
}) => {
  return (
    <Touchable haptic onPress={() => setChecked(!checked)}>
      <Flex flexDirection="row" alignItems="flex-start">
        <Checkbox
          error={error}
          checked={checked}
          onPress={() => setChecked(!checked)}
          mt={0.5}
          checkboxAccessibilityProps={{
            accessible: true,
            accessibilityRole: "checkbox",
            accessibilityLabel: "checkbox of consent",
            accessibilityHint: "Check this element to consent with the Terms of Service",
            accessibilityState: {
              checked,
            },
          }}
          testID="termsCheckbox"
        >
          <Text variant="xs" testID="disclaimer">
            I accept Artsy's{" "}
            <Text
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              General Terms and Conditions of Sale
            </Text>{" "}
            and{" "}
            <Text
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/privacy" })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </Checkbox>
      </Flex>
    </Touchable>
  )
}
