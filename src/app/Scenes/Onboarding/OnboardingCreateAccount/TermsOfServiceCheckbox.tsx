import { Checkbox, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp } from "@react-navigation/native"

interface TermsOfServiceCheckboxProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  error: boolean
  navigation: NavigationProp<any>
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
            accessibilityLabel: "Accept terms and privacy policy",
            accessibilityHint: "Check this element to accept Artsy's terms and privacy policy",
            "aria-checked": checked,
            accessibilityState: {
              checked,
            },
          }}
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
