import { Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { navigate } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { Box, Button, Input, LinkText, PhoneInput, Text } from "palette"
import { useEffect, useRef } from "react"
import { Platform, ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { InquiryFormikSchema } from "./ConsignmentInquiryScreen"

export const ConsignmentInquiryForm: React.FC<{
  confirmLeaveEdit: (v: boolean) => void
  canPopScreen: boolean
}> = ({ confirmLeaveEdit, canPopScreen }) => {
  const { safeAreaInsets } = useScreenDimensions()
  const { values, handleChange, errors, setErrors, handleSubmit, isValid, dirty } =
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
        return
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

  const handleOnChangeText = (field: keyof InquiryFormikSchema, text: string) => {
    if (errors[field]) {
      setErrors({
        [field]: undefined,
      })
    }
    handleChange(field)(text)
  }

  return (
    <ScrollView
      ref={ScrollViewRef}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box>
          <Text variant="lg-display" mb={2}>
            Contact a specialist
          </Text>
          <Input
            required
            ref={nameInputRef}
            testID="swa-inquiry-name-input"
            title="Name"
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={(text) => {
              handleOnChangeText("name", text.trim())
            }}
            onSubmitEditing={() => jumpToNextField("name")}
            blurOnSubmit={false}
            placeholder="First and last name"
            returnKeyType="next"
            maxLength={128}
            value={values.name}
            error={errors.name}
          />
          <Spacer y={2} />
          <Input
            required
            ref={emailInputRef}
            testID="swa-inquiry-email-input"
            title="Email"
            autoCapitalize="none"
            enableClearButton
            keyboardType="email-address"
            onChangeText={(text) => {
              handleOnChangeText("email", text.trim())
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
          <Spacer y={2} />
          <PhoneInput
            ref={phoneInputRef}
            testID="swa-inquiry-phone-input"
            style={{ flex: 1 }}
            title="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={(text) => {
              handleOnChangeText("phoneNumber", text.trim())
            }}
            onSubmitEditing={() => jumpToNextField("phone")}
            value={values.phoneNumber}
            setValidation={() => null}
            accessibilityLabel="Phone number"
            shouldDisplayLocalError={false}
          />
          <Spacer y={4} />
          <Input
            required
            ref={messageInputRef}
            testID="swa-inquiry-message-input"
            title="Your Message"
            numberOfLines={4}
            multiline
            autoCapitalize="none"
            onFocus={showMessageInputFully}
            onChangeText={(text) => {
              handleOnChangeText("message", text.trimStart())
            }}
            onSubmitEditing={() => jumpToNextField("message")}
            blurOnSubmit={false}
            placeholder="Questions about selling multiple works or an entire collection? Tell us more about how we can assist you. "
            value={values.message}
            spellCheck={false}
            autoCorrect={false}
            error={errors.message}
          />
          <Spacer y={4} />
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
  )
}
