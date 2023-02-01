import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { Flex, Text, Touchable } from "palette"
import { Checkbox } from "palette/elements/Checkbox"

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
        <Checkbox error={error} checked={checked} onPress={() => setChecked(!checked)} mt="0.5">
          <Text variant="xs">
            By checking this box, you consent to our{" "}
            <Text
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Terms of Use
            </Text>
            ,{" "}
            <Text
              onPress={() => navigation.navigate("OnboardingWebView", { url: "/privacy" })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Privacy Policy
            </Text>
            , and{" "}
            <Text
              onPress={() =>
                navigation.navigate("OnboardingWebView", { url: "/conditions-of-sale" })
              }
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Conditions of Sale
            </Text>
            .
          </Text>
        </Checkbox>
      </Flex>
    </Touchable>
  )
}
