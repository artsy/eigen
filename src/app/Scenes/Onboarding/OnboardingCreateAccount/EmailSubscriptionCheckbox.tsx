import { Text, Checkbox } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface EmailSubscriptionCheckboxProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  error?: boolean
}

export const EmailSubscriptionCheckbox: React.FC<EmailSubscriptionCheckboxProps> = ({
  setChecked,
  checked,
  error,
}) => {
  const signupLoginFusionEnabled = useFeatureFlag("AREnableSignupLoginFusion")

  return (
    <Checkbox
      error={error}
      checked={checked}
      onPress={() => setChecked(!checked)}
      mt={0.5}
      accessibilityLabel="Agree to receive Artsy's emails"
      accessibilityHint="Check this element to receive Artsy's emails"
    >
      {signupLoginFusionEnabled ? (
        <Text variant="xs">
          Get Artsy's emails on the art market, products, services, editorial, and promotional
          content. Unsubscribe at any time.
        </Text>
      ) : (
        <Text variant="xs">
          Dive deeper into the art market with Artsy emails. Subscribe to hear about our products,
          services, editorials, and other promotional content. Unsubscribe at any time.
        </Text>
      )}
    </Checkbox>
  )
}
