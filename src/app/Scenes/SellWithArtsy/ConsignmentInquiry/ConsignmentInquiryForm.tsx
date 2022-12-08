import { navigate } from "app/navigation/navigate"
import { useFormikContext } from "formik"
import { Box, Button, Input, LinkText, PhoneInput, Spacer, Text } from "palette"
import { useRef } from "react"
import { Platform, ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import { InquiryFormikSchema } from "./ConsignmentInquiryScreen"

export const ConsignmentInquiryForm = () => {
  const { safeAreaInsets } = useScreenDimensions()
  const { values, handleChange, errors, setErrors, handleSubmit, isValid, dirty } =
    useFormikContext<InquiryFormikSchema>()

  const ScrollViewRef = useRef<ScrollView>(null)
  const nameInputRef = useRef<Input>(null)
  const emailInputRef = useRef<Input>(null)
  const phoneInputRef = useRef<Input>(null)
  const messageInputRef = useRef<Input>(null)

  const jumpToNextField = (currentField: "name" | "email" | "phone" | "message") => {
    switch (currentField) {
      case "name":
        emailInputRef.current?.focus()
        break
      case "email":
        phoneInputRef.current?.focus()
        break
      case "phone":
        messageInputRef.current?.focus()
        break
      default:
        handleSubmit()
    }
  }

  // We cannot rely on the KeyboardAvoidingView to fully expose the
  // multiline input and the send button at the same time, hence the need
  // for this function
  const showMessageInputFully = () => {
    requestAnimationFrame(() => {
      ScrollViewRef.current?.scrollToEnd()
    })
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <ScrollView
        ref={ScrollViewRef}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
          <Box my={3}>
            <Text variant="lg-display" mb={2}>
              Contact a specialist
            </Text>
            <Input
              required
              ref={nameInputRef}
              testID="swa-inquiry-name-input"
              title="Name"
              autoFocus={!values.name}
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={(text) => {
                if (errors.name) {
                  setErrors({
                    name: undefined,
                  })
                }
                handleChange("name")(text)
              }}
              onSubmitEditing={() => jumpToNextField("name")}
              blurOnSubmit={false}
              placeholder="First and last name"
              returnKeyType="next"
              maxLength={128}
              value={values.name}
              error={errors.name}
            />
            <Spacer m={2} />
            <Input
              required
              ref={emailInputRef}
              testID="swa-inquiry-email-input"
              title="Email"
              autoFocus={!!values.name && !values.email}
              autoCapitalize="none"
              enableClearButton
              keyboardType="email-address"
              onChangeText={(text) => {
                if (errors.email) {
                  setErrors({
                    email: undefined,
                  })
                }
                handleChange("email")(text.trim())
              }}
              onSubmitEditing={() => jumpToNextField("email")}
              blurOnSubmit={false}
              placeholder="Email address"
              value={values.email}
              returnKeyType="next"
              spellCheck={false}
              autoCorrect={false}
              textContentType={Platform.OS === "ios" ? "username" : "emailAddress"}
              error={errors.email}
            />
            <Spacer m={2} />
            <PhoneInput
              ref={phoneInputRef}
              testID="swa-inquiry-phone-input"
              style={{ flex: 1 }}
              title="Phone number"
              autoFocus={!!values.email && !!values.name && !values.phoneNumber}
              placeholder="(000) 000-0000"
              onChangeText={handleChange("phoneNumber")}
              onSubmitEditing={() => jumpToNextField("phone")}
              value={values.phoneNumber}
              setValidation={() => null}
              accessibilityLabel="Phone number"
              shouldDisplayLocalError={false}
            />
            <Spacer m={2} />
            <Spacer m={1} />
            <Input
              required
              ref={messageInputRef}
              testID="swa-inquiry-message-input"
              title="Your Message"
              numberOfLines={4}
              multiline
              autoCapitalize="none"
              autoFocus={!!values.email && !!values.name && !!values.phoneNumber}
              onFocus={showMessageInputFully}
              onChangeText={(text) => {
                if (errors.message) {
                  setErrors({
                    message: undefined,
                  })
                }
                handleChange("message")(text.trimStart())
              }}
              onSubmitEditing={() => jumpToNextField("message")}
              blurOnSubmit={false}
              placeholder="Questions about selling multiple works or an entire collection? Tell us more about how we can assist you. "
              value={values.message}
              spellCheck={false}
              autoCorrect={false}
              error={errors.message}
            />
            <Spacer mb={4} />
            <Text variant="xs" color="black60" mb={2}>
              By continuing, you agree to{" "}
              <LinkText variant="xs" onPress={() => navigate("/privacy", { modal: true })}>
                Artsy’s Privacy Policy.
              </LinkText>{" "}
            </Text>
            <Button
              block
              onPress={handleSubmit}
              disabled={!(isValid && dirty)}
              testID="swa-inquiry-submit-button"
            >
              Send
            </Button>
          </Box>
        </Box>
      </ScrollView>
      {}
    </ArtsyKeyboardAvoidingView>
  )
}
