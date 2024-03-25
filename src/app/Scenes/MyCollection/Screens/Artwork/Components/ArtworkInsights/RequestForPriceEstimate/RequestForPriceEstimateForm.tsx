import { Spacer, Box, Text, LinkText, Button, Input2 } from "@artsy/palette-mobile"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import { navigate } from "app/system/navigation/navigate"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { useScreenDimensions } from "app/utils/hooks"
import { useFormikContext } from "formik"
import { Platform, ScrollView } from "react-native"
import { RequestForPriceEstimateFormikSchema } from "./RequestForPriceEstimateScreen"

export const RequestForPriceEstimateForm = () => {
  const { safeAreaInsets } = useScreenDimensions()
  const { values, handleChange, errors, setErrors, handleSubmit, isValid } =
    useFormikContext<RequestForPriceEstimateFormikSchema>()

  return (
    <ArtsyKeyboardAvoidingView>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Box pt={`${safeAreaInsets.top}px`} pb={`${safeAreaInsets.bottom}px`} px={2}>
          <Box my={4}>
            <Text variant="lg-display" mb={2}>
              Let us know how to reach you
            </Text>
            <Input2
              testID="request-price-estimate-name-input"
              title="Name"
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={(text) => {
                if (errors.requesterName) {
                  setErrors({
                    requesterName: undefined,
                  })
                }
                handleChange("requesterName")(text)
              }}
              blurOnSubmit={false}
              placeholder="First and last name"
              returnKeyType="done"
              maxLength={128}
              value={values.requesterName}
              error={errors.requesterName}
            />
            <Spacer y={2} />
            <Input2
              testID="request-price-estimate-email-input"
              title="Email"
              autoCapitalize="none"
              enableClearButton
              keyboardType="email-address"
              onChangeText={(text) => {
                if (errors.requesterEmail) {
                  setErrors({
                    requesterEmail: undefined,
                  })
                }
                handleChange("requesterEmail")(text.trim())
              }}
              blurOnSubmit={false}
              placeholder="Email address"
              value={values.requesterEmail}
              returnKeyType="next"
              spellCheck={false}
              autoCorrect={false}
              textContentType={Platform.OS === "ios" ? "username" : "emailAddress"}
              error={errors.requesterEmail}
            />
            <Spacer y={2} />
            <PhoneInput
              testID="request-price-estimate-phone-input"
              style={{ flex: 1 }}
              title="Phone number"
              autoFocus={!values.requesterPhoneNumber}
              placeholder="(000) 000-0000"
              onChangeText={handleChange("requesterPhoneNumber")}
              value={values.requesterPhoneNumber}
              setValidation={() => null}
              accessibilityLabel="Phone number"
              shouldDisplayLocalError={false}
            />
            <Spacer y={6} />
            <Text variant="xs" color="black60" mb={2}>
              By continuing, you agree to{" "}
              <LinkText variant="xs" onPress={() => navigate("/privacy")}>
                Artsy’s Privacy Policy.
              </LinkText>{" "}
            </Text>
            <Button
              block
              onPress={handleSubmit}
              disabled={!isValid}
              testID="request-price-estimate-submit-button"
            >
              Request a Price Estimate
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </ArtsyKeyboardAvoidingView>
  )
}
