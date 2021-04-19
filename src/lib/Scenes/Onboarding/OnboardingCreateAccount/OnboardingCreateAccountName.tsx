import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { BackButton } from "lib/navigation/BackButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { OnboardingCreateAccountNavigationStack, UserSchema } from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountNameProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountName"> {}

export const OnboardingCreateAccountName: React.FC<OnboardingCreateAccountNameProps> = ({ navigation }) => {
  const { values, handleSubmit, handleChange, validateForm, errors } = useFormikContext<UserSchema>()

  return (
    <Flex backgroundColor="white" flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: useScreenDimensions().safeAreaInsets.top,
          justifyContent: "flex-start",
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={navigation.goBack} />
        <Spacer mt={60} />
        <Box height={130}>
          <Text variant="largeTitle">What’s your full name?</Text>
          <Spacer mt={1.5} />
          <Text variant="caption" color={color("black60")}>
            Galleries and auction houses you contact will identity you by your full name.
          </Text>
        </Box>
        <Spacer mt={50} />
        <Input
          autoCapitalize="words"
          autoCompleteType="name"
          autoCorrect={false}
          autoFocus
          onChangeText={(text) => {
            handleChange("name")(text)
          }}
          onSubmitEditing={handleSubmit}
          onBlur={() => validateForm()}
          blurOnSubmit={false}
          placeholder="First and Last Name"
          placeholderTextColor={color("black30")}
          returnKeyType="done"
          value={values.name}
          error={errors.name}
        />
      </ScrollView>
    </Flex>
  )
}
