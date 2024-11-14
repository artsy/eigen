import { Box, Button, Input, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import { navigate } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { useEffect, useRef } from "react"
import { Platform, ScrollView } from "react-native"
import { InquiryFormikSchema } from "./ConsignmentInquiryScreen"

export const ConsignmentInquiryForm: React.FC<{
  confirmLeaveEdit: (v: boolean) => void
  canPopScreen: boolean
  recipientName?: string
}> = ({ confirmLeaveEdit, canPopScreen, recipientName }) => {
  const { values, handleChange, errors, handleSubmit, isValid, dirty, validateField } =
    useFormikContext<InquiryFormikSchema>()

  const navigation = useNavigation()

  useEffect(() => {
    const backListener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault()
      if (canPopScreen) {
        navigation.dispatch(e.data.action)
      }
      if (dirty) {
        confirmLeaveEdit(true)
        return
      }
      navigation.dispatch(e.data.action)
    })
    return backListener
  }, [canPopScreen, dirty, navigation])

  const scrollViewRef = useRef<ScrollView>(null)
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
        return
    }
  }

  // We cannot rely on the KeyboardAvoidingView to fully expose the
  // multiline input and the send button at the same time, hence the need
  // for this function
  const showMessageInputFully = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd()
    })
  }

  const handleOnChangeText = (field: keyof InquiryFormikSchema, text: string) => {
    if (errors[field]) {
      validateField(field)
    }
    handleChange(field)(text)
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <Box p={2}>
        <Box>
          <Text variant="lg-display" mb={2}>
            {!!recipientName ? `Contact ${recipientName}` : "Contact a specialist"}
          </Text>
          <Input
            accessibilityLabel="Name"
            autoCapitalize="words"
            autoCorrect={false}
            blurOnSubmit={false}
            error={errors.name}
            maxLength={128}
            onBlur={() => validateField("name")}
            onChangeText={(text) => handleOnChangeText("name", text)}
            onSubmitEditing={() => jumpToNextField("name")}
            placeholder="First and last name"
            ref={nameInputRef}
            returnKeyType="next"
            testID="swa-inquiry-name-input"
            title="Name"
            value={values.name}
          />
          <Spacer y={2} />
          <Input
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            enableClearButton
            error={errors.email}
            keyboardType="email-address"
            onBlur={() => validateField("email")}
            onChangeText={(text) => handleOnChangeText("email", text.trim())}
            onSubmitEditing={() => jumpToNextField("email")}
            placeholder="Email address"
            ref={emailInputRef}
            returnKeyType="next"
            spellCheck={false}
            testID="swa-inquiry-email-input"
            textContentType={Platform.OS === "ios" ? "username" : "emailAddress"}
            title="Email"
            value={values.email}
          />
          <Spacer y={2} />
          <PhoneInput
            accessibilityLabel="Phone number"
            onChangeText={(text) => handleOnChangeText("phoneNumber", text.trim())}
            onSubmitEditing={() => jumpToNextField("phone")}
            placeholder="(000) 000-0000"
            ref={phoneInputRef}
            shouldDisplayLocalError={false}
            style={{ flex: 1 }}
            optional
            testID="swa-inquiry-phone-input"
            title="Phone number"
            value={values.phoneNumber}
          />
          <Spacer y={6} />
          <Input
            accessibilityLabel="Message to the Artsy Specialist"
            blurOnSubmit={false}
            error={errors.message}
            multiline
            numberOfLines={4}
            onBlur={() => validateField("message")}
            onChangeText={(text) => handleOnChangeText("message", text.trimStart())}
            onFocus={showMessageInputFully}
            onSubmitEditing={() => jumpToNextField("message")}
            placeholder="Questions about selling multiple works or an entire collection? Tell us more about how we can assist you. "
            ref={messageInputRef}
            required
            returnKeyType="default"
            testID="swa-inquiry-message-input"
            title="Your Message"
            value={values.message}
          />
          <Spacer y={4} />
          <Text variant="xs" color="black60" mb={2}>
            By continuing, you agree to{" "}
            <LinkText variant="xs" onPress={() => navigate("/privacy")}>
              Artsy’s Privacy Policy.
            </LinkText>{" "}
          </Text>
          <Button
            accessibilityLabel="Submit"
            block
            disabled={!(isValid && dirty)}
            onPress={handleSubmit}
            testID="swa-inquiry-submit-button"
          >
            Send
          </Button>
        </Box>
      </Box>
    </ScrollView>
  )
}
