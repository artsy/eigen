import { Flex } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { EmailSocialStep } from "app/Scenes/Onboarding/Auth2/scenes/EmailSocialStep"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginPasswordStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpPasswordStep"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"

export const AuthScenes: React.FC = () => {
  return (
    <ScrollView keyboardShouldPersistTaps>
      <AuthScreen name="EmailSocialStep">
        <EmailSocialStep />
      </AuthScreen>

      <AuthScreen name="LoginPasswordStep">
        <LoginPasswordStep />
      </AuthScreen>

      <AuthScreen name="LoginOTPStep">
        <LoginOTPStep />
      </AuthScreen>

      <AuthScreen name="ForgotPasswordStep">
        <ForgotPasswordStep />
      </AuthScreen>

      <AuthScreen name="SignUpNameStep">
        <SignUpNameStep />
      </AuthScreen>

      <AuthScreen name="SignUpPasswordStep">
        <SignUpPasswordStep />
      </AuthScreen>
    </ScrollView>
  )
}

interface AuthScreenProps {
  name: string
  isVisible?: boolean
}

const AuthScreen: React.FC<AuthScreenProps> = ({ children, name }) => {
  const currentScreen = AuthContext.useStoreState((state) => state.currentScreen)
  const isVisible = name === currentScreen?.name

  return <Flex display={isVisible ? "flex" : "none"}>{children}</Flex>
}
