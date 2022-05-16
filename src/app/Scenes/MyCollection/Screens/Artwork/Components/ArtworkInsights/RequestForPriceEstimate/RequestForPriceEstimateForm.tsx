import { useFormikContext } from "formik"
import { Box, Button, Input, PhoneInput, Spacer, Text } from "palette"
import React from "react"
import { Platform, ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import { RequestForPriceEstimateFormikSchema } from "./RequestForPriceEstimateScreen"

export const RequestForPriceEstimateForm = () => {
  const { safeAreaInsets } = useScreenDimensions()
  const { values, handleChange, errors, setErrors, handleSubmit, isValid } =
    useFormikContext<RequestForPriceEstimateFormikSchema>()

  return (
    <ArtsyKeyboardAvoidingView>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
          <Box my={3}>
            <Text variant="xl">Contact Information</Text>
            <Spacer p={1} />
            <Text variant="md" color="black60">
              We will only use this to contact you about this price estimate
            </Text>
            <Spacer p={1} />
            <Input
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
            <Spacer p={1} />
            <Input
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
            <Spacer p={1} />
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
            <Spacer p={2} />
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
