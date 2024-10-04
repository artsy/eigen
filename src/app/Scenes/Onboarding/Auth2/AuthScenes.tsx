import { AuthScreen } from "app/Scenes/Onboarding/Auth2/components/AuthScreen"
import { EmailSocialStep } from "app/Scenes/Onboarding/Auth2/scenes/EmailSocialStep"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginPasswordStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpPasswordStep"
import { ScrollView } from "react-native-gesture-handler"

export const AuthScenes: React.FC = () => {
  return (
    <>
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
    </>
  )
}
