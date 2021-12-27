import { navigate } from "lib/navigation/navigate"
import { Flex, Text, Touchable } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import React from "react"

interface TermsOfServiceCheckboxProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  error: boolean
}

export const TermsOfServiceCheckbox: React.FC<TermsOfServiceCheckboxProps> = ({ setChecked, checked, error }) => {
  return (
    <Touchable haptic onPress={() => setChecked(!checked)}>
      <Flex flexDirection="row" alignItems="flex-start">
        <Checkbox error={error} checked={checked} onPress={() => setChecked(!checked)} mt={0.3}>
          <Text variant="xs">
            By checking this box, you consent to our{" "}
            <Text
              onPress={() => navigate("/terms", { modal: true })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Terms of Use
            </Text>
            ,{" "}
            <Text
              onPress={() => navigate("/privacy", { modal: true })}
              variant="xs"
              style={{ textDecorationLine: "underline" }}
            >
              Privacy Policy
            </Text>
            , and{" "}
            <Text
              onPress={() => navigate("/conditions-of-sale", { modal: true })}
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
